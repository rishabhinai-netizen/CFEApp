import { useState, useEffect } from 'react';
import { Heart, TrendingUp, Target, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';

interface Message {
  type: 'motivation' | 'tip' | 'reminder' | 'celebration';
  icon: any;
  title: string;
  content: string;
  color: string;
}

export default function BuddyMode() {
  const { gameState } = useGame();
  const [messages, setMessages] = useState<Message[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    generateMessages();
    calculateWeeklyProgress();
  }, [gameState]);

  async function calculateWeeklyProgress() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', 'demo-user')
      .gte('created_at', weekAgo.toISOString());

    if (data) {
      const totalMinutes = data.reduce((sum, session) => sum + session.duration_minutes, 0);
      setWeeklyProgress(totalMinutes);
      setWeeklyGoal(300);
    }
  }

  function generateMessages() {
    const newMessages: Message[] = [];

    if (gameState.streak_days === 0) {
      newMessages.push({
        type: 'reminder',
        icon: Target,
        title: 'Start Your Study Streak!',
        content: 'Begin your CFE preparation journey today. Consistency is key to exam success!',
        color: 'from-blue-500 to-blue-700'
      });
    } else if (gameState.streak_days >= 7) {
      newMessages.push({
        type: 'celebration',
        icon: Sparkles,
        title: 'Amazing Streak!',
        content: `You've maintained a ${gameState.streak_days}-day study streak! Your dedication is inspiring. Keep up the great work!`,
        color: 'from-purple-500 to-purple-700'
      });
    } else if (gameState.streak_days >= 3) {
      newMessages.push({
        type: 'motivation',
        icon: Heart,
        title: 'Great Progress!',
        content: `${gameState.streak_days} days and counting! You're building a strong study habit. Stay consistent!`,
        color: 'from-pink-500 to-pink-700'
      });
    }

    if (gameState.questions_answered >= 100 && gameState.questions_answered < 500) {
      const accuracy = Math.round((gameState.questions_correct / gameState.questions_answered) * 100);
      newMessages.push({
        type: 'motivation',
        icon: TrendingUp,
        title: 'Building Momentum!',
        content: `You've answered ${gameState.questions_answered} questions with ${accuracy}% accuracy. You're making excellent progress!`,
        color: 'from-green-500 to-green-700'
      });
    } else if (gameState.questions_answered >= 500) {
      newMessages.push({
        type: 'celebration',
        icon: Sparkles,
        title: 'Question Master!',
        content: `Over ${gameState.questions_answered} questions answered! Your commitment to practice is outstanding!`,
        color: 'from-yellow-500 to-orange-600'
      });
    }

    if (gameState.level >= 5) {
      newMessages.push({
        type: 'celebration',
        icon: Target,
        title: 'Level Up Champion!',
        content: `You've reached Level ${gameState.level}! Your hard work is paying off. The CFE exam is within your reach!`,
        color: 'from-indigo-500 to-indigo-700'
      });
    }

    const tips = [
      {
        type: 'tip' as const,
        icon: MessageCircle,
        title: 'Study Tip: Spaced Repetition',
        content: 'Review flashcards regularly using our spaced repetition system. It is scientifically proven to improve long-term retention.',
        color: 'from-cyan-500 to-cyan-700'
      },
      {
        type: 'tip' as const,
        icon: MessageCircle,
        title: 'Exam Strategy: Time Management',
        content: 'Practice with timed mock exams to build your pacing. Aim for 1-2 minutes per question on average.',
        color: 'from-teal-500 to-teal-700'
      },
      {
        type: 'tip' as const,
        icon: MessageCircle,
        title: 'Learning Tip: Active Recall',
        content: 'Test yourself frequently rather than just re-reading material. Active recall strengthens memory pathways.',
        color: 'from-emerald-500 to-emerald-700'
      }
    ];

    newMessages.push(tips[Math.floor(Math.random() * tips.length)]);

    setMessages(newMessages);
  }

  const dailyQuotes = [
    'Success is the sum of small efforts repeated day in and day out.',
    'Your future is created by what you do today, not tomorrow.',
    'The expert in anything was once a beginner.',
    'Every accomplishment starts with the decision to try.',
    'Believe you can and you\'re halfway there.',
    'Small progress is still progress. Keep going!'
  ];

  const todayQuote = dailyQuotes[new Date().getDay()];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Buddy Mode</h1>
        <p className="text-gray-600">Your personal CFE exam preparation companion</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start">
          <Heart className="w-12 h-12 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Daily Inspiration</h2>
            <p className="text-purple-100 text-lg italic">"{todayQuote}"</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Weekly Goal</h2>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Study Time This Week</span>
            <span className="text-2xl font-bold text-blue-600">
              {weeklyProgress} / {weeklyGoal} min
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
            ></div>
          </div>
        </div>

        {weeklyProgress >= weeklyGoal ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-800 font-semibold">
              Congratulations! You've met your weekly study goal! 🎉
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800">
              <strong>{weeklyGoal - weeklyProgress} minutes</strong> remaining to reach your weekly goal.
              You can do it!
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {messages.map((message, index) => {
          const Icon = message.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${message.color} rounded-2xl p-8 text-white`}
            >
              <div className="flex items-start">
                <div className="p-3 bg-white/20 rounded-lg mr-4 flex-shrink-0">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{message.title}</h3>
                  <p className="text-white/90 leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{gameState.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{gameState.streak_days}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{gameState.questions_answered}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{gameState.xp}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
        <h3 className="font-bold text-gray-900 mb-3">Study Recommendations</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Aim to study at the same time each day to build a consistent routine</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Take regular breaks using the Pomodoro technique (25 min study, 5 min break)</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Focus on your weakest domains first, then reinforce your strong areas</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Complete at least one mock exam per week to track progress</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Review flashcards daily for spaced repetition benefits</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
