import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider, useI18n } from './i18n';
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
import { Toaster } from './components/Toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full spinner mx-auto mb-4" />
        <p className="text-primary-300 text-lg">{t('loading')}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
      <AuthProvider>
        <Toaster />
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
      </I18nProvider>
    </BrowserRouter>
  );
}
