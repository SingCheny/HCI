import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  AimOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  Progress,
  Space,
  Spin,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { StudyPlan, StudyPlanItem } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

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

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const planItems = items
      .filter((i) => i.trim())
      .map((i) => ({ title: i.trim(), completed: false }));
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Spin size="large" />
      </div>
    );
  }

  const activePlans = plans.filter((p) => !p.completed);
  const completedPlans = plans.filter((p) => p.completed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, margin: '0 -60px' }}>
      {/* ---- Header ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined style={{ color: '#A08F84' }} /> {t('planTitle')}
          </Title>
          <Text type="secondary" style={{ marginTop: 8, display: 'block', fontSize: 13 }}>
            {t('planSubtitle')}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreate(!showCreate)}
        >
          {t('planCreate')}
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
                <Form.Item label={t('planTitlePlaceholder')} style={{ marginBottom: 16 }}>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('planTitlePlaceholder')}
                  />
                </Form.Item>

                <Form.Item label={t('planDescPlaceholder')} style={{ marginBottom: 16 }}>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('planDescPlaceholder')}
                    rows={2}
                  />
                </Form.Item>

                <Form.Item label={t('planTargetDate')} style={{ marginBottom: 16 }}>
                  <DatePicker
                    value={targetDate ? dayjs(targetDate) : null}
                    onChange={(_date, dateString) =>
                      setTargetDate(typeof dateString === 'string' ? dateString : '')
                    }
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label={t('planTasks')} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((item, i) => (
                      <Space key={i} style={{ display: 'flex' }}>
                        <Input
                          value={item}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[i] = e.target.value;
                            setItems(copy);
                          }}
                          placeholder={`${t('planTaskItem')} ${i + 1}`}
                          style={{ flex: 1 }}
                        />
                        {items.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => setItems(items.filter((_, j) => j !== i))}
                          />
                        )}
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => setItems([...items, ''])}
                      icon={<PlusOutlined />}
                      size="small"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {t('planAddTask')}
                    </Button>
                  </div>
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="primary" onClick={handleCreate} disabled={!title.trim()}>
                    {t('planSave')}
                  </Button>
                </div>
              </Form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Empty state ---- */}
      {activePlans.length === 0 && completedPlans.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">{t('planEmpty')}</Text>}
          style={{ padding: '48px 0' }}
        />
      )}

      {/* ---- Active Plans ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      </div>

      {/* ---- Completed Plans ---- */}
      {completedPlans.length > 0 && (
        <div>
          <Divider orientation="left" plain>
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text type="secondary">
                {t('planCompleted')} ({completedPlans.length})
              </Text>
            </Space>
          </Divider>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        </div>
      )}
    </div>
  );
}

/* ---- PlanCard sub-component ---- */

function PlanCard({
  plan,
  idx,
  expanded,
  onToggleExpand,
  onToggleItem,
  onDelete,
  t,
  dimmed,
}: {
  plan: StudyPlan;
  idx: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (pid: number, iid: number) => void;
  onDelete: (pid: number) => void;
  t: (k: any) => string;
  dimmed?: boolean;
}) {
  const doneCount = plan.items.filter((i) => i.completed).length;
  const totalCount = plan.items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const collapseItems = [
    {
      key: 'tasks',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Space>
            <AimOutlined
              style={{ color: plan.completed ? '#52c41a' : '#A08F84' }}
            />
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {plan.title}
              </Text>
              {plan.description && (
                <Text
                  type="secondary"
                  style={{ display: 'block', fontSize: 12, marginTop: 2 }}
                >
                  {plan.description}
                </Text>
              )}
            </div>
          </Space>
          <Space size="middle">
            {plan.target_date && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {new Date(plan.target_date).toLocaleDateString()}
              </Text>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {doneCount}/{totalCount}
            </Text>
          </Space>
        </div>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plan.items
            .sort((a, b) => a.order_index - b.order_index)
            .map((item) => (
              <Checkbox
                key={item.id}
                checked={item.completed}
                onChange={() => onToggleItem(plan.id, item.id)}
                style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                  color: item.completed ? '#bfbfbf' : undefined,
                }}
              >
                {item.title}
              </Checkbox>
            ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(plan.id);
              }}
            >
              {t('planDeletePlan')}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      style={{ opacity: dimmed ? 0.55 : 1 }}
    >
      <Card
        bodyStyle={{ padding: 0 }}
        style={{ overflow: 'hidden' }}
      >
        {totalCount > 0 && (
          <Progress
            percent={pct}
            showInfo={false}
            strokeColor="#B88A72"
            trailColor="#F1E7DC"
            size={['100%', 3]}
            style={{ margin: 0, lineHeight: 0 }}
          />
        )}
        <Collapse
          ghost
          activeKey={expanded ? ['tasks'] : []}
          onChange={() => onToggleExpand()}
          items={collapseItems}
          style={{ background: 'transparent' }}
        />
      </Card>
    </motion.div>
  );
}
