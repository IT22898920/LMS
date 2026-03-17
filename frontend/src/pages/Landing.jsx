import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  GraduationCap, Shield, BookOpen, Users2, ArrowRight,
  Link2, FileText, Activity, BarChart2, Users, Star,
  CheckCircle2, Brain, Target, TrendingUp, Zap, Heart,
  ClipboardList, MessageSquare, BookMarked, Sparkles, Globe,
} from 'lucide-react';

/* ─── Animation variants ───────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};
const stagger = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay } },
});

/* ─── Floating Orb ─────────────────────────────────────────────────────────── */
const Orb = ({ className, style, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    animate={{ y: [0, -24, 0], scale: [1, 1.04, 1] }}
    transition={{ repeat: Infinity, duration: 7 + delay, ease: 'easeInOut', delay }}
    style={style}
  />
);

/* ─── Pre-computed particle data (avoids Math.random in render) ────────────── */
const PARTICLES = [
  { x: 12, y: 8,  size: 3, delay: 0.0 }, { x: 85, y: 15, size: 4, delay: 0.5 },
  { x: 40, y: 22, size: 2, delay: 1.0 }, { x: 68, y: 5,  size: 3, delay: 1.5 },
  { x: 25, y: 55, size: 4, delay: 0.3 }, { x: 90, y: 40, size: 2, delay: 0.8 },
  { x: 55, y: 70, size: 3, delay: 1.2 }, { x: 10, y: 80, size: 4, delay: 0.6 },
  { x: 75, y: 88, size: 2, delay: 1.8 }, { x: 35, y: 92, size: 3, delay: 0.2 },
  { x: 60, y: 35, size: 4, delay: 1.4 }, { x: 20, y: 45, size: 2, delay: 0.9 },
  { x: 80, y: 62, size: 3, delay: 0.4 }, { x: 48, y: 48, size: 4, delay: 1.6 },
  { x: 92, y: 75, size: 2, delay: 0.7 }, { x: 5,  y: 30, size: 3, delay: 1.1 },
  { x: 30, y: 18, size: 4, delay: 1.9 }, { x: 70, y: 28, size: 2, delay: 0.1 },
  { x: 15, y: 65, size: 3, delay: 1.3 }, { x: 95, y: 55, size: 4, delay: 0.5 },
];

/* ─── Floating Particle ────────────────────────────────────────────────────── */
const Particle = ({ delay, x, y, size = 3 }) => (
  <motion.div
    className="absolute rounded-full bg-white/20 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [-8, 8, -8], opacity: [0.2, 0.6, 0.2] }}
    transition={{ repeat: Infinity, duration: 4 + delay, ease: 'easeInOut', delay }}
  />
);

/* ─── Feature card ─────────────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, gradient, delay = 0 }) => (
  <motion.div
    variants={stagger(delay)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(99,102,241,0.15)' }}
    className="bg-white rounded-2xl p-6 border border-gray-100 transition-shadow duration-300"
    style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}
  >
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}
      style={{ boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}
    >
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

/* ─── Stat ─────────────────────────────────────────────────────────────────── */
const Stat = ({ num, label, delay = 0 }) => (
  <motion.div
    variants={stagger(delay)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="text-center"
  >
    <motion.p
      className="text-4xl font-black gradient-text"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 300 }}
    >{num}</motion.p>
    <p className="text-gray-500 text-sm mt-1 font-medium">{label}</p>
  </motion.div>
);

