import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircleOutlined,
  ReadOutlined,
  ClockCircleOutlined,
  StarOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Card, Progress, Tag, Typography, Space, Row, Col, Spin } from 'antd';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Course } from '../types';

const { Title, Text } = Typography;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    api.get('/courses').then((r) => {
      setCourses(r.data);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.025em' }}>
          {t('coursesTitle')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block' }}>
          {t('coursesSubtitle')}
        </Text>
      </motion.div>

      <Row gutter={[24, 24]}>
        {courses.map((course, idx) => {
          const done = course.lessons.filter((l) => l.completed).length;
          const total = course.lessons.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const allDone = done === total && total > 0;

          return (
            <Col xs={24} lg={12} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Card
                  hoverable
                  bordered={false}
                  style={{
                    borderRadius: 16,
                    border: '1px solid #F1E7DC',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 0 } }}
                >
                  {/* Top accent line */}
                  <div style={{ height: 2, background: '#E2D4C7' }} />

                  <div style={{ padding: 28 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                      <Space size={12} align="start">
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            background: '#F8F4EF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ReadOutlined style={{ fontSize: 16, color: '#A08F84' }} />
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 16, color: '#4C4038', display: 'block' }}>
                            {course.title}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#A08F84' }}>
                            {total} {t('coursesLessons')}
                          </Text>
                        </div>
                      </Space>
                      {allDone && (
                        <Tag
                          color="success"
                          icon={<CheckCircleOutlined />}
                          style={{ borderRadius: 6, fontSize: 12, fontWeight: 500, margin: 0 }}
                        >
                          {t('coursesComplete')}
                        </Tag>
                      )}
                    </div>

                    {/* Description */}
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#A08F84',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: 20,
                      }}
                    >
                      {course.description}
                    </Text>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 12, color: '#A08F84' }}>{t('coursesProgress')}</Text>
                        <Text style={{ fontSize: 12, color: '#A08F84' }}>
                          {done}/{total} {t('coursesLessons')}
                        </Text>
                      </div>
                      <Progress
                        percent={pct}
                        strokeColor="#B88A72"
                        trailColor="#F1E7DC"
                        showInfo={false}
                        size={['100%', 6]}
                      />
                    </div>

                    {/* Lessons List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {course.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${lesson.id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              borderRadius: 8,
                              background: '#F8F4EF',
                              transition: 'all 0.2s',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLDivElement).style.background = '#F1E7DC';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLDivElement).style.background = '#F8F4EF';
                            }}
                          >
                            <Space size={12}>
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  background: lesson.completed ? '#f0fdf4' : '#F1E7DC',
                                  color: lesson.completed ? '#22c55e' : '#A08F84',
                                }}
                              >
                                {lesson.completed ? (
                                  <CheckCircleOutlined style={{ fontSize: 14 }} />
                                ) : (
                                  <span style={{ fontWeight: 500 }}>{lesson.order_index + 1}</span>
                                )}
                              </div>
                              <div>
                                <Text style={{ fontSize: 14, color: '#4C4038', display: 'block' }}>
                                  {lesson.title}
                                </Text>
                                <Space size={8} style={{ marginTop: 2 }}>
                                  <Space size={4}>
                                    <ClockCircleOutlined style={{ fontSize: 10, color: '#A08F84' }} />
                                    <Text style={{ fontSize: 11, color: '#A08F84' }}>
                                      {lesson.estimated_minutes} {t('coursesMin')}
                                    </Text>
                                  </Space>
                                  <Space size={4}>
                                    <StarOutlined style={{ fontSize: 10, color: '#A08F84' }} />
                                    <Text style={{ fontSize: 11, color: '#A08F84' }}>
                                      {lesson.xp_reward} XP
                                    </Text>
                                  </Space>
                                </Space>
                              </div>
                            </Space>
                            <RightOutlined style={{ fontSize: 12, color: '#E2D4C7' }} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
