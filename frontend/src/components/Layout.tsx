import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Trophy, BarChart3,
  MessageSquare, LogOut, ChevronLeft, ChevronRight,
  Sparkles, Zap, Flame, Globe, Layers, CalendarDays, Timer, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import api from '../services/api';
import type { TranslationKey } from '../i18n/translations';

const navItems: { path: string; icon: typeof LayoutDashboard; labelKey: TranslationKey }[] = [
  { path: '/', icon: LayoutDashboard, labelKey: 'navDashboard' },
  { path: '/courses', icon: BookOpen, labelKey: 'navCourses' },
  { path: '/achievements', icon: Trophy, labelKey: 'navAchievements' },
  { path: '/comparison', icon: BarChart3, labelKey: 'navComparison' },
  { path: '/chat', icon: MessageSquare, labelKey: 'navChat' },
  { path: '/flashcards', icon: Layers, labelKey: 'navFlashcards' },
  { path: '/study-plan', icon: CalendarDays, labelKey: 'navStudyPlan' },
  { path: '/focus', icon: Timer, labelKey: 'navFocus' },
  { path: '/wrong-answers', icon: AlertCircle, labelKey: 'navWrongAnswers' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, refreshUser } = useAuth();
  const { t, toggleLocale, locale } = useI18n();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [aiToggling, setAiToggling] = useState(false);

  const toggleAI = async () => {
    if (!user || aiToggling) return;
    setAiToggling(true);
    try {
      await api.post('/settings/ai-mode', { enabled: !user.ai_mode_enabled });
      await refreshUser();
    } catch {
      // ignore
    }
    setAiToggling(false);
  };

  const levelProgress = user ? (user.total_xp % 100) : 0;

  return (
    <div className="flex min-h-screen">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${99 + Math.random() * 140}, ${102 + Math.random() * 100}, 241, ${0.1 + Math.random() * 0.2})`,
              animation: `float ${15 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen glass-strong z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-lg font-bold text-white">{t('appName')}</h1>
              <p className="text-xs text-primary-300">{t('appSubtitle')}</p>
            </motion.div>
          )}
        </div>

        {/* User info */}
        {user && (
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                {user.display_name?.[0]?.toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.display_name}</p>
                  <div className="flex items-center gap-1 text-xs text-primary-300">
                    <Zap className="w-3 h-3" />
                    <span>Lv.{user.level}</span>
                    <span className="mx-1">·</span>
                    <span>{user.total_xp} XP</span>
                  </div>
                  {/* XP bar */}
                  <div className="mt-1 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(levelProgress, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </div>
            {!collapsed && user.streak_days > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                <Flame className="w-3 h-3" />
                <span>{user.streak_days} day streak!</span>
              </div>
            )}
          </div>
        )}

        {/* AI Mode Toggle */}
        {!collapsed && user && (
          <div className="px-6 py-4 border-b border-white/10">
            <button
              onClick={toggleAI}
              disabled={aiToggling}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 ${
                user.ai_mode_enabled
                  ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                  : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${user.ai_mode_enabled ? 'text-primary-400' : 'text-gray-500'}`} />
                <span className="text-xs font-medium">{t('aiAssist')}</span>
              </div>
              <div className={`w-9 h-5 rounded-full transition-all duration-300 flex items-center ${
                user.ai_mode_enabled ? 'bg-primary-500 justify-end' : 'bg-gray-600 justify-start'
              }`}>
                <div className="w-4 h-4 rounded-full bg-white mx-0.5 transition-all" />
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-1 h-7 bg-primary-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[22px] h-[22px] flex-shrink-0 ${active ? 'text-primary-400' : ''}`} />
                {!collapsed && (
                  <span className="text-[15px] font-medium">{t(item.labelKey)}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-5 border-t border-white/10 space-y-1.5">
          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-gray-400 hover:bg-primary-500/10 hover:text-primary-300 transition-all w-full"
          >
            <Globe className="w-[22px] h-[22px] flex-shrink-0" />
            {!collapsed && <span className="text-[15px] font-medium">{locale === 'en' ? '中文' : 'English'}</span>}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-[22px] h-[22px] flex-shrink-0" />
            {!collapsed && <span className="text-[15px] font-medium">{t('logout')}</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-gray-300 transition-all w-full mt-1"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span className="text-xs">{t('collapse')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen relative z-10"
      >
        <div className="p-5 sm:p-8 lg:p-10 xl:p-12 max-w-[1440px] mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
