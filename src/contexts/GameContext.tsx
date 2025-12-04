import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface GameState {
  xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  total_study_minutes: number;
  questions_answered: number;
  questions_correct: number;
  mocks_completed: number;
}

interface GameContextType {
  gameState: GameState;
  addXP: (amount: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  incrementQuestions: (correct: boolean) => Promise<void>;
  loading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    xp: 0,
    level: 1,
    streak_days: 0,
    longest_streak: 0,
    total_study_minutes: 0,
    questions_answered: 0,
    questions_correct: 0,
    mocks_completed: 0
  });
  const [loading, setLoading] = useState(true);

  const userId = 'demo-user';

  useEffect(() => {
    loadGameState();
  }, []);

  async function loadGameState() {
    try {
      const { data, error } = await supabase
        .from('gamification_state')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading game state:', error);
        return;
      }

      if (data) {
        setGameState({
          xp: data.xp || 0,
          level: data.level || 1,
          streak_days: data.streak_days || 0,
          longest_streak: data.longest_streak || 0,
          total_study_minutes: data.total_study_minutes || 0,
          questions_answered: data.questions_answered || 0,
          questions_correct: data.questions_correct || 0,
          mocks_completed: data.mocks_completed || 0
        });
      } else {
        await initializeGameState();
      }
    } catch (error) {
      console.error('Error in loadGameState:', error);
    } finally {
      setLoading(false);
    }
  }

  async function initializeGameState() {
    const { error } = await supabase
      .from('gamification_state')
      .insert({
        user_id: userId,
        xp: 0,
        level: 1,
        streak_days: 0,
        longest_streak: 0,
        total_study_minutes: 0,
        questions_answered: 0,
        questions_correct: 0,
        mocks_completed: 0
      });

    if (error) {
      console.error('Error initializing game state:', error);
    }
  }

  async function addXP(amount: number) {
    const newXP = gameState.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    setGameState(prev => ({ ...prev, xp: newXP, level: newLevel }));

    await supabase
      .from('gamification_state')
      .update({ xp: newXP, level: newLevel })
      .eq('user_id', userId);
  }

  async function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('gamification_state')
      .select('last_study_date, streak_days, longest_streak')
      .eq('user_id', userId)
      .single();

    if (!data) return;

    const lastDate = data.last_study_date;
    let newStreak = data.streak_days || 0;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const newLongest = Math.max(newStreak, data.longest_streak || 0);

      setGameState(prev => ({
        ...prev,
        streak_days: newStreak,
        longest_streak: newLongest
      }));

      await supabase
        .from('gamification_state')
        .update({
          last_study_date: today,
          streak_days: newStreak,
          longest_streak: newLongest
        })
        .eq('user_id', userId);
    }
  }

  async function incrementQuestions(correct: boolean) {
    const newAnswered = gameState.questions_answered + 1;
    const newCorrect = correct ? gameState.questions_correct + 1 : gameState.questions_correct;

    setGameState(prev => ({
      ...prev,
      questions_answered: newAnswered,
      questions_correct: newCorrect
    }));

    await supabase
      .from('gamification_state')
      .update({
        questions_answered: newAnswered,
        questions_correct: newCorrect
      })
      .eq('user_id', userId);

    await addXP(correct ? 10 : 5);
  }

  return (
    <GameContext.Provider
      value={{ gameState, addXP, updateStreak, incrementQuestions, loading }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
