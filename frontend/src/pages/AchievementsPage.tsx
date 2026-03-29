import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyOutlined,
  LockOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  ReadOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  AimOutlined,
  FireOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Card, Progress, Tag, Typography, Row, Col, Avatar, Space, Spin, Badge } from 'antd';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Achievement } from '../types';

const { Title, Text } = Typography;

const iconMap: Record<string, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'footprints': StarOutlined,
  'book-open': ReadOutlined,
  'graduation-cap': CrownOutlined,
  'crown': CrownOutlined,
  'check-circle': CheckCircleOutlined,
  'target': AimOutlined,
  'star': StarOutlined,
  'flame': FireOutlined,
  'zap': ThunderboltOutlined,
  'trophy': TrophyOutlined,
  'sparkles': StarOutlined,
  'brain': ExperimentOutlined,
  'shield': SafetyOutlined,
  'clock': ClockCircleOutlined,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  const progressPercent = (earned.length / Math.max(achievements.length, 1)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Space align="center" size={8}>
          <TrophyOutlined style={{ fontSize: 20, color: '#a8a29e' }} />
          <Title level={3} style={{ margin: 0 }}>{t('achievementsTitle')}</Title>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 14 }}>
          {t('achievementsUnlocked')} {earned.length} {t('achievementsOf')} {achievements.length} {t('achievementsAchievements')}
        </Text>
        <Progress
          percent={Math.round(progressPercent)}
          strokeColor="#292524"
          trailColor="#f5f5f4"
          style={{ maxWidth: 384, marginTop: 12 }}
          format={(p) => `${p}%`}
        />
      </motion.div>

      {/* Earned */}
      {earned.length > 0 && (
        <section>
          <Space align="center" size={8} style={{ marginBottom: 20 }}>
            <StarOutlined style={{ fontSize: 14, color: '#a8a29e' }} />
            <Text strong style={{ fontSize: 12, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('achievementsEarned')}
            </Text>
          </Space>
          <Row gutter={[20, 20]}>
            {earned.map((a, i) => {
              const IconComponent = iconMap[a.icon] || TrophyOutlined;
              return (
                <Col xs={24} sm={12} lg={8} key={a.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card
                      hoverable
                      style={{ borderRadius: 16 }}
                      styles={{ body: { padding: 24 } }}
                    >
                      <Space align="start" size={16}>
                        <Avatar
                          size={44}
                          icon={<IconComponent />}
                          style={{
                            backgroundColor: '#292524',
                            color: '#fff',
                            borderRadius: 8,
                            flexShrink: 0,
                          }}
                          shape="square"
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text strong style={{ fontSize: 14, display: 'block' }} ellipsis>
                            {a.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
                            {a.description}
                          </Text>
                          <Space size={12} style={{ marginTop: 8 }}>
                            <Tag
                              icon={<ThunderboltOutlined />}
                              color="default"
                              style={{ fontSize: 11, margin: 0 }}
                            >
                              {a.xp_reward} XP
                            </Tag>
                            {a.earned_at && (
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {new Date(a.earned_at).toLocaleDateString()}
                              </Text>
                            )}
                          </Space>
                        </div>
                      </Space>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <Space align="center" size={8} style={{ marginBottom: 20 }}>
            <LockOutlined style={{ fontSize: 14, color: '#a8a29e' }} />
            <Text style={{ fontSize: 12, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('achievementsLocked')}
            </Text>
          </Space>
          <Row gutter={[20, 20]}>
            {locked.map((a, i) => (
              <Col xs={24} sm={12} lg={8} key={a.id}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Badge.Ribbon text={<LockOutlined />} color="default">
                    <Card
                      style={{ borderRadius: 16, opacity: 0.45 }}
                      styles={{ body: { padding: 24 } }}
                    >
                      <Space align="start" size={16}>
                        <Avatar
                          size={44}
                          icon={<LockOutlined />}
                          style={{
                            backgroundColor: '#f5f5f4',
                            color: '#a8a29e',
                            borderRadius: 8,
                            flexShrink: 0,
                          }}
                          shape="square"
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text style={{ fontSize: 14, display: 'block', color: '#78716c' }} ellipsis>
                            {a.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
                            {a.description}
                          </Text>
                          <Tag
                            icon={<ThunderboltOutlined />}
                            color="default"
                            style={{ fontSize: 11, marginTop: 8 }}
                          >
                            {a.xp_reward} XP
                          </Tag>
                        </div>
                      </Space>
                    </Card>
                  </Badge.Ribbon>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </div>
  );
}
