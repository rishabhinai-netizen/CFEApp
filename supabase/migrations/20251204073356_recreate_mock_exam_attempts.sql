/*
  # Recreate Mock Exam Attempts Table
  
  Recreates the mock_exam_attempts table after mock_exams schema change
*/

-- Recreate the table with proper foreign key
DROP TABLE IF EXISTS mock_exam_attempts CASCADE;

CREATE TABLE mock_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  mock_exam_id uuid REFERENCES mock_exams(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  time_taken_minutes integer NOT NULL,
  answers jsonb NOT NULL,
  section_scores jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mock_exam_attempts ENABLE ROW LEVEL SECURITY;

-- Add policy for full access
CREATE POLICY "mock_exam_attempts_all" ON mock_exam_attempts FOR ALL USING (true) WITH CHECK (true);
