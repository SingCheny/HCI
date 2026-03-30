import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Shield, Heart, Crown, Flame,
} from 'lucide-react';
import {
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RightOutlined,
  ReadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Card,
  Button,
  Progress,
  Alert,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Spin,
} from 'antd';
import api from '../services/api';
import { useI18n } from '../i18n';

const { Title, Text } = Typography;

interface WrongAnswer {
  attempt_id: number;
  quiz_id: number;
  question: string;
  options: string[];
  selected_answer: number;
  correct_answer: number;
  explanation: string;
  lesson_id: number;
  lesson_title: string;
  ai_assisted: boolean;
  created_at: string | null;
}

type Phase = 'lobby' | 'battle' | 'result' | 'victory';

export default function WrongAnswersPage() {
  const [allItems, setAllItems] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('lobby');
  const [queue, setQueue] = useState<WrongAnswer[]>([]);
  const [current, setCurrent] = useState(0);
  const [hp, setHp] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [defeated, setDefeated] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useI18n();

  const TIME_LIMIT = 10;

  const fetchItems = useCallback(() => {
    api.get('/wrong-answers').then((r) => {
      setAllItems(r.data);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const startChallenge = () => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrent(0);
    setHp(3);
    setStreak(0);
    setBestStreak(0);
    setTotalXP(0);
    setSelected(null);
    setAnswered(false);
    setDefeated([]);
    setCountdown(TIME_LIMIT);
    setPhase('battle');
  };

  useEffect(() => {
    if (phase === 'battle' && !answered) {
      setCountdown(TIME_LIMIT);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    }
    if (answered && countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, [phase, current, answered]);

  useEffect(() => {
    if (phase === 'battle' && !answered && countdown === 0) {
      handleTimeout();
    }
  }, [countdown]);

  const handleTimeout = () => {
    if (answered) return;
    setAnswered(true);
    setIsCorrect(false);
    setStreak(0);
    setHp((prev) => prev - 1);
    const item = queue[current];
    const wrongAnswer = (item.correct_answer + 1) % item.options.length;
    api
      .post(`/wrong-answers/${item.quiz_id}/retry`, {
        quiz_id: item.quiz_id,
        selected_answer: wrongAnswer,
        time_spent_seconds: TIME_LIMIT,
        used_hint: false,
      })
      .catch(() => {});
  };

  const handleSelect = async (optIdx: number) => {
    if (answered) return;
    setSelected(optIdx);
    setAnswered(true);
    const item = queue[current];
    const correct = optIdx === item.correct_answer;
    setIsCorrect(correct);

    try {
      const res = await api.post(`/wrong-answers/${item.quiz_id}/retry`, {
        quiz_id: item.quiz_id,
        selected_answer: optIdx,
        time_spent_seconds: 0,
        used_hint: false,
      });
      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        setTotalXP((prev) => prev + (res.data.xp_earned || 5));
        setDefeated((prev) => [...prev, item.quiz_id]);
      } else {
        setStreak(0);
        setHp((prev) => prev - 1);
      }
    } catch {
      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        setTotalXP((prev) => prev + 5);
        setDefeated((prev) => [...prev, item.quiz_id]);
      } else {
        setStreak(0);
        setHp((prev) => prev - 1);
      }
    }
  };

  const goNext = () => {
    if (hp <= 0 && !isCorrect) {
      setPhase('result');
      return;
    }
    const next = current + 1;
    if (next >= queue.length) {
      setPhase('victory');
      fetchItems();
      return;
    }
    setCurrent(next);
    setSelected(null);
    setAnswered(false);
    setShowExplanation(false);
    setCountdown(TIME_LIMIT);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  // --------------- LOBBY ---------------
  if (phase === 'lobby') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 20px', borderRadius: 12,
            background: '#B88A72', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Swords style={{ width: 28, height: 28, color: 'white' }} />
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>{t('wrongChallengeTitle')}</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>{t('wrongChallengeDesc')}</Text>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card style={{ borderRadius: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, display: 'block' }} type="secondary">
              {t('wrongRules')}
            </Text>
            <Row gutter={[12, 12]}>
              {[
                { iconNode: <Heart style={{ width: 16, height: 16, color: '#A08F84' }} />, label: t('wrongRuleHP'), desc: t('wrongRuleHPDesc') },
                { iconNode: <Flame style={{ width: 16, height: 16, color: '#A08F84' }} />, label: t('wrongRuleStreak'), desc: t('wrongRuleStreakDesc') },
                { iconNode: <ThunderboltOutlined style={{ fontSize: 16, color: '#A08F84' }} />, label: t('wrongRuleXP'), desc: t('wrongRuleXPDesc') },
                { iconNode: <ClockCircleOutlined style={{ fontSize: 16, color: '#A08F84' }} />, label: t('wrongRuleTime'), desc: t('wrongRuleTimeDesc') },
              ].map(({ iconNode, label, desc }) => (
                <Col key={label} xs={12} sm={6}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12,
                    borderRadius: 8, background: '#F8F4EF',
                  }}>
                    <span style={{ flexShrink: 0, marginTop: 2, lineHeight: 1 }}>{iconNode}</span>
                    <div>
                      <Text strong style={{ fontSize: 14 }}>{label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{desc}</Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card style={{ borderRadius: 16, textAlign: 'center' }}>
            <Statistic
              value={allItems.length}
              valueStyle={{ fontSize: 30, fontWeight: 600, color: '#4C4038' }}
            />
            <Text type="secondary" style={{ fontSize: 14 }}>{t('wrongBossCount')}</Text>
          </Card>
        </motion.div>

        {allItems.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<Swords style={{ width: 20, height: 20 }} />}
              onClick={startChallenge}
              style={{ background: '#B88A72', color: '#fff', border: 'none', borderRadius: 12, height: 52, paddingInline: 40, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {t('wrongStartChallenge')}
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <Crown style={{ width: 40, height: 40, color: '#E2D4C7', margin: '0 auto 12px', display: 'block' }} />
            <Text type="secondary" style={{ fontWeight: 500, fontSize: 14 }}>{t('wrongEmpty')}</Text>
          </motion.div>
        )}
      </div>
    );
  }

  // --------------- BATTLE ---------------
  if (phase === 'battle') {
    const item = queue[current];
    const progressPct = ((current + 1) / queue.length) * 100;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* HUD */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <Card style={{ borderRadius: 16 }} styles={{ body: { padding: '16px 20px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Space size="middle">
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      style={{
                        width: 16,
                        height: 16,
                        color: i < hp ? '#f87171' : '#E2D4C7',
                        fill: i < hp ? '#f87171' : 'none',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
                {streak > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Tag style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6, margin: 0 }}>
                      <Flame style={{ width: 12, height: 12, color: '#7A6A60' }} />
                      <span style={{ fontWeight: 600 }}>x{streak}</span>
                    </Tag>
                  </motion.div>
                )}
              </Space>
              <Space size="middle">
                <Tag
                  color={countdown <= 3 ? 'error' : 'default'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6, margin: 0,
                    fontWeight: 600, fontSize: 12,
                    animation: countdown <= 3 ? 'pulse 1s infinite' : 'none',
                  }}
                >
                  <ClockCircleOutlined /> {countdown}s
                </Tag>
                <Space size={4} style={{ color: '#7A6A60' }}>
                  <ThunderboltOutlined />
                  <Text strong style={{ fontSize: 14 }}>{totalXP}</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>{current + 1}/{queue.length}</Text>
              </Space>
            </div>
            <Progress
              percent={progressPct}
              showInfo={false}
              strokeColor="#B88A72"
              trailColor="#F1E7DC"
              size="small"
              style={{ margin: 0 }}
            />
          </Card>
        </motion.div>

        {/* Stage label */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Shield style={{ width: 14, height: 14, color: '#A08F84' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>{item.lesson_title}</Text>
          <Text type="secondary" style={{ fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: 'auto' }}>
            Stage {current + 1}
          </Text>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.quiz_id}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
          >
            <Card style={{ borderRadius: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: 500, color: '#4C4038', lineHeight: 1.7, display: 'block', marginBottom: 24 }}>
                {item.question}
              </Text>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {item.options.map((opt, oi) => {
                  const isCorrectOpt = oi === item.correct_answer;
                  const isSelected = oi === selected;

                  let borderColor = '#E2D4C7';
                  let bgColor = '#F8F4EF';
                  let textColor = '#4C4038';

                  if (answered) {
                    if (isCorrectOpt) {
                      borderColor = '#bbf7d0';
                      bgColor = '#f0fdf4';
                      textColor = '#15803d';
                    } else if (isSelected && !isCorrectOpt) {
                      borderColor = '#fecaca';
                      bgColor = '#fef2f2';
                      textColor = '#dc2626';
                    } else {
                      borderColor = '#F8F4EF';
                      bgColor = '#F8F4EF';
                      textColor = '#E2D4C7';
                    }
                  }

                  return (
                    <motion.button
                      key={oi}
                      whileHover={!answered ? { scale: 1.005 } : {}}
                      whileTap={!answered ? { scale: 0.995 } : {}}
                      disabled={answered}
                      onClick={() => handleSelect(oi)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: `1px solid ${borderColor}`,
                        background: bgColor,
                        color: textColor,
                        fontSize: 14,
                        cursor: answered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.2s',
                        outline: 'none',
                      }}
                    >
                      <span style={{
                        width: 24, height: 24, borderRadius: 6,
                        border: '1px solid currentColor',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600, flexShrink: 0,
                      }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {answered && isCorrectOpt && <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 16, flexShrink: 0 }} />}
                      {answered && isSelected && !isCorrectOpt && <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }} />}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Post-answer */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <Alert
                type={isCorrect ? 'success' : 'error'}
                showIcon
                icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                message={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <Text strong style={{ color: isCorrect ? '#15803d' : '#dc2626' }}>
                        {isCorrect ? t('wrongBattleCorrect') : (selected === null ? t('wrongTimeout') : t('wrongBattleWrong'))}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {isCorrect && streak > 1
                          ? `${t('wrongStreakBonus')} x${streak}`
                          : !isCorrect
                          ? (hp <= 0 ? t('wrongGameOver') : '-1 HP')
                          : ''}
                      </Text>
                    </div>
                    {isCorrect && (
                      <Tag icon={<ThunderboltOutlined />} color="default" style={{ fontWeight: 600, margin: 0 }}>
                        +5 XP
                      </Tag>
                    )}
                  </div>
                }
                style={{ borderRadius: 12 }}
              />

              {item.explanation && (
                <>
                  {!showExplanation ? (
                    <Button
                      type="text"
                      size="small"
                      icon={<ReadOutlined style={{ fontSize: 12 }} />}
                      onClick={() => setShowExplanation(true)}
                      style={{ padding: 0, fontSize: 12, color: '#A08F84', height: 'auto' }}
                    >
                      {t('wrongShowExplanation')}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Card size="small" style={{ borderRadius: 8, background: '#F8F4EF', border: '1px solid #F1E7DC' }}>
                        <Text style={{ fontSize: 12, lineHeight: 1.7, color: '#4C4038' }}>
                          <Text strong style={{ color: '#4C4038' }}>{t('wrongExplanation')}:</Text>{' '}
                          {item.explanation}
                        </Text>
                      </Card>
                    </motion.div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={goNext}
                  style={{ background: '#B88A72', color: '#fff', border: 'none', borderRadius: 12, height: 48, paddingInline: 32, fontWeight: 500 }}
                >
                  {hp <= 0 && !isCorrect
                    ? t('wrongSeeResults')
                    : current + 1 >= queue.length && isCorrect
                    ? t('wrongFinish')
                    : t('wrongNextStage')}
                  <RightOutlined style={{ marginLeft: 8 }} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --------------- RESULT / VICTORY ---------------
  const isVictory = phase === 'victory';

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{
          width: 80, height: 80, margin: '0 auto 24px', borderRadius: 16,
          background: isVictory ? '#B88A72' : '#E2D4C7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isVictory
            ? <Crown style={{ width: 40, height: 40, color: 'white' }} />
            : <Shield style={{ width: 40, height: 40, color: '#A08F84' }} />
          }
        </div>
        <Title level={3} style={{ marginBottom: 4 }}>
          {isVictory ? t('wrongVictoryTitle') : t('wrongDefeatTitle')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {isVictory ? t('wrongVictoryDesc') : t('wrongDefeatDesc')}
        </Text>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card style={{ borderRadius: 16 }}>
          <Row gutter={[20, 20]} style={{ textAlign: 'center' }}>
            <Col span={8}>
              <Swords style={{ width: 16, height: 16, color: '#A08F84', margin: '0 auto 4px', display: 'block' }} />
              <Statistic
                value={defeated.length}
                valueStyle={{ fontSize: 20, fontWeight: 600, color: '#4C4038' }}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>{t('wrongDefeated')}</Text>
            </Col>
            <Col span={8}>
              <Flame style={{ width: 16, height: 16, color: '#A08F84', margin: '0 auto 4px', display: 'block' }} />
              <Statistic
                value={bestStreak}
                valueStyle={{ fontSize: 20, fontWeight: 600, color: '#4C4038' }}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>{t('wrongBestStreak')}</Text>
            </Col>
            <Col span={8}>
              <ThunderboltOutlined style={{ fontSize: 16, color: '#A08F84', display: 'block', margin: '0 auto 4px' }} />
              <Statistic
                value={totalXP}
                valueStyle={{ fontSize: 20, fontWeight: 600, color: '#4C4038' }}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>XP</Text>
            </Col>
          </Row>

          <div style={{ marginTop: 20, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {queue.map((q, i) => {
              const isDone = defeated.includes(q.quiz_id);
              const isFailed = i <= current && !isDone;
              return (
                <div
                  key={q.quiz_id}
                  title={`Stage ${i + 1}`}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    background: isDone ? '#4ade80' : isFailed ? '#fca5a5' : '#F1E7DC',
                  }}
                />
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 12 }}
      >
        <Button
          size="large"
          icon={<ReloadOutlined />}
          onClick={() => { fetchItems(); setPhase('lobby'); }}
          style={{ background: '#F1E7DC', color: '#4C4038', border: 'none', borderRadius: 12, height: 48, paddingInline: 24, fontWeight: 500 }}
        >
          {t('wrongBackToLobby')}
        </Button>
        {!isVictory && allItems.length > 0 && (
          <Button
            type="primary"
            size="large"
            icon={<Swords style={{ width: 14, height: 14 }} />}
            onClick={startChallenge}
            style={{ background: '#B88A72', color: '#fff', border: 'none', borderRadius: 12, height: 48, paddingInline: 24, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {t('wrongRetryChallenge')}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
