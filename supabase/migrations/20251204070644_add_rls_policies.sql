/*
  # Add RLS Policies for CFE Platform
  
  Allow public access for study content and questions
  Allow full access for user-specific tables (simplified for initial version)
*/

-- Study content is public
CREATE POLICY "study_content_select" ON study_content FOR SELECT USING (true);

-- Questions are public
CREATE POLICY "questions_select" ON questions FOR SELECT USING (true);

-- Flashcards - full access for now
CREATE POLICY "flashcards_all" ON flashcards FOR ALL USING (true) WITH CHECK (true);

-- Cases are public
CREATE POLICY "cases_select" ON cases FOR SELECT USING (true);

-- Mock exams are public
CREATE POLICY "mock_exams_select" ON mock_exams FOR SELECT USING (true);

-- User progress - full access
CREATE POLICY "user_progress_all" ON user_progress FOR ALL USING (true) WITH CHECK (true);

-- Achievements are public
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);

-- User achievements - full access
CREATE POLICY "user_achievements_all" ON user_achievements FOR ALL USING (true) WITH CHECK (true);

-- Gamification state - full access
CREATE POLICY "gamification_state_all" ON gamification_state FOR ALL USING (true) WITH CHECK (true);

-- User settings - full access
CREATE POLICY "user_settings_all" ON user_settings FOR ALL USING (true) WITH CHECK (true);

-- Study sessions - full access
CREATE POLICY "study_sessions_all" ON study_sessions FOR ALL USING (true) WITH CHECK (true);

-- Question attempts - full access
CREATE POLICY "question_attempts_all" ON question_attempts FOR ALL USING (true) WITH CHECK (true);

-- Mock exam attempts - full access
CREATE POLICY "mock_exam_attempts_all" ON mock_exam_attempts FOR ALL USING (true) WITH CHECK (true);
