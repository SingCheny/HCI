# 🎓 LearnSmart — AI 辅助智能学习平台

> **COMP5517 Human-Computer Interaction** 课程项目  
> 香港理工大学 | 2026 Spring

一个基于 AI 辅助的交互式 HCI（人机交互）知识学习平台，集成了游戏化激励机制、AI 智能辅导、以及 **AI 辅助 vs 传统学习** 的 A/B 对比分析功能。

---

## 📑 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [环境搭建与运行](#-环境搭建与运行)
- [使用指南](#-使用指南)
- [系统架构](#-系统架构)
- [数据库模型](#-数据库模型)
- [API 接口文档](#-api-接口文档)
- [前端页面说明](#-前端页面说明)
- [游戏化系统](#-游戏化系统)
- [AI 辅助 vs 传统对比](#-ai-辅助-vs-传统对比)
- [设计理念](#-设计理念)

---

## 🎯 项目概述

LearnSmart 是一个面向 HCI 课程学习的全栈 Web 应用，旨在探索 **AI 辅助** 对学习效果的影响。平台提供 6 个 HCI 核心课程模块、18 节课程、40+ 道测验题，并通过游戏化机制（XP、等级、成就、排行榜）提高学习动力。

### 核心亮点

- **AI 辅助模式**：开启后可获得 AI 提示、智能辅导
- **A/B 对比实验**：数据驱动的 AI 辅助 vs 传统学习效果对比
- **游戏化激励**：XP 经验值、等级系统、14 种成就徽章、排行榜
- **错题闯关**：游戏化的错题复习系统（HP、连击、倒计时）
- **闪卡复习**：间隔重复记忆闪卡，支持难度评估
- **学习计划**：可定制的学习计划，跟踪完成进度
- **专注计时**：番茄钟式专注计时，含详细统计分析
- **中英双语**：完整的国际化支持（中文/English）
- **精美 UI**：暗色玻璃拟态风格、流畅动画、响应式设计
- **HCI 课程内容**：涵盖完整的人机交互知识体系

---

## ✨ 功能特性

### 1. 用户认证

- 注册 / 登录系统
- Token 认证机制
- 用户数据持久化

### 2. 课程学习

- 6 大 HCI 核心课程模块
- 18 节详细课程（Markdown 富文本渲染）
- 阅读进度追踪
- 课程完成标记 & XP 奖励

### 3. 智能测验

- 40+ 道 HCI 知识测验题
- 三级难度系统（⭐/⭐⭐/⭐⭐⭐）
- 实时答题计时
- 答案解析 & 详细说明
- AI 提示功能（仅 AI 模式下可用）

### 4. 游戏化系统

- **XP 经验值**：完成课程/答题获得 XP
- **等级系统**：XP 积累自动升级（公式：`100 × n^1.5`）
- **14 种成就徽章**：涵盖学习、答题、连续登录等维度
- **排行榜**：全局 Top 20 排名

### 5. AI 辅助对比

- 一键切换 AI 辅助模式
- AI 模式提供答题提示
- 非 AI 模式正确答题获得 **1.5 倍 XP 加成**
- 详细的对比分析面板（准确率、速度、XP 等维度）
- 多种图表可视化（柱状图、雷达图、饼图）

### 6. AI 智能辅导

- AI Tutor 聊天界面
- 按课程上下文提问
- 智能话题检测 & 回复生成
- 预设常用问题快捷入口
- 聊天历史记录

### 7. 数据仪表盘

- 个人学习概览
- 课程进度可视化
- 学习统计数据
- 等级进度条
- 闪卡复习小组件
- 错题集小组件
- 学习计划小组件
- 专注分析小组件（含每周柱状图）

### 8. 闪卡复习系统

- 创建自定义闪卡
- 间隔重复算法（SM-2 变体）
- 正面/反面翻转动画
- 难度评估（简单/中等/困难）
- 复习到期提醒

### 9. 学习计划

- 创建个人学习计划
- 添加/管理待办事项
- 进度追踪与可视化
- 计划完成标记

### 10. 专注计时器

- 番茄钟式计时（15/25/45/60 分钟预设）
- 圆环进度动画
- 完成专注获得 XP 奖励
- 详细统计分析：
  - 每周专注柱状图
  - 连续天数（Streak）
  - 时长偏好分布
  - 平均专注时长
- 历史记录列表

### 11. 错题闯关系统

- 游戏化的错题复习挑战
- 3 条生命（HP）机制
- 连击（Combo）加成
- 10 秒倒计时限时答题
- 超时自动判错
- 闯关大厅 → 战斗 → 战果展示
- 通关/失败结算页面

### 12. 国际化（i18n）

- 中文/English 一键切换
- 所有页面完整翻译
- 侧边栏语言切换开关

---

## 🛠 技术栈

### 后端（Backend）

| 技术             | 版本     | 用途            |
| -------------- | ------ | ------------- |
| **Python**     | 3.11   | 核心语言          |
| **FastAPI**    | 0.135+ | Web 框架（高性能异步） |
| **SQLAlchemy** | 2.0+   | ORM 数据库映射     |
| **SQLite**     | -      | 轻量级数据库        |
| **Pydantic**   | 2.12+  | 数据验证 & 序列化    |
| **Uvicorn**    | 0.42+  | ASGI 服务器      |
| **Conda**      | -      | Python 环境隔离   |

### 前端（Frontend）

| 技术                 | 版本    | 用途           |
| ------------------ | ----- | ------------ |
| **React**          | 19.2  | UI 框架        |
| **TypeScript**     | 5.9   | 类型安全语言       |
| **Vite**           | 8.0   | 构建工具 & 开发服务器 |
| **Tailwind CSS**   | 4.2   | 原子化 CSS 框架   |
| **Framer Motion**  | 12.38 | 动画库          |
| **Recharts**       | 3.8   | 数据可视化图表      |
| **React Router**   | 7.13  | 前端路由         |
| **Axios**          | 1.13  | HTTP 请求库     |
| **React Markdown** | 10.1  | Markdown 渲染  |
| **Lucide React**   | 0.577 | 图标库          |

### 开发工具

| 工具         | 用途          |
| ---------- | ----------- |
| **ESLint** | 代码规范检查      |
| **Conda**  | Python 环境管理 |
| **npm**    | Node.js 包管理 |

---

## 📁 项目结构

```
hci_proj/
├── README.md                        # 项目说明文档
│
├── backend/                         # 后端服务
│   ├── database.py                  # 数据库连接 & Session 管理
│   ├── models.py                    # SQLAlchemy ORM 数据模型（10 个表）
│   ├── schemas.py                   # Pydantic 请求/响应模式
│   ├── seed_data.py                 # 课程/测验/成就种子数据
│   ├── main.py                      # FastAPI 应用入口 & 全部 API 路由
│   ├── requirements.txt             # Python 依赖清单
│   └── learn_smart.db               # SQLite 数据库文件（自动生成）
│
│   # ORM 模型包含：User, Course, Lesson, Quiz, QuizAttempt,
│   # UserProgress, Achievement, UserAchievement, StudySession,
│   # ChatMessage, Flashcard, StudyPlan, StudyPlanItem, FocusSession
│
└── frontend/                        # 前端应用
    ├── index.html                   # HTML 入口
    ├── package.json                 # npm 依赖 & 脚本
    ├── vite.config.ts               # Vite 构建配置（含 API 代理）
    ├── tsconfig.json                # TypeScript 配置
    ├── tsconfig.app.json            # 应用 TS 配置
    ├── tsconfig.node.json           # Node TS 配置
    ├── eslint.config.js             # ESLint 配置
    │
    └── src/
        ├── main.tsx                 # React 入口
        ├── App.tsx                  # 路由 & 全局布局
        ├── index.css                # 全局样式 & 主题（玻璃拟态 + 动画）
        │
        ├── types/
        │   └── index.ts             # TypeScript 类型定义（12 个接口）
        │
        ├── services/
        │   └── api.ts               # Axios 实例 & Token 拦截器
        │
        ├── hooks/
        │   └── useAuth.tsx          # 认证 Context & Hook
        │
        ├── i18n/
        │   ├── index.tsx             # i18n Context & Provider & Hook
        │   └── translations.ts      # 中英双语翻译词典（250+ 键值对）
        │
        ├── components/
        │   ├── Layout.tsx           # 侧边栏导航布局（可折叠 + 粒子背景）
        │   └── Toast.tsx            # 全局通知系统（成功/错误/成就）
        │
        └── pages/
            ├── LoginPage.tsx        # 登录 / 注册页
            ├── DashboardPage.tsx    # 学习仪表盘（含 4 个功能小组件）
            ├── CoursesPage.tsx      # 课程列表
            ├── LessonPage.tsx       # 课程学习 & 测验
            ├── AchievementsPage.tsx # 成就徽章展示
            ├── ComparisonPage.tsx   # AI vs 传统对比分析
            ├── ChatPage.tsx         # AI 辅导聊天
            ├── FlashcardsPage.tsx   # 闪卡复习
            ├── StudyPlanPage.tsx    # 学习计划
            ├── FocusTimerPage.tsx   # 专注计时 & 统计分析
            └── WrongAnswersPage.tsx # 错题闯关（游戏化挑战）
```

---

## 🚀 环境搭建与运行

### 前置要求

- **Anaconda / Miniconda**（用于 Python 环境隔离）
- **Node.js** ≥ 18（用于前端构建）
- **npm** ≥ 9

### 第一步：创建 Conda 环境

```bash
conda create -n hci_learn python=3.11 -y
conda activate hci_learn
```

### 第二步：安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

`requirements.txt` 包含：

```
fastapi>=0.100.0
uvicorn>=0.23.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
aiosqlite>=0.19.0
```

### 第三步：启动后端服务器

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

后端将运行在 `http://localhost:8000`，首次启动时会自动：

- 创建 SQLite 数据库表
- 填充种子数据（6 门课程、18 节课、40+ 测验、14 个成就）
- 创建演示账户 `demo / demo123`
- 填充演示数据（学习计划、闪卡、专注记录、错题记录）

### 第四步：安装前端依赖

```bash
cd frontend
npm install
```

### 第五步：启动前端开发服务器

```bash
cd frontend
npm run dev
```

前端将运行在 `http://localhost:5173`，自动代理 `/api` 请求到后端。

### 第六步：打开浏览器

访问 **http://localhost:5173**，使用演示账户登录：

- **用户名**：`demo`
- **密码**：`demo123`

---

## 🌐 外网部署（ngrok）

如需让不在同一局域网的成员访问：

### 1. 安装 ngrok

从 https://ngrok.com/download 下载并解压。

### 2. 认证 ngrok

注册账号后获取 authtoken，执行：

```bash
ngrok config add-authtoken <your-token>
```

### 3. 构建前端

```bash
cd frontend
npx vite build
```

### 4. 启动后端

后端会自动 serve 前端打包产物（`frontend/dist`）：

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. 启动 ngrok 隧道

```bash
ngrok http 8000
```

ngrok 会输出一个公网 URL（如 `https://xxx.ngrok-free.dev`），分享给组员即可访问。

> **注意**：免费版每次重启 URL 会变；不要关闭运行 ngrok 和后端的终端窗口。

---

## 📖 使用指南

### 登录 / 注册

1. 打开 `http://localhost:5173`，进入登录页面
2. 使用演示账户 `demo / demo123` 登录，或注册新账户
3. 登录后自动跳转到仪表盘

### 学习课程

1. 点击侧边栏 **"Courses"** 进入课程列表
2. 选择一门课程，点击具体课节
3. 阅读 Markdown 格式的课程内容
4. 点击 **"Complete & Start Quiz"** 标记完成并进入测验

### 参加测验

1. 阅读题目，选择答案
2. 如果 AI 模式开启，可以点击 **"Show AI Hint"** 查看提示
3. 点击 **"Submit Answer"** 提交
4. 查看答案解析，获得 XP
5. 完成所有题目后查看总分

### 切换 AI 模式

1. 侧边栏底部有 **"AI Mode"** 开关
2. **开启**：测验中可看到 AI 提示，获得标准 XP
3. **关闭**：无 AI 提示，但正确答案获得 **1.5 倍 XP 加成**

### 查看成就

1. 点击侧边栏 **"Achievements"**
2. 查看已获得和未解锁的成就
3. 满足条件时自动弹出成就通知

### AI vs 传统对比

1. 点击侧边栏 **"AI vs Standard"**
2. 查看两种模式下的准确率、速度、答题量对比
3. 多种图表（柱状图、雷达图、饼图）可视化分析

### AI 辅导聊天

1. 点击侧边栏 **"AI Tutor"**
2. 可选择课程上下文
3. 输入问题或点击预设问题
4. AI 会根据 HCI 知识生成回复

---

## 🏗 系统架构

```
┌──────────────────────────────────────────────────────┐
│                    浏览器（Browser）                     │
│                                                      │
│  React 19 + TypeScript + Tailwind CSS + Framer Motion │
│  ┌──────────┬──────────┬──────────┬─────────────────┐ │
│  │ Dashboard│ Courses  │  Quiz    │ AI Chat         │ │
│  │ Page     │ & Lesson │  System  │ Interface       │ │
│  └──────────┴──────────┴──────────┴─────────────────┘ │
│              │ Axios HTTP (Token Auth)                 │
└──────────────┼────────────────────────────────────────┘
               │ Vite Dev Proxy /api → :8000
┌──────────────┼────────────────────────────────────────┐
│              ▼                                        │
│         FastAPI (Port 8000)                           │
│  ┌──────────┬──────────┬──────────┬─────────────────┐ │
│  │   Auth   │  Course  │  Quiz    │  Gamification   │ │
│  │  Routes  │  Routes  │  Routes  │  & Analytics    │ │
│  └──────────┴──────────┴──────────┴─────────────────┘ │
│              │ SQLAlchemy ORM                         │
│              ▼                                        │
│         SQLite Database (learn_smart.db)              │
│  ┌───────────────────────────────────────────────────┐│
│  │ Users │ Courses │ Lessons │ Quizzes │ Achievements││
│  │ UserProgress │ QuizAttempts │ ChatMessages        ││
│  └───────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### 数据流

```
用户操作 → React 组件 → Axios API 调用 → Vite Proxy
→ FastAPI 路由 → SQLAlchemy ORM → SQLite
→ Pydantic 响应 → JSON → React 状态更新 → UI 渲染
```

---

## 🗄 数据库模型

项目共包含 **14 个数据模型**：

| 模型                  | 说明   | 关键字段                                                                    |
| ------------------- | ---- | ----------------------------------------------------------------------- |
| **User**            | 用户   | username, email, level, total_xp, streak_days, ai_mode_enabled          |
| **Course**          | 课程   | title, description, icon, color, order_index                            |
| **Lesson**          | 课节   | title, content（Markdown）, xp_reward, estimated_minutes                  |
| **Quiz**            | 测验题  | question, options（JSON 数组）, correct_answer, ai_hint, difficulty         |
| **QuizAttempt**     | 答题记录 | selected_answer, is_correct, ai_assisted, time_spent_seconds, used_hint |
| **UserProgress**    | 学习进度 | lesson_id, completed, score, ai_assisted                                |
| **Achievement**     | 成就定义 | name, description, icon, badge_color, condition_type, condition_value   |
| **UserAchievement** | 用户成就 | user_id, achievement_id, earned_at                                      |
| **StudySession**    | 学习会话 | duration_seconds, questions_attempted, xp_earned                        |
| **ChatMessage**     | 聊天记录 | role（user/assistant）, content, lesson_id                                |
| **Flashcard**       | 闪卡   | front, back, difficulty, review_count, next_review                      |
| **StudyPlan**       | 学习计划 | title, description, completed                                           |
| **StudyPlanItem**   | 计划项  | content, completed, order_index                                         |
| **FocusSession**    | 专注记录 | duration_minutes, completed, xp_earned, started_at, ended_at            |

### 关系图

```
User ──1:N──▶ UserProgress
User ──1:N──▶ QuizAttempt
User ──1:N──▶ UserAchievement ◀──N:1── Achievement
User ──1:N──▶ StudySession
User ──1:N──▶ ChatMessage

Course ──1:N──▶ Lesson ──1:N──▶ Quiz
                Lesson ──1:N──▶ Quiz ──1:N──▶ QuizAttempt

User ──1:N──▶ Flashcard
User ──1:N──▶ StudyPlan ──1:N──▶ StudyPlanItem
User ──1:N──▶ FocusSession
```

---

## 📡 API 接口文档

### 认证接口

| 方法   | 路径                   | 说明       | 请求体                                           |
| ---- | -------------------- | -------- | --------------------------------------------- |
| POST | `/api/auth/register` | 用户注册     | `{ username, email, password, display_name }` |
| POST | `/api/auth/login`    | 用户登录     | `{ username, password }`                      |
| GET  | `/api/auth/me`       | 获取当前用户信息 | —                                             |

### 课程接口

| 方法   | 路径                           | 说明                   |
| ---- | ---------------------------- | -------------------- |
| GET  | `/api/courses`               | 获取所有课程（含课节列表 & 完成状态） |
| GET  | `/api/lessons/{id}`          | 获取课节详细内容（Markdown）   |
| POST | `/api/lessons/{id}/complete` | 标记课节完成，获得 XP         |

### 测验接口

| 方法   | 路径                          | 说明         | 请求体                                                           |
| ---- | --------------------------- | ---------- | ------------------------------------------------------------- |
| GET  | `/api/lessons/{id}/quizzes` | 获取课节的所有测验题 | —                                                             |
| POST | `/api/quizzes/submit`       | 提交答案       | `{ quiz_id, selected_answer, time_spent_seconds, used_hint }` |

### 游戏化接口

| 方法  | 路径                  | 说明                |
| --- | ------------------- | ----------------- |
| GET | `/api/achievements` | 获取所有成就及解锁状态       |
| GET | `/api/leaderboard`  | 获取 XP 排行榜（Top 20） |
| GET | `/api/user/stats`   | 获取用户详细学习统计        |

### 数据分析接口

| 方法  | 路径                          | 说明                |
| --- | --------------------------- | ----------------- |
| GET | `/api/analytics/comparison` | AI 模式 vs 传统模式对比数据 |
| GET | `/api/analytics/progress`   | 每日学习进度时间线         |

### AI 辅导接口

| 方法     | 路径                                      | 说明        | 请求体                       |
| ------ | --------------------------------------- | --------- | ------------------------- |
| POST   | `/api/chat` | 向 AI 发送消息 | `{ message, lesson_id? }` |
| GET    | `/api/chat/history`                     | 获取聊天历史    | 查询参数 `lesson_id`          |
| DELETE | `/api/chat/history`                     | 清除聊天历史    | —                         |
| POST   | `/api/settings/ai-mode`                 | 切换 AI 模式  | `{ enabled }`             |

### 闪卡接口

| 方法     | 路径                  | 说明        |
| ------ | ------------------- | --------- |
| GET    | `/api/flashcards`   | 获取用户所有闪卡  |
| POST   | `/api/flashcards`   | 创建新闪卡     |
| GET    | `/api/flashcards/due` | 获取待复习闪卡 |
| POST   | `/api/flashcards/{id}/review` | 提交复习结果 |
| DELETE | `/api/flashcards/{id}` | 删除闪卡    |

### 学习计划接口

| 方法     | 路径                            | 说明       |
| ------ | ----------------------------- | -------- |
| GET    | `/api/study-plans`            | 获取所有学习计划 |
| POST   | `/api/study-plans`            | 创建学习计划   |
| POST   | `/api/study-plans/{id}/items` | 添加计划项    |
| PATCH  | `/api/study-plans/{id}/items/{item_id}` | 更新计划项 |
| DELETE | `/api/study-plans/{id}`       | 删除学习计划   |

### 专注计时接口

| 方法   | 路径                                | 说明         |
| ---- | --------------------------------- | ---------- |
| GET  | `/api/focus-sessions`             | 获取专注记录列表   |
| POST | `/api/focus-sessions`             | 创建新专注会话    |
| POST | `/api/focus-sessions/{id}/complete` | 完成专注会话   |
| GET  | `/api/focus-sessions/stats`       | 获取专注统计（含周报）|

### 错题集接口

| 方法   | 路径                               | 说明       |
| ---- | -------------------------------- | -------- |
| GET  | `/api/wrong-answers`             | 获取所有错题   |
| POST | `/api/wrong-answers/{id}/retry`  | 重试错题     |

### 仪表盘接口

| 方法  | 路径                      | 说明                      |
| --- | ----------------------- | ----------------------- |
| GET | `/api/dashboard/widgets` | 聚合仪表盘数据（闪卡/错题/计划/专注） |

### 认证方式

所有需要认证的接口通过 URL 查询参数传递 Token：

```
GET /api/courses?token=<access_token>
```

---

## 🖥 前端页面说明

### 1. 登录页（LoginPage）

- 登录 / 注册表单切换
- 渐变动画背景
- 密码可见性切换
- 演示账户提示信息
- 错误反馈提示

### 2. 仪表盘（DashboardPage）

- 欢迎横幅 & 用户等级
- 4 个统计卡片（总 XP、连续天数、完成课节、测验准确率）
- 等级进度条（渐变动画）
- 课程进度概览
- AI 模式状态显示
- 4 个功能小组件：闪卡复习、错题集、学习计划、专注分析
- 专注分析含每周柱状图

### 3. 课程列表（CoursesPage）

- 课程卡片网格布局
- 每门课程独立配色
- 课节列表 & 完成状态✓
- XP 奖励 & 预计时间显示
- 进度百分比条

### 4. 课程学习（LessonPage）— **最复杂的页面**

- **三阶段流程**：阅读 → 测验 → 完成
- Markdown 内容渲染
- 测验进度条 & 难度星级
- 选项动画（悬浮/点击/正确/错误）
- AI 提示折叠面板
- 答案解析展示
- 完成页面：XP 统计、测验得分、跳转按钮

### 5. 成就展示（AchievementsPage）

- 总进度条
- 已获得成就（彩色徽章 + 日期）
- 未解锁成就（灰色 + 锁图标）
- 7 种徽章配色（gold/silver/bronze/purple/blue/green/red）

### 6. AI vs 传统对比（ComparisonPage）

- 4 个对比统计卡片
- 柱状图：准确率 / 速度 / 题量 / 正确数
- 雷达图：多维能力对比
- 饼图：答题量分布
- 关键洞察文字分析

### 7. AI 辅导聊天（ChatPage）

- 聊天消息列表（用户 / AI 气泡）
- 课程上下文选择器
- 预设快捷问题按钮
- 发送中加载动画（旋转图标 + 跳动圆点）
- 清除对话历史按钮
- 空状态引导

### 8. 闪卡复习（FlashcardsPage）

- 卡片翻转动画（正面 ↔ 反面）
- 难度评估（简单/中等/困难）
- 间隔重复调度
- 创建新闪卡表单
- 到期/总数/已掌握统计

### 9. 学习计划（StudyPlanPage）

- 创建学习计划
- 添加待办项
- 复选框标记完成
- 进度条可视化
- 删除计划

### 10. 专注计时（FocusTimerPage）

- 圆环倒计时动画
- 15/25/45/60 分钟预设
- 开始/暂停/重置控制
- 4 个统计卡片（今日/累计/次数/连续天数）
- **每周柱状图**：7 日专注时间分布
- **时长偏好分布**：各预设时长使用频率
- 平均时长 & XP 总览
- 最近记录列表

### 11. 错题闯关（WrongAnswersPage）

- **闯关大厅**：规则说明（HP/连击/XP/10秒限时）、错题数量
- **战斗界面**：HP 心形、连击火焰、XP 计数、倒计时
- **10 秒限时**：每题 10 秒倒计时，超时自动判错扣 HP
- **答题反馈**：正确/错误/超时动画、解析展开
- **战果页面**：击败数、最佳连击、XP、关卡进度格
- 通关庆祝 / 失败重试

---

## 🎮 游戏化系统

### XP 经验值

| 行为            | XP 奖励             |
| ------------- | ----------------- |
| 完成课节          | 50-60 XP          |
| 测验正确（AI 模式）   | 基础 XP             |
| 测验正确（非 AI 模式） | 基础 XP × **1.5 倍** |
| 获得成就          | 100-500 XP        |
| 完成专注计时        | 等于分钟数的 XP（如 25 分钟 = 25 XP） |
| 错题闯关答对        | 5 XP / 题           |

### 等级系统

升级所需 XP 公式：`XP = 100 × Level^1.5`

| 等级      | 所需 XP |
| ------- | ----- |
| 1 → 2   | 100   |
| 2 → 3   | 283   |
| 3 → 4   | 520   |
| 5 → 6   | 1,118 |
| 10 → 11 | 3,162 |

### 14 种成就

| 成就                   | 条件             | 徽章颜色 | XP 奖励 |
| -------------------- | -------------- | ---- | ----- |
| 🎯 First Steps       | 完成 1 节课        | 绿色   | 100   |
| 📚 Knowledge Seeker  | 完成 5 节课        | 蓝色   | 200   |
| 🎓 Scholar           | 完成 10 节课       | 紫色   | 500   |
| 👑 HCI Master        | 完成 18 节课（全部）   | 金色   | 1000  |
| ✅ Quiz Rookie        | 答对 5 题         | 绿色   | 100   |
| 🏆 Quiz Pro          | 答对 20 题        | 蓝色   | 300   |
| ⭐ Perfect Score      | 单课节全部答对        | 金色   | 200   |
| 🔥 Streak Starter    | 连续 3 天         | 橙色   | 150   |
| 💪 Dedicated Learner | 连续 7 天         | 红色   | 300   |
| ⚡ XP Hunter          | 累积 500 XP      | 黄色   | 100   |
| 💎 XP Champion       | 累积 2000 XP     | 紫色   | 300   |
| 🤖 AI Explorer       | AI 模式答对 10 题   | 蓝色   | 200   |
| 🧠 Self Reliant      | 非 AI 模式答对 10 题 | 绿色   | 250   |
| ⏱ Speed Learner      | 10 秒内答对        | 银色   | 150   |

---

## ⚖ AI 辅助 vs 传统对比

这是项目的核心 HCI 研究功能，通过数据追踪分析两种学习模式的差异：

### AI 辅助模式（AI Mode ON）

- ✅ 测验中可显示 AI 提示
- ✅ AI Tutor 聊天完整可用
- ❌ XP 为标准值

### 传统模式（AI Mode OFF）

- ❌ 无 AI 提示
- ❌ AI Tutor 不可用
- ✅ 正确答案获得 **1.5 倍 XP 加成**

### 对比维度

| 维度        | 说明           |
| --------- | ------------ |
| **准确率**   | 两种模式下的正确率对比  |
| **答题速度**  | 平均每题耗时       |
| **答题量**   | 各模式下的总答题次数   |
| **提示使用**  | AI 模式下提示使用次数 |
| **按课程对比** | 每门课程的模式对比    |
| **总学习时间** | 两种模式的累计学习时间  |

### 可视化图表

- **柱状图**（Bar Chart）：多维指标并排对比
- **雷达图**（Radar Chart）：综合能力画像
- **饼图**（Pie Chart）：答题量分布比例
- **洞察面板**（Insights）：自动生成文字分析

---

## 🎨 设计理念

### 视觉风格

- **暗色主题**：深蓝灰底色（`#0a0a1a`），减少视觉疲劳
- **玻璃拟态**（Glassmorphism）：半透明毛玻璃卡片效果
- **渐变色彩**：紫 → 粉渐变强调色（Primary: Indigo / Accent: Pink）
- **发光效果**（Glow）：按钮 & 元素的柔和辉光

### 交互设计

- **Framer Motion 动效**：页面切换、卡片悬浮、元素出现
- **流畅过渡**：状态切换、侧边栏折叠、测验阶段
- **微交互**：按钮点击缩放、进度条动画、XP 数字跳动
- **浮动粒子**：背景装饰性粒子漂浮动画

### HCI 原则应用

- **可见性**：AI 模式开关始终可见并有明确状态指示
- **反馈**：每个操作都有即时视觉/动画反馈
- **一致性**：统一的卡片样式、配色方案、交互模式
- **容错性**：登录错误提示、空状态引导
- **可学习性**：渐进式信息展示、预设问题引导

### 配色方案

| 颜色               | 色值        | 用途        |
| ---------------- | --------- | --------- |
| Primary (Indigo) | `#6366f1` | 主色调、按钮、导航 |
| Accent (Pink)    | `#ec4899` | 强调色、渐变终点  |
| Success (Green)  | `#10b981` | 正确答案、完成状态 |
| Warning (Amber)  | `#f59e0b` | 警告、提示     |
| Danger (Red)     | `#ef4444` | 错误答案、删除   |

---

## 📝 课程内容

### 课程模块一览

| #   | 课程                               | 课节数 | 总 XP | 描述              |
| --- | -------------------------------- | --- | ---- | --------------- |
| 1   | Introduction to HCI              | 3   | ~160 | HCI 基础、历史、人因工程  |
| 2   | Visual Perception & Design       | 3   | ~165 | 格式塔原理、色彩理论、排版   |
| 3   | Interaction Techniques           | 3   | ~160 | 直接操纵、输入方式、反馈    |
| 4   | User Interface Design            | 3   | ~165 | UI 原则、布局、设计模式   |
| 5   | Usability Evaluation             | 3   | ~160 | 启发式评估、用户测试、可用性  |
| 6   | Accessibility & Inclusive Design | 3   | ~160 | 无障碍设计、WCAG、通用设计 |

每节课包含：

- 完整的 Markdown 教学内容
- 2-3 道配套测验题
- AI 提示信息
- 详细答案解析

---

## ⚠ 注意事项

1. **数据库**：使用 SQLite，数据存储在 `backend/learn_smart.db`，删除此文件可重置所有数据
2. **Token 认证**：采用内存存储，重启后端服务后需要重新登录
3. **AI 聊天**：当前为模拟 AI（规则匹配 + 预设回复），可接入真实 LLM API
4. **并发**：SQLite 适用于演示/开发环境，生产环境建议更换为 PostgreSQL
5. **环境隔离**：务必使用 `conda activate hci_learn` 激活环境后再运行后端

---

## 📄 License

本项目为 COMP5517 课程项目，仅用于学术目的。

---

*Built with ❤️ for COMP5517 Human-Computer Interaction @ PolyU*
