import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BulbOutlined,
  StarOutlined,
  ThunderboltOutlined,
  RightOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Sparkles } from 'lucide-react';
import { Card, Button, Alert, Result, Space, Typography, Tag, Spin, Rate, Progress, Steps } from 'antd';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { toast } from '../components/Toast';
import type { Lesson, Quiz, QuizResult } from '../types';

const { Title, Text, Paragraph } = Typography;

export default function LessonPage() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const { t } = useI18n();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'complete'>('reading');
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const quizStartTime = useRef(Date.now());

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/lessons/${id}`).then((r) => setLesson(r.data)),
      api.get(`/lessons/${id}/quizzes`).then((r) => setQuizzes(r.data)),
    ]).finally(() => setLoading(false));
  }, [id]);

  const handleCompleteLesson = async () => {
    if (!id) return;
    try {
      const res = await api.post(`/lessons/${id}/complete`);
      if (res.data.xp_earned > 0) {
        setTotalXpEarned((prev) => prev + res.data.xp_earned);
        toast({ type: 'success', title: `+${res.data.xp_earned} XP`, message: 'Lesson completed!' });
      }
      if (res.data.new_achievements?.length) {
        res.data.new_achievements.forEach((a: any) => {
          toast({ type: 'achievement', title: a.name, message: a.description });
        });
      }
      await refreshUser();
    } catch { /* ignore */ }

    if (quizzes.length > 0) {
      setPhase('quiz');
      quizStartTime.current = Date.now();
    } else {
      setPhase('complete');
    }
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswer === null || !quizzes[currentQuiz]) return;
    const timeSpent = (Date.now() - quizStartTime.current) / 1000;

    try {
      const res = await api.post('/quizzes/submit', {
        quiz_id: quizzes[currentQuiz].id,
        selected_answer: selectedAnswer,
        time_spent_seconds: timeSpent,
        used_hint: showHint,
      });
      setQuizResult(res.data);
      if (res.data.is_correct) {
        setCorrectCount((c) => c + 1);
        setTotalXpEarned((prev) => prev + res.data.xp_earned);
      }
      if (res.data.achievements_earned?.length) {
        res.data.achievements_earned.forEach((a: any) => {
          toast({ type: 'achievement', title: a.name, message: a.description });
        });
      }
      await refreshUser();
    } catch { /* ignore */ }
  };

  const handleNextQuiz = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz((c) => c + 1);
      setSelectedAnswer(null);
      setQuizResult(null);
      setShowHint(false);
      quizStartTime.current = Date.now();
    } else {
      setPhase('complete');
    }
  };

  const phaseIndex = ['reading', 'quiz', 'complete'].indexOf(phase);

  if (loading || !lesson) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <Link to="/courses">
          <Button type="text" icon={<ArrowLeftOutlined />} />
        </Link>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>{lesson.title}</Title>
          <Space size="middle" style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {lesson.estimated_minutes} min
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <StarOutlined style={{ marginRight: 4 }} />
              {lesson.xp_reward} XP
            </Text>
            {quizzes.length > 0 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {quizzes.length} {t('lessonQuizQuestions')}
              </Text>
            )}
          </Space>
        </div>
        <Steps
          size="small"
          current={phaseIndex}
          style={{ maxWidth: 320 }}
          items={[
            { title: t('lessonQuestion') || 'Reading' },
            { title: t('lessonQuizQuestions') || 'Quiz' },
            { title: t('lessonComplete') || 'Complete' },
          ]}
        />
      </motion.div>

      {/* AI Mode indicator */}
      {user?.ai_mode_enabled && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert
            type="info"
            showIcon
            icon={<Sparkles style={{ width: 16, height: 16 }} />}
            message={
              <span>
                AI Assistance is <strong>{t('lessonAIOnLabel')}</strong>
                {phase === 'quiz' && (
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    {t('lessonAIHintBonus')}
                  </Text>
                )}
              </span>
            }
            style={{ borderRadius: 8 }}
          />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* READING PHASE */}
        {phase === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            <Card
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 40 } }}
            >
              <div className="lesson-content">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>

              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCompleteLesson}
                  icon={<RightOutlined />}
                  iconPosition="end"
                >
                  {quizzes.length > 0 ? t('lessonCompleteAndQuiz') : t('lessonCompleteLesson')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && quizzes[currentQuiz] && (
          <motion.div
            key={`quiz-${currentQuiz}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Quiz progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {t('lessonQuestion')} {currentQuiz + 1} {t('lessonQuestionOf')} {quizzes.length}{t('lessonQuestionTotal')}
              </Text>
              <Progress
                percent={((currentQuiz + 1) / quizzes.length) * 100}
                showInfo={false}
                strokeColor="#B88A72"
                trailColor="#F1E7DC"
                size="small"
                style={{ flex: 1, margin: 0 }}
              />
              <Rate
                disabled
                count={3}
                value={quizzes[currentQuiz].difficulty}
                character={<StarOutlined />}
                style={{ fontSize: 12 }}
              />
            </div>

            <Card style={{ borderRadius: 16 }} styles={{ body: { padding: 28 } }}>
              <Title level={5} style={{ marginBottom: 28 }}>
                {quizzes[currentQuiz].question}
              </Title>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {quizzes[currentQuiz].options.map((opt: string, i: number) => {
                  let cls = 'quiz-option';
                  if (quizResult) {
                    if (i === quizResult.correct_answer) cls += ' correct';
                    else if (i === selectedAnswer && !quizResult.is_correct) cls += ' incorrect';
                  }

                  const isSelected = i === selectedAnswer;
                  const isCorrectAnswer = quizResult && i === quizResult.correct_answer;
                  const isWrongSelected = quizResult && i === selectedAnswer && !quizResult.is_correct;
                  const isDimmed = quizResult && !isCorrectAnswer && !isWrongSelected;

                  return (
                    <motion.button
                      key={i}
                      whileHover={!quizResult ? { scale: 1.005 } : {}}
                      whileTap={!quizResult ? { scale: 0.995 } : {}}
                      onClick={() => !quizResult && setSelectedAnswer(i)}
                      className={cls}
                      disabled={!!quizResult}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 16,
                        borderRadius: 8,
                        border: `1px solid ${
                          isCorrectAnswer ? '#bbf7d0' : isWrongSelected ? '#fecaca' : isSelected && !quizResult ? '#A08F84' : '#F1E7DC'
                        }`,
                        background: isCorrectAnswer
                          ? '#f0fdf4'
                          : isWrongSelected
                          ? '#fef2f2'
                          : isSelected && !quizResult
                          ? '#F8F4EF'
                          : '#FFFDF9',
                        cursor: quizResult ? 'default' : 'pointer',
                        opacity: isDimmed ? 0.4 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 600,
                          background: isCorrectAnswer
                            ? '#dcfce7'
                            : isWrongSelected
                            ? '#fee2e2'
                            : isSelected
                            ? '#E2D4C7'
                            : '#F8F4EF',
                          color: isCorrectAnswer
                            ? '#16a34a'
                            : isWrongSelected
                            ? '#ef4444'
                            : isSelected
                            ? '#4C4038'
                            : '#A08F84',
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span style={{ fontSize: 14, color: '#7A6A60', flex: 1 }}>{opt}</span>
                      {isCorrectAnswer && (
                        <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 16 }} />
                      )}
                      {isWrongSelected && (
                        <CloseCircleOutlined style={{ color: '#f87171', fontSize: 16 }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* AI Hint */}
              {user?.ai_mode_enabled && quizzes[currentQuiz].ai_hint && !quizResult && (
                <div style={{ marginTop: 16 }}>
                  {!showHint ? (
                    <Button
                      type="link"
                      icon={<BulbOutlined />}
                      onClick={() => setShowHint(true)}
                      style={{ padding: 0, color: '#A08F84' }}
                    >
                      {t('lessonShowHint')}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Alert
                        type="info"
                        icon={<Sparkles style={{ width: 14, height: 14 }} />}
                        showIcon
                        message={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {t('lessonAIHint')}
                          </Text>
                        }
                        description={
                          <Text style={{ fontSize: 14 }}>
                            {quizzes[currentQuiz].ai_hint}
                          </Text>
                        }
                        style={{ borderRadius: 8, background: '#F8F4EF', borderColor: '#F1E7DC' }}
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Result */}
              {quizResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: 24 }}
                >
                  <Alert
                    type={quizResult.is_correct ? 'success' : 'error'}
                    showIcon
                    icon={quizResult.is_correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    message={
                      quizResult.is_correct
                        ? `${t('lessonCorrect')} +${quizResult.xp_earned} XP`
                        : t('lessonIncorrect')
                    }
                    description={quizResult.explanation}
                    style={{ borderRadius: 8 }}
                  />
                </motion.div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                {!quizResult ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswer === null}
                  >
                    {t('lessonSubmitAnswer')}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNextQuiz}
                    icon={<RightOutlined />}
                    iconPosition="end"
                  >
                    {currentQuiz < quizzes.length - 1 ? t('lessonNextQuestion') : t('lessonSeeResults')}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Card style={{ borderRadius: 16, textAlign: 'center' }} styles={{ body: { padding: 48 } }}>
              <Result
                icon={
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        margin: '0 auto',
                        borderRadius: 12,
                        background: '#B88A72',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrophyOutlined style={{ fontSize: 32, color: '#fff' }} />
                    </div>
                  </motion.div>
                }
                title={t('lessonComplete')}
                subTitle={lesson.title}
                extra={
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Space size={48} style={{ justifyContent: 'center', width: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 600, color: '#4C4038', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                          <ThunderboltOutlined style={{ fontSize: 20, color: '#A08F84' }} />
                          {totalXpEarned}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{t('lessonXPEarned')}</Text>
                      </div>
                      {quizzes.length > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 28, fontWeight: 600, color: '#4C4038' }}>
                            {correctCount}/{quizzes.length}
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>{t('lessonQuizScore')}</Text>
                        </div>
                      )}
                    </Space>
                    <Space>
                      <Link to="/courses">
                        <Button size="large">{t('lessonBackToCourses2')}</Button>
                      </Link>
                      <Link to="/">
                        <Button type="primary" size="large">{t('lessonDashboard')}</Button>
                      </Link>
                    </Space>
                  </Space>
                }
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
