import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Star, Zap, Calendar } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Achievement } from '../types';

const badgeColors: Record<string, string> = {
  gold: 'from-yellow-400 to-amber-500',
  silver: 'from-gray-300 to-gray-400',
  bronze: 'from-orange-400 to-orange-600',
  purple: 'from-purple-400 to-purple-600',
  blue: 'from-blue-400 to-blue-600',
  green: 'from-green-400 to-emerald-500',
  red: 'from-red-400 to-red-600',
  pink: 'from-pink-400 to-pink-600',
};

const iconEmoji: Record<string, string> = {
  'footprints': '👣',
  'book-open': '📖',
  'graduation-cap': '🎓',
  'crown': '👑',
  'check-circle': '✅',
  'target': '🎯',
  'star': '⭐',
  'flame': '🔥',
  'zap': '⚡',
  'trophy': '🏆',
  'sparkles': '✨',
  'brain': '🧠',
  'shield': '🛡️',
  'clock': '⏰',
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/achievements').then((r) => {
      setAchievements(r.data);
      setLoading(false);
    });
  }, []);

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-yellow-400" /> {t('achievementsTitle')}
        </h1>
        <p className="text-gray-400 mt-1">
          {t('achievementsUnlocked')} {earned.length} {t('achievementsOf')} {achievements.length} {t('achievementsAchievements')}
        </p>
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden max-w-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earned.length / Math.max(achievements.length, 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Earned */}
      {earned.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> {t('achievementsEarned')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {earned.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 lg:p-7 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${a.badge_color}, ${a.badge_color}cc)` }}
                  >
                    <span className="text-2xl">{iconEmoji[a.icon] || '🏅'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{a.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Zap className="w-3 h-3" />{a.xp_reward} XP
                      </span>
                      {a.earned_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(a.earned_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" /> {t('achievementsLocked')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {locked.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 lg:p-7 opacity-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-400 truncate">{a.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />{a.xp_reward} XP
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
