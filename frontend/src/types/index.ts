export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  level: number;
  total_xp: number;
  streak_days: number;
  ai_mode_enabled: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: LessonBrief[];
}

export interface LessonBrief {
  id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  estimated_minutes: number;
  completed: boolean;
  score: number;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  summary: string;
  order_index: number;
  xp_reward: number;
  estimated_minutes: number;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  question: string;
  options: string[];
  difficulty: number;
  xp_reward: number;
  ai_hint: string | null;
}

export interface QuizResult {
  is_correct: boolean;
  correct_answer: number;
  explanation: string;
  xp_earned: number;
  new_total_xp: number;
  new_level: number;
  achievements_earned: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  badge_color: string;
  xp_reward: number;
  earned: boolean;
  earned_at: string | null;
}

export interface UserStats {
  total_xp: number;
  level: number;
  streak_days: number;
  lessons_completed: number;
  total_lessons: number;
  quizzes_attempted: number;
  quizzes_correct: number;
  accuracy: number;
  achievements_earned: number;
  total_achievements: number;
  xp_progress: number;
  xp_needed: number;
  next_level_xp: number;
  ai_mode_enabled: boolean;
}

export interface ComparisonData {
  ai_assisted: {
    total_attempts: number;
    correct: number;
    accuracy: number;
    avg_time: number;
    hint_usage: number;
  };
  non_ai_assisted: {
    total_attempts: number;
    correct: number;
    accuracy: number;
    avg_time: number;
    hint_usage: number;
  };
  course_comparison: {
    course: string;
    ai_accuracy: number;
    non_ai_accuracy: number;
    ai_avg_time: number;
    non_ai_avg_time: number;
  }[];
  total_study_time: {
    ai: number;
    non_ai: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  display_name: string;
  level: number;
  total_xp: number;
  avatar_url: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}
