from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ---- Auth ----
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: Optional[str] = ""


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: str
    avatar_url: str
    level: int
    total_xp: int
    streak_days: int
    ai_mode_enabled: bool
    last_active: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---- Course / Lesson ----
class LessonBrief(BaseModel):
    id: int
    title: str
    order_index: int
    xp_reward: int
    estimated_minutes: int
    completed: bool = False
    score: float = 0

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    color: str
    lessons: List[LessonBrief] = []

    class Config:
        from_attributes = True


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    content: str
    summary: str
    order_index: int
    xp_reward: int
    estimated_minutes: int

    class Config:
        from_attributes = True


# ---- Quiz ----
class QuizResponse(BaseModel):
    id: int
    lesson_id: int
    question: str
    options: list
    difficulty: int
    xp_reward: int
    ai_hint: Optional[str] = None  # only when AI mode

    class Config:
        from_attributes = True


class QuizSubmit(BaseModel):
    quiz_id: int
    selected_answer: int
    time_spent_seconds: float = 0
    used_hint: bool = False


class QuizResult(BaseModel):
    is_correct: bool
    correct_answer: int
    explanation: str
    xp_earned: int
    new_total_xp: int
    new_level: int
    achievements_earned: list = []


# ---- Gamification ----
class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    badge_color: str
    xp_reward: int
    earned: bool = False
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    display_name: str
    level: int
    total_xp: int
    avatar_url: str


# ---- Analytics ----
class ComparisonStats(BaseModel):
    ai_assisted: dict
    non_ai_assisted: dict


class StudySessionCreate(BaseModel):
    lesson_id: Optional[int] = None
    ai_assisted: bool = False
    duration_seconds: float = 0
    questions_attempted: int = 0
    questions_correct: int = 0


# ---- Chat ----
class ChatRequest(BaseModel):
    message: str
    lesson_id: Optional[int] = None


class ChatResponse(BaseModel):
    reply: str
    lesson_context: Optional[str] = None


# ---- Settings ----
class AIToggle(BaseModel):
    enabled: bool
