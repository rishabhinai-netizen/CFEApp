import { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface CaseQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface Case {
  id: string;
  title: string;
  scenario: string;
  industry: string;
  fraud_type: string;
  difficulty: string;
  case_questions: CaseQuestion[];
  learning_points: string[];
  tags: string[];
}

export default function CaseLab() {
  const { addXP } = useGame();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('difficulty', { ascending: true });

    if (error) {
      console.error('Error loading cases:', error);
    } else if (data) {
      setCases(data);
    }

    setLoading(false);
  }

  function startCase(caseData: Case) {
    setSelectedCase(caseData);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  }

  function handleAnswer(answer: string) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedCase!.case_questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishCase(newAnswers);
    }
  }

  async function finishCase(finalAnswers: string[]) {
    setShowResults(true);

    const correctCount = finalAnswers.filter(
      (answer, idx) => answer === selectedCase!.case_questions[idx].correct_answer
    ).length;

    const totalQuestions = selectedCase!.case_questions.length;
    const score = (correctCount / totalQuestions) * 100;

    let xpReward = 50;
    if (score >= 80) xpReward = 100;
    if (score === 100) xpReward = 150;

    await addXP(xpReward);
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  const filteredCases = filterDifficulty === 'all'
    ? cases
    : cases.filter(c => c.difficulty.toLowerCase() === filterDifficulty);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading cases...</div>
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Case Lab</h1>
          <p className="text-gray-600">
            Practice with realistic fraud investigation scenarios and case studies
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterDifficulty === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Cases
          </button>
          <button
            onClick={() => setFilterDifficulty('easy')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterDifficulty === 'easy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setFilterDifficulty('medium')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterDifficulty === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterDifficulty('hard')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterDifficulty === 'hard'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map(caseData => (
            <div
              key={caseData.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer"
              onClick={() => startCase(caseData)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{caseData.title}</h3>
                    <p className="text-sm text-gray-500">{caseData.industry}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{caseData.scenario}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(caseData.difficulty)}`}>
                    {caseData.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    {caseData.fraud_type}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {caseData.case_questions.length} questions
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No cases found for selected difficulty level
          </div>
        )}
      </div>
    );
  }

  if (showResults) {
    const correctCount = answers.filter(
      (answer, idx) => answer === selectedCase.case_questions[idx].correct_answer
    ).length;
    const totalQuestions = selectedCase.case_questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Award className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Case Complete!</h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600">
              You got {correctCount} out of {totalQuestions} questions correct
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {selectedCase.case_questions.map((question, idx) => {
              const isCorrect = answers[idx] === question.correct_answer;
              return (
                <div key={idx} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-start mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        Question {idx + 1}: {question.question}
                      </div>
                      <div className="text-sm text-gray-600">
                        Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{answers[idx]}</span>
                      </div>
                      {!isCorrect && (
                        <div className="text-sm text-gray-600">
                          Correct answer: <span className="text-green-600">{question.correct_answer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Key Learning Points</h3>
            <ul className="space-y-2">
              {selectedCase.learning_points.map((point, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSelectedCase(null)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedCase.case_questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedCase.case_questions.length) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setSelectedCase(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Exit Case
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedCase.title}</h2>
              <p className="text-sm text-gray-500">{selectedCase.industry} • {selectedCase.fraud_type}</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{selectedCase.scenario}</p>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {selectedCase.case_questions.length}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center">
                <span className="font-bold text-gray-700 mr-3">{String.fromCharCode(65 + idx)}.</span>
                <span className="text-gray-800">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
