import { Database, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface TopbarProps {
  onSeedDatabase: () => void;
  seeded: boolean;
  seeding: boolean;
}

export default function Topbar({ onSeedDatabase, seeded, seeding }: TopbarProps) {
  const { gameState, loading } = useGame();

  const xpToNextLevel = (gameState.level * 1000) - gameState.xp;
  const xpProgress = ((gameState.xp % 1000) / 1000) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-xs text-gray-500">Level {gameState.level}</div>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">{gameState.xp} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-500">Streak:</span>
              <span className="ml-2 font-bold text-orange-600">{gameState.streak_days} 🔥</span>
            </div>
            <div>
              <span className="text-gray-500">Accuracy:</span>
              <span className="ml-2 font-bold text-green-600">
                {gameState.questions_answered > 0
                  ? Math.round((gameState.questions_correct / gameState.questions_answered) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {!seeded && (
          <button
            onClick={onSeedDatabase}
            disabled={seeding}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              seeding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Database className="w-4 h-4 mr-2" />
            {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
        )}
      </div>
    </div>
  );
}
