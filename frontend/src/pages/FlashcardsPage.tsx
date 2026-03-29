import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, RotateCcw, Trash2, Sparkles, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Flashcard } from '../types';

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | undefined>();
  const [generating, setGenerating] = useState(false);
  const { t } = useI18n();

  const fetchCards = () => {
    api.get('/flashcards').then((r) => {
      setCards(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCards();
    api.get('/courses').then((r) => {
      const all: { id: number; title: string }[] = [];
      r.data.forEach((c: any) => c.lessons?.forEach((l: any) => all.push({ id: l.id, title: l.title })));
      setLessons(all);
    });
  }, []);

  const handleCreate = async () => {
    if (!front.trim() || !back.trim()) return;
    await api.post('/flashcards', { front: front.trim(), back: back.trim(), lesson_id: selectedLesson });
    setFront('');
    setBack('');
    setShowCreate(false);
    fetchCards();
  };

  const handleGenerate = async (lessonId: number) => {
    setGenerating(true);
    try {
      const res = await api.post(`/flashcards/generate?lesson_id=${lessonId}`);
      if (res.data.created > 0) fetchCards();
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (quality: number) => {
    const card = cards[currentIdx];
    if (!card) return;
    await api.post(`/flashcards/${card.id}/review`, { quality });
    setFlipped(false);
    if (currentIdx < cards.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      fetchCards();
      setCurrentIdx(0);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/flashcards/${id}`);
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (currentIdx >= cards.length - 1) setCurrentIdx(Math.max(0, currentIdx - 1));
  };

  const card = cards[currentIdx];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary-400" /> {t('flashcardsTitle')}
          </h1>
          <p className="text-gray-400 mt-1">{t('flashcardsSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm hover:bg-primary-500/30 transition"
          >
            <Plus className="w-4 h-4" /> {t('flashcardsCreate')}
          </button>
        </div>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 lg:p-7 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">{t('flashcardsFront')}</label>
                <textarea
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary-500 resize-none h-24"
                  placeholder={t('flashcardsFrontPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">{t('flashcardsBack')}</label>
                <textarea
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary-500 resize-none h-24"
                  placeholder={t('flashcardsBackPlaceholder')}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <select
                value={selectedLesson ?? ''}
                onChange={(e) => setSelectedLesson(e.target.value ? Number(e.target.value) : undefined)}
                className="text-sm bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                <option value="">{t('flashcardsNoLesson')}</option>
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
              <button
                onClick={handleCreate}
                disabled={!front.trim() || !back.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium disabled:opacity-40 hover:from-primary-600 hover:to-accent-600 transition"
              >
                {t('flashcardsAdd')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-generate from lesson */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-white">{t('flashcardsAutoGenerate')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {lessons.slice(0, 8).map((l) => (
            <button
              key={l.id}
              onClick={() => handleGenerate(l.id)}
              disabled={generating}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
            >
              <BookOpen className="w-3 h-3 inline mr-1" />{l.title}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Card review area */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <Layers className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">{t('flashcardsEmpty')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{currentIdx + 1} / {cards.length}</span>
            <div className="flex gap-2">
              <button onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setFlipped(false); }} disabled={currentIdx === 0} className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => { setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1)); setFlipped(false); }} disabled={currentIdx >= cards.length - 1} className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Flashcard */}
          <div className="perspective-1000" style={{ perspective: '1000px' }}>
            <motion.div
              onClick={() => setFlipped(!flipped)}
              className="relative w-full h-72 cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-primary-500/20 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-xs text-primary-400 mb-3 uppercase tracking-wider">{t('flashcardsFront')}</p>
                <p className="text-lg text-white text-center font-medium leading-relaxed">{card?.front}</p>
                <p className="text-xs text-gray-500 mt-4">{t('flashcardsTapToFlip')}</p>
              </div>
              {/* Back */}
              <div
                className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-accent-500/20 backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="text-xs text-accent-400 mb-3 uppercase tracking-wider">{t('flashcardsBack')}</p>
                <p className="text-base text-gray-200 text-center leading-relaxed whitespace-pre-line">{card?.back}</p>
              </div>
            </motion.div>
          </div>

          {/* Review buttons */}
          {flipped && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-3">
              {[
                { q: 0, label: t('flashcardsAgain'), color: 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30' },
                { q: 1, label: t('flashcardsHard'), color: 'bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30' },
                { q: 2, label: t('flashcardsGood'), color: 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30' },
                { q: 3, label: t('flashcardsEasy'), color: 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30' },
              ].map(({ q, label, color }) => (
                <button
                  key={q}
                  onClick={() => handleReview(q)}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition ${color}`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Delete current */}
          <div className="flex justify-center">
            <button onClick={() => card && handleDelete(card.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition">
              <Trash2 className="w-3.5 h-3.5" /> {t('flashcardsDelete')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
