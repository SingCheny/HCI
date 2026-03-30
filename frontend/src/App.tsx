import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin, App as AntApp } from 'antd';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider, useI18n } from './i18n';
import themeConfig from './theme/themeConfig';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import LessonPage from './pages/LessonPage';
import AchievementsPage from './pages/AchievementsPage';
import ComparisonPage from './pages/ComparisonPage';
import ChatPage from './pages/ChatPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudyPlanPage from './pages/StudyPlanPage';
import FocusTimerPage from './pages/FocusTimerPage';
import WrongAnswersPage from './pages/WrongAnswersPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  const { t } = useI18n();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F4EF' }}>
      <Spin size="large" tip={t('loading')} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
      <ConfigProvider theme={themeConfig}>
      <AntApp>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/lesson/:id" element={<LessonPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/comparison" element={<ComparisonPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/study-plan" element={<StudyPlanPage />} />
                    <Route path="/focus" element={<FocusTimerPage />} />
                    <Route path="/wrong-answers" element={<WrongAnswersPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      </AntApp>
      </ConfigProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
