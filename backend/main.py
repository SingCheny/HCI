"""
LearnSmart - AI-Assisted Learning Platform
Backend API Server
"""

import os
import sys
import json
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc

from database import engine, Base, get_db, SessionLocal
from models import (
    User, Course, Lesson, Quiz, QuizAttempt,
    UserProgress, Achievement, UserAchievement,
    StudySession, ChatMessage,
)
from schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    CourseResponse, LessonBrief, LessonResponse,
    QuizResponse, QuizSubmit, QuizResult,
    AchievementResponse, LeaderboardEntry, ComparisonStats,
    StudySessionCreate, ChatRequest, ChatResponse, AIToggle,
)
from seed_data import COURSES, LESSONS, QUIZZES, ACHIEVEMENTS


# ---- Helpers ----
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}:{hashed.hex()}"


def verify_password(password: str, hashed: str) -> bool:
    salt, stored_hash = hashed.split(":")
    computed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return computed.hex() == stored_hash


def xp_for_level(level: int) -> int:
    """XP required to reach a given level."""
    return int(100 * (level ** 1.5))


def level_from_xp(total_xp: int) -> int:
    """Calculate level from total XP."""
    level = 1
    while xp_for_level(level + 1) <= total_xp:
        level += 1
    return level


def seed_database():
    """Populate database with HCI course content."""
    db = SessionLocal()
    try:
        if db.query(Course).count() > 0:
            return  # Already seeded

        # Create courses
        course_map = {}
        for c_data in COURSES:
            course = Course(**c_data)
            db.add(course)
            db.flush()
            course_map[c_data["title"]] = course.id

        # Create lessons
        lesson_map = {}
        for course_title, lessons in LESSONS.items():
            course_id = course_map.get(course_title)
            if not course_id:
                continue
            for l_data in lessons:
                lesson = Lesson(course_id=course_id, **l_data)
                db.add(lesson)
                db.flush()
                lesson_map[l_data["title"]] = lesson.id

        # Create quizzes
        for lesson_title, quizzes in QUIZZES.items():
            lesson_id = lesson_map.get(lesson_title)
            if not lesson_id:
                continue
            for q_data in quizzes:
                quiz = Quiz(lesson_id=lesson_id, **q_data)
                db.add(quiz)

        # Create achievements
        for a_data in ACHIEVEMENTS:
            achievement = Achievement(**a_data)
            db.add(achievement)

        # Create demo user
        demo_user = User(
            username="demo",
            email="demo@learnsmart.hci",
            hashed_password=hash_password("demo123"),
            display_name="Demo User",
            level=1,
            total_xp=0,
            streak_days=0,
        )
        db.add(demo_user)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()


# ---- App Lifecycle ----
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


app = FastAPI(
    title="LearnSmart API",
    description="AI-Assisted Learning Platform for HCI Education",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Simple token storage (in-memory for demo) ----
_tokens: dict[str, int] = {}  # token -> user_id


def create_token(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    _tokens[token] = user_id
    return token


def get_current_user(
    token: str = Query(None, alias="token"),
    db: Session = Depends(get_db),
) -> User:
    """Extract user from token query param or Authorization header."""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = _tokens.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ===========================================================
#  AUTH ROUTES
# ===========================================================

@app.post("/api/auth/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(400, "Username already taken")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        display_name=data.display_name or data.username,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid username or password")

    # Update streak
    now = datetime.now(timezone.utc)
    if user.last_active:
        last = user.last_active.replace(tzinfo=timezone.utc) if user.last_active.tzinfo is None else user.last_active
        diff = (now.date() - last.date()).days
        if diff == 1:
            user.streak_days += 1
        elif diff > 1:
            user.streak_days = 1
    user.last_active = now
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)


# ===========================================================
#  COURSE ROUTES
# ===========================================================

@app.get("/api/courses", response_model=List[CourseResponse])
def get_courses(
    db: Session = Depends(get_db),
    token: Optional[str] = Query(None),
):
    courses = db.query(Course).order_by(Course.order_index).all()
    user_id = _tokens.get(token) if token else None

    result = []
    for course in courses:
        lessons_data = []
        for lesson in sorted(course.lessons, key=lambda l: l.order_index):
            completed = False
            score = 0.0
            if user_id:
                progress = db.query(UserProgress).filter(
                    UserProgress.user_id == user_id,
                    UserProgress.lesson_id == lesson.id,
                    UserProgress.completed == True,
                ).first()
                if progress:
                    completed = True
                    score = progress.score
            lessons_data.append(LessonBrief(
                id=lesson.id,
                title=lesson.title,
                order_index=lesson.order_index,
                xp_reward=lesson.xp_reward,
                estimated_minutes=lesson.estimated_minutes,
                completed=completed,
                score=score,
            ))
        result.append(CourseResponse(
            id=course.id,
            title=course.title,
            description=course.description,
            icon=course.icon,
            color=course.color,
            lessons=lessons_data,
        ))
    return result


@app.get("/api/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return LessonResponse.model_validate(lesson)


@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    # Check if already completed
    existing = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.lesson_id == lesson_id,
        UserProgress.completed == True,
    ).first()

    xp_earned = 0
    if not existing:
        progress = UserProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            completed=True,
            score=100,
            ai_assisted=user.ai_mode_enabled,
            completed_at=datetime.now(timezone.utc),
        )
        db.add(progress)
        xp_earned = lesson.xp_reward
        user.total_xp += xp_earned
        user.level = level_from_xp(user.total_xp)
        db.commit()

    # Check achievements
    new_achievements = check_achievements(user, db)

    return {
        "success": True,
        "xp_earned": xp_earned,
        "total_xp": user.total_xp,
        "level": user.level,
        "new_achievements": new_achievements,
    }


