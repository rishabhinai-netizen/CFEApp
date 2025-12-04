import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export default function Quiz({ question, options, correctAnswer, explanation, category }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
          {category}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">{question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === correctAnswer;
          const showCorrect = showResult && isCorrectOption;
          const showIncorrect = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showCorrect
                  ? 'border-green-500 bg-green-50'
                  : showIncorrect
                  ? 'border-red-500 bg-red-50'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{option}</span>
                {showCorrect && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {showIncorrect && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div
          className={`p-6 rounded-lg ${
            isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
          }`}
        >
          <div className="flex items-center mb-3">
            {isCorrect ? (
              <>
                <Check className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-lg font-bold text-green-800">Correct!</span>
              </>
            ) : (
              <>
                <X className="w-6 h-6 text-red-600 mr-2" />
                <span className="text-lg font-bold text-red-800">Incorrect</span>
              </>
            )}
          </div>
          <p className="text-gray-700 mb-4">{explanation}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
