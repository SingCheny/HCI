import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, Trash2, CheckCircle, Circle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { StudyPlan } from '../types';

export default function StudyPlanPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [items, setItems] = useState<string[]>(['']);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { t } = useI18n();

  const fetchPlans = () => {
    api.get('/study-plans').then((r) => {
      setPlans(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const planItems = items.filter((i) => i.trim()).map((i) => ({ title: i.trim(), completed: false }));
    await api.post('/study-plans', {
      title: title.trim(),
      description: description.trim(),
      target_date: targetDate || null,
      items: planItems,
    });
    setTitle('');
    setDescription('');
    setTargetDate('');
    setItems(['']);
    setShowCreate(false);
    fetchPlans();
  };

  const toggleItem = async (planId: number, itemId: number) => {
    await api.patch(`/study-plans/${planId}/items/${itemId}`);
    fetchPlans();
  };

  const deletePlan = async (planId: number) => {
    await api.delete(`/study-plans/${planId}`);
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  const activePlans = plans.filter((p) => !p.completed);
  const completedPlans = plans.filter((p) => p.completed);

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-primary-400" /> {t('planTitle')}
          </h1>
          <p className="text-gray-400 mt-1">{t('planSubtitle')}</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm hover:bg-primary-500/30 transition"
        >
          <Plus className="w-4 h-4" /> {t('planCreate')}
        </button>
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
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary-500"
              placeholder={t('planTitlePlaceholder')}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary-500 resize-none h-20"
              placeholder={t('planDescPlaceholder')}
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">{t('planTargetDate')}</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('planTasks')}</label>
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                  <input
                    value={item}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[i] = e.target.value;
                      setItems(copy);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder={`${t('planTaskItem')} ${i + 1}`}
                  />
                  {items.length > 1 && (
                    <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setItems([...items, ''])}
                className="text-xs text-primary-400 hover:text-primary-300 transition"
              >
                + {t('planAddTask')}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium disabled:opacity-40 hover:from-primary-600 hover:to-accent-600 transition"
              >
                {t('planSave')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Plans */}
      {activePlans.length === 0 && completedPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">{t('planEmpty')}</p>
        </div>
      )}

      {activePlans.map((plan, idx) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          idx={idx}
          expanded={expandedId === plan.id}
          onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
          onToggleItem={toggleItem}
          onDelete={deletePlan}
          t={t}
        />
      ))}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {t('planCompleted')} ({completedPlans.length})
          </h2>
          {completedPlans.map((plan, idx) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              idx={idx}
              expanded={expandedId === plan.id}
              onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
              onToggleItem={toggleItem}
              onDelete={deletePlan}
              t={t}
              dimmed
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  plan, idx, expanded, onToggleExpand, onToggleItem, onDelete, t, dimmed,
}: {
  plan: StudyPlan; idx: number; expanded: boolean;
  onToggleExpand: () => void; onToggleItem: (pid: number, iid: number) => void;
  onDelete: (pid: number) => void; t: (k: any) => string; dimmed?: boolean;
}) {
  const doneCount = plan.items.filter((i) => i.completed).length;
  const totalCount = plan.items.length;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`glass rounded-2xl overflow-hidden ${dimmed ? 'opacity-60' : ''}`}
    >
      <div className="p-6 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className={`w-5 h-5 ${plan.completed ? 'text-green-400' : 'text-primary-400'}`} />
            <div>
              <h3 className="font-semibold text-white">{plan.title}</h3>
              {plan.description && <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {plan.target_date && (
              <span className="text-xs text-gray-500">
                {new Date(plan.target_date).toLocaleDateString()}
              </span>
            )}
            <span className="text-xs text-gray-400">{doneCount}/{totalCount}</span>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>
        </div>
        {totalCount > 0 && (
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 space-y-2.5 border-t border-white/5 pt-4">
              {plan.items
                .sort((a, b) => a.order_index - b.order_index)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); onToggleItem(plan.id, item.id); }}
                    className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/5 transition group"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500 shrink-0 group-hover:text-primary-400 transition" />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{item.title}</span>
                  </button>
                ))}
              <div className="flex justify-end pt-2">
                <button onClick={() => onDelete(plan.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition">
                  <Trash2 className="w-3.5 h-3.5" /> {t('planDeletePlan')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
