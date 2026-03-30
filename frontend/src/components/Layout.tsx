import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-components';
import { Switch, Dropdown, Progress, Typography, Space, Button, Tag } from 'antd';
import {
  DashboardOutlined, ReadOutlined, TrophyOutlined, BarChartOutlined,
  CommentOutlined, AppstoreOutlined, CalendarOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, LogoutOutlined, GlobalOutlined, ThunderboltOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import api from '../services/api';
import type { TranslationKey } from '../i18n/translations';

const { Text } = Typography;

const navItems: { path: string; icon: ReactNode; labelKey: TranslationKey }[] = [
  { path: '/', icon: <DashboardOutlined />, labelKey: 'navDashboard' },
  { path: '/courses', icon: <ReadOutlined />, labelKey: 'navCourses' },
  { path: '/achievements', icon: <TrophyOutlined />, labelKey: 'navAchievements' },
  { path: '/comparison', icon: <BarChartOutlined />, labelKey: 'navComparison' },
  { path: '/chat', icon: <CommentOutlined />, labelKey: 'navChat' },
  { path: '/flashcards', icon: <AppstoreOutlined />, labelKey: 'navFlashcards' },
  { path: '/study-plan', icon: <CalendarOutlined />, labelKey: 'navStudyPlan' },
  { path: '/focus', icon: <ClockCircleOutlined />, labelKey: 'navFocus' },
  { path: '/wrong-answers', icon: <ExclamationCircleOutlined />, labelKey: 'navWrongAnswers' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, refreshUser } = useAuth();
  const { t, toggleLocale, locale } = useI18n();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [aiToggling, setAiToggling] = useState(false);

  const toggleAI = async () => {
    if (!user || aiToggling) return;
    setAiToggling(true);
    try {
      await api.post('/settings/ai-mode', { enabled: !user.ai_mode_enabled });
      await refreshUser();
    } catch {
      // ignore
    }
    setAiToggling(false);
  };

  const levelProgress = user ? (user.total_xp % 100) : 0;

  const route = {
    path: '/',
    routes: navItems.map(item => ({
      path: item.path,
      name: t(item.labelKey),
      icon: item.icon,
    })),
  };

  return (
    <ProLayout
      title={t('appName')}
      logo={
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#B88A72', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={14} color="#FFFDF9" />
        </div>
      }
      route={route}
      location={{ pathname: location.pathname }}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      fixSiderbar
      layout="mix"
      navTheme="light"
      contentWidth="Fluid"
      siderWidth={240}
      menuItemRender={(item, dom) => (
        <Link to={item.path || '/'}>{dom}</Link>
      )}
      token={{
        sider: {
          colorMenuBackground: '#FFFDF9',
          colorMenuItemDivider: '#F1E7DC',
          colorTextMenu: '#7A6A60',
          colorTextMenuSelected: '#FFFDF9',
          colorBgMenuItemSelected: '#B88A72',
          colorTextMenuActive: '#B88A72',
        },
        header: {
          colorBgHeader: '#FFFDF9',
          heightLayoutHeader: 56,
        },
        pageContainer: {
          paddingBlockPageContainerContent: 24,
          paddingInlinePageContainerContent: 32,
        },
      }}
      headerContentRender={() => null}
      actionsRender={() => [
        <Space key="actions" size="middle" align="center">
          {user && (
            <Space size={4} align="center">
              <ThunderboltOutlined style={{ fontSize: 12, color: '#A08F84' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{user.total_xp} XP</Text>
              {user.streak_days > 0 && (
                <Tag color="default" style={{ marginLeft: 4, fontSize: 11 }}>
                  <FireOutlined /> {user.streak_days}d
                </Tag>
              )}
            </Space>
          )}
          {user && (
            <Space size={4} align="center">
              <Text type="secondary" style={{ fontSize: 12 }}>AI</Text>
              <Switch
                size="small"
                checked={user.ai_mode_enabled}
                loading={aiToggling}
                onChange={toggleAI}
              />
            </Space>
          )}
          <Button
            type="text"
            size="small"
            icon={<GlobalOutlined />}
            onClick={toggleLocale}
          >
            {locale === 'en' ? '中文' : 'EN'}
          </Button>
        </Space>,
      ]}
      avatarProps={{
        style: { backgroundColor: '#B88A72' },
        children: user?.display_name?.[0]?.toUpperCase() || 'U',
        title: user?.display_name || '',
        render: (_props, dom) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'info',
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 500 }}>{user?.display_name}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Lv.{user?.level} &middot; {user?.total_xp} XP</Text>
                      <Progress
                        percent={levelProgress}
                        size="small"
                        showInfo={false}
                        strokeColor="#B88A72"
                        style={{ marginTop: 6 }}
                      />
                    </div>
                  ),
                  disabled: true,
                },
                { type: 'divider' as const },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: t('logout'),
                  danger: true,
                  onClick: logout,
                },
              ],
            }}
            placement="bottomRight"
          >
            {dom}
          </Dropdown>
        ),
      }}
      menuFooterRender={(props) => {
        if (props?.collapsed) return null;
        return (
          <div style={{ padding: '16px 16px 24px', borderTop: '1px solid #F1E7DC' }}>
            <Text type="secondary" style={{ fontSize: 11 }}>{t('appSubtitle')}</Text>
          </div>
        );
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </div>
    </ProLayout>
  );
}
