import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Zap, Coffee, Flame, BarChart3 } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { FocusSession } from '../types';

const PRESETS = [15, 25, 45, 60];

export default function FocusTimerPage() {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [stats, setStats] = useState<any>({ total_minutes: 0, total_sessions: 0, total_xp: 0, today_minutes: 0, weekly_data: [], avg_duration: 0, focus_streak: 0, distribution: {}, week_minutes: 0 });
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useI18n();

  const fetchData = useCallback(() => {
    api.get('/focus-sessions').then((r) => setSessions(r.data));
    api.get('/focus-sessions/stats').then((r) => setStats(r.data));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false);
      if (sessionId) completeSession(sessionId);
    }
  }, [secondsLeft, running, sessionId]);

  const startTimer = async () => {
    const res = await api.post('/focus-sessions', { duration_minutes: duration });
    setSessionId(res.data.id);
    setSecondsLeft(duration * 60);
    setRunning(true);
  };

  const completeSession = async (id: number) => {
    const res = await api.post(`/focus-sessions/${id}/complete`);
    setJustEarned(res.data.xp_earned);
    setSessionId(null);
    setTimeout(() => setJustEarned(null), 3000);
    fetchData();
  };

  const resetTimer = () => {
    setRunning(false);
    setSessionId(null);
    setSecondsLeft(duration * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const selectDuration = (m: number) => {
    if (running) return;
    setDuration(m);
    setSecondsLeft(m * 60);
  };

  const togglePause = () => setRunning(!running);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = sessionId ? 1 - secondsLeft / (duration * 60) : 0;
  const circumference = 2 * Math.PI * 120;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Timer className="w-7 h-7 text-primary-400" /> {t('focusTitle')}
        </h1>
        <p className="text-gray-400 mt-1">{t('focusSubtitle')}</p>
      </motion.div>

      {/* XP notification */}
      {justEarned !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center gap-2 text-yellow-300 font-medium"
        >
          <Zap className="w-5 h-5" /> +{justEarned} XP!
        </motion.div>
      )}

      {/* Timer circle */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold text-white tabular-nums">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-500 mt-1">{duration} {t('focusMin')}</span>
          </div>
        </div>
      </motion.div>

      {/* Duration presets */}
      <div className="flex justify-center gap-3">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => selectDuration(m)}
            disabled={running}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              duration === m
                ? 'bg-primary-500/30 border border-primary-500/50 text-primary-300'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            } disabled:cursor-not-allowed`}
          >
            {m} {t('focusMin')}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!sessionId ? (
          <button
            onClick={startTimer}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:from-primary-600 hover:to-accent-600 transition shadow-lg shadow-primary-500/25"
          >
            <Play className="w-5 h-5" /> {t('focusStart')}
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white font-medium hover:bg-white/20 transition"
            >
              {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {running ? t('focusPause') : t('focusResume')}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition"
            >
              <RotateCcw className="w-4 h-4" /> {t('focusReset')}
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('focusToday'), value: `${stats.today_minutes}m`, icon: Coffee },
          { label: t('focusTotalMin'), value: `${stats.total_minutes}m`, icon: Timer },
          { label: t('focusSessions'), value: stats.total_sessions, icon: Zap },
          { label: t('focusStreak'), value: `${stats.focus_streak}d`, icon: Flame },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <s.icon className="w-4 h-4 mx-auto text-primary-400 mb-1" />
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Weekly Chart */}
      {stats.weekly_data && stats.weekly_data.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> {t('focusWeeklyChart')}
            </h2>
            <span className="text-xs text-gray-500">{stats.week_minutes} min {t('focusThisWeek')}</span>
          </div>
          <div className="flex items-end gap-2" style={{ height: '112px' }}>
            {stats.weekly_data.map((d: any, i: number) => {
              const maxMins = Math.max(...stats.weekly_data.map((w: any) => w.minutes), 1);
              const barH = Math.max(Math.round((d.minutes / maxMins) * 80), 4);
              const isToday = i === stats.weekly_data.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5" style={{ height: '100%' }}>
                  <span className="text-[10px] text-gray-500">{d.minutes > 0 ? `${d.minutes}m` : ''}</span>
                  <div
                    className={`w-full rounded-t transition-all ${isToday ? 'bg-gradient-to-t from-primary-500 to-accent-500' : 'bg-gradient-to-t from-emerald-600 to-teal-500'}`}
                    style={{ height: `${barH}px` }}
                  />
                  <span className={`text-[10px] ${isToday ? 'text-primary-400 font-bold' : 'text-gray-600'}`}>{d.weekday}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Duration Distribution + Avg */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Distribution */}
        {stats.distribution && (
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-medium text-gray-400 mb-3">{t('focusDistribution')}</h2>
            <div className="space-y-2.5">
              {[{k:'15', label:'15 min'},{k:'25', label:'25 min'},{k:'45', label:'45 min'},{k:'60', label:'60 min'}].map(({k, label}) => {
                const count = stats.distribution[k] || 0;
                const maxCount = Math.max(...Object.values(stats.distribution).map((v: any) => v as number), 1);
                const pct = (count / maxCount) * 100;
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-12">{label}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all" style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="glass rounded-2xl p-5 flex flex-col justify-center space-y-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{t('focusAvgDuration')}</p>
            <p className="text-3xl font-bold text-white">{stats.avg_duration}<span className="text-sm text-gray-500 ml-1">min</span></p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{t('focusTotalXP')}</p>
            <p className="text-2xl font-bold text-yellow-300 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5" />{stats.total_xp}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">{t('focusHistory')}</h2>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {sessions.slice(0, 20).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">{s.duration_minutes} {t('focusMin')}</span>
                  {s.completed && <span className="text-xs text-green-400">✓</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {s.xp_earned > 0 && <span className="text-yellow-400">+{s.xp_earned} XP</span>}
                  <span>{new Date(s.started_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
