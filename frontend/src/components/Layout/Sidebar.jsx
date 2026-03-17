import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Link2, FileText, Users2,
  Activity, LogOut, GraduationCap, Shield, BookOpen,
  Heart, BookMarked, MessageSquare, ClipboardList, Sparkles, TrendingUp,
} from 'lucide-react';

const ROLE_COLORS = {
  admin:    { from: 'from-violet-600',  to: 'to-indigo-700',   accent: '#8b5cf6', light: 'rgba(139,92,246,0.12)', text: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200' },
  teacher:  { from: 'from-blue-600',    to: 'to-indigo-600',   accent: '#6366f1', light: 'rgba(99,102,241,0.12)',  text: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  student:  { from: 'from-emerald-500', to: 'to-teal-600',     accent: '#10b981', light: 'rgba(16,185,129,0.1)',   text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  guardian: { from: 'from-orange-500',  to: 'to-amber-500',    accent: '#f97316', light: 'rgba(249,115,22,0.1)',   text: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200' },
};

const ROLE_ICONS = { admin: Shield, teacher: BookOpen, student: GraduationCap, guardian: Heart };

const navItems = {
  admin: [
    { to: '/dashboard',           label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/dashboard/users',     label: 'User Management', icon: Users },
    { to: '/dashboard/guardians', label: 'Guardian Links',  icon: Link2 },
    { to: '/dashboard/materials', label: 'Content Manager', icon: BookMarked },
    { to: '/dashboard/reports',   label: 'Reports',         icon: FileText },
    { to: '/dashboard/groups',    label: 'Learning Groups', icon: Users2 },
    { to: '/dashboard/activity',  label: 'Activity Monitor',icon: Activity },
    { to: '/dashboard/feedback',  label: 'Feedback',        icon: MessageSquare },
    { to: '/dashboard/quiz',      label: 'Quiz Management', icon: ClipboardList },
    { to: '/dashboard/progress',  label: 'Progress Tracker',icon: TrendingUp },
  ],
  teacher: [
    { to: '/dashboard',           label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/dashboard/materials', label: 'Content Manager', icon: BookMarked },
    { to: '/dashboard/guardians', label: 'Guardian Links',  icon: Link2 },
    { to: '/dashboard/reports',   label: 'Reports',         icon: FileText },
    { to: '/dashboard/groups',    label: 'Learning Groups', icon: Users2 },
    { to: '/dashboard/activity',  label: 'My Activity',     icon: Activity },
    { to: '/dashboard/feedback',  label: 'Feedback',        icon: MessageSquare },
    { to: '/dashboard/quiz',      label: 'Quiz Management', icon: ClipboardList },
    { to: '/dashboard/progress',  label: 'Progress Tracker',icon: TrendingUp },
  ],
  student: [
    { to: '/dashboard',           label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/dashboard/materials', label: 'Study Materials', icon: BookMarked },
    { to: '/dashboard/reports',   label: 'My Reports',      icon: FileText },
    { to: '/dashboard/groups',    label: 'Learning Groups', icon: Users2 },
    { to: '/dashboard/activity',  label: 'My Activity',     icon: Activity },
    { to: '/dashboard/feedback',  label: 'Feedback',        icon: MessageSquare },
    { to: '/dashboard/quiz',      label: 'Quizzes',         icon: ClipboardList },
    { to: '/dashboard/progress',  label: 'My Progress',     icon: TrendingUp },
  ],
  guardian: [
    { to: '/dashboard',           label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/dashboard/reports',   label: "Student Reports", icon: FileText },
    { to: '/dashboard/activity',  label: 'Activity Log',    icon: Activity },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  const colors = ROLE_COLORS[user?.role] || ROLE_COLORS.admin;
  const RoleIcon = ROLE_ICONS[user?.role] || Shield;

  const handleLogout = () => { logout(); navigate('/'); };
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(15,10,40,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transform transition-transform duration-300 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRight: '1px solid rgba(226,232,240,0.7)',
          boxShadow: '4px 0 40px rgba(99,102,241,0.08), 1px 0 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* ── Brand header ──────────────────────────────────────────────── */}
        <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-5 relative overflow-hidden`}>
          {/* Decorative orbs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/7" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5" />

          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/25 shadow-inner-light">
                <GraduationCap size={19} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-none tracking-tight">eduCare</p>
                <p className="text-white/55 text-xs mt-0.5 font-medium">LMS Platform</p>
              </div>
              <div className="ml-auto">
                <Sparkles size={13} className="text-white/40 animate-pulse-slow" />
              </div>
            </div>

            {/* User card */}
            <div className="rounded-2xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}
              >
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-sm truncate leading-none">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" style={{ boxShadow: '0 0 5px rgba(110,231,183,0.8)' }} />
                  <p className="text-white/65 text-xs capitalize font-medium">{user?.role}</p>
                </div>
              </div>
              <RoleIcon size={13} className="text-white/40 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
          <ul className="space-y-0.5">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? `${colors.bg} ${colors.text}`
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    boxShadow: `0 1px 4px ${colors.light}, inset 0 0 0 1px ${colors.light.replace('0.12','0.25')}`,
                  } : {}}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${isActive
                          ? `bg-gradient-to-br ${colors.from} ${colors.to}`
                          : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                        }
                      `}
                        style={isActive ? { boxShadow: `0 3px 10px ${colors.light.replace('0.12','0.4')}` } : {}}
                      >
                        <Icon size={14} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} />
                      </div>
                      <span className="flex-1">{label}</span>
                      {isActive && (
                        <div className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${colors.from} ${colors.to} opacity-70`} />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="p-3 border-t border-gray-100/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50/80 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <LogOut size={14} className="text-red-500" />
            </div>
            Sign Out
          </button>
          <p className="text-center text-[10px] text-gray-300 mt-3 font-medium">eduCare LMS v1.0</p>
        </div>
      </aside>
    </>
  );
}
