import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import { flashcards } from '../data/flashcards';
import { sections } from '../data/sections';

interface FlashcardsPageProps {
  sectionId: number;
  onBack: () => void;
}

export default function FlashcardsPage({ sectionId, onBack }: FlashcardsPageProps) {
  const sectionFlashcards = flashcards.filter((card) => card.sectionId === sectionId);
  const section = sections.find((s) => s.id === sectionId);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sectionFlashcards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < sectionFlashcards.length - 1 ? prev + 1 : 0));
  };

  if (sectionFlashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No flashcards available for this section yet.</p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentCard = sectionFlashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Section
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h1>
          {section && (
            <p className="text-gray-600">
              {section.title} - Card {currentIndex + 1} of {sectionFlashcards.length}
            </p>
          )}
        </div>

        <div className="mb-8">
          <Flashcard
            question={currentCard.question}
            answer={currentCard.answer}
            category={currentCard.category}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

          <div className="flex gap-2">
            {sectionFlashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
