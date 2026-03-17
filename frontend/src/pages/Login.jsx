import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Eye, EyeOff, LogIn, BookOpen,
  Heart, ArrowLeft, Sparkles, CheckCircle2, Shield,
} from 'lucide-react';

const QUICK_ACCOUNTS = [
  { role: 'admin',    email: 'admin@lms.com',    password: 'admin123',    icon: Shield,        gradient: 'from-violet-600 to-indigo-700', label: 'Admin' },
  { role: 'teacher',  email: 'teacher@lms.com',  password: 'teacher123',  icon: BookOpen,      gradient: 'from-blue-600 to-cyan-600',     label: 'Teacher' },
  { role: 'student',  email: 'student@lms.com',  password: 'student123',  icon: GraduationCap, gradient: 'from-emerald-500 to-teal-600',  label: 'Student' },
  { role: 'guardian', email: 'guardian@lms.com', password: 'guardian123', icon: Heart,         gradient: 'from-orange-500 to-amber-500',  label: 'Guardian' },
];

const Orb = ({ className, style, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 7 + delay, ease: 'easeInOut', delay }}
    style={style}
  />
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [activeRole, setActiveRole] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveRole(acc.role);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 30%, #312e81 65%, #4c1d95 100%)' }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
            backgroundSize: '400% 400%',
          }}
        />

        {/* Orbs */}
        <Orb className="w-72 h-72 -top-16 -left-16 opacity-25" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} delay={0} />
        <Orb className="w-64 h-64 top-1/2 -right-12 opacity-20" style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} delay={2} />
        <Orb className="w-56 h-56 bottom-10 left-1/4 opacity-20" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} delay={4} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Top: logo + back */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.08, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <GraduationCap size={24} className="text-white" />
              </motion.div>
              <div>
                <p className="text-white font-black text-base leading-none">eduCare LMS</p>
                <p className="text-white/50 text-xs mt-0.5">ERM Platform</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                <ArrowLeft size={14} /> Back to home
              </Link>
            </motion.div>
          </div>

          {/* Middle: headline */}
          <motion.div
            className="flex-1 flex flex-col justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 w-fit"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#c7d2fe' }}
            >
              <Sparkles size={11} className="text-indigo-300" />
              Welcome back
            </div>

            <h2 className="text-5xl font-black text-white leading-[1.1] mb-5">
              Empowering<br />
              <span style={{
                background: 'linear-gradient(135deg, #a5b4fc, #f0abfc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Education</span><br />
              Together
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              A unified platform connecting admins, teachers, students, and guardians through
              intelligent relationship management.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-3">
              {[
                'Guardian–Student Linking with smart permissions',
                'Role-Based Access for all stakeholders',
                'Academic Reports with GPA & attendance tracking',
                'Learning Communities & Quiz Management',
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-white/65"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                >
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  {f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom: version */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/25 text-xs"
          >
            eduCare LMS v1.0 · © 2026
          </motion.p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#f5f4fc' }}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">eduCare LMS</h1>
                <p className="text-gray-500 text-xs">ERM Platform</p>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-primary-600 text-sm transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Quick login cards */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick demo login</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isActive = activeRole === acc.role;
                return (
                  <motion.button
                    key={acc.role}
                    onClick={() => quickLogin(acc)}
                    className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                    style={{
                      background: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                      borderColor: isActive ? 'rgba(99,102,241,0.4)' : 'rgba(226,232,240,0.9)',
                      boxShadow: isActive ? '0 4px 16px rgba(99,102,241,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${acc.gradient} flex items-center justify-center`}
                      style={{ boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.3)' : '0 2px 6px rgba(0,0,0,0.1)' }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>{acc.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="roleActive"
                        className="absolute inset-0 rounded-xl"
                        style={{ border: '1.5px solid rgba(99,102,241,0.5)' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="bg-red-50 border border-red-200/80 text-red-700 text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base font-bold mt-2"
              whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                    />
                    Signing in…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <LogIn size={17} /> Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-500">
              New to eduCare?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
