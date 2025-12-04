/*
  # Fix Mock Exams Table Schema
  
  Updates the mock_exams table to match the seeding code expectations:
  - Rename 'name' to 'title'
  - Add 'description' field
  - Rename 'total_questions' to 'question_count'
  - Rename 'timer_minutes' to 'time_limit_minutes'
  - Replace 'is_grand_mock' with 'exam_type'
  - Add 'passing_score' field
*/

-- Drop the old table and recreate with correct schema
DROP TABLE IF EXISTS mock_exams CASCADE;

CREATE TABLE mock_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  exam_type text NOT NULL,
  question_count integer NOT NULL,
  time_limit_minutes integer NOT NULL,
  passing_score integer DEFAULT 75,
  question_ids uuid[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "mock_exams_select" ON mock_exams FOR SELECT USING (true);
