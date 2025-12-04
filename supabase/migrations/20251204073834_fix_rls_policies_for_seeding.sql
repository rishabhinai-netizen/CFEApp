/*
  # Fix RLS Policies to Allow Seeding
  
  The current policies only allow SELECT operations. We need to add INSERT policies
  for seeding the database with initial data.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "questions_select" ON questions;
DROP POLICY IF EXISTS "study_content_select" ON study_content;
DROP POLICY IF EXISTS "cases_select" ON cases;
DROP POLICY IF EXISTS "mock_exams_select" ON mock_exams;
DROP POLICY IF EXISTS "achievements_select" ON achievements;

-- Questions - allow public read and insert
CREATE POLICY "questions_select" ON questions FOR SELECT USING (true);
CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (true);

-- Study content - allow public read and insert
CREATE POLICY "study_content_select" ON study_content FOR SELECT USING (true);
CREATE POLICY "study_content_insert" ON study_content FOR INSERT WITH CHECK (true);

-- Cases - allow public read and insert
CREATE POLICY "cases_select" ON cases FOR SELECT USING (true);
CREATE POLICY "cases_insert" ON cases FOR INSERT WITH CHECK (true);

-- Mock exams - allow public read and insert
CREATE POLICY "mock_exams_select" ON mock_exams FOR SELECT USING (true);
CREATE POLICY "mock_exams_insert" ON mock_exams FOR INSERT WITH CHECK (true);

-- Achievements - allow public read and insert
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_insert" ON achievements FOR INSERT WITH CHECK (true);
