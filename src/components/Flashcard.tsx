import { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface FlashcardProps {
  question: string;
  answer: string;
  category: string;
}

export default function Flashcard({ question, answer, category }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between backface-hidden ${
            isFlipped ? 'invisible' : 'visible'
          }`}
        >
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
              {category}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Question</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{question}</p>
          </div>
          <div className="flex items-center justify-center text-gray-400">
            <RotateCw className="w-5 h-5 mr-2" />
            <span className="text-sm">Click to reveal answer</span>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 ${
            isFlipped ? 'visible' : 'invisible'
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div>
            <div className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-semibold rounded-full mb-4">
              {category}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Answer</h3>
            <p className="text-lg text-white leading-relaxed">{answer}</p>
          </div>
          <div className="flex items-center justify-center text-white text-opacity-70">
            <RotateCw className="w-5 h-5 mr-2" />
            <span className="text-sm">Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
}
