import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ThunderboltOutlined,
  FireOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  AimOutlined,
} from '@ant-design/icons';
import { Sparkles } from 'lucide-react';
import { Card, Statistic, Row, Col, Typography, Space, Spin, Empty } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
} from 'recharts';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { ComparisonData } from '../types';

const { Title, Text } = Typography;

const COLORS_AI = '#292524';
const COLORS_STD = '#d6d3d1';

const tooltipContentStyle = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: 8,
  color: '#1c1917',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  fontSize: 12,
} as const;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || (!data.ai_assisted.total_attempts && !data.non_ai_assisted.total_attempts)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Empty description={
          <Space direction="vertical" size={4} align="center">
            <Text style={{ fontSize: 16, fontWeight: 500 }}>{t('compNoData')}</Text>
            <Text type="secondary" style={{ fontSize: 14 }}>{t('compNoDataSub')}</Text>
          </Space>
        } />
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
    { title: t('compAIAccuracy'), value: `${Math.round(ai.accuracy)}%`, icon: <Sparkles style={{ width: 16, height: 16, color: '#a8a29e' }} /> },
    { title: t('compStdAccuracy'), value: `${Math.round(std.accuracy)}%`, icon: <ExperimentOutlined style={{ fontSize: 16, color: '#a8a29e' }} /> },
    { title: t('compAISpeed'), value: `${Math.round(ai.avg_time * 10) / 10}s`, icon: <ClockCircleOutlined style={{ fontSize: 16, color: '#a8a29e' }} /> },
    { title: t('compHintsUsed'), value: ai.hint_usage.toString(), icon: <ThunderboltOutlined style={{ fontSize: 16, color: '#a8a29e' }} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Space align="center" size={8}>
          <FireOutlined style={{ fontSize: 20, color: '#a8a29e' }} />
          <Title level={3} style={{ margin: 0 }}>{t('compTitle')}</Title>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 14 }}>
          {t('compSubtitle')}
        </Text>
      </motion.div>

      {/* Stat Cards */}
      <Row gutter={[20, 20]}>
        {statCards.map((card, i) => (
          <Col xs={12} lg={6} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card style={{ borderRadius: 16 }} styles={{ body: { padding: 24 } }}>
                <Statistic
                  title={
                    <Space size={8} style={{ marginBottom: 8 }}>
                      {card.icon}
                      <Text type="secondary" style={{ fontSize: 12 }}>{card.title}</Text>
                    </Space>
                  }
                  value={card.value}
                  valueStyle={{ fontSize: 30, fontWeight: 600, color: '#1c1917' }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts grid */}
      <Row gutter={[24, 24]}>
        {/* Bar Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card
              title={<Text strong style={{ fontSize: 14 }}>{t('compPerformance')}</Text>}
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 28 } }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Legend />
                  <Bar dataKey="AI" fill={COLORS_AI} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Standard" fill={COLORS_STD} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Radar Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              title={<Text strong style={{ fontSize: 14 }}>{t('compSkillRadar')}</Text>}
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 28 } }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.04)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="AI" dataKey="AI" stroke={COLORS_AI} fill={COLORS_AI} fillOpacity={0.15} />
                  <Radar name="Standard" dataKey="Standard" stroke={COLORS_STD} fill={COLORS_STD} fillOpacity={0.15} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card
              title={<Text strong style={{ fontSize: 14 }}>{t('compQuizDistribution')}</Text>}
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 28 } }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    <Cell fill={COLORS_AI} />
                    <Cell fill={COLORS_STD} />
                  </Pie>
                  <Tooltip contentStyle={tooltipContentStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Key Insights */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              title={<Text strong style={{ fontSize: 14 }}>{t('compKeyInsights')}</Text>}
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 28 } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ai.accuracy > std.accuracy ? (
                  <InsightRow
                    icon={<Sparkles style={{ width: 14, height: 14, color: '#57534e' }} />}
                    text={`AI mode boosted your accuracy by ${Math.round(ai.accuracy - std.accuracy)}%`}
                    positive
                  />
                ) : ai.accuracy < std.accuracy ? (
                  <InsightRow
                    icon={<ExperimentOutlined style={{ fontSize: 14, color: '#57534e' }} />}
                    text={`You performed ${Math.round(std.accuracy - ai.accuracy)}% better without AI`}
                    positive
                  />
                ) : (
                  <InsightRow
                    icon={<AimOutlined style={{ fontSize: 14, color: '#a8a29e' }} />}
                    text="Equal accuracy in both modes"
                  />
                )}

                {ai.avg_time < std.avg_time ? (
                  <InsightRow
                    icon={<ClockCircleOutlined style={{ fontSize: 14, color: '#57534e' }} />}
                    text={`AI mode helped you answer ${Math.round(std.avg_time - ai.avg_time)}s faster on average`}
                    positive
                  />
                ) : ai.avg_time > std.avg_time ? (
                  <InsightRow
                    icon={<ClockCircleOutlined style={{ fontSize: 14, color: '#a8a29e' }} />}
                    text={`Standard mode was ${Math.round(ai.avg_time - std.avg_time)}s faster on average`}
                  />
                ) : null}

                <InsightRow
                  icon={<ThunderboltOutlined style={{ fontSize: 14, color: '#57534e' }} />}
                  text="Standard mode earns 1.5x XP bonus per correct answer"
                  positive
                />

                <InsightRow
                  icon={<AimOutlined style={{ fontSize: 14, color: '#57534e' }} />}
                  text={`Total quizzes taken: ${ai.total_attempts + std.total_attempts} (AI: ${ai.total_attempts}, Std: ${std.total_attempts})`}
                />

                {ai.hint_usage > 0 && (
                  <InsightRow
                    icon={<Sparkles style={{ width: 14, height: 14, color: '#a8a29e' }} />}
                    text={`You used AI hints ${ai.hint_usage} time${ai.hint_usage > 1 ? 's' : ''}`}
                  />
                )}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}

function InsightRow({ icon, text, positive }: { icon: ReactNode; text: string; positive?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: 14,
        borderRadius: 8,
        background: '#fafaf9',
      }}
    >
      <div style={{ marginTop: 2 }}>{icon}</div>
      <span style={{ fontSize: 14, color: positive ? '#57534e' : '#a8a29e' }}>{text}</span>
    </div>
  );
}