# ===========================================================
#  QUIZ ROUTES
# ===========================================================

@app.get("/api/lessons/{lesson_id}/quizzes", response_model=List[QuizResponse])
def get_quizzes(
    lesson_id: int,
    db: Session = Depends(get_db),
    token: Optional[str] = Query(None),
):
    quizzes = db.query(Quiz).filter(Quiz.lesson_id == lesson_id).all()
    user_id = _tokens.get(token) if token else None

    # Check if AI mode enabled
    ai_mode = False
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        ai_mode = user.ai_mode_enabled if user else False

    result = []
    for q in quizzes:
        qr = QuizResponse(
            id=q.id,
            lesson_id=q.lesson_id,
            question=q.question,
            options=q.options,
            difficulty=q.difficulty,
            xp_reward=q.xp_reward,
            ai_hint=q.ai_hint if ai_mode else None,
        )
        result.append(qr)
    return result


@app.post("/api/quizzes/submit", response_model=QuizResult)
def submit_quiz(
    data: QuizSubmit,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    quiz = db.query(Quiz).filter(Quiz.id == data.quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    is_correct = data.selected_answer == quiz.correct_answer

    attempt = QuizAttempt(
        user_id=user.id,
        quiz_id=quiz.id,
        selected_answer=data.selected_answer,
        is_correct=is_correct,
        ai_assisted=user.ai_mode_enabled,
        time_spent_seconds=data.time_spent_seconds,
        used_hint=data.used_hint,
    )
    db.add(attempt)

    xp_earned = 0
    if is_correct:
        xp_earned = quiz.xp_reward
        if not user.ai_mode_enabled:
            xp_earned = int(xp_earned * 1.5)  # Bonus for non-AI mode
        user.total_xp += xp_earned
        user.level = level_from_xp(user.total_xp)

    db.commit()

    new_achievements = check_achievements(user, db)

    return QuizResult(
        is_correct=is_correct,
        correct_answer=quiz.correct_answer,
        explanation=quiz.explanation,
        xp_earned=xp_earned,
        new_total_xp=user.total_xp,
        new_level=user.level,
        achievements_earned=new_achievements,
    )


# ===========================================================
#  GAMIFICATION ROUTES
# ===========================================================

def check_achievements(user: User, db: Session) -> list:
    """Check and award any new achievements."""
    earned_ids = {ua.achievement_id for ua in db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id
    ).all()}

    all_achievements = db.query(Achievement).all()
    new_earned = []

    for ach in all_achievements:
        if ach.id in earned_ids:
            continue

        earned = False

        if ach.condition_type == "lessons_completed":
            count = db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.completed == True,
            ).count()
            earned = count >= ach.condition_value

        elif ach.condition_type == "quizzes_correct":
            count = db.query(QuizAttempt).filter(
                QuizAttempt.user_id == user.id,
                QuizAttempt.is_correct == True,
            ).count()
            earned = count >= ach.condition_value

        elif ach.condition_type == "streak_days":
            earned = user.streak_days >= ach.condition_value

        elif ach.condition_type == "total_xp":
            earned = user.total_xp >= ach.condition_value

        elif ach.condition_type == "ai_quizzes":
            count = db.query(QuizAttempt).filter(
                QuizAttempt.user_id == user.id,
                QuizAttempt.is_correct == True,
                QuizAttempt.ai_assisted == True,
            ).count()
            earned = count >= ach.condition_value

        elif ach.condition_type == "non_ai_quizzes":
            count = db.query(QuizAttempt).filter(
                QuizAttempt.user_id == user.id,
                QuizAttempt.is_correct == True,
                QuizAttempt.ai_assisted == False,
            ).count()
            earned = count >= ach.condition_value

        elif ach.condition_type == "fast_quiz":
            count = db.query(QuizAttempt).filter(
                QuizAttempt.user_id == user.id,
                QuizAttempt.is_correct == True,
                QuizAttempt.time_spent_seconds < ach.condition_value,
                QuizAttempt.time_spent_seconds > 0,
            ).count()
            earned = count >= 1

        elif ach.condition_type == "perfect_quiz":
            # Check if user got all quizzes correct for any lesson
            lessons_with_quizzes = db.query(Quiz.lesson_id).distinct().all()
            for (lid,) in lessons_with_quizzes:
                total_qs = db.query(Quiz).filter(Quiz.lesson_id == lid).count()
                correct_qs = db.query(QuizAttempt).join(Quiz).filter(
                    QuizAttempt.user_id == user.id,
                    Quiz.lesson_id == lid,
                    QuizAttempt.is_correct == True,
                ).count()
                if correct_qs >= total_qs and total_qs > 0:
                    earned = True
                    break

        if earned:
            ua = UserAchievement(user_id=user.id, achievement_id=ach.id)
            db.add(ua)
            user.total_xp += ach.xp_reward
            user.level = level_from_xp(user.total_xp)
            db.commit()
            new_earned.append({
                "name": ach.name,
                "description": ach.description,
                "icon": ach.icon,
                "badge_color": ach.badge_color,
                "xp_reward": ach.xp_reward,
            })

    return new_earned


