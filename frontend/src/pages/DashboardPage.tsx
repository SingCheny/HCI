import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ThunderboltOutlined,
  FireOutlined,
  ReadOutlined,
  AimOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  RiseOutlined,
  StarOutlined,
  BarChartOutlined,
  RightOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { Card, Row, Col, Progress, Button, Typography, Space, Tag, Spin } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import api from '../services/api';
import type { UserStats, Course } from '../types';

const { Title, Text } = Typography;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  const xpPercent = stats ? Math.min((stats.xp_progress / Math.max(stats.xp_needed, 1)) * 100, 100) : 0;

  const statCards = [
    { icon: <ThunderboltOutlined style={{ fontSize: 16, color: '#a8a29e' }} />, label: t('dashTotalXP'), value: stats?.total_xp || 0 },
    { icon: <FireOutlined style={{ fontSize: 16, color: '#a8a29e' }} />, label: t('dashDayStreak'), value: `${stats?.streak_days || 0} ${t('dashDays')}` },
    { icon: <ReadOutlined style={{ fontSize: 16, color: '#a8a29e' }} />, label: t('dashLessonsDone'), value: `${stats?.lessons_completed || 0}/${stats?.total_lessons || 0}` },
    { icon: <AimOutlined style={{ fontSize: 16, color: '#a8a29e' }} />, label: t('dashQuizAccuracy'), value: `${stats?.accuracy || 0}%` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.025em' }}>
              {t('dashWelcomeBack')} {user?.display_name || t('dashLearner')}
            </Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block' }}>
              {t('dashSubtitle')}
            </Text>
          </div>
          <Link to="/courses">
            <Button
              type="primary"
              style={{ background: '#1c1917', borderColor: '#1c1917', borderRadius: 8, height: 40, fontWeight: 500 }}
            >
              {t('dashContinueLearning')} <RightOutlined style={{ fontSize: 12 }} />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <Row gutter={[20, 20]}>
        {statCards.map((stat, i) => (
          <Col xs={12} lg={6} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                hoverable
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  {stat.icon}
                  <RiseOutlined style={{ fontSize: 14, color: '#d6d3d1' }} />
                </div>
                <Text style={{ fontSize: 30, fontWeight: 600, color: '#1c1917', letterSpacing: '-0.025em', display: 'block' }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 12, color: '#a8a29e', marginTop: 8, display: 'block' }}>{stat.label}</Text>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Level Progress + Quick Stats */}
      <Row gutter={[24, 24]}>
        {/* Level Progress */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card style={{ borderRadius: 16 }} styles={{ body: { padding: 32 } }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <Space size={8}>
                  <StarOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                  <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashLevelProgress')}</Text>
                </Space>
                <Tag color="default" style={{ borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                  {t('dashLevel')} {stats?.level || 1}
                </Tag>
              </div>

              <Progress
                percent={Math.round(xpPercent)}
                strokeColor="#292524"
                trailColor="#f5f5f4"
                showInfo={false}
                size={['100%', 8]}
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: '#a8a29e' }}>{stats?.xp_progress || 0} XP</Text>
                <Text style={{ fontSize: 11, color: '#a8a29e' }}>
                  {stats?.xp_needed || 100} XP {t('dashXPNeeded')} {(stats?.level || 1) + 1}
                </Text>
              </div>

              {/* Course Progress */}
              <div style={{ marginTop: 32 }}>
                <Text style={{ fontSize: 12, fontWeight: 500, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('dashCourseProgress')}
                </Text>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {courses.slice(0, 4).map((course) => {
                    const done = course.lessons.filter((l) => l.completed).length;
                    const total = course.lessons.length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: '#fafaf9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ReadOutlined style={{ fontSize: 14, color: '#a8a29e' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                            <Text ellipsis style={{ fontSize: 14, color: '#57534e' }}>{course.title}</Text>
                            <Text style={{ fontSize: 11, color: '#a8a29e', flexShrink: 0 }}>{done}/{total}</Text>
                          </div>
                          <Progress
                            percent={pct}
                            strokeColor="#292524"
                            trailColor="#f5f5f4"
                            showInfo={false}
                            size={['100%', 4]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ height: '100%' }}
          >
            <Card
              style={{ borderRadius: 16, height: '100%' }}
              styles={{ body: { padding: 32, display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <Space size={8} style={{ marginBottom: 20 }}>
                <TrophyOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashQuickStats')}</Text>
              </Space>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {[
                  { icon: <CheckCircleOutlined style={{ fontSize: 14, color: '#a8a29e' }} />, label: t('dashQuizzesCorrect'), value: stats?.quizzes_correct || 0 },
                  { icon: <ClockCircleOutlined style={{ fontSize: 14, color: '#a8a29e' }} />, label: t('dashQuizzesAttempted'), value: stats?.quizzes_attempted || 0 },
                  { icon: <TrophyOutlined style={{ fontSize: 14, color: '#a8a29e' }} />, label: t('dashAchievements'), value: `${stats?.achievements_earned || 0}/${stats?.total_achievements || 0}` },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: '#fafaf9',
                    }}
                  >
                    <Space size={10}>
                      {item.icon}
                      <Text style={{ fontSize: 14, color: '#78716c' }}>{item.label}</Text>
                    </Space>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>{item.value}</Text>
                  </div>
                ))}
              </div>

              <Link to="/achievements" style={{ marginTop: 20 }}>
                <Button
                  block
                  icon={<TrophyOutlined />}
                  style={{ borderRadius: 8, background: '#fafaf9', borderColor: '#e7e5e4', color: '#78716c', height: 40 }}
                >
                  {t('dashViewAllAchievements')}
                </Button>
              </Link>

              {/* AI Mode Status */}
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 8,
                  background: '#fafaf9',
                  border: '1px solid #f5f5f4',
                }}
              >
                <Space size={8}>
                  <BarChartOutlined style={{ fontSize: 14, color: '#a8a29e' }} />
                  <Text style={{ fontSize: 12, color: '#78716c' }}>
                    {t('dashAIMode')}: <Text strong style={{ fontSize: 12, color: '#44403c' }}>{stats?.ai_mode_enabled ? 'ON' : 'OFF'}</Text>
                  </Text>
                </Space>
                <div style={{ marginTop: 6 }}>
                  <Link to="/comparison" style={{ fontSize: 12, color: '#a8a29e' }}>
                    {t('dashViewComparison')}
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Feature Widgets */}
      {widgets && (
        <Row gutter={[20, 20]}>
          {/* Flashcard Widget */}
          <Col xs={24} sm={12} lg={6}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card
                hoverable
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: 24 } }}
              >
                <Space size={10} style={{ marginBottom: 20 }}>
                  <AppstoreOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                  <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashFlashcards')}</Text>
                </Space>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFlashTotal')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.flashcards.total}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFlashDue')}</Text>
                    <Text strong style={{ fontSize: 14, color: widgets.flashcards.due > 0 ? '#292524' : '#a8a29e' }}>
                      {widgets.flashcards.due}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFlashMastered')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.flashcards.mastered}</Text>
                  </div>
                  {widgets.flashcards.total > 0 && (
                    <Progress
                      percent={Math.round(widgets.flashcards.mastered / Math.max(widgets.flashcards.total, 1) * 100)}
                      strokeColor="#292524"
                      trailColor="#f5f5f4"
                      showInfo={false}
                      size={['100%', 4]}
                    />
                  )}
                </div>

                <Link to="/flashcards" style={{ display: 'block', marginTop: 20 }}>
                  <Button
                    block
                    icon={<AppstoreOutlined />}
                    size="small"
                    style={{ borderRadius: 8, background: '#fafaf9', borderColor: '#e7e5e4', color: '#78716c', height: 36, fontSize: 12 }}
                  >
                    {t('dashFlashGo')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </Col>

          {/* Wrong Answers Widget */}
          <Col xs={24} sm={12} lg={6}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card
                hoverable
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: 24 } }}
              >
                <Space size={10} style={{ marginBottom: 20 }}>
                  <ExclamationCircleOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                  <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashWrong')}</Text>
                </Space>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashWrongTotal')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.wrong_answers.total_wrong}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashWrongCorrected')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.wrong_answers.corrected}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashWrongRemaining')}</Text>
                    <Text strong style={{ fontSize: 14, color: widgets.wrong_answers.uncorrected > 0 ? '#292524' : '#a8a29e' }}>
                      {widgets.wrong_answers.uncorrected}
                    </Text>
                  </div>
                  {widgets.wrong_answers.total_wrong > 0 && (
                    <Progress
                      percent={Math.round(widgets.wrong_answers.corrected / Math.max(widgets.wrong_answers.total_wrong, 1) * 100)}
                      strokeColor="#292524"
                      trailColor="#f5f5f4"
                      showInfo={false}
                      size={['100%', 4]}
                    />
                  )}
                </div>

                <Link to="/wrong-answers" style={{ display: 'block', marginTop: 20 }}>
                  <Button
                    block
                    icon={<ExclamationCircleOutlined />}
                    size="small"
                    style={{ borderRadius: 8, background: '#fafaf9', borderColor: '#e7e5e4', color: '#78716c', height: 36, fontSize: 12 }}
                  >
                    {t('dashWrongGo')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </Col>

          {/* Study Plan Widget */}
          <Col xs={24} sm={12} lg={6}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card
                hoverable
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: 24 } }}
              >
                <Space size={10} style={{ marginBottom: 20 }}>
                  <CalendarOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                  <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashPlan')}</Text>
                </Space>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashPlanCompleted')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>
                      {widgets.study_plans.completed_plans}/{widgets.study_plans.total_plans}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashPlanTasks')}</Text>
                    <Text strong style={{ fontSize: 14, color: '#292524' }}>
                      {widgets.study_plans.done_items}/{widgets.study_plans.total_items}
                    </Text>
                  </div>
                  {widgets.study_plans.active_plans.map((p: any) => (
                    <div key={p.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text ellipsis style={{ fontSize: 12, color: '#a8a29e', marginRight: 8 }}>{p.title}</Text>
                        <Text style={{ fontSize: 12, color: '#a8a29e', flexShrink: 0 }}>{p.done}/{p.total}</Text>
                      </div>
                      <Progress
                        percent={p.progress}
                        strokeColor="#292524"
                        trailColor="#f5f5f4"
                        showInfo={false}
                        size={['100%', 4]}
                      />
                    </div>
                  ))}
                </div>

                <Link to="/study-plan" style={{ display: 'block', marginTop: 20 }}>
                  <Button
                    block
                    icon={<CalendarOutlined />}
                    size="small"
                    style={{ borderRadius: 8, background: '#fafaf9', borderColor: '#e7e5e4', color: '#78716c', height: 36, fontSize: 12 }}
                  >
                    {t('dashPlanGo')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </Col>

          {/* Focus Analytics Widget */}
          {widgets.focus && (
            <Col xs={24} sm={12} lg={6}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <Card
                  hoverable
                  style={{ borderRadius: 16 }}
                  styles={{ body: { padding: 24 } }}
                >
                  <Space size={10} style={{ marginBottom: 20 }}>
                    <FieldTimeOutlined style={{ fontSize: 16, color: '#a8a29e' }} />
                    <Text strong style={{ fontSize: 14, color: '#44403c' }}>{t('dashFocus')}</Text>
                  </Space>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFocusToday')}</Text>
                      <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.focus.today_minutes} min</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFocusTotal')}</Text>
                      <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.focus.total_minutes} min</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFocusSessions')}</Text>
                      <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.focus.total_sessions}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#a8a29e' }}>{t('dashFocusAvg')}</Text>
                      <Text strong style={{ fontSize: 14, color: '#292524' }}>{widgets.focus.avg_duration} min</Text>
                    </div>

                    {/* Weekly bar chart */}
                    {widgets.focus.weekly && (
                      <div style={{ paddingTop: 12 }}>
                        <Text style={{ fontSize: 10, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('dashFocusWeek')}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56, marginTop: 8 }}>
                          {widgets.focus.weekly.map((d: any, i: number) => {
                            const maxMins = Math.max(...widgets.focus.weekly.map((w: any) => w.minutes), 1);
                            const barH = Math.max(Math.round((d.minutes / maxMins) * 40), 2);
                            return (
                              <div
                                key={i}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  gap: 4,
                                  height: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    width: '100%',
                                    borderRadius: 2,
                                    background: '#d6d3d1',
                                    height: barH,
                                    transition: 'all 0.3s',
                                  }}
                                  title={`${d.minutes} min`}
                                />
                                <span style={{ fontSize: 9, color: '#a8a29e' }}>{d.weekday}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link to="/focus" style={{ display: 'block', marginTop: 20 }}>
                    <Button
                      block
                      icon={<FieldTimeOutlined />}
                      size="small"
                      style={{ borderRadius: 8, background: '#fafaf9', borderColor: '#e7e5e4', color: '#78716c', height: 36, fontSize: 12 }}
                    >
                      {t('dashFocusGo')}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
}
