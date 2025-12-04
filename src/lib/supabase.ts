import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      study_content: {
        Row: {
          id: string;
          section_id: number;
          domain_id: string;
          subtopic_id: string;
          content_type: string;
          title: string;
          content: string;
          pdf_reference: string | null;
          order_index: number;
          estimated_read_time: number;
          created_at: string;
        };
      };
      questions: {
        Row: {
          id: string;
          section_id: number;
          domain_id: string;
          subtopic_id: string | null;
          question_type: string;
          question_text: string;
          option_a: string | null;
          option_b: string | null;
          option_c: string | null;
          option_d: string | null;
          correct_answer: string;
          explanation: string;
          difficulty: string;
          tags: string[] | null;
          pdf_reference: string | null;
          times_attempted: number;
          times_correct: number;
          created_at: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string | null;
          section_id: number;
          domain_id: string;
          front: string;
          back: string;
          difficulty: string;
          next_review_date: string;
          last_result: string | null;
          review_count: number;
          ease_factor: number;
          interval_days: number;
          is_custom: boolean;
          created_at: string;
        };
      };
      cases: {
        Row: {
          id: string;
          section_id: number;
          domain_id: string;
          title: string;
          scenario_text: string;
          difficulty: string;
          questions: any;
          answers: any;
          key_takeaways: string[];
          red_flags: string[];
          estimated_time: number;
          created_at: string;
        };
      };
      gamification_state: {
        Row: {
          id: string;
          user_id: string;
          xp: number;
          level: number;
          streak_days: number;
          longest_streak: number;
          last_study_date: string | null;
          total_study_minutes: number;
          questions_answered: number;
          questions_correct: number;
          mocks_completed: number;
          created_at: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string | null;
          section_id: number;
          domain_id: string;
          subtopic_id: string | null;
          correct: number;
          incorrect: number;
          accuracy: number;
          last_attempt: string | null;
          total_time_spent: number;
          created_at: string;
        };
      };
    };
  };
};