@app.get("/api/achievements", response_model=List[AchievementResponse])
def get_achievements(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    all_achs = db.query(Achievement).all()
    user_achs = {ua.achievement_id: ua.earned_at for ua in db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id
    ).all()}

    result = []
    for ach in all_achs:
        result.append(AchievementResponse(
            id=ach.id,
            name=ach.name,
            description=ach.description,
            icon=ach.icon,
            badge_color=ach.badge_color,
            xp_reward=ach.xp_reward,
            earned=ach.id in user_achs,
            earned_at=user_achs.get(ach.id),
        ))
    return result


@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(desc(User.total_xp)).limit(20).all()
    result = []
    for i, u in enumerate(users):
        result.append(LeaderboardEntry(
            rank=i + 1,
            username=u.username,
            display_name=u.display_name or u.username,
            level=u.level,
            total_xp=u.total_xp,
            avatar_url=u.avatar_url or "",
        ))
    return result


@app.get("/api/user/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lessons_completed = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.completed == True,
    ).count()

    total_lessons = db.query(Lesson).count()

    quizzes_attempted = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
    ).count()

    quizzes_correct = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.is_correct == True,
    ).count()

    achievements_earned = db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id,
    ).count()

    total_achievements = db.query(Achievement).count()

    # XP for next level
    next_level_xp = xp_for_level(user.level + 1)
    current_level_xp = xp_for_level(user.level) if user.level > 1 else 0
    xp_progress = max(user.total_xp - current_level_xp, 0)
    xp_needed = next_level_xp - current_level_xp

    return {
        "total_xp": user.total_xp,
        "level": user.level,
        "streak_days": user.streak_days,
        "lessons_completed": lessons_completed,
        "total_lessons": total_lessons,
        "quizzes_attempted": quizzes_attempted,
        "quizzes_correct": quizzes_correct,
        "accuracy": round(quizzes_correct / max(quizzes_attempted, 1) * 100, 1),
        "achievements_earned": achievements_earned,
        "total_achievements": total_achievements,
        "xp_progress": xp_progress,
        "xp_needed": xp_needed,
        "next_level_xp": next_level_xp,
        "ai_mode_enabled": user.ai_mode_enabled,
    }


# ===========================================================
#  ANALYTICS / COMPARISON ROUTES
# ===========================================================