/* ─── Dashboard Mockup SVG ─────────────────────────────────────────────────── */
const DashboardMockup = () => (
  <svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
    <defs>
      <linearGradient id="sidebg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4f46e5"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
      <linearGradient id="chartArea2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02"/>
      </linearGradient>
      <clipPath id="clip2"><rect width="600" height="440" rx="18"/></clipPath>
    </defs>
    <rect width="600" height="440" rx="18" fill="#1a1635"/>
    <rect width="600" height="44" fill="#231f4a"/>
    <circle cx="24" cy="22" r="6" fill="#ff5f57"/>
    <circle cx="44" cy="22" r="6" fill="#febc2e"/>
    <circle cx="64" cy="22" r="6" fill="#28c840"/>
    <rect x="120" y="12" width="360" height="20" rx="10" fill="rgba(255,255,255,0.07)"/>
    <text x="300" y="25" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="system-ui,sans-serif">localhost:5173/dashboard</text>
    <rect x="0" y="44" width="600" height="396" fill="#f5f4fc"/>
    {/* Sidebar */}
    <rect x="0" y="44" width="130" height="396" fill="url(#sidebg2)"/>
    <rect x="10" y="60" width="110" height="30" rx="8" fill="rgba(255,255,255,0.15)"/>
    <circle cx="25" cy="75" r="10" fill="rgba(255,255,255,0.25)"/>
    <rect x="40" y="70" width="50" height="6" rx="3" fill="rgba(255,255,255,0.6)"/>
    <rect x="40" y="79" width="30" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
    {[0,1,2,3,4,5,6,7].map(i => (
      <g key={i}>
        <rect x="10" y={110 + i*34} width="110" height="26" rx="7" fill={i===0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}/>
        <rect x="18" y={116 + i*34} width="14" height="14" rx="4" fill={i===0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}/>
        <rect x="38" y={119 + i*34} width={i===0 ? 55 : 40+i*3} height="5" rx="2.5" fill={i===0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}/>
        <rect x="38" y={126 + i*34} width={20+i*4} height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      </g>
    ))}
    {/* Navbar */}
    <rect x="130" y="44" width="470" height="38" fill="rgba(245,244,252,0.9)"/>
    <rect x="145" y="55" width="140" height="16" rx="8" fill="rgba(226,232,240,0.7)"/>
    <circle cx="560" cy="63" r="10" fill="url(#sidebg2)"/>
    <circle cx="537" cy="63" r="8" fill="rgba(226,232,240,0.6)"/>
    {/* Stats */}
    {[
      { x:140, color:'#6366f1' }, { x:250, color:'#10b981' },
      { x:360, color:'#f59e0b' }, { x:470, color:'#ec4899' }
    ].map((s,i) => (
      <g key={i}>
        <rect x={s.x} y="96" width="100" height="58" rx="10" fill="white"
          style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}/>
        <rect x={s.x+8} y="104" width="14" height="14" rx="4" fill={s.color} opacity="0.15"/>
        <rect x={s.x+8} y="104" width="14" height="14" rx="4" fill={s.color} opacity="0.5"/>
        <rect x={s.x+8} y="124" width={[35,40,32,38][i]} height="6" rx="3" fill="#1e1b4b"/>
        <rect x={s.x+8} y="134" width={[20,25,18,22][i]} height="4" rx="2" fill="#94a3b8"/>
        <rect x={s.x+70} y="106" width="22" height="10" rx="5" fill={s.color} opacity="0.12"/>
        <rect x={s.x+73} y="109" width="16" height="4" rx="2" fill={s.color}/>
      </g>
    ))}
    {/* Chart */}
    <rect x="140" y="168" width="300" height="130" rx="10" fill="white"
      style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}/>
    <rect x="150" y="176" width="80" height="6" rx="3" fill="#1e1b4b"/>
    <rect x="150" y="185" width="50" height="4" rx="2" fill="#94a3b8"/>
    <polyline points="155,280 175,255 200,265 230,240 260,248 295,225 330,235 355,215 390,222 415,208"
      fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M155,280 175,255 200,265 230,240 260,248 295,225 330,235 355,215 390,222 415,208 415,288 155,288Z"
      fill="url(#chartArea2)"/>
    {[155,175,200,230,260,295,330,355,390,415].map((x,i) => (
      <circle key={i} cx={x} cy={[280,255,265,240,248,225,235,215,222,208][i]} r="3.5" fill="#6366f1" stroke="white" strokeWidth="1.5"/>
    ))}
    {/* Recent list */}
    <rect x="452" y="168" width="148" height="130" rx="10" fill="white"
      style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}/>
    <rect x="462" y="176" width="60" height="6" rx="3" fill="#1e1b4b"/>
    {[0,1,2,3].map(i => (
      <g key={i}>
        <circle cx="470" cy={198+i*28} r="8" fill={['#6366f1','#10b981','#f59e0b','#ec4899'][i]} opacity="0.3"/>
        <rect x="484" y={193+i*28} width={[50,38,44,42][i]} height="5" rx="2.5" fill="#334155"/>
        <rect x="484" y={201+i*28} width={[30,24,26,28][i]} height="3.5" rx="1.75" fill="#94a3b8"/>
      </g>
    ))}
    {/* Bottom row */}
    <rect x="140" y="310" width="210" height="116" rx="10" fill="white"
      style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}/>
    <rect x="150" y="320" width="70" height="5" rx="2.5" fill="#1e1b4b"/>
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x="150" y={334+i*22} width="190" height="15" rx="5" fill={i%2===0 ? '#f8f7ff' : '#fff'}/>
        <rect x="156" y={337+i*22} width={[60,50,70,55][i]} height="5" rx="2.5" fill="#334155"/>
        <rect x={290} y={337+i*22} width="30" height="5" rx="2.5" fill={['#10b981','#6366f1','#f59e0b','#ec4899'][i]} opacity="0.7"/>
      </g>
    ))}
    <rect x="362" y="310" width="238" height="116" rx="10" fill="white"
      style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}/>
    <rect x="372" y="320" width="70" height="5" rx="2.5" fill="#1e1b4b"/>
    {[0,1,2].map(i => (
      <g key={i}>
        <rect x="372" y={335+i*30} width={[130,100,115][i]} height="7" rx="3.5" fill={['#6366f1','#10b981','#f59e0b'][i]} opacity="0.5"/>
        <rect x="372" y={344+i*30} width={[80,60,70][i]} height="4" rx="2" fill="#94a3b8"/>
      </g>
    ))}
  </svg>
);

