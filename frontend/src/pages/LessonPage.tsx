import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, Lightbulb, Sparkles,
  ChevronRight, Star, Zap, Award, Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { toast } from '../components/Toast';
import type { Lesson, Quiz, QuizResult } from '../types';

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
          toast({ type: 'achievement', title: `🏆 ${a.name}`, message: a.description });
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
          toast({ type: 'achievement', title: `🏆 ${a.name}`, message: a.description });
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

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link to="/courses" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{lesson.estimated_minutes} min</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{lesson.xp_reward} XP</span>
            {quizzes.length > 0 && <span>{quizzes.length} {t('lessonQuizQuestions')}</span>}
          </div>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center gap-1">
          {['reading', 'quiz', 'complete'].map((p, i) => (
            <div
              key={p}
              className={`w-8 h-1.5 rounded-full transition-all ${
                i <= ['reading', 'quiz', 'complete'].indexOf(phase)
                  ? 'bg-primary-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* AI Mode indicator */}
      {user?.ai_mode_enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-sm text-primary-300"
        >
          <Sparkles className="w-4 h-4" />
          AI Assistance is <strong>{t('lessonAIOnLabel')}</strong> — You'll receive hints during quizzes
          {phase === 'quiz' && <span className="text-xs text-gray-400 ml-2">{t('lessonAIHintBonus')}</span>}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* READING PHASE */}
        {phase === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-10"
          >
            <div className="lesson-content">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCompleteLesson}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center gap-2 hover:from-primary-600 hover:to-accent-600 transition-all glow-primary"
              >
                {quizzes.length > 0 ? t('lessonCompleteAndQuiz') : t('lessonCompleteLesson')}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && quizzes[currentQuiz] && (
          <motion.div
            key={`quiz-${currentQuiz}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Quiz progress */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{t('lessonQuestion')} {currentQuiz + 1} {t('lessonQuestionOf')} {quizzes.length}{t('lessonQuestionTotal')}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${((currentQuiz + 1) / quizzes.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < quizzes[currentQuiz].difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-white mb-8">{quizzes[currentQuiz].question}</h2>

              <div className="space-y-3.5">
                {quizzes[currentQuiz].options.map((opt: string, i: number) => {
                  let cls = 'quiz-option p-4 rounded-xl border border-white/10 cursor-pointer';
                  if (quizResult) {
                    if (i === quizResult.correct_answer) cls += ' correct';
                    else if (i === selectedAnswer && !quizResult.is_correct) cls += ' incorrect';
                    else cls += ' opacity-50';
                  } else if (i === selectedAnswer) {
                    cls += ' bg-primary-500/20 border-primary-500/40';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!quizResult ? { scale: 1.01 } : {}}
                      whileTap={!quizResult ? { scale: 0.99 } : {}}
                      onClick={() => !quizResult && setSelectedAnswer(i)}
                      className={`${cls} w-full text-left flex items-center gap-4`}
                      disabled={!!quizResult}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        quizResult && i === quizResult.correct_answer
                          ? 'bg-green-500/30 text-green-400'
                          : quizResult && i === selectedAnswer && !quizResult.is_correct
                          ? 'bg-red-500/30 text-red-400'
                          : i === selectedAnswer
                          ? 'bg-primary-500/30 text-primary-400'
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-200">{opt}</span>
                      {quizResult && i === quizResult.correct_answer && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                      {quizResult && i === selectedAnswer && !quizResult.is_correct && (
                        <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* AI Hint */}
              {user?.ai_mode_enabled && quizzes[currentQuiz].ai_hint && !quizResult && (
                <div className="mt-4">
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition"
                    >
                      <Lightbulb className="w-4 h-4" /> {t('lessonShowHint')}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20"
                    >
                      <div className="flex items-center gap-2 text-sm text-primary-300 mb-1">
                        <Sparkles className="w-4 h-4" /> {t('lessonAIHint')}
                      </div>
                      <p className="text-sm text-gray-300">{quizzes[currentQuiz].ai_hint}</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Result */}
              {quizResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl border ${
                    quizResult.is_correct
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {quizResult.is_correct ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-green-400">{t('lessonCorrect')} +{quizResult.xp_earned} XP</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="font-semibold text-red-400">{t('lessonIncorrect')}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{quizResult.explanation}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                {!quizResult ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswer === null}
                    className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold disabled:opacity-40 hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    {t('lessonSubmitAnswer')}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center gap-2 hover:from-primary-600 hover:to-accent-600 transition-all"
                  >
                    {currentQuiz < quizzes.length - 1 ? t('lessonNextQuestion') : t('lessonSeeResults')}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center glow-success"
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">{t('lessonComplete')}</h2>
            <p className="text-gray-400 mb-6">{lesson.title}</p>

            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 flex items-center gap-1 justify-center">
                  <Zap className="w-6 h-6" />
                  {totalXpEarned}
                </div>
                <p className="text-xs text-gray-400 mt-1">{t('lessonXPEarned')}</p>
              </div>
              {quizzes.length > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {correctCount}/{quizzes.length}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t('lessonQuizScore')}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <Link
                to="/courses"
                className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 hover:bg-white/15 transition"
              >
                {t('lessonBackToCourses2')}
              </Link>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:from-primary-600 hover:to-accent-600 transition-all"
              >
                {t('lessonDashboard')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
