import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Progress,
  Statistic,
  Button,
  Radio,
  Typography,
  Space,
  Row,
  Col,
  List,
  Tag,
} from 'antd';
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  UndoOutlined,
  ThunderboltOutlined,
  FireOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { FocusSession } from '../types';

const { Title, Text } = Typography;

const PRESETS = [15, 25, 45, 60];

export default function FocusTimerPage() {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [stats, setStats] = useState<any>({
    total_minutes: 0,
    total_sessions: 0,
    total_xp: 0,
    today_minutes: 0,
    weekly_data: [],
    avg_duration: 0,
    focus_streak: 0,
    distribution: {},
    week_minutes: 0,
  });
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useI18n();

  const fetchData = useCallback(() => {
    api.get('/focus-sessions').then((r) => setSessions(r.data));
    api.get('/focus-sessions/stats').then((r) => setStats(r.data));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
  const progress = sessionId ? ((1 - secondsLeft / (duration * 60)) * 100) : 0;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Title level={3} style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockCircleOutlined style={{ fontSize: 20, color: '#A08F84' }} /> {t('focusTitle')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>{t('focusSubtitle')}</Text>
      </motion.div>

      {/* XP notification */}
      {justEarned !== null && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ textAlign: 'center' }}
        >
          <Tag icon={<ThunderboltOutlined />} color="default" style={{ fontSize: 14, padding: '4px 12px' }}>
            +{justEarned} XP
          </Tag>
        </motion.div>
      )}

      {/* Timer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Progress
            type="circle"
            percent={progress}
            size={260}
            strokeColor="#B88A72"
            trailColor="rgba(76,64,56,0.06)"
            strokeWidth={3}
            format={() => (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                  fontSize: 36,
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  fontWeight: 600,
                  color: '#4C4038',
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {timeDisplay}
                </span>
                <span style={{ fontSize: 11, color: '#A08F84', marginTop: 4 }}>
                  {duration} {t('focusMin')}
                </span>
              </div>
            )}
          />
        </motion.div>

        {/* Duration presets */}
        <div style={{ marginTop: 28 }}>
          <Radio.Group
            value={duration}
            onChange={(e) => selectDuration(e.target.value)}
            disabled={running}
            optionType="button"
            buttonStyle="solid"
          >
            {PRESETS.map((m) => (
              <Radio.Button key={m} value={m}>
                {m} {t('focusMin')}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* Controls */}
        <Space size="middle" style={{ marginTop: 24 }}>
          {!sessionId ? (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={startTimer}
              style={{ borderRadius: 12, height: 48, paddingInline: 32, fontWeight: 500 }}
            >
              {t('focusStart')}
            </Button>
          ) : (
            <>
              <Button
                size="large"
                icon={running ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={togglePause}
                style={{ borderRadius: 12, height: 48, paddingInline: 24, fontWeight: 500 }}
              >
                {running ? t('focusPause') : t('focusResume')}
              </Button>
              <Button
                size="large"
                icon={<UndoOutlined />}
                onClick={resetTimer}
                style={{ borderRadius: 12, height: 48, paddingInline: 24 }}
              >
                {t('focusReset')}
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Row gutter={[24, 24]}>
          {[
            { title: t('focusToday'), value: stats.today_minutes, suffix: 'm', icon: <ClockCircleOutlined /> },
            { title: t('focusTotalMin'), value: stats.total_minutes, suffix: 'm', icon: <ClockCircleOutlined /> },
            { title: t('focusSessions'), value: stats.total_sessions, icon: <ThunderboltOutlined /> },
            { title: t('focusStreak'), value: stats.focus_streak, suffix: 'd', icon: <FireOutlined /> },
          ].map((s, i) => (
            <Col key={i} xs={12} lg={6}>
              <Card bordered={false} className="glass" style={{ borderRadius: 16, textAlign: 'center', padding: '8px 0' }}>
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: 11 }}>{s.title}</Text>}
                  value={s.value}
                  suffix={s.suffix}
                  prefix={s.icon}
                  valueStyle={{ fontSize: 24, fontWeight: 600, color: '#4C4038' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Weekly Chart */}
      {stats.weekly_data && stats.weekly_data.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card
            bordered={false}
            className="glass"
            style={{ borderRadius: 16 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }} type="secondary">
                  <BarChartOutlined style={{ marginRight: 8 }} />
                  {t('focusWeeklyChart')}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{stats.week_minutes} min {t('focusThisWeek')}</Text>
              </div>
            }
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
              {stats.weekly_data.map((d: any, i: number) => {
                const maxMins = Math.max(...stats.weekly_data.map((w: any) => w.minutes), 1);
                const barH = Math.max(Math.round((d.minutes / maxMins) * 88), 3);
                const isToday = i === stats.weekly_data.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
                    <span style={{ fontSize: 10, color: '#A08F84' }}>{d.minutes > 0 ? `${d.minutes}m` : ''}</span>
                    <div style={{ width: '100%', maxWidth: 48, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 0, borderRadius: 3, background: '#F8F4EF' }}>
                      <div
                        style={{
                          width: '100%',
                          borderRadius: 3,
                          background: isToday ? '#B88A72' : '#E2D4C7',
                          height: barH,
                          transition: 'all 0.3s',
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: 10,
                      color: isToday ? '#4C4038' : '#A08F84',
                      fontWeight: isToday ? 600 : 400,
                    }}>
                      {d.weekday}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Distribution + Avg */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Row gutter={[28, 28]}>
          {stats.distribution && (
            <Col xs={24} lg={12}>
              <Card
                bordered={false}
                className="glass"
                style={{ borderRadius: 16 }}
                title={
                  <Text style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }} type="secondary">
                    {t('focusDistribution')}
                  </Text>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { k: '15', label: '15 min' },
                    { k: '25', label: '25 min' },
                    { k: '45', label: '45 min' },
                    { k: '60', label: '60 min' },
                  ].map(({ k, label }) => {
                    const count = stats.distribution[k] || 0;
                    const maxCount = Math.max(...Object.values(stats.distribution).map((v: any) => v as number), 1);
                    const pct = (count / maxCount) * 100;
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Text type="secondary" style={{ fontSize: 12, width: 48, flexShrink: 0 }}>{label}</Text>
                        <div style={{ flex: 1 }}>
                          <Progress
                            percent={Math.max(pct, 2)}
                            showInfo={false}
                            strokeColor="#A08F84"
                            trailColor="#F8F4EF"
                            size="small"
                          />
                        </div>
                        <Text strong style={{ fontSize: 12, width: 20, textAlign: 'right', color: '#7A6A60' }}>{count}</Text>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          )}

          <Col xs={24} lg={12}>
            <Card bordered={false} className="glass" style={{ borderRadius: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t('focusAvgDuration')}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Statistic
                        value={stats.avg_duration}
                        suffix="min"
                        valueStyle={{ fontSize: 30, fontWeight: 600, color: '#4C4038' }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t('focusTotalXP')}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Statistic
                        value={stats.total_xp}
                        prefix={<ThunderboltOutlined style={{ color: '#A08F84' }} />}
                        valueStyle={{ fontSize: 24, fontWeight: 600, color: '#4C4038' }}
                      />
                    </div>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Card
            bordered={false}
            className="glass"
            style={{ borderRadius: 16 }}
            title={
              <Text style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }} type="secondary">
                {t('focusHistory')}
              </Text>
            }
          >
            <List
              dataSource={sessions.slice(0, 20)}
              style={{ maxHeight: 240, overflow: 'auto' }}
              renderItem={(s) => (
                <List.Item
                  style={{ padding: '10px 12px', background: '#F8F4EF', borderRadius: 8, marginBottom: 6 }}
                  extra={
                    <Space size="middle">
                      {s.xp_earned > 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>+{s.xp_earned} XP</Text>
                      )}
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {s.started_at ? new Date(s.started_at).toLocaleDateString() : ''}
                      </Text>
                    </Space>
                  }
                >
                  <Space>
                    <ClockCircleOutlined style={{ color: '#A08F84', fontSize: 14 }} />
                    <Text style={{ fontSize: 14 }}>{s.duration_minutes} {t('focusMin')}</Text>
                    {s.completed && <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 12 }} />}
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </motion.div>
      )}
    </div>
  );
}
