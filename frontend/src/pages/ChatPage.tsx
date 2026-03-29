import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RobotOutlined,
  SendOutlined,
  UserOutlined,
  DeleteOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Empty, Input, Select, Space, Spin, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { ChatMessage } from '../types';

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [lessonId, setLessonId] = useState<number | undefined>();
  const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
  const [sending, setSending] = useState(false);
  const { t } = useI18n();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/courses').then((r) => {
      const all: { id: number; title: string }[] = [];
      r.data.forEach((c: any) =>
        c.lessons?.forEach((l: any) => all.push({ id: l.id, title: l.title })),
      );
      setLessons(all);
    });
    api.get('/chat/history').then((r) => setMessages(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);

    const userMsg: ChatMessage = { role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.post('/chat', { message: text, lesson_id: lessonId });
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: res.data.reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong.', created_at: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.delete('/chat/history');
      setMessages([]);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 7rem)' }}>
      {/* ---- Header ---- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingBottom: 20,
          borderBottom: '1px solid #f5f5f5',
        }}
      >
        <Avatar
          size={40}
          icon={<RobotOutlined />}
          style={{ backgroundColor: '#1a1a1a', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0 }}>
            {t('chatTitle')}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('chatSubtitle')}
          </Text>
        </div>

        <Space size="middle">
          {messages.length > 0 && (
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={handleClear}
            >
              {t('chatClear')}
            </Button>
          )}
          <Select
            value={lessonId ?? null}
            onChange={(v) => setLessonId(v ?? undefined)}
            allowClear
            placeholder={t('chatGeneralChat')}
            suffixIcon={<ReadOutlined />}
            style={{ minWidth: 180 }}
            size="small"
            options={lessons.map((l) => ({ label: l.title, value: l.id }))}
          />
        </Space>
      </div>

      {/* ---- Messages ---- */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={4}>
                  <Text type="secondary">{t('chatEmptyTitle')}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('chatEmptySub')}
                  </Text>
                </Space>
              }
            />
            <Space wrap style={{ marginTop: 20, justifyContent: 'center' }}>
              {[t('chatSuggestion1'), t('chatSuggestion2'), t('chatSuggestion3'), t('chatSuggestion4')].map(
                (q) => (
                  <Button key={q} size="small" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ),
              )}
            </Space>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'assistant' && (
                <Avatar
                  size={32}
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: '#1a1a1a', flexShrink: 0, marginTop: 2 }}
                />
              )}

              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  lineHeight: 1.6,
                  ...(msg.role === 'user'
                    ? { background: '#1a1a1a', color: '#fff' }
                    : {
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                        color: 'rgba(0,0,0,0.65)',
                      }),
                }}
              >
                {msg.role === 'assistant' ? (
                  <div className="lesson-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>

              {msg.role === 'user' && (
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#f5f5f5', color: '#999', flexShrink: 0, marginTop: 2 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: 12 }}
          >
            <Avatar
              size={32}
              icon={<RobotOutlined />}
              style={{ backgroundColor: '#1a1a1a', flexShrink: 0 }}
            />
            <div
              style={{
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                padding: '12px 16px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Spin size="small" />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {t('chatThinking')}
              </Text>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ---- Input bar ---- */}
      <div style={{ paddingTop: 20, borderTop: '1px solid #f5f5f5' }}>
        <Space.Compact style={{ display: 'flex', width: '100%' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatPlaceholder')}
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!input.trim() || sending}
            style={{ height: 'auto' }}
          />
        </Space.Compact>
      </div>
    </div>
  );
}
