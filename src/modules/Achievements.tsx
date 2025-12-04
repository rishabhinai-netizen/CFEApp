import { useState, useEffect } from 'react';
import { Award, Trophy, Star, Zap, Target, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  category: string;
  xp_reward: number;
  unlock_condition: any;
}

interface UserAchievement {
  achievement_id: string;
  unlocked: boolean;
  progress: number;
  unlocked_at: string | null;
}

export default function Achievements() {
  const { gameState } = useGame();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Map<string, UserAchievement>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Achievements', icon: Award },
    { id: 'questions', label: 'Questions', icon: Target },
    { id: 'study', label: 'Study', icon: Star },
    { id: 'exams', label: 'Exams', icon: Trophy },
    { id: 'mastery', label: 'Mastery', icon: Zap }
  ];

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    const { data: userAchievementsData } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', 'demo-user');

    if (achievementsData) {
      setAchievements(achievementsData);
    }

    if (userAchievementsData) {
      const userMap = new Map(
        userAchievementsData.map(ua => [ua.achievement_id, ua])
      );
      setUserAchievements(userMap);
    }

    setLoading(false);
  }

  function calculateProgress(achievement: Achievement): number {
    const condition = achievement.unlock_condition;
    const userAch = userAchievements.get(achievement.id);

    if (userAch?.unlocked) return 100;

    if (condition.questions_answered) {
      return Math.min(100, (gameState.questions_answered / condition.questions_answered) * 100);
    }
    if (condition.questions_correct) {
      return Math.min(100, (gameState.questions_correct / condition.questions_correct) * 100);
    }
    if (condition.streak_days) {
      return Math.min(100, (gameState.streak_days / condition.streak_days) * 100);
    }
    if (condition.level) {
      return Math.min(100, (gameState.level / condition.level) * 100);
    }
    if (condition.xp) {
      return Math.min(100, (gameState.xp / condition.xp) * 100);
    }

    return userAch?.progress || 0;
  }

  function getUnlockDescription(achievement: Achievement): string {
    const condition = achievement.unlock_condition;

    if (condition.questions_answered) {
      return `Answer ${condition.questions_answered} questions`;
    }
    if (condition.questions_correct) {
      return `Answer ${condition.questions_correct} questions correctly`;
    }
    if (condition.streak_days) {
      return `Maintain a ${condition.streak_days}-day study streak`;
    }
    if (condition.level) {
      return `Reach level ${condition.level}`;
    }
    if (condition.xp) {
      return `Earn ${condition.xp} XP`;
    }
    if (condition.mocks_completed) {
      return `Complete ${condition.mocks_completed} mock exams`;
    }

    return 'Complete the required action';
  }

  function getBadgeIcon(iconName: string, unlocked: boolean) {
    const iconProps = {
      className: `w-12 h-12 ${unlocked ? 'text-yellow-500' : 'text-gray-400'}`,
    };

    switch (iconName) {
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'award':
      default:
        return <Award {...iconProps} />;
    }
  }

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = Array.from(userAchievements.values()).filter(ua => ua.unlocked).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Unlock badges and earn rewards as you progress</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold opacity-90 mb-2">Total Unlocked</div>
            <div className="text-5xl font-bold">{unlockedCount}</div>
            <div className="text-sm opacity-80 mt-1">out of {achievements.length} achievements</div>
          </div>
          <div className="text-right">
            <Trophy className="w-20 h-20 opacity-80" />
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => {
          const userAch = userAchievements.get(achievement.id);
          const unlocked = userAch?.unlocked || false;
          const progress = calculateProgress(achievement);

          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-md p-6 transition-all ${
                unlocked ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${unlocked ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                  {getBadgeIcon(achievement.badge_icon, unlocked)}
                </div>
                {unlocked ? (
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    UNLOCKED
                  </div>
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{getUnlockDescription(achievement)}</span>
                  <span className="text-xs font-semibold text-gray-700">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {achievement.category}
                </span>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm font-bold text-gray-900">+{achievement.xp_reward} XP</span>
                </div>
              </div>

              {unlocked && userAch?.unlocked_at && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Unlocked {new Date(userAch.unlocked_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No achievements found in this category
        </div>
      )}
    </div>
  );
}
