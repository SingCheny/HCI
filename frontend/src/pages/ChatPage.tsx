import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { ChatMessage } from '../types';

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
      r.data.forEach((c: any) => c.lessons?.forEach((l: any) => all.push({ id: l.id, title: l.title })));
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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.', created_at: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 pb-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{t('chatTitle')}</h1>
          <p className="text-xs text-gray-400">{t('chatSubtitle')}</p>
        </div>

        {/* Lesson Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <select
            value={lessonId ?? ''}
            onChange={(e) => setLessonId(e.target.value ? Number(e.target.value) : undefined)}
            className="text-sm bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary-500"
          >
            <option value="">{t('chatGeneralChat')}</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Sparkles className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">{t('chatEmptyTitle')}</p>
            <p className="text-xs mt-1">{t('chatEmptySub')}</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[t('chatSuggestion1'), t('chatSuggestion2'), t('chatSuggestion3'), t('chatSuggestion4')].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-gray-200 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-500/20 border border-primary-500/30 text-gray-200'
                    : 'glass text-gray-300'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="lesson-content prose-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
              <span>{t('chatThinking')}</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-white/10">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatPlaceholder')}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-40 hover:from-primary-600 hover:to-accent-600 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
