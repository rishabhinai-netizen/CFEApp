import { useState, useEffect } from 'react';
import { Brain, Target, Shuffle, TrendingDown, ChevronLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

type QuizMode = 'menu' | 'smart' | 'domain' | 'mixed' | 'weak';

interface Question {
  id: string;
  section_id: number;
  domain_id: string;
  subtopic_id: string | null;
  question_type: string;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  option_e: string | null;
  correct_answer: string;
  explanation: string;
  difficulty: string;
  tags: string[];
}

interface UserProgress {
  section_id: number;
  domain_id: string;
  correct: number;
  incorrect: number;
}

export default function Practice() {
  const { incrementQuestions } = useGame();
  const [mode, setMode] = useState<QuizMode>('menu');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const sections = [
    { id: 1, name: 'Financial Transactions & Fraud Schemes' },
    { id: 2, name: 'Law' },
    { id: 3, name: 'Investigation' },
    { id: 4, name: 'Fraud Prevention & Deterrence' }
  ];

  const domains = [
    { section: 1, id: '1-1', name: 'Accounting & Finance Basics' },
    { section: 1, id: '1-2', name: 'Fraud Schemes' },
    { section: 1, id: '1-3', name: 'Cyber & Identity Fraud' },
    { section: 2, id: '2-1', name: 'Legal Foundations' },
    { section: 2, id: '2-2', name: 'Fraud-Related Laws' },
    { section: 2, id: '2-3', name: 'Legal Procedures' },
    { section: 3, id: '3-1', name: 'Investigation Process' },
    { section: 3, id: '3-2', name: 'Interviewing Techniques' },
    { section: 3, id: '3-3', name: 'Digital Forensics' },
    { section: 4, id: '4-1', name: 'Fraud Prevention Programs' },
    { section: 4, id: '4-2', name: 'Fraud Deterrence' },
    { section: 4, id: '4-3', name: 'Fraud Risk Management' }
  ];

  async function startQuiz(quizMode: QuizMode) {
    setLoading(true);
    setMode(quizMode);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer('');
    setShowExplanation(false);

    let query = supabase.from('questions').select('*');

    if (quizMode === 'smart') {
      const progress = await getUserProgress();
      const weakDomains = progress
        .filter(p => {
          const total = p.correct + p.incorrect;
          const accuracy = total > 0 ? p.correct / total : 0;
          return accuracy < 0.7 && total >= 5;
        })
        .map(p => p.domain_id);

      if (weakDomains.length > 0) {
        query = query.in('domain_id', weakDomains);
      }
    } else if (quizMode === 'domain' && selectedSection && selectedDomain) {
      query = query.eq('section_id', selectedSection).eq('domain_id', selectedDomain);
    } else if (quizMode === 'weak') {
      const progress = await getUserProgress();
      const weakestDomains = progress
        .filter(p => (p.correct + p.incorrect) >= 3)
        .sort((a, b) => {
          const accA = a.correct / (a.correct + a.incorrect);
          const accB = b.correct / (b.correct + b.incorrect);
          return accA - accB;
        })
        .slice(0, 3)
        .map(p => p.domain_id);

      if (weakestDomains.length > 0) {
        query = query.in('domain_id', weakestDomains);
      }
    }

    const { data, error } = await query.limit(20);

    if (error) {
      console.error('Error loading questions:', error);
      setMode('menu');
    } else if (data) {
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }

    setLoading(false);
  }

  async function getUserProgress(): Promise<UserProgress[]> {
    const { data } = await supabase
      .from('user_progress')
      .select('section_id, domain_id, correct, incorrect')
      .eq('user_id', 'demo-user');

    return data || [];
  }

  async function handleAnswer(answer: string) {
    if (showExplanation) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);

    const currentQ = questions[currentIndex];
    const isCorrect = answer === currentQ.correct_answer;

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    await incrementQuestions(isCorrect);

    await supabase.from('question_attempts').insert({
      user_id: 'demo-user',
      question_id: currentQ.id,
      selected_answer: answer,
      is_correct: isCorrect,
      time_spent: 30
    });

    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', 'demo-user')
      .eq('section_id', currentQ.section_id)
      .eq('domain_id', currentQ.domain_id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_progress')
        .update({
          correct: existing.correct + (isCorrect ? 1 : 0),
          incorrect: existing.incorrect + (isCorrect ? 0 : 1)
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('user_progress').insert({
        user_id: 'demo-user',
        section_id: currentQ.section_id,
        domain_id: currentQ.domain_id,
        subtopic_id: currentQ.subtopic_id,
        correct: isCorrect ? 1 : 0,
        incorrect: isCorrect ? 0 : 1
      });
    }
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setMode('menu');
      setQuestions([]);
    }
  }

  function renderQuestionOptions() {
    const currentQ = questions[currentIndex];
    const options = [
      { key: 'A', value: currentQ.option_a },
      { key: 'B', value: currentQ.option_b },
      { key: 'C', value: currentQ.option_c },
      { key: 'D', value: currentQ.option_d },
      { key: 'E', value: currentQ.option_e }
    ].filter(opt => opt.value);

    return options.map(opt => {
      const isSelected = selectedAnswer === opt.key;
      const isCorrect = opt.key === currentQ.correct_answer;
      const showCorrect = showExplanation && isCorrect;
      const showIncorrect = showExplanation && isSelected && !isCorrect;

      return (
        <button
          key={opt.key}
          onClick={() => handleAnswer(opt.key)}
          disabled={showExplanation}
          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
            showCorrect
              ? 'border-green-500 bg-green-50'
              : showIncorrect
              ? 'border-red-500 bg-red-50'
              : isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="flex items-center">
            <span className="font-bold text-gray-700 mr-3">{opt.key}.</span>
            <span className="text-gray-800">{opt.value}</span>
            {showCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
            {showIncorrect && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
          </div>
        </button>
      );
    });
  }

  if (mode === 'menu') {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Practice Mode</h1>
          <p className="text-gray-600">Choose a practice mode to start answering questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => startQuiz('smart')}
            className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-2xl hover:shadow-2xl transition-all text-left"
          >
            <Brain className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Smart Quiz</h3>
            <p className="text-purple-100 text-sm">
              Adaptive questions based on your weak areas and learning progress
            </p>
          </button>

          <button
            onClick={() => {
              setMode('domain');
            }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-2xl hover:shadow-2xl transition-all text-left"
          >
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Domain Drill</h3>
            <p className="text-blue-100 text-sm">
              Practice questions from a specific section and domain
            </p>
          </button>

          <button
            onClick={() => startQuiz('mixed')}
            className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-2xl hover:shadow-2xl transition-all text-left"
          >
            <Shuffle className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Mixed Practice</h3>
            <p className="text-green-100 text-sm">
              Random questions from all sections for comprehensive review
            </p>
          </button>

          <button
            onClick={() => startQuiz('weak')}
            className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-8 rounded-2xl hover:shadow-2xl transition-all text-left"
          >
            <TrendingDown className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Weak Area Drill</h3>
            <p className="text-orange-100 text-sm">
              Focus on your lowest-scoring domains to improve accuracy
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'domain' && (!selectedSection || !selectedDomain)) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <button
          onClick={() => setMode('menu')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Modes
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Select Domain</h1>

        {!selectedSection ? (
          <div className="space-y-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className="w-full p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-left"
              >
                <div className="font-bold text-lg text-gray-900">Section {section.id}</div>
                <div className="text-gray-600 mt-1">{section.name}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedSection(null)}
              className="text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Change Section
            </button>
            {domains
              .filter(d => d.section === selectedSection)
              .map(domain => (
                <button
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain.id);
                    startQuiz('domain');
                  }}
                  className="w-full p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-left"
                >
                  <div className="font-bold text-gray-900">{domain.name}</div>
                </button>
              ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No questions available</p>
          <button
            onClick={() => setMode('menu')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => {
            setMode('menu');
            setQuestions([]);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Exit Quiz
        </button>

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            Score: {score.correct}/{score.total}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mr-2">
              Section {currentQ.section_id}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              {currentQ.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{currentQ.question_text}</h2>
        </div>

        <div className="space-y-3">{renderQuestionOptions()}</div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900 mb-1">Explanation</div>
                <div className="text-blue-800 text-sm">{currentQ.explanation}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showExplanation && (
        <button
          onClick={nextQuestion}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}
