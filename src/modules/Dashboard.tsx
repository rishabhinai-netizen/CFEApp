import { useEffect, useState } from 'react';
import { TrendingUp, Target, Calendar, Zap, Brain, Award } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface SectionProgress {
  section_id: number;
  accuracy: number;
  questions_attempted: number;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { gameState, updateStreak } = useGame();
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [todayTasks] = useState([
    { id: 1, task: 'Complete 20 practice questions', progress: 65, target: 20 },
    { id: 2, task: 'Review 15 flashcards', progress: 40, target: 15 },
    { id: 3, task: 'Study for 30 minutes', progress: 20, target: 30 }
  ]);

  useEffect(() => {
    updateStreak();
    loadSectionProgress();
  }, []);

  async function loadSectionProgress() {
    const { data, error } = await supabase
      .from('user_progress')
      .select('section_id, correct, incorrect')
      .eq('user_id', 'demo-user');

    if (error) {
      console.error('Error loading section progress:', error);
      return;
    }

    if (data) {
      const sections = [1, 2, 3, 4].map(section_id => {
        const sectionData = data.filter(d => d.section_id === section_id);
        const totalCorrect = sectionData.reduce((sum, d) => sum + d.correct, 0);
        const totalIncorrect = sectionData.reduce((sum, d) => sum + d.incorrect, 0);
        const total = totalCorrect + totalIncorrect;
        const accuracy = total > 0 ? (totalCorrect / total) * 100 : 0;

        return {
          section_id,
          accuracy: Math.round(accuracy),
          questions_attempted: total
        };
      });

      setSectionProgress(sections);
    }
  }

  const sectionNames = [
    'Financial Transactions & Fraud Schemes',
    'Law',
    'Investigation',
    'Fraud Prevention & Deterrence'
  ];

  const overallReadiness = Math.round(
    sectionProgress.reduce((sum, s) => sum + s.accuracy, 0) / 4 || 0
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Let's continue your CFE exam preparation journey</p>
      </div>

      {/* Readiness Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Exam Readiness</h2>
            <Target className="w-8 h-8" />
          </div>
          <div className="flex items-end">
            <div className="text-6xl font-bold">{overallReadiness}%</div>
            <div className="ml-4 mb-2">
              <div className="text-sm opacity-80">Overall Progress</div>
              <div className="text-xs opacity-60">Based on all sections</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Study Streak</h3>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{gameState.streak_days} days</div>
          <div className="text-sm text-gray-500 mt-1">Longest: {gameState.longest_streak}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Questions</h3>
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{gameState.questions_answered}</div>
          <div className="text-sm text-gray-500 mt-1">{gameState.questions_correct} correct</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section Progress */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Section Progress</h2>
            <div className="space-y-4">
              {sectionProgress.map((section, idx) => (
                <div key={section.section_id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">Section {section.section_id}</div>
                      <div className="text-sm text-gray-500">{sectionNames[idx]}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{section.accuracy}%</div>
                      <div className="text-xs text-gray-500">{section.questions_attempted} questions</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                      style={{ width: `${section.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('practice')}
              className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <Brain className="w-8 h-8 mb-2" />
              <div className="font-bold text-lg">Start Practice</div>
              <div className="text-sm opacity-80">Answer questions</div>
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <Award className="w-8 h-8 mb-2" />
              <div className="font-bold text-lg">Flashcards</div>
              <div className="text-sm opacity-80">Review concepts</div>
            </button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
            </div>
            <div className="space-y-4">
              {todayTasks.map(task => (
                <div key={task.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{task.task}</span>
                    <span className="text-xs text-gray-500">{task.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
              Focus Areas
            </h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-700">• Money Laundering Laws</div>
              <div className="text-sm text-gray-700">• Digital Forensics</div>
              <div className="text-sm text-gray-700">• Evidence Principles</div>
            </div>
            <button
              onClick={() => onNavigate('practice')}
              className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Practice Weak Areas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
