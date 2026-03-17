import { Menu, Bell, Search, Home, X, CheckCheck, TrendingDown, Award, ClipboardList, FileText, MessageSquare, AlertTriangle, Info, UserCheck, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../utils/api';

/* ─── role colours ─── */
const ROLE_META = {
  admin:    { gradient: 'from-violet-500 to-indigo-600', dot: 'bg-violet-400',  glow: 'rgba(139,92,246,0.5)',  label: 'bg-violet-50 text-violet-700 border-violet-200/80' },
  teacher:  { gradient: 'from-blue-500 to-indigo-500',   dot: 'bg-blue-400',    glow: 'rgba(99,102,241,0.5)',  label: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  student:  { gradient: 'from-emerald-500 to-teal-500',  dot: 'bg-emerald-400', glow: 'rgba(16,185,129,0.45)', label: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  guardian: { gradient: 'from-orange-400 to-amber-500',  dot: 'bg-orange-400',  glow: 'rgba(249,115,22,0.45)', label: 'bg-orange-50 text-orange-700 border-orange-200/80' },
};

/* ─── notification type config ─── */
const TYPE_CONFIG = {
  pending_approval: { icon: Users,         bg: 'bg-amber-50',   border: 'border-amber-200',   iconColor: 'text-amber-600'  },
  feedback:         { icon: MessageSquare, bg: 'bg-blue-50',    border: 'border-blue-200',    iconColor: 'text-blue-600'   },
  quiz_attempt:     { icon: ClipboardList, bg: 'bg-violet-50',  border: 'border-violet-200',  iconColor: 'text-violet-600' },
  progress_drop:    { icon: TrendingDown,  bg: 'bg-red-50',     border: 'border-red-200',     iconColor: 'text-red-500'    },
  milestone:        { icon: Award,         bg: 'bg-purple-50',  border: 'border-purple-200',  iconColor: 'text-purple-600' },
  new_report:       { icon: FileText,      bg: 'bg-teal-50',    border: 'border-teal-200',    iconColor: 'text-teal-600'   },
  streak_break:     { icon: AlertTriangle, bg: 'bg-orange-50',  border: 'border-orange-200',  iconColor: 'text-orange-500' },
  quiz_decline:     { icon: TrendingDown,  bg: 'bg-red-50',     border: 'border-red-200',     iconColor: 'text-red-500'    },
  user_approved:    { icon: UserCheck,     bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-600'},
  info:             { icon: Info,          bg: 'bg-gray-50',    border: 'border-gray-200',    iconColor: 'text-gray-500'   },
};

const SEVERITY_DOT = {
  danger:  'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info:    'bg-blue-400',
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

/* ─── single notification row ─── */
function NotifItem({ n, onClick }) {
  const cfg  = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;
  const dot  = SEVERITY_DOT[n.severity] || SEVERITY_DOT.info;

  return (
    <Link
      to={n.link || '/dashboard'}
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0 group`}
    >
      {/* Icon bubble */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg} border ${cfg.border}`}>
        <Icon size={14} className={cfg.iconColor} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 leading-snug">{n.title}</p>
        <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
      )}
    </Link>
  );
}

/* ─── notification panel ─── */
function NotifPanel({ onClose }) {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications')
      .then(r => setNotifs(r.data.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async () => {
    await api.put('/notifications/read').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClick = (link) => {
    onClose();
    if (link) navigate(link);
  };

  return (
    <div
      className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-float border border-gray-100 z-50 overflow-hidden animate-scale-in"
      style={{ transformOrigin: 'top right' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-indigo-500" />
          <p className="text-sm font-bold text-gray-800">Notifications</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markRead}
            title="Mark all read"
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <CheckCheck size={12} /> All read
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto overscroll-contain">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bell size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No new notifications right now.</p>
          </div>
        ) : (
          notifs.map(n => (
            <NotifItem key={n.id} n={n} onClick={() => handleClick(n.link)} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50">
          <Link
            to="/dashboard/progress"
            onClick={onClose}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
          >
            <TrendingUp size={11} /> View progress tracker
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── main navbar ─── */
export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [showSearch, setShowSearch]   = useState(false);
  const [showNotifs, setShowNotifs]   = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);
  const meta = ROLE_META[user?.role] || ROLE_META.student;

  // Fetch unread count periodically
  const fetchCount = useCallback(() => {
    if (!user) return;
    api.get('/notifications')
      .then(r => {
        const notifs = r.data.notifications || [];
        const unread = notifs.filter(n => n.isRead === false || n.isRead === undefined).length;
        setUnreadCount(unread);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // re-check every 30s
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Close on outside click
  useEffect(() => {
    const fn = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleBellClick = () => {
    setShowNotifs(v => !v);
    if (!showNotifs) setUnreadCount(0); // optimistic clear
  };

  return (
    <header
      className="h-16 flex items-center px-5 gap-4 flex-shrink-0 z-10 sticky top-0"
      style={{
        background: 'rgba(245,244,252,0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(226,232,240,0.7)',
        boxShadow: '0 1px 0 rgba(99,102,241,0.06), 0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white transition-all duration-200"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Menu size={18} />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-md">
        {showSearch ? (
          <div className="relative animate-fade-in-down">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              autoFocus
              onBlur={() => setShowSearch(false)}
              placeholder="Search users, reports, groups…"
              className="input pl-10 pr-9 py-2 text-sm w-full"
            />
            <button
              onMouseDown={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-gray-600 transition-all duration-200 w-full max-w-xs px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <Search size={13} />
            <span className="hidden sm:block text-xs">Search anything…</span>
            <span
              className="hidden sm:flex ml-auto items-center gap-0.5 text-xs font-mono text-gray-400 px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(226,232,240,0.7)' }}
            >⌘K</span>
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Home */}
        <Link
          to="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-white transition-all duration-200"
          title="Landing page"
        >
          <Home size={16} />
        </Link>

        {/* ── Notification bell ── */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={handleBellClick}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${showNotifs ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-primary-600 hover:bg-white'}`}
            style={showNotifs ? {} : { boxShadow: '0 0 0 0 transparent' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none"
                style={{ boxShadow: '0 0 8px rgba(244,63,94,0.6)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <NotifPanel onClose={() => setShowNotifs(false)} />
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1.5" style={{ background: 'rgba(226,232,240,0.9)' }} />

        {/* User chip */}
        <div className="flex items-center gap-2.5 pl-0.5">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            style={{ boxShadow: `0 3px 10px ${meta.glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none tracking-tight">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} style={{ boxShadow: `0 0 5px ${meta.glow}` }} />
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border capitalize ${meta.label}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
