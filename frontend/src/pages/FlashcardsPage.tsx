import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppstoreOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
  ReadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Flashcard } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
      r.data.forEach((c: any) =>
        c.lessons?.forEach((l: any) => all.push({ id: l.id, title: l.title })),
      );
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* ---- Header ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppstoreOutlined style={{ color: '#A08F84' }} /> {t('flashcardsTitle')}
          </Title>
          <Text type="secondary" style={{ marginTop: 8, display: 'block', fontSize: 13 }}>
            {t('flashcardsSubtitle')}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreate(!showCreate)}
        >
          {t('flashcardsCreate')}
        </Button>
      </div>

      {/* ---- Create form ---- */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Card>
              <Form layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label={t('flashcardsFront')} style={{ marginBottom: 16 }}>
                    <TextArea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      placeholder={t('flashcardsFrontPlaceholder')}
                      rows={3}
                    />
                  </Form.Item>
                  <Form.Item label={t('flashcardsBack')} style={{ marginBottom: 16 }}>
                    <TextArea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      placeholder={t('flashcardsBackPlaceholder')}
                      rows={3}
                    />
                  </Form.Item>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Select
                    value={selectedLesson ?? null}
                    onChange={(v) => setSelectedLesson(v ?? undefined)}
                    allowClear
                    placeholder={t('flashcardsNoLesson')}
                    style={{ minWidth: 200 }}
                    size="small"
                    options={lessons.map((l) => ({ label: l.title, value: l.id }))}
                  />
                  <Button
                    type="primary"
                    onClick={handleCreate}
                    disabled={!front.trim() || !back.trim()}
                  >
                    {t('flashcardsAdd')}
                  </Button>
                </div>
              </Form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Auto-generate ---- */}
      <Card>
        <Space align="center" style={{ marginBottom: 16 }}>
          <StarOutlined style={{ color: '#A08F84' }} />
          <Text strong>{t('flashcardsAutoGenerate')}</Text>
          {generating && <Spin size="small" />}
        </Space>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {lessons.slice(0, 8).map((l) => (
            <Tag
              key={l.id}
              icon={<ReadOutlined />}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => !generating && handleGenerate(l.id)}
              color={generating ? undefined : 'default'}
            >
              {l.title}
            </Tag>
          ))}
        </div>
      </Card>

      <Divider style={{ margin: 0 }} />

      {/* ---- Card review ---- */}
      {cards.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">{t('flashcardsEmpty')}</Text>}
          style={{ padding: '48px 0' }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Progress & navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              {currentIdx + 1} / {cards.length}
            </Text>
            <Space>
              <Button
                size="small"
                icon={<LeftOutlined />}
                onClick={() => {
                  setCurrentIdx(Math.max(0, currentIdx - 1));
                  setFlipped(false);
                }}
                disabled={currentIdx === 0}
              />
              <Button
                size="small"
                icon={<RightOutlined />}
                onClick={() => {
                  setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1));
                  setFlipped(false);
                }}
                disabled={currentIdx >= cards.length - 1}
              />
            </Space>
          </div>

          {/* 3D flip flashcard */}
          <div style={{ perspective: '1000px' }}>
            <motion.div
              onClick={() => setFlipped(!flipped)}
              style={{
                position: 'relative',
                width: '100%',
                height: 260,
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
              }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  borderRadius: 12,
                  border: '1px solid #E2D4C7',
                  background: '#FFFDF9',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 40,
                  boxShadow: '0 1px 4px rgba(76,64,56,0.06)',
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  {t('flashcardsFront')}
                </Text>
                <Text strong style={{ fontSize: 16, textAlign: 'center', lineHeight: 1.6 }}>
                  {card?.front}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: 10, marginTop: 20, opacity: 0.5 }}
                >
                  {t('flashcardsTapToFlip')}
                </Text>
              </div>

              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: 12,
                  border: '1px solid #E2D4C7',
                  background: '#F8F4EF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 40,
                  boxShadow: '0 1px 4px rgba(76,64,56,0.06)',
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginBottom: 12,
                  }}
                >
                  {t('flashcardsBack')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    color: 'rgba(0,0,0,0.65)',
                  }}
                >
                  {card?.back}
                </Text>
              </div>
            </motion.div>
          </div>

          {/* Review buttons */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <Space
                  size="middle"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button danger onClick={() => handleReview(0)}>
                    {t('flashcardsAgain')}
                  </Button>
                  <Button onClick={() => handleReview(1)}>
                    {t('flashcardsHard')}
                  </Button>
                  <Button type="default" onClick={() => handleReview(2)} style={{ borderColor: '#52c41a', color: '#52c41a' }}>
                    {t('flashcardsGood')}
                  </Button>
                  <Button type="primary" onClick={() => handleReview(3)}>
                    {t('flashcardsEasy')}
                  </Button>
                </Space>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => card && handleDelete(card.id)}
            >
              {t('flashcardsDelete')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
