import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Flame, BookOpen, Target, Trophy, TrendingUp, Star,
  ArrowRight, CheckCircle, Clock, BarChart3,
  Layers, AlertCircle, CalendarDays, Timer,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import api from '../services/api';
import type { UserStats, Course } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [widgets, setWidgets] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/user/stats').then((r) => setStats(r.data)),
      api.get('/courses').then((r) => setCourses(r.data)),
      api.get('/dashboard/widgets').then((r) => setWidgets(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  const xpPercent = stats ? Math.min((stats.xp_progress / Math.max(stats.xp_needed, 1)) * 100, 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t('dashWelcomeBack')} <span className="gradient-text">{user?.display_name || t('dashLearner')}</span>! 👋
          </h1>
          <p className="text-gray-400 mt-1">{t('dashSubtitle')}</p>
        </div>
        <Link
          to="/courses"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 glow-primary"
        >
          {t('dashContinueLearning')} <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Zap,
            label: t('dashTotalXP'),
            value: stats?.total_xp || 0,
            color: 'from-yellow-500 to-orange-500',
            glow: 'rgba(245, 158, 11, 0.2)',
          },
          {
            icon: Flame,
            label: t('dashDayStreak'),
            value: `${stats?.streak_days || 0} ${t('dashDays')}`,
            color: 'from-red-500 to-orange-500',
            glow: 'rgba(239, 68, 68, 0.2)',
          },
          {
            icon: BookOpen,
            label: t('dashLessonsDone'),
            value: `${stats?.lessons_completed || 0}/${stats?.total_lessons || 0}`,
            color: 'from-primary-500 to-purple-500',
            glow: 'rgba(99, 102, 241, 0.2)',
          },
          {
            icon: Target,
            label: t('dashQuizAccuracy'),
            value: `${stats?.accuracy || 0}%`,
            color: 'from-green-500 to-emerald-500',
            glow: 'rgba(16, 185, 129, 0.2)',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-7 card-hover"
            style={{ boxShadow: `0 0 30px ${stat.glow}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> {t('dashLevelProgress')}
            </h2>
            <span className="text-sm text-primary-300 font-medium">{t('dashLevel')} {stats?.level || 1}</span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-warning-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 gap-4">
            <span className="whitespace-nowrap">{stats?.xp_progress || 0} XP</span>
            <span className="whitespace-nowrap text-right">{stats?.xp_needed || 100} XP {t('dashXPNeeded')} {(stats?.level || 1) + 1}</span>
          </div>

          {/* Quick Course Progress */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-300">{t('dashCourseProgress')}</h3>
            {courses.slice(0, 4).map((course) => {
              const done = course.lessons.filter((l) => l.completed).length;
              const total = course.lessons.length;
              const pct = total > 0 ? (done / total) * 100 : 0;
              return (
                <div key={course.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: course.color + '30' }}>
                    <BookOpen className="w-4 h-4" style={{ color: course.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="text-sm text-gray-300 truncate">{course.title}</span>
                      <span className="text-xs text-gray-500 shrink-0">{done}/{total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: course.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" /> {t('dashQuickStats')}
          </h2>
          <div className="space-y-3.5 flex-1">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{t('dashQuizzesCorrect')}</span>
              </div>
              <span className="text-sm font-semibold text-white">{stats?.quizzes_correct || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">{t('dashQuizzesAttempted')}</span>
              </div>
              <span className="text-sm font-semibold text-white">{stats?.quizzes_attempted || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">{t('dashAchievements')}</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {stats?.achievements_earned || 0}/{stats?.total_achievements || 0}
              </span>
            </div>
          </div>
          <Link
            to="/achievements"
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-sm text-primary-300 hover:bg-primary-500/10 transition"
          >
            <Trophy className="w-4 h-4" /> {t('dashViewAllAchievements')}
          </Link>

          {/* AI Mode Status */}
          <div className="mt-4 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-400" />
              <span className="text-xs text-primary-300">
                {t('dashAIMode')}: <strong>{stats?.ai_mode_enabled ? 'ON' : 'OFF'}</strong>
              </span>
            </div>
            <Link to="/comparison" className="text-xs text-primary-400 hover:underline mt-1 block">
              {t('dashViewComparison')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ===== New Feature Widgets ===== */}
      {widgets && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Flashcard Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('dashFlashcards')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashFlashTotal')}</span>
                <span className="text-sm font-bold text-white">{widgets.flashcards.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashFlashDue')}</span>
                <span className={`text-sm font-bold ${widgets.flashcards.due > 0 ? 'text-yellow-300' : 'text-green-300'}`}>{widgets.flashcards.due}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashFlashMastered')}</span>
                <span className="text-sm font-bold text-green-400">{widgets.flashcards.mastered}</span>
              </div>
              {widgets.flashcards.total > 0 && (
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.round(widgets.flashcards.mastered / Math.max(widgets.flashcards.total, 1) * 100)}%` }} />
                </div>
              )}
            </div>
            <Link to="/flashcards" className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-primary-300 hover:bg-primary-500/10 transition">
              <Layers className="w-3.5 h-3.5" /> {t('dashFlashGo')}
            </Link>
          </motion.div>

          {/* Wrong Answers Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('dashWrong')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashWrongTotal')}</span>
                <span className="text-sm font-bold text-red-300">{widgets.wrong_answers.total_wrong}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashWrongCorrected')}</span>
                <span className="text-sm font-bold text-green-400">{widgets.wrong_answers.corrected}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashWrongRemaining')}</span>
                <span className={`text-sm font-bold ${widgets.wrong_answers.uncorrected > 0 ? 'text-yellow-300' : 'text-green-300'}`}>{widgets.wrong_answers.uncorrected}</span>
              </div>
              {widgets.wrong_answers.total_wrong > 0 && (
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.round(widgets.wrong_answers.corrected / Math.max(widgets.wrong_answers.total_wrong, 1) * 100)}%` }} />
                </div>
              )}
            </div>
            <Link to="/wrong-answers" className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-primary-300 hover:bg-primary-500/10 transition">
              <AlertCircle className="w-3.5 h-3.5" /> {t('dashWrongGo')}
            </Link>
          </motion.div>

          {/* Study Plan Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('dashPlan')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashPlanCompleted')}</span>
                <span className="text-sm font-bold text-white">{widgets.study_plans.completed_plans}/{widgets.study_plans.total_plans}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('dashPlanTasks')}</span>
                <span className="text-sm font-bold text-white">{widgets.study_plans.done_items}/{widgets.study_plans.total_items}</span>
              </div>
              {widgets.study_plans.active_plans.map((p: any) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 truncate mr-2">{p.title}</span>
                    <span className="text-gray-500 shrink-0">{p.done}/{p.total}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/study-plan" className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-primary-300 hover:bg-primary-500/10 transition">
              <CalendarDays className="w-3.5 h-3.5" /> {t('dashPlanGo')}
            </Link>
          </motion.div>

          {/* Focus Analytics Widget */}
          {widgets.focus && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">{t('dashFocus')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('dashFocusToday')}</span>
                  <span className="text-sm font-bold text-emerald-300">{widgets.focus.today_minutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('dashFocusTotal')}</span>
                  <span className="text-sm font-bold text-white">{widgets.focus.total_minutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('dashFocusSessions')}</span>
                  <span className="text-sm font-bold text-white">{widgets.focus.total_sessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('dashFocusAvg')}</span>
                  <span className="text-sm font-bold text-white">{widgets.focus.avg_duration} min</span>
                </div>
                {/* Weekly bar chart */}
                {widgets.focus.weekly && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-2">{t('dashFocusWeek')}</p>
                    <div className="flex items-end gap-1.5" style={{ height: '64px' }}>
                      {widgets.focus.weekly.map((d: any, i: number) => {
                        const maxMins = Math.max(...widgets.focus.weekly.map((w: any) => w.minutes), 1);
                        const barH = Math.max(Math.round((d.minutes / maxMins) * 44), 3);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-teal-400 transition-all"
                              style={{ height: `${barH}px` }}
                              title={`${d.minutes} min`}
                            />
                            <span className="text-[9px] text-gray-600">{d.weekday}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/focus" className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-primary-300 hover:bg-primary-500/10 transition">
                <Timer className="w-3.5 h-3.5" /> {t('dashFocusGo')}
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
