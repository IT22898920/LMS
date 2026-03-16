const StudentProgress     = require('../models/StudentProgress');
const ProgressNotification = require('../models/ProgressNotification');
const QuizAttempt         = require('../models/QuizAttempt');
const ActivityLog         = require('../models/ActivityLog');
const Feedback            = require('../models/Feedback');
const User                = require('../models/User');

/* ─────────────────────── helpers ─────────────────────── */

function startOfDay(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function dayShift(d, days) {
  return new Date(startOfDay(d).getTime() + days * 86400000);
}

/* Gather real DB metrics for a student on a specific day */
async function computeMetrics(studentId, date) {
  const dayStart = startOfDay(date);
  const dayEnd   = dayShift(date, 1);

  // Quiz attempts
  const attempts = await QuizAttempt.find({
    student: studentId,
    submittedAt: { $gte: dayStart, $lt: dayEnd },
  }).select('percentage');

  const quizAttempts  = attempts.length;
  const quizAvgScore  = quizAttempts ? Math.round(attempts.reduce((s, a) => s + (a.percentage || 0), 0) / quizAttempts) : 0;
  const quizBestScore = quizAttempts ? Math.round(Math.max(...attempts.map(a => a.percentage || 0))) : 0;

  // Login activity (ActivityLog category: auth, action: LOGIN)
  const loginDoc = await ActivityLog.findOne({
    user:    studentId,
    category: 'auth',
    action:  { $regex: /login/i },
    createdAt: { $gte: dayStart, $lt: dayEnd },
  });
  const loginActive = !!loginDoc;

  // Group activities
  const groupActivities = await ActivityLog.countDocuments({
    user:    studentId,
    category: 'group',
    createdAt: { $gte: dayStart, $lt: dayEnd },
  });

  // Feedback given
  const feedbackGiven = await Feedback.countDocuments({
    submittedBy: studentId,
    createdAt:   { $gte: dayStart, $lt: dayEnd },
  });

  // Materials viewed (ActivityLog category: system with VIEW_MATERIAL or similar)
  const materialsViewed = await ActivityLog.countDocuments({
    user:    studentId,
    action:  { $regex: /material/i },
    createdAt: { $gte: dayStart, $lt: dayEnd },
  });

  return { quizAttempts, quizAvgScore, quizBestScore, loginActive, groupActivities, feedbackGiven, materialsViewed };
}

/* Compute weighted progress score from metrics + streak */
function computeScore(metrics, streak) {
  // Quiz component (0–100): quality × frequency bonus
  let quizComp = 0;
  if (metrics.quizAttempts > 0) {
    const freqBonus = Math.min(metrics.quizAttempts * 5, 15);
    quizComp = Math.min(metrics.quizAvgScore + freqBonus, 100);
  }

  // Engagement component (0–100)
  const engPoints =
    (metrics.loginActive      ? 20 : 0) +
    Math.min(metrics.groupActivities * 12, 30) +
    Math.min(metrics.feedbackGiven   * 15, 25) +
    Math.min(metrics.materialsViewed * 8,  25);
  const engComp = Math.min(engPoints, 100);

  // Consistency component (0–100): streak-based
  const consComp = Math.min(streak * 7, 100);

  // Weighted composite
  let score;
  if (metrics.quizAttempts > 0) {
    score = quizComp * 0.45 + engComp * 0.35 + consComp * 0.20;
  } else {
    // No quiz today — engagement matters more, but cap at 68
    score = Math.min(engComp * 0.65 + consComp * 0.35, 68);
  }

  return {
    progressScore:        Math.round(score),
    quizComponent:        Math.round(quizComp),
    engagementComponent:  Math.round(engComp),
    consistencyComponent: Math.round(consComp),
  };
}

/* Check if student is "active" based on metrics */
function isActiveDay(metrics) {
  return metrics.loginActive ||
    metrics.quizAttempts > 0 ||
    metrics.groupActivities > 0 ||
    metrics.feedbackGiven > 0 ||
    metrics.materialsViewed > 0;
}

/* Compute streak by looking back at prior records */
async function computeStreak(studentId, todayActive) {
  if (!todayActive) return 0;
  let streak = 1;
  for (let i = 1; i <= 60; i++) {
    const d = dayShift(new Date(), -i);
    const rec = await StudentProgress.findOne({ student: studentId, date: d });
    if (!rec || !isActiveDay(rec.metrics)) break;
    streak++;
  }
  return streak;
}

/* Create drop / milestone notifications (once per day per type) */
async function fireNotifications(studentId, todayScore, streak, metrics) {
  const todayStart = startOfDay(new Date());
  const todayEnd   = dayShift(new Date(), 1);

  const alreadySent = async (type, extra = {}) =>
    !!(await ProgressNotification.findOne({ student: studentId, type, createdAt: { $gte: todayStart, $lt: todayEnd }, ...extra }));

  // ── Progress drop ──────────────────────────────────────────
  const prevRecords = await StudentProgress.find({
    student: studentId,
    date: { $gte: dayShift(new Date(), -7), $lt: todayStart },
  }).select('progressScore');

  if (prevRecords.length >= 3) {
    const prevAvg = prevRecords.reduce((s, r) => s + r.progressScore, 0) / prevRecords.length;
    const drop    = prevAvg - todayScore;
    const dropPct = prevAvg > 0 ? Math.round((drop / prevAvg) * 100) : 0;

    if (drop >= 18 && !(await alreadySent('progress_drop'))) {
      await ProgressNotification.create({
        student: studentId,
        type:    'progress_drop',
        severity: drop >= 35 ? 'danger' : 'warning',
        title:   drop >= 35 ? 'Significant Progress Drop!' : 'Progress Declining',
        message: `Your progress score dropped ${dropPct}% compared to your weekly average. You had ${Math.round(prevAvg)} pts before — let's get back on track today!`,
        previousScore: Math.round(prevAvg),
        currentScore:  todayScore,
        dropPercent:   dropPct,
      });
    }

    // ── Quiz decline ─────────────────────────────────────────
    if (metrics.quizAttempts > 0) {
      const prevQuizRecords = prevRecords.filter(r => r.quizComponent > 0);
      if (prevQuizRecords.length >= 2) {
        const prevQuizAvg = prevQuizRecords.reduce((s, r) => s + r.quizComponent, 0) / prevQuizRecords.length;
        if ((prevQuizAvg - metrics.quizAvgScore) >= 20 && !(await alreadySent('quiz_decline'))) {
          await ProgressNotification.create({
            student:  studentId,
            type:     'quiz_decline',
            severity: 'warning',
            title:    'Quiz Performance Dropped',
            message:  `Your quiz score today (${metrics.quizAvgScore}%) is significantly lower than your recent average (${Math.round(prevQuizAvg)}%). Review the material and try again!`,
            currentScore: metrics.quizAvgScore,
          });
        }
      }
    }
  }

  // ── Streak break ──────────────────────────────────────────
  if (streak === 0) {
    const yesterday = await StudentProgress.findOne({
      student: studentId,
      date: dayShift(new Date(), -1),
    });
    if (yesterday && yesterday.streak >= 3 && !(await alreadySent('streak_break'))) {
      await ProgressNotification.create({
        student:  studentId,
        type:     'streak_break',
        severity: 'warning',
        title:    `${yesterday.streak}-Day Streak Broken!`,
        message:  `You had an impressive ${yesterday.streak}-day learning streak, but missed yesterday. Start a new streak today — every day counts!`,
      });
    }
  }

  // ── Milestones ────────────────────────────────────────────
  const MILESTONES = [
    { key: 'streak-3',  check: streak === 3,          title: '3-Day Streak!',       msg: 'You\'ve been active 3 days in a row. Keep the momentum!' },
    { key: 'streak-7',  check: streak === 7,          title: '7-Day Streak! 🔥',    msg: 'A full week of consistent learning. You\'re unstoppable!' },
    { key: 'streak-14', check: streak === 14,         title: '2-Week Streak! ⚡',   msg: 'Two weeks straight! You\'re building a powerful learning habit.' },
    { key: 'streak-30', check: streak === 30,         title: '30-Day Legend! 🏆',   msg: 'A full month of daily learning. You are exceptional!' },
    { key: 'score-75',  check: todayScore >= 75,      title: 'Progress Score 75+',  msg: 'Your progress score crossed 75 points. Outstanding work!' },
    { key: 'score-90',  check: todayScore >= 90,      title: 'Excellent! Score 90+',msg: 'You hit 90 progress points today — top-tier performance!' },
    { key: 'quiz-100',  check: metrics.quizBestScore === 100, title: 'Perfect Quiz! 💯', msg: 'You scored 100% on a quiz today. Flawless!' },
  ];

  for (const m of MILESTONES) {
    if (!m.check) continue;
    const exists = await ProgressNotification.findOne({ student: studentId, type: 'milestone', milestone: m.key });
    if (exists) continue;
    await ProgressNotification.create({
      student:  studentId,
      type:     'milestone',
      severity: 'info',
      title:    m.title,
      message:  m.msg,
      milestone: m.key,
      currentScore: todayScore,
    });
  }
}

/* ─────────────────────── controllers ─────────────────────── */

// POST /progress/sync — compute + save today's snapshot
exports.syncProgress = async (req, res) => {
  try {
    const studentId = req.user.role === 'student'
      ? req.user._id
      : req.params.studentId;

    if (!studentId) return res.status(400).json({ message: 'studentId required' });

    const today   = startOfDay(new Date());
    const metrics = await computeMetrics(studentId, today);
    const active  = isActiveDay(metrics);
    const streak  = await computeStreak(studentId, active);

    const { progressScore, quizComponent, engagementComponent, consistencyComponent }
      = computeScore(metrics, streak);

    const record = await StudentProgress.findOneAndUpdate(
      { student: studentId, date: today },
      { metrics, progressScore, streak, quizComponent, engagementComponent, consistencyComponent },
      { upsert: true, new: true }
    );

    await fireNotifications(studentId, progressScore, streak, metrics);

    res.json({ success: true, record });
  } catch (err) {
    console.error('syncProgress error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /progress/my?days=30 — student's own data
exports.getMyProgress = async (req, res) => {
  try {
    const studentId = req.user._id;
    const days  = Math.min(parseInt(req.query.days) || 30, 90);
    const since = dayShift(new Date(), -(days - 1));

    const records = await StudentProgress.find({
      student: studentId,
      date: { $gte: since },
    }).sort({ date: 1 });

    // Fill gaps with zero-records for the chart
    const chart = [];
    for (let i = 0; i < days; i++) {
      const d   = dayShift(since, i);
      const rec = records.find(r => r.date.getTime() === d.getTime());
      chart.push({
        date:        d.toISOString().slice(0, 10),
        score:       rec?.progressScore        || 0,
        quiz:        rec?.quizComponent        || 0,
        engagement:  rec?.engagementComponent  || 0,
        consistency: rec?.consistencyComponent || 0,
        streak:      rec?.streak               || 0,
        quizAttempts: rec?.metrics?.quizAttempts || 0,
      });
    }

    const latest   = records[records.length - 1] || null;
    const prevWeek = records.slice(-14, -7);
    const thisWeek = records.slice(-7);

    const weekAvg  = thisWeek.length ? Math.round(thisWeek.reduce((s, r) => s + r.progressScore, 0) / thisWeek.length) : 0;
    const prevAvg  = prevWeek.length ? Math.round(prevWeek.reduce((s, r) => s + r.progressScore, 0) / prevWeek.length) : 0;
    const weekTrend = weekAvg - prevAvg;

    const activeDays       = records.filter(r => isActiveDay(r.metrics)).length;
    const totalQuizAttempts = records.reduce((s, r) => s + (r.metrics.quizAttempts || 0), 0);
    const avgQuizScore     = records.filter(r => r.metrics.quizAttempts > 0).length
      ? Math.round(records.filter(r => r.metrics.quizAttempts > 0).reduce((s, r) => s + r.metrics.quizAvgScore, 0) /
          records.filter(r => r.metrics.quizAttempts > 0).length)
      : 0;

    // Earned milestones
    const milestoneNotifs = await ProgressNotification.find({
      student: studentId, type: 'milestone',
    }).sort({ createdAt: 1 });
    const milestones = milestoneNotifs.map(n => n.milestone);

    // Unread notifications
    const notifications = await ProgressNotification.find({
      student: studentId, isRead: false,
    }).sort({ createdAt: -1 }).limit(10);

    const unreadCount = await ProgressNotification.countDocuments({ student: studentId, isRead: false });

    res.json({
      chart,
      current:  latest,
      summary: {
        currentScore:       latest?.progressScore        || 0,
        currentStreak:      latest?.streak               || 0,
        weekAvg,
        weekTrend,
        activeDays,
        totalQuizAttempts,
        avgQuizScore,
      },
      milestones,
      notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /progress/class — teacher/admin overview
exports.getClassProgress = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: { $ne: false } })
      .select('name email studentId grade');

    const since = dayShift(new Date(), -6);

    const data = await Promise.all(students.map(async (s) => {
      const records = await StudentProgress.find({
        student: s._id,
        date: { $gte: since },
      }).sort({ date: 1 });

      const latest  = records[records.length - 1];
      const prev    = records[records.length - 2];
      const trend   = (latest && prev) ? latest.progressScore - prev.progressScore : 0;
      const weekAvg = records.length
        ? Math.round(records.reduce((sum, r) => sum + r.progressScore, 0) / records.length)
        : 0;
      const streak  = latest?.streak || 0;

      // 7-day sparkline points (normalized 0-100)
      const sparkline = Array.from({ length: 7 }, (_, i) => {
        const d = dayShift(since, i);
        const r = records.find(rec => rec.date.getTime() === d.getTime());
        return r?.progressScore || 0;
      });

      return {
        student:      s,
        currentScore: latest?.progressScore || 0,
        weekAvg,
        streak,
        trend,
        sparkline,
        atRisk:       weekAvg < 40 || trend < -20,
        topPerformer: weekAvg >= 75,
      };
    }));

    data.sort((a, b) => b.currentScore - a.currentScore);

    const classAvg  = data.length ? Math.round(data.reduce((s, d) => s + d.weekAvg, 0) / data.length) : 0;
    const atRisk    = data.filter(d => d.atRisk).length;
    const topCount  = data.filter(d => d.topPerformer).length;

    res.json({
      students: data,
      summary: { total: data.length, classAvg, atRisk, topCount },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /progress/student/:studentId — detailed view for teacher/admin
exports.getStudentDetail = async (req, res) => {
  try {
    const { studentId } = req.params;
    const days  = Math.min(parseInt(req.query.days) || 30, 90);
    const since = dayShift(new Date(), -(days - 1));

    const [student, records, milestones] = await Promise.all([
      User.findById(studentId).select('name email studentId grade'),
      StudentProgress.find({ student: studentId, date: { $gte: since } }).sort({ date: 1 }),
      ProgressNotification.find({ student: studentId, type: 'milestone' }).sort({ createdAt: 1 }),
    ]);

    const chart = Array.from({ length: days }, (_, i) => {
      const d   = dayShift(since, i);
      const rec = records.find(r => r.date.getTime() === d.getTime());
      return {
        date:   d.toISOString().slice(0, 10),
        score:  rec?.progressScore || 0,
        streak: rec?.streak || 0,
        quizAttempts: rec?.metrics?.quizAttempts || 0,
      };
    });

    res.json({ student, chart, records, milestones: milestones.map(n => n.milestone) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /progress/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await ProgressNotification.find({ student: req.user.id })
      .sort({ createdAt: -1 }).limit(25);
    const unreadCount = await ProgressNotification.countDocuments({ student: req.user.id, isRead: false });
    res.json({ notifications: notifs, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /progress/notifications/read — mark all read
exports.markAllRead = async (req, res) => {
  try {
    await ProgressNotification.updateMany({ student: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