@app.get("/api/analytics/comparison")
def get_comparison(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Compare AI-assisted vs non-AI-assisted performance."""
    # AI-assisted attempts
    ai_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.ai_assisted == True,
    ).all()

    # Non-AI attempts
    non_ai_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.ai_assisted == False,
    ).all()

    def calc_stats(attempts):
        if not attempts:
            return {
                "total_attempts": 0,
                "correct": 0,
                "accuracy": 0,
                "avg_time": 0,
                "hint_usage": 0,
            }
        correct = sum(1 for a in attempts if a.is_correct)
        times = [a.time_spent_seconds for a in attempts if a.time_spent_seconds > 0]
        hints = sum(1 for a in attempts if a.used_hint)
        return {
            "total_attempts": len(attempts),
            "correct": correct,
            "accuracy": round(correct / len(attempts) * 100, 1),
            "avg_time": round(sum(times) / max(len(times), 1), 1),
            "hint_usage": hints,
        }

    # Per-course comparison
    courses = db.query(Course).all()
    course_comparison = []
    for course in courses:
        lesson_ids = [l.id for l in course.lessons]
        quiz_ids = [q.id for q in db.query(Quiz).filter(Quiz.lesson_id.in_(lesson_ids)).all()] if lesson_ids else []

        if not quiz_ids:
            continue

        ai_course = [a for a in ai_attempts if a.quiz_id in quiz_ids]
        non_ai_course = [a for a in non_ai_attempts if a.quiz_id in quiz_ids]

        if ai_course or non_ai_course:
            course_comparison.append({
                "course": course.title,
                "ai_accuracy": calc_stats(ai_course)["accuracy"],
                "non_ai_accuracy": calc_stats(non_ai_course)["accuracy"],
                "ai_avg_time": calc_stats(ai_course)["avg_time"],
                "non_ai_avg_time": calc_stats(non_ai_course)["avg_time"],
            })

    return {
        "ai_assisted": calc_stats(ai_attempts),
        "non_ai_assisted": calc_stats(non_ai_attempts),
        "course_comparison": course_comparison,
        "total_study_time": {
            "ai": sum(a.time_spent_seconds for a in ai_attempts),
            "non_ai": sum(a.time_spent_seconds for a in non_ai_attempts),
        },
    }


@app.get("/api/analytics/progress")
def get_progress_timeline(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get daily progress timeline."""
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
    ).order_by(QuizAttempt.created_at).all()

    daily = {}
    for a in attempts:
        day = a.created_at.strftime("%Y-%m-%d")
        if day not in daily:
            daily[day] = {"date": day, "attempts": 0, "correct": 0, "xp": 0}
        daily[day]["attempts"] += 1
        if a.is_correct:
            daily[day]["correct"] += 1
            daily[day]["xp"] += 20  # approximate

    return list(daily.values())


# ===========================================================
#  AI TOGGLE
# ===========================================================

