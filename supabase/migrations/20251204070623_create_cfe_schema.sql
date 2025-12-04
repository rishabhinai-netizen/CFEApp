/*
  # CFE Exam Prep Platform - Complete Database Schema

  Creates all tables for the comprehensive CFE exam preparation platform
*/

-- Study Content Table
CREATE TABLE IF NOT EXISTS study_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id integer NOT NULL CHECK (section_id BETWEEN 1 AND 4),
  domain_id text NOT NULL,
  subtopic_id text NOT NULL,
  content_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  pdf_reference text,
  order_index integer DEFAULT 0,
  estimated_read_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id integer NOT NULL CHECK (section_id BETWEEN 1 AND 4),
  domain_id text NOT NULL,
  subtopic_id text,
  question_type text NOT NULL,
  question_text text NOT NULL,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty text DEFAULT 'medium',
  tags text[],
  pdf_reference text,
  times_attempted integer DEFAULT 0,
  times_correct integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Flashcards Table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  section_id integer NOT NULL CHECK (section_id BETWEEN 1 AND 4),
  domain_id text NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  difficulty text DEFAULT 'medium',
  next_review_date timestamptz DEFAULT now(),
  last_result text,
  review_count integer DEFAULT 0,
  ease_factor decimal DEFAULT 2.5,
  interval_days integer DEFAULT 1,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Cases Table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id integer NOT NULL CHECK (section_id BETWEEN 1 AND 4),
  domain_id text NOT NULL,
  title text NOT NULL,
  scenario_text text NOT NULL,
  difficulty text DEFAULT 'medium',
  questions jsonb NOT NULL,
  answers jsonb NOT NULL,
  key_takeaways text[],
  red_flags text[],
  estimated_time integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Mock Exams Table
CREATE TABLE IF NOT EXISTS mock_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  section_id integer,
  total_questions integer NOT NULL,
  timer_minutes integer NOT NULL,
  question_ids uuid[],
  is_grand_mock boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  section_id integer NOT NULL,
  domain_id text NOT NULL,
  subtopic_id text,
  correct integer DEFAULT 0,
  incorrect integer DEFAULT 0,
  accuracy decimal DEFAULT 0,
  last_attempt timestamptz,
  total_time_spent integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  category text NOT NULL,
  unlock_condition jsonb NOT NULL,
  icon text NOT NULL,
  xp_reward integer DEFAULT 100,
  rarity text DEFAULT 'common',
  created_at timestamptz DEFAULT now()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  achievement_id uuid REFERENCES achievements(id),
  unlocked boolean DEFAULT false,
  date_unlocked timestamptz,
  progress decimal DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Gamification State Table
CREATE TABLE IF NOT EXISTS gamification_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  streak_days integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_study_date date,
  total_study_minutes integer DEFAULT 0,
  questions_answered integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  mocks_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE,
  target_exam_date date,
  daily_goal_minutes integer DEFAULT 60,
  notifications_enabled boolean DEFAULT true,
  buddy_mode_enabled boolean DEFAULT true,
  theme text DEFAULT 'light',
  preferred_sections integer[],
  created_at timestamptz DEFAULT now()
);

-- Study Sessions Table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  session_type text NOT NULL,
  section_id integer,
  duration_minutes integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Question Attempts Table
CREATE TABLE IF NOT EXISTS question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  question_id uuid REFERENCES questions(id),
  session_id uuid REFERENCES study_sessions(id),
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent_seconds integer,
  attempted_at timestamptz DEFAULT now()
);

-- Mock Exam Attempts Table
CREATE TABLE IF NOT EXISTS mock_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  mock_exam_id uuid REFERENCES mock_exams(id),
  score integer NOT NULL,
  total_questions integer NOT NULL,
  time_taken_minutes integer NOT NULL,
  answers jsonb NOT NULL,
  section_scores jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE study_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_attempts ENABLE ROW LEVEL SECURITY;