/* ─── Main Landing Page ────────────────────────────────────────────────────── */
export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpac = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const features = [
    { icon: Link2,         title: 'Guardian-Student Linking',   desc: 'Smart family connections with granular permission controls and real-time visibility.',        gradient: 'from-violet-500 to-indigo-600' },
    { icon: Shield,        title: 'Role-Based Access Control',  desc: 'Fine-grained permissions for admins, teachers, students, and guardians.',                     gradient: 'from-blue-500 to-cyan-600' },
    { icon: FileText,      title: 'Academic Reports',           desc: 'Detailed performance reports with GPA tracking, grade breakdowns, and attendance.',           gradient: 'from-emerald-500 to-teal-600' },
    { icon: Users2,        title: 'Learning Communities',       desc: 'Self-enrolled study groups with moderation, subjects, and collaborative tools.',               gradient: 'from-orange-500 to-amber-500' },
    { icon: ClipboardList, title: 'Quiz & Assessment',          desc: 'Create MCQ, True/False, and short-answer quizzes with auto-grading and analytics.',           gradient: 'from-pink-500 to-rose-600' },
    { icon: TrendingUp,    title: 'Progress Tracking',          desc: 'Visual progress rings, streak tracking, heatmaps, and milestone celebrations.',               gradient: 'from-purple-500 to-violet-600' },
    { icon: BookMarked,    title: 'Content Management',         desc: 'Upload, approve, and archive study materials with version control and download tracking.',     gradient: 'from-teal-500 to-cyan-600' },
    { icon: MessageSquare, title: 'Feedback System',            desc: 'Anonymous or named feedback with star ratings, admin responses, and category analytics.',     gradient: 'from-indigo-500 to-blue-600' },
  ];

  const stats = [
    { num: '10K+', label: 'Active Students' },
    { num: '500+', label: 'Educators' },
    { num: '98%',  label: 'Satisfaction Rate' },
    { num: '4',    label: 'User Roles' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
          boxShadow: '0 1px 0 rgba(99,102,241,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center"
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <GraduationCap size={19} className="text-white" />
          </motion.div>
          <div>
            <span className="font-black text-gray-900 text-sm">eduCare</span>
            <span className="text-gray-400 text-xs ml-1.5 font-medium">LMS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <motion.button
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              className="btn-primary px-5 py-2 text-sm"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 30%, #312e81 60%, #4c1d95 100%)',
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
            backgroundSize: '400% 400%',
          }}
        />

        {/* Orbs */}
        <Orb className="w-96 h-96 -top-20 -left-20 opacity-20" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} delay={0} />
        <Orb className="w-80 h-80 top-1/3 -right-10 opacity-15" style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} delay={2} />
        <Orb className="w-64 h-64 bottom-20 left-1/4 opacity-15" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} delay={4} />

        {/* Particles — fixed positions to avoid re-render flicker */}
        {PARTICLES.map((p, i) => (
          <Particle key={i} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpac }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.45, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.4)',
              color: '#c7d2fe',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={13} className="text-indigo-300 animate-pulse-slow" />
            Educational Relationship Management Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            Empower Every{' '}
            <span className="relative">
              <span className="relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 50%, #fb7185 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Learning
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, #a5b4fc, #f0abfc, #fb7185)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            {' '}Journey
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            A unified platform connecting admins, teachers, students, and guardians through
            intelligent relationship management, analytics, and collaboration.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <Link to="/register">
              <motion.button
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: '0 14px 40px rgba(99,102,241,0.65)' }}
                whileTap={{ scale: 0.97 }}
              >
                Start for Free
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-bold text-white/80 hover:text-white transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
                whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.14)' }}
                whileTap={{ scale: 0.97 }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-10 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {['No credit card required', 'Free tier available', 'GDPR compliant'].map((text, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-white/50">
                <CheckCircle2 size={13} className="text-emerald-400" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto mt-14 px-6"
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)' }}
          >
            <DashboardMockup />
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-3xl rounded-full opacity-40"
            style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)' }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => <Stat key={i} {...s} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#f5f4fc' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="section-label mx-auto mb-4 w-fit"
            >
              <Zap size={13} /> Everything you need
            </motion.div>
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
            >
              Built for modern{' '}
              <span className="gradient-text">education</span>
            </motion.h2>
            <motion.p
              variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              eduCare brings together every tool your institution needs — from relationship management
              to analytics — in one beautifully designed platform.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Role showcase ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
            >
              One platform,{' '}
              <span className="gradient-text">four roles</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Shield,        role: 'Admin',    color: 'from-violet-600 to-indigo-700', perks: ['Full user management', 'Approve registrations', 'System-wide analytics', 'Activity monitoring'] },
              { icon: BookOpen,      role: 'Teacher',  color: 'from-blue-600 to-cyan-600',     perks: ['Create & publish reports', 'Manage learning groups', 'Upload study materials', 'Run quizzes'] },
              { icon: GraduationCap, role: 'Student',  color: 'from-emerald-500 to-teal-600',  perks: ['View personal reports', 'Join study groups', 'Track progress & streaks', 'Take quizzes'] },
              { icon: Heart,         role: 'Guardian', color: 'from-orange-500 to-amber-500',  perks: ['View linked students', 'Monitor reports', 'Track activity logs', 'Stay informed'] },
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  variants={stagger(i * 0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl p-6 border border-gray-100 bg-white flex gap-5"
                  style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}
                    style={{ boxShadow: '0 6px 20px rgba(99,102,241,0.25)' }}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{r.role}</h3>
                    <ul className="space-y-1">
                      {r.perks.map((p, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 40%, #6d28d9 70%, #4f46e5 100%)' }}
        />
        <Orb className="w-96 h-96 -top-20 -left-20 opacity-30" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} delay={0} />
        <Orb className="w-80 h-80 bottom-0 right-0 opacity-20" style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} delay={3} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#c7d2fe' }}
            >
              <Globe size={13} /> Join thousands of educators
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to transform your institution?
            </h2>
            <p className="text-white/65 text-lg mb-10 leading-relaxed">
              Start your journey with eduCare today. Free to get started, scales with your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <motion.button
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-700 bg-white text-base"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Create Free Account <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white/80 hover:text-white text-base border border-white/20 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">eduCare LMS</span>
          </div>
          <p className="text-gray-600 text-xs">© 2026 eduCare LMS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-500 hover:text-white text-xs transition-colors">Sign In</Link>
            <Link to="/register" className="text-gray-500 hover:text-white text-xs transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
