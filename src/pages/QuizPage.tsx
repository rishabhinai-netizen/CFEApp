import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Quiz from '../components/Quiz';
import { quizQuestions } from '../data/quizzes';
import { sections } from '../data/sections';

interface QuizPageProps {
  sectionId: number;
  onBack: () => void;
}

export default function QuizPage({ sectionId, onBack }: QuizPageProps) {
  const sectionQuestions = quizQuestions.filter((q) => q.sectionId === sectionId);
  const section = sections.find((s) => s.id === sectionId);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < sectionQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (sectionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz questions available for this section yet.</p>
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

  const currentQuestion = sectionQuestions[currentIndex];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Quiz</h1>
          {section && (
            <p className="text-gray-600">
              {section.title} - Question {currentIndex + 1} of {sectionQuestions.length}
            </p>
          )}
        </div>

        <div className="mb-8">
          <Quiz
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            category={currentQuestion.category}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-lg transition-all ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

          <span className="text-gray-600 font-medium">
            {currentIndex + 1} / {sectionQuestions.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === sectionQuestions.length - 1}
            className={`flex items-center px-6 py-3 rounded-lg transition-all ${
              currentIndex === sectionQuestions.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
