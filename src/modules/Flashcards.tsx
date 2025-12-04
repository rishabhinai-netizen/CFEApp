import { useState, useEffect } from 'react';
import { RotateCcw, ChevronLeft, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface Flashcard {
  id: string;
  section_id: number;
  domain_id: string;
  question: string;
  answer: string;
  tags: string[];
  ease_factor: number;
  interval_days: number;
  next_review_date: string;
  times_reviewed: number;
  mastery_level: number;
}

export default function Flashcards() {
  const { addXP } = useGame();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [todayStats, setTodayStats] = useState({ reviewed: 0, due: 0 });

  useEffect(() => {
    loadFlashcards();
  }, []);

  async function loadFlashcards() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review_date', today)
      .order('next_review_date', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading flashcards:', error);
    } else if (data) {
      setFlashcards(data);
      setTodayStats({ reviewed: 0, due: data.length });
    }

    setLoading(false);
  }

  function calculateNextReview(quality: number, card: Flashcard) {
    let newEaseFactor = card.ease_factor;
    let newInterval = card.interval_days;

    if (quality < 3) {
      newInterval = 1;
      newEaseFactor = Math.max(1.3, card.ease_factor - 0.2);
    } else {
      newEaseFactor = card.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);

      if (card.times_reviewed === 0) {
        newInterval = 1;
      } else if (card.times_reviewed === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval_days * newEaseFactor);
      }
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    const newMasteryLevel = Math.min(5, Math.floor((card.times_reviewed + 1) / 3));

    return {
      ease_factor: newEaseFactor,
      interval_days: newInterval,
      next_review_date: nextReviewDate.toISOString().split('T')[0],
      times_reviewed: card.times_reviewed + 1,
      mastery_level: newMasteryLevel
    };
  }

  async function handleRating(quality: number) {
    const currentCard = flashcards[currentIndex];
    const updates = calculateNextReview(quality, currentCard);

    await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', currentCard.id);

    const xpReward = quality >= 3 ? 5 : 2;
    await addXP(xpReward);

    setTodayStats(prev => ({ ...prev, reviewed: prev.reviewed + 1 }));

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setReviewMode(false);
      setFlashcards([]);
      setCurrentIndex(0);
    }
  }

  function getMasteryColor(level: number) {
    const colors = [
      'text-gray-400',
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-blue-500'
    ];
    return colors[level] || colors[0];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading flashcards...</div>
      </div>
    );
  }

  if (!reviewMode || flashcards.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Flashcards</h1>
          <p className="text-gray-600">Review cards with spaced repetition for better retention</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Due Today</span>
              <RotateCcw className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{todayStats.due}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Reviewed</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{todayStats.reviewed}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Remaining</span>
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{todayStats.due - todayStats.reviewed}</div>
          </div>
        </div>

        {flashcards.length > 0 ? (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Review</h2>
            <p className="text-blue-100 mb-6">
              You have {flashcards.length} cards due for review today. Regular practice strengthens memory retention.
            </p>
            <button
              onClick={() => setReviewMode(true)}
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Start Review Session
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600">No flashcards due for review today. Come back tomorrow!</p>
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How Spaced Repetition Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Mastery Levels:</strong> Cards progress through 5 mastery levels
              as you review them successfully.
            </p>
            <p>
              <strong className="text-gray-900">Review Intervals:</strong> Each successful review increases the
              time until the next review, optimizing long-term retention.
            </p>
            <p>
              <strong className="text-gray-900">Rating System:</strong>
            </p>
            <ul className="ml-6 space-y-1">
              <li>• <strong>Again (1):</strong> Completely forgot - Review in 1 day</li>
              <li>• <strong>Hard (2):</strong> Struggled to recall - Shorter interval</li>
              <li>• <strong>Good (3):</strong> Recalled correctly - Normal interval</li>
              <li>• <strong>Easy (4):</strong> Instantly recalled - Longer interval</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => {
            setReviewMode(false);
            setIsFlipped(false);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Exit Review
        </button>

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          <div className="flex items-center">
            <Star className={`w-4 h-4 mr-1 ${getMasteryColor(currentCard.mastery_level)}`} />
            <span className="text-sm text-gray-600">
              Mastery: {currentCard.mastery_level}/5
            </span>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl shadow-xl p-12 mb-6 min-h-[400px] flex flex-col justify-center items-center cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="text-center">
          {!isFlipped ? (
            <>
              <div className="text-sm text-gray-500 mb-4">QUESTION</div>
              <div className="text-2xl font-semibold text-gray-900 mb-6">
                {currentCard.question}
              </div>
              <div className="text-sm text-gray-400">Click to reveal answer</div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-500 mb-4">ANSWER</div>
              <div className="text-xl text-gray-800 mb-6 max-w-2xl">
                {currentCard.answer}
              </div>
              {currentCard.tags && currentCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {currentCard.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => handleRating(1)}
            className="bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            <div className="font-bold">Again</div>
            <div className="text-xs opacity-80">1 day</div>
          </button>
          <button
            onClick={() => handleRating(2)}
            className="bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <div className="font-bold">Hard</div>
            <div className="text-xs opacity-80">Shorter</div>
          </button>
          <button
            onClick={() => handleRating(3)}
            className="bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <div className="font-bold">Good</div>
            <div className="text-xs opacity-80">Normal</div>
          </button>
          <button
            onClick={() => handleRating(4)}
            className="bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <div className="font-bold">Easy</div>
            <div className="text-xs opacity-80">Longer</div>
          </button>
        </div>
      )}
    </div>
  );
}
