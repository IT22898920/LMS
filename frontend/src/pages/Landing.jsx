import { Link } from 'react-router-dom';
import {
  GraduationCap, Shield, BookOpen, Users2, ArrowRight,
  Link2, FileText, Activity, BarChart2, Users, Star,
  CheckCircle2, ChevronRight, Play, Sparkles,
  Brain, Target, TrendingUp, Globe, Zap, Heart,
} from 'lucide-react';

/* ─── Data ─── */
const FEATURES = [
  {
    icon: Link2,
    title: 'Guardian–Student Linking',
    desc: 'Connect parents and guardians directly to their children\'s academic journey with granular permission controls.',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    desc: 'Fine-grained RBAC ensures every user sees exactly what they need — nothing more, nothing less.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: BarChart2,
    title: 'Academic Dashboards',
    desc: 'Beautiful, data-rich dashboards tailored to each role — from admin analytics to student performance radars.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: FileText,
    title: 'Student Report Generation',
    desc: 'Generate detailed academic reports with grades, attendance, GPA, and teacher remarks. Publish to guardians instantly.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Users2,
    title: 'Learning Communities',
    desc: 'Students self-enroll into subject groups, project teams, and discussion circles — fostering collaborative learning.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
  },
  {
    icon: Activity,
    title: 'User Activity Monitoring',
    desc: 'Full audit trail of platform activity with real-time analytics, category filters, and exportable logs.',
    color: 'from-indigo-500 to-primary-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
];

const ROLES = [
  {
    role: 'Admin',
    icon: Shield,
    gradient: 'from-violet-600 to-purple-700',
    lightGradient: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    perks: ['Full platform control', 'User & role management', 'Activity audit trail', 'Guardian link management', 'System analytics'],
  },
  {
    role: 'Teacher',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-600',
    lightGradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    perks: ['Create & publish reports', 'Manage learning groups', 'View student profiles', 'Track class performance', 'Access guardian links'],
  },
  {
    role: 'Student',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    perks: ['Personal dashboard', 'View academic reports', 'Join learning groups', 'Track progress & GPA', 'Activity history'],
  },
  {
    role: 'Guardian',
    icon: Heart,
    gradient: 'from-orange-500 to-amber-500',
    lightGradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    perks: ['Monitor linked students', 'View published reports', 'Attendance tracking', 'Grade overview', 'Controlled data access'],
  },
];

const STATS = [
  { value: '4', label: 'User Roles', icon: Users },
  { value: '6', label: 'Core Modules', icon: Zap },
  { value: '100%', label: 'RBAC Protected', icon: Shield },
  { value: 'Live', label: 'Real-time Logs', icon: Activity },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Admin Registers Users', desc: 'Admin creates accounts for teachers, students, and guardians with the correct roles and permissions.' },
  { step: '02', title: 'Link Guardians to Students', desc: 'Admin creates guardian–student relationships with customisable data-access permissions per link.' },
  { step: '03', title: 'Teachers Generate Reports', desc: 'Teachers log grades, attendance, and remarks, then publish reports visible to students and guardians.' },
  { step: '04', title: 'Everyone Stays Connected', desc: 'All roles get tailored dashboards, real-time activity logs, and a seamless collaborative experience.' },
];

/* ─── Components ─── */
const FloatingCard = ({ className, children }) => (
  <div className={`absolute glass rounded-2xl shadow-card border border-white/60 p-4 ${className}`}>
    {children}
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-700 rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap size={19} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base leading-none">EduConnect</span>
              <span className="text-xs text-gray-400 block leading-none mt-0.5">LMS Platform</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Roles'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link to="/login"
            className="btn-primary bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-glow/50 border-0 px-5">
            Sign In <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-bg opacity-[0.07]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="animate-slide-up">
            <div className="section-label mb-6">
              <Sparkles size={14} />
              Educational Relationship Management
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-6">
              The LMS that<br />
              <span className="gradient-text">connects everyone</span><br />
              in education
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              EduConnect unifies admins, teachers, students, and guardians on one intelligent platform —
              with smart relationship management, live reports, and granular access control.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/login"
                className="btn-primary text-base px-7 py-3.5 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-glow border-0 rounded-xl">
                Get Started Free <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works"
                className="btn-secondary text-base px-6 py-3.5 rounded-xl">
                <Play size={15} className="text-primary-500" /> See How It Works
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4">
              {['RBAC Security', 'MongoDB Atlas', 'REST API', 'Real-time Logs'].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating UI mockups */}
          <div className="relative h-[520px] hidden lg:block">
            {/* Central card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded-3xl shadow-card-hover border border-gray-100 p-6 animate-float z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Alex Fernando</p>
                  <p className="text-xs text-emerald-600 font-medium">● Grade 10A · Active</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[['Mathematics', 'A', 92], ['Science', 'A-', 88], ['English', 'B+', 84]].map(([sub, grade, score]) => (
                  <div key={sub} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700">{sub}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary-700 w-6">{grade}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Overall GPA</span>
                <span className="text-lg font-black gradient-text">3.85</span>
              </div>
            </div>

            {/* Floating small cards */}
            <FloatingCard className="top-8 left-0 animate-float-delay">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <Users2 size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Maria Silva</p>
                  <p className="text-xs text-orange-600">Guardian · Linked</p>
                </div>
                <CheckCircle2 size={14} className="text-emerald-500 ml-1" />
              </div>
            </FloatingCard>

            <FloatingCard className="top-12 right-0 animate-float-slow">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-primary-500" />
                <p className="text-xs font-semibold text-gray-700">Live Activity</p>
              </div>
              <div className="mt-2 space-y-1">
                {['Report published', 'Student joined group', 'Guardian linked'].map((a) => (
                  <div key={a} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-gray-500">{a}</span>
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard className="bottom-16 left-4 animate-float">
              <div className="flex items-center gap-2 mb-2">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-gray-700">Math Study Group</span>
              </div>
              <div className="flex -space-x-1.5">
                {['#6366f1','#10b981','#f59e0b','#ef4444'].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">+8</div>
              </div>
            </FloatingCard>

            <FloatingCard className="bottom-10 right-4 animate-float-delay">
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-violet-500" />
                <span className="text-xs font-bold text-gray-700">RBAC Active</span>
              </div>
              <div className="mt-1.5 flex gap-1 flex-wrap">
                {['admin','teacher','student','guardian'].map((r) => (
                  <span key={r} className="text-xs bg-primary-50 text-primary-700 rounded-full px-1.5 py-0.5 font-medium">{r}</span>
                ))}
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 animate-bounce-slow">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-gradient-to-r from-primary-600 via-violet-700 to-purple-700 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-white" />
              </div>
              <p className="text-4xl font-black text-white">{value}</p>
              <p className="text-white/70 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-4"><Zap size={14} /> Platform Features</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Everything education needs,<br />
              <span className="gradient-text">built into one platform</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Six powerful modules designed specifically for the educational ecosystem,
              working together seamlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div key={title} className={`card-hover group ${bg} ${border} border`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-4"><Target size={14} /> How It Works</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              From setup to success<br />
              <span className="gradient-text">in four simple steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center group">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-black text-lg">{step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-4"><Users size={14} /> User Roles</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              A tailored experience<br />
              <span className="gradient-text">for every stakeholder</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Each role gets a custom dashboard, navigation, and permissions — perfectly scoped to their needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLES.map(({ role, icon: Icon, gradient, lightGradient, border, perks }) => (
              <div key={role} className={`card-hover bg-gradient-to-b ${lightGradient} ${border} border`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{role}</h3>
                <ul className="space-y-2">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL / QUOTE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
            <Brain size={28} className="text-white" />
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-6">
            "Education is not just about knowledge transfer —<br />
            it's about building <span className="gradient-text">relationships that last</span>."
          </blockquote>
          <p className="text-gray-500 text-sm">EduConnect LMS · Educational Relationship Management Platform</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-bg" />
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 border border-white/20">
            <Globe size={14} /> Ready to transform your institution?
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Start building smarter<br />educational connections today
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Sign in now and explore the full ERM platform — all demo accounts are pre-seeded and ready to explore.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login"
              className="flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
              Get Started Now <ArrowRight size={18} />
            </Link>
            <a href="#features"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base border border-white/20">
              View Features
            </a>
          </div>
          {/* Role quick links */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { role: 'Admin',    color: 'bg-violet-500/20 text-violet-200 border-violet-400/30' },
              { role: 'Teacher',  color: 'bg-blue-500/20 text-blue-200 border-blue-400/30' },
              { role: 'Student',  color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
              { role: 'Guardian', color: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
            ].map(({ role, color }) => (
              <Link key={role} to="/login"
                className={`badge border text-sm px-4 py-1.5 rounded-full font-medium hover:scale-105 transition-transform ${color}`}>
                Try as {role}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-700 rounded-xl flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold">EduConnect LMS</p>
                <p className="text-xs text-gray-500">Educational Relationship Management</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {['Features', 'How it works', 'Roles', 'Sign In'].map((item) => (
                <a key={item} href={item === 'Sign In' ? '/login' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
            <p className="text-xs text-gray-600">© 2025 EduConnect LMS · MERN Stack · ITPM Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
