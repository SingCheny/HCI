import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Shield, Heart, Zap, Trophy, Star, ChevronRight,
  BookOpen, CheckCircle, XCircle, Flame, RotateCcw, Crown, Clock,
} from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';

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
    api.get('/wrong-answers').then((r) => { setAllItems(r.data); setLoading(false); });
  }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

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

  // Countdown timer for battle phase
  useEffect(() => {
    if (phase === 'battle' && !answered) {
      setCountdown(TIME_LIMIT);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Time's up — treat as wrong answer
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }
    if (answered && countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, [phase, current, answered]);

  // Handle timeout
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
    // Call retry API with wrong answer
    const item = queue[current];
    const wrongAnswer = (item.correct_answer + 1) % item.options.length;
    api.post(`/wrong-answers/${item.quiz_id}/retry`, {
      quiz_id: item.quiz_id,
      selected_answer: wrongAnswer,
      time_spent_seconds: TIME_LIMIT,
      used_hint: false,
    }).catch(() => {});
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
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  // ===== LOBBY =====
  if (phase === 'lobby') {
    return (
      <div className="space-y-8 lg:space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Swords className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">{t('wrongChallengeTitle')}</h1>
          <p className="text-gray-400 mt-2">{t('wrongChallengeDesc')}</p>
        </motion.div>

        {/* Rules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 lg:p-8 space-y-4">
          <h2 className="text-sm font-semibold text-white">{t('wrongRules')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
              <Heart className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{t('wrongRuleHP')}</p>
                <p className="text-xs text-gray-500">{t('wrongRuleHPDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
              <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{t('wrongRuleStreak')}</p>
                <p className="text-xs text-gray-500">{t('wrongRuleStreakDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
              <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{t('wrongRuleXP')}</p>
                <p className="text-xs text-gray-500">{t('wrongRuleXPDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
              <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{t('wrongRuleTime')}</p>
                <p className="text-xs text-gray-500">{t('wrongRuleTimeDesc')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 lg:p-8 text-center">
          <p className="text-4xl font-bold text-white mb-1">{allItems.length}</p>
          <p className="text-sm text-gray-400">{t('wrongBossCount')}</p>
        </motion.div>

        {allItems.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center">
            <button
              onClick={startChallenge}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg hover:from-red-600 hover:to-orange-600 transition shadow-lg shadow-red-500/30"
            >
              <Swords className="w-6 h-6" /> {t('wrongStartChallenge')}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Crown className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
            <p className="text-white font-medium">{t('wrongEmpty')}</p>
          </motion.div>
        )}
      </div>
    );
  }

  // ===== BATTLE =====
  if (phase === 'battle') {
    const item = queue[current];
    const progress = ((current + 1) / queue.length) * 100;

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* HUD */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* HP */}
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${i < hp ? 'text-red-400 fill-red-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              {/* Streak */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-bold text-orange-300">×{streak}</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Countdown */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${countdown <= 3 ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/10 text-gray-300'}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{countdown}s</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-300">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{totalXP}</span>
              </div>
              <span className="text-xs text-gray-500">{current + 1}/{queue.length}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Stage label */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-primary-400" />
          <span className="text-xs text-gray-500">{item.lesson_title}</span>
          <span className="ml-auto text-xs font-mono text-gray-600">STAGE {current + 1}</span>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.quiz_id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="glass rounded-2xl p-6 lg:p-7"
          >
            <p className="text-base text-white font-medium leading-relaxed mb-5">{item.question}</p>

            <div className="space-y-3">
              {item.options.map((opt, oi) => {
                const isCorrectOpt = oi === item.correct_answer;
                const isSelected = oi === selected;
                let classes = 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20';
                if (answered) {
                  if (isCorrectOpt) {
                    classes = 'bg-green-500/15 border-green-500/40 text-green-300';
                  } else if (isSelected && !isCorrectOpt) {
                    classes = 'bg-red-500/15 border-red-500/40 text-red-300';
                  } else {
                    classes = 'bg-white/3 border-white/5 text-gray-500';
                  }
                }

                return (
                  <motion.button
                    key={oi}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    disabled={answered}
                    onClick={() => handleSelect(oi)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border ${classes} text-sm transition-all flex items-center gap-3`}
                  >
                    <span className="w-7 h-7 rounded-lg border border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrectOpt && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                    {answered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Post-answer feedback */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Result banner */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-300">{t('wrongBattleCorrect')}</p>
                      {streak > 1 && <p className="text-xs text-green-400/70">{t('wrongStreakBonus')} ×{streak}!</p>}
                    </div>
                    <span className="flex items-center gap-1 text-yellow-300 font-bold text-sm">
                      <Zap className="w-4 h-4" />+5 XP
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-400" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-300">{selected === null ? t('wrongTimeout') : t('wrongBattleWrong')}</p>
                      <p className="text-xs text-red-400/70">-1 ❤️ {hp <= 0 ? t('wrongGameOver') : ''}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Explanation toggle */}
              {item.explanation && (
                <>
                  {!showExplanation ? (
                    <button
                      onClick={() => setShowExplanation(true)}
                      className="text-xs text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> {t('wrongShowExplanation')}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs text-primary-200 leading-relaxed"
                    >
                      <strong>{t('wrongExplanation')}:</strong> {item.explanation}
                    </motion.div>
                  )}
                </>
              )}

              {/* Next button */}
              <div className="flex justify-center">
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:from-primary-600 hover:to-accent-600 transition"
                >
                  {hp <= 0 && !isCorrect ? t('wrongSeeResults') : current + 1 >= queue.length && isCorrect ? t('wrongFinish') : t('wrongNextStage')}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ===== RESULT (game over) / VICTORY =====
  const isVictory = phase === 'victory';
  return (
    <div className="max-w-2xl mx-auto pt-10 lg:pt-12 space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className={`w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center ${isVictory ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/40' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
          {isVictory ? <Crown className="w-12 h-12 text-white" /> : <Shield className="w-12 h-12 text-gray-300" />}
        </div>
        <h1 className="text-3xl font-bold text-white">
          {isVictory ? t('wrongVictoryTitle') : t('wrongDefeatTitle')}
        </h1>
        <p className="text-gray-400 mt-1">
          {isVictory ? t('wrongVictoryDesc') : t('wrongDefeatDesc')}
        </p>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 lg:p-8"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Swords className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{defeated.length}</p>
            <p className="text-xs text-gray-500">{t('wrongDefeated')}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">{bestStreak}</p>
            <p className="text-xs text-gray-500">{t('wrongBestStreak')}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-300">{totalXP}</p>
            <p className="text-xs text-gray-500">XP</p>
          </div>
        </div>

        {/* Stage progress */}
        <div className="mt-5 flex gap-1 justify-center flex-wrap">
          {queue.map((q, i) => {
            const isDone = defeated.includes(q.quiz_id);
            const isFailed = i <= current && !isDone;
            return (
              <div
                key={q.quiz_id}
                className={`w-4 h-4 rounded-sm transition-all ${isDone ? 'bg-green-500' : isFailed ? 'bg-red-500/60' : 'bg-white/10'}`}
                title={`Stage ${i + 1}`}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-3"
      >
        <button
          onClick={() => { fetchItems(); setPhase('lobby'); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white font-medium hover:bg-white/20 transition"
        >
          <RotateCcw className="w-4 h-4" /> {t('wrongBackToLobby')}
        </button>
        {!isVictory && allItems.length > 0 && (
          <button
            onClick={startChallenge}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:from-red-600 hover:to-orange-600 transition"
          >
            <Swords className="w-4 h-4" /> {t('wrongRetryChallenge')}
          </button>
        )}
      </motion.div>
    </div>
  );
}