@app.post("/api/settings/ai-mode")
def toggle_ai_mode(
    data: AIToggle,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user.ai_mode_enabled = data.enabled
    db.commit()
    return {"ai_mode_enabled": user.ai_mode_enabled}


# ===========================================================
#  AI CHAT (Simulated for demo)
# ===========================================================

@app.post("/api/chat", response_model=ChatResponse)
def chat_with_ai(
    data: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """AI Tutor chat endpoint. Uses built-in responses for demo."""
    # Save user message
    user_msg = ChatMessage(
        user_id=user.id,
        role="user",
        content=data.message,
        lesson_id=data.lesson_id,
    )
    db.add(user_msg)

    # Get lesson context if available
    lesson_context = ""
    if data.lesson_id:
        lesson = db.query(Lesson).filter(Lesson.id == data.lesson_id).first()
        if lesson:
            lesson_context = lesson.title

    # Generate a contextual response
    reply = generate_ai_response(data.message, lesson_context, db)

    # Save assistant message
    ai_msg = ChatMessage(
        user_id=user.id,
        role="assistant",
        content=reply,
        lesson_id=data.lesson_id,
    )
    db.add(ai_msg)
    db.commit()

    return ChatResponse(reply=reply, lesson_context=lesson_context)


@app.get("/api/chat/history")
def get_chat_history(
    lesson_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(ChatMessage).filter(ChatMessage.user_id == user.id)
    if lesson_id:
        query = query.filter(ChatMessage.lesson_id == lesson_id)
    messages = query.order_by(ChatMessage.created_at.desc()).limit(50).all()
    return [
        {
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in reversed(messages)
    ]


def generate_ai_response(message: str, lesson_context: str, db: Session) -> str:
    """Generate contextual AI responses for demo purposes."""
    msg_lower = message.lower().strip()

    # Greeting patterns
    if any(w in msg_lower for w in ["hello", "hi", "hey", "greetings"]):
        return (
            "Hello! 👋 I'm your AI learning assistant for Human-Computer Interaction. "
            "I can help you understand HCI concepts, answer questions about the course material, "
            "or provide hints on quiz questions. What would you like to learn about today?"
        )

    # Help patterns
    if any(w in msg_lower for w in ["help", "what can you do", "how do you work"]):
        return (
            "I can help you in several ways:\n\n"
            "📚 **Explain concepts** — Ask me about any HCI topic\n"
            "💡 **Give hints** — I can provide hints when you're stuck on quizzes\n"
            "🔍 **Deep dive** — I can elaborate on lesson content\n"
            "📝 **Review** — I can help you review key takeaways\n"
            "🎯 **Practice** — I can ask you practice questions\n\n"
            "Just type your question and I'll do my best to help!"
        )

    # HCI-specific responses
    if "fitts" in msg_lower or "fitt's" in msg_lower:
        return (
            "**Fitts's Law** is a fundamental principle in HCI! 🎯\n\n"
            "It predicts the time (T) required to move to a target:\n\n"
            "**T = a + b × log₂(D/W + 1)**\n\n"
            "Where:\n"
            "- **D** = distance to the target\n"
            "- **W** = width (size) of the target\n"
            "- **a, b** = constants from experimental data\n\n"
            "**Key implications for design:**\n"
            "1. Make frequently-used targets larger\n"
            "2. Place important elements closer to where the cursor typically is\n"
            "3. The edges and corners of a screen are effectively infinite in size (easy targets!)\n"
            "4. Pie menus are faster than linear menus (equal distance for all items)\n\n"
            "Would you like to explore how this applies to mobile design?"
        )

    if "gestalt" in msg_lower:
        return (
            "**Gestalt Principles** explain how we perceive visual patterns! 👁️\n\n"
            "The key principles are:\n\n"
            "1. **Proximity** — Close elements = related group\n"
            "2. **Similarity** — Similar-looking elements = related\n"
            "3. **Closure** — We complete incomplete shapes mentally\n"
            "4. **Continuity** — We follow smooth paths\n"
            "5. **Figure-Ground** — We separate focal objects from background\n"
            "6. **Common Fate** — Elements moving together = related\n\n"
            "These are incredibly useful for UI layout! For example, proximity is why we group "
            "related form fields together, and figure-ground is why modal dialogs dim the background.\n\n"
            "Which principle would you like to explore in more detail?"
        )

    if any(w in msg_lower for w in ["nielsen", "heuristic"]):
        return (
            "**Nielsen's 10 Usability Heuristics** are the gold standard for evaluating interfaces! 📋\n\n"
            "1. **Visibility of system status** — Keep users informed\n"
            "2. **Match with real world** — Use familiar language\n"
            "3. **User control & freedom** — Support undo/redo\n"
            "4. **Consistency** — Same action = same result\n"
            "5. **Error prevention** — Prevent mistakes before they happen\n"
            "6. **Recognition over recall** — Make options visible\n"
            "7. **Flexibility & efficiency** — Shortcuts for experts\n"
            "8. **Minimalist design** — No unnecessary information\n"
            "9. **Error recovery** — Help users fix mistakes\n"
            "10. **Help & documentation** — Accessible when needed\n\n"
            "These can be used for heuristic evaluation — having 3-5 experts review your interface. "
            "Want me to explain any specific heuristic in more detail?"
        )

    if any(w in msg_lower for w in ["accessibility", "a11y", "wcag"]):
        return (
            "**Web Accessibility (a11y)** is essential for inclusive design! ♿\n\n"
            "The WCAG 2.1 principles spell **POUR**:\n\n"
            "- **Perceivable** — Can users see/hear the content?\n"
            "- **Operable** — Can users interact with all controls?\n"
            "- **Understandable** — Can users comprehend the content?\n"
            "- **Robust** — Does it work with assistive technologies?\n\n"
            "**Quick wins for accessibility:**\n"
            "✅ Add alt text to images\n"
            "✅ Use semantic HTML\n"
            "✅ Ensure 4.5:1 color contrast\n"
            "✅ Make everything keyboard-navigable\n"
            "✅ Use focus indicators\n\n"
            "Remember: ~8% of males have some form of color blindness, so never use color alone to convey information!"
        )

    if any(w in msg_lower for w in ["color", "colour"]):
        return (
            "**Color in Interface Design** is both functional and emotional! 🎨\n\n"
            "**Color Psychology:**\n"
            "- 🔵 Blue → Trust, professionalism (Facebook, LinkedIn)\n"
            "- 🔴 Red → Urgency, errors, notifications\n"
            "- 🟢 Green → Success, confirmation\n"
            "- 🟡 Yellow/Orange → Warning, attention\n"
            "- 🟣 Purple → Creativity, luxury\n\n"
            "**Key rules:**\n"
            "1. Limit to 3-5 primary colors\n"
            "2. Use one accent color for CTAs\n"
            "3. WCAG AA: 4.5:1 contrast for text\n"
            "4. Never use color alone for information\n"
            "5. Test with color blindness simulators\n\n"
            "Would you like to know more about color harmony or accessibility?"
        )

    if any(w in msg_lower for w in ["miller", "working memory", "cognitive load"]):
        return (
            "Great question about cognitive science in HCI! 🧠\n\n"
            "**Miller's Law:** Humans can hold about **7 ± 2** items in working memory.\n\n"
            "**Cognitive Load Theory** identifies three types:\n"
            "1. **Intrinsic** — Complexity of the task itself (can't reduce)\n"
            "2. **Extraneous** — Added by poor design (should minimize!)\n"
            "3. **Germane** — Effort building understanding (desirable)\n\n"
            "**Design implications:**\n"
            "- Chunk information into groups of 3-5 items\n"
            "- Use progressive disclosure to manage complexity\n"
            "- Don't require users to remember information across screens\n"
            "- Provide visual cues to support memory\n"
            "- Use recognition (showing options) rather than recall (typing from memory)"
        )

    if any(w in msg_lower for w in ["usability", "testing", "evaluation"]):
        return (
            "**Usability Evaluation** is crucial for creating great interfaces! 🔍\n\n"
            "**Key methods:**\n\n"
            "1. **Think-Aloud Testing** — Users verbalize thoughts during tasks\n"
            "   - 5-8 users find ~85% of problems\n\n"
            "2. **Heuristic Evaluation** — Experts review against Nielsen's heuristics\n"
            "   - 3-5 evaluators is optimal\n\n"
            "3. **A/B Testing** — Compare two versions with real data\n"
            "   - Great for optimizing specific elements\n\n"
            "4. **SUS (System Usability Scale)** — Standardized questionnaire\n"
            "   - Average score is 68/100\n\n"
            "5. **Eye Tracking** — See where users actually look\n"
            "   - Reveals attention patterns\n\n"
            "Which method would you like to learn more about?"
        )

    # General/unknown topics - provide a helpful response
    if lesson_context:
        return (
            f"That's a great question about **{lesson_context}**! 🤔\n\n"
            "Let me help you think through this. In HCI, it's important to consider:\n\n"
            "1. **The user's perspective** — How would a real user experience this?\n"
            "2. **Design principles** — Which heuristics or guidelines apply?\n"
            "3. **Evidence-based design** — What does research tell us?\n\n"
            "Could you be more specific about what aspect you'd like to explore? "
            "I'm happy to provide detailed explanations, examples, or practice questions!"
        )

    return (
        "That's an interesting question! 🤔\n\n"
        "In the context of Human-Computer Interaction, I can help you with:\n\n"
        "- **Interface Design** — Layout, color, typography, navigation\n"
        "- **Interaction Techniques** — Input methods, feedback, direct manipulation\n"
        "- **Evaluation Methods** — Usability testing, heuristic analysis\n"
        "- **Human Factors** — Perception, cognition, ergonomics\n"
        "- **Accessibility** — Inclusive design, WCAG guidelines\n\n"
        "Try asking about a specific topic! For example:\n"
        "- \"Explain Fitts's Law\"\n"
        "- \"What are the Gestalt principles?\"\n"
        "- \"How do Nielsen's heuristics work?\"\n\n"
        "I'm here to support your learning journey! 📚"
    )


# ===========================================================
#  HEALTH / STARTUP
# ===========================================================

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "LearnSmart API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
