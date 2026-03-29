import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows, Sparkles, Zap, Target, Clock, Brain } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
} from 'recharts';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { ComparisonData } from '../types';

const COLORS_AI = '#a855f7';
const COLORS_STD = '#6b7280';

export default function ComparisonPage() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    api.get('/analytics/comparison').then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  if (!data || (!data.ai_assisted.total_attempts && !data.non_ai_assisted.total_attempts)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <GitCompareArrows className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-lg font-medium">{t('compNoData')}</p>
        <p className="text-sm mt-1">{t('compNoDataSub')}</p>
      </div>
    );
  }

  const ai = data.ai_assisted;
  const std = data.non_ai_assisted;

  const barData = [
    { name: t('compAccuracy'), AI: Math.round(ai.accuracy), Standard: Math.round(std.accuracy) },
    { name: t('compAvgSpeed'), AI: Math.round(ai.avg_time * 10) / 10, Standard: Math.round(std.avg_time * 10) / 10 },
    { name: t('compTotalQuizzes'), AI: ai.total_attempts, Standard: std.total_attempts },
    { name: t('compCorrect'), AI: ai.correct, Standard: std.correct },
  ];

  const radarData = [
    { metric: 'Accuracy', AI: ai.accuracy, Standard: std.accuracy },
    { metric: 'Speed', AI: Math.max(0, 100 - ai.avg_time * 3), Standard: Math.max(0, 100 - std.avg_time * 3) },
    { metric: 'Volume', AI: (ai.total_attempts / Math.max(ai.total_attempts + std.total_attempts, 1)) * 100, Standard: (std.total_attempts / Math.max(ai.total_attempts + std.total_attempts, 1)) * 100 },
    { metric: 'Correctness', AI: ai.total_attempts ? (ai.correct / ai.total_attempts) * 100 : 0, Standard: std.total_attempts ? (std.correct / std.total_attempts) * 100 : 0 },
  ];

  const pieData = [
    { name: 'AI Mode', value: ai.total_attempts },
    { name: 'Standard', value: std.total_attempts },
  ];

  const statCards = [
    {
      title: t('compAIAccuracy'),
      value: `${Math.round(ai.accuracy)}%`,
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: t('compStdAccuracy'),
      value: `${Math.round(std.accuracy)}%`,
      icon: Brain,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
    },
    {
      title: t('compAISpeed'),
      value: `${Math.round(ai.avg_time * 10) / 10}s`,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: t('compHintsUsed'),
      value: ai.hint_usage.toString(),
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
          <GitCompareArrows className="w-7 h-7 text-primary-400" /> {t('compTitle')}
        </h1>
        <p className="text-gray-400 mt-1">{t('compSubtitle')}</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 lg:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <span className="text-xs text-gray-400">{card.title}</span>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 lg:p-8"
        >
          <h3 className="text-white font-semibold mb-5">{t('compPerformance')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="AI" fill={COLORS_AI} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Standard" fill={COLORS_STD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 lg:p-8"
        >
          <h3 className="text-white font-semibold mb-5">{t('compSkillRadar')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="AI" dataKey="AI" stroke={COLORS_AI} fill={COLORS_AI} fillOpacity={0.3} />
              <Radar name="Standard" dataKey="Standard" stroke={COLORS_STD} fill={COLORS_STD} fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 lg:p-8"
        >
          <h3 className="text-white font-semibold mb-5">{t('compQuizDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                <Cell fill={COLORS_AI} />
                <Cell fill={COLORS_STD} />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 lg:p-8"
        >
          <h3 className="text-white font-semibold mb-5">{t('compKeyInsights')}</h3>
          <div className="space-y-4">
            {ai.accuracy > std.accuracy ? (
              <InsightRow
                icon={<Sparkles className="w-4 h-4 text-purple-400" />}
                text={`AI mode boosted your accuracy by ${Math.round(ai.accuracy - std.accuracy)}%`}
                positive
              />
            ) : ai.accuracy < std.accuracy ? (
              <InsightRow
                icon={<Brain className="w-4 h-4 text-gray-400" />}
                text={`You performed ${Math.round(std.accuracy - ai.accuracy)}% better without AI`}
                positive
              />
            ) : (
              <InsightRow
                icon={<Target className="w-4 h-4 text-blue-400" />}
                text="Equal accuracy in both modes"
              />
            )}

            {ai.avg_time < std.avg_time ? (
              <InsightRow
                icon={<Clock className="w-4 h-4 text-blue-400" />}
                text={`AI mode helped you answer ${Math.round(std.avg_time - ai.avg_time)}s faster on average`}
                positive
              />
            ) : ai.avg_time > std.avg_time ? (
              <InsightRow
                icon={<Clock className="w-4 h-4 text-orange-400" />}
                text={`Standard mode was ${Math.round(ai.avg_time - std.avg_time)}s faster on average`}
              />
            ) : null}

            <InsightRow
              icon={<Zap className="w-4 h-4 text-yellow-400" />}
              text="Standard mode earns 1.5x XP bonus per correct answer"
              positive
            />

            <InsightRow
              icon={<Target className="w-4 h-4 text-green-400" />}
              text={`Total quizzes taken: ${ai.total_attempts + std.total_attempts} (AI: ${ai.total_attempts}, Std: ${std.total_attempts})`}
            />

            {ai.hint_usage > 0 && (
              <InsightRow
                icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                text={`You used AI hints ${ai.hint_usage} time${ai.hint_usage > 1 ? 's' : ''}`}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InsightRow({ icon, text, positive }: { icon: React.ReactNode; text: string; positive?: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
      <div className="mt-0.5">{icon}</div>
      <span className={`text-sm ${positive ? 'text-gray-200' : 'text-gray-400'}`}>{text}</span>
    </div>
  );
}
