import { useState, useEffect } from 'react';
import { Clock, Flag, CheckSquare, ChevronLeft, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface Question {
  id: string;
  section_id: number;
  domain_id: string;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  explanation: string;
}

interface MockExam {
  id: string;
  title: string;
  description: string;
  exam_type: string;
  question_count: number;
  time_limit_minutes: number;
  passing_score: number;
}

type ExamState = 'menu' | 'taking' | 'results';

export default function ExamSimulator() {
  const { addXP } = useGame();
  const [state, setState] = useState<ExamState>('menu');
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [selectedMock, setSelectedMock] = useState<MockExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockExams();
  }, []);

  useEffect(() => {
    if (state === 'taking' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state, timeRemaining]);

  async function loadMockExams() {
    const { data, error } = await supabase
      .from('mock_exams')
      .select('*')
      .order('exam_type', { ascending: true });

    if (error) {
      console.error('Error loading mock exams:', error);
    } else if (data) {
      setMockExams(data);
    }

    setLoading(false);
  }

  async function startMockExam(mock: MockExam) {
    setLoading(true);
    setSelectedMock(mock);

    const { data: mockData } = await supabase
      .from('mock_exams')
      .select('question_ids')
      .eq('id', mock.id)
      .single();

    if (mockData && mockData.question_ids) {
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .in('id', mockData.question_ids);

      if (questionsData) {
        setQuestions(questionsData);
        setTimeRemaining(mock.time_limit_minutes * 60);
        setStartTime(new Date());
        setState('taking');
      }
    }

    setLoading(false);
  }

  function handleAnswer(questionIndex: number, answer: string) {
    const newAnswers = new Map(answers);
    newAnswers.set(questionIndex, answer);
    setAnswers(newAnswers);
  }

  function toggleFlag(questionIndex: number) {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionIndex)) {
      newFlagged.delete(questionIndex);
    } else {
      newFlagged.add(questionIndex);
    }
    setFlaggedQuestions(newFlagged);
  }

  async function finishExam() {
    setState('results');

    const correctCount = questions.filter((q, idx) => {
      return answers.get(idx) === q.correct_answer;
    }).length;

    const score = (correctCount / questions.length) * 100;
    const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60) : 0;

    await supabase.from('mock_exam_attempts').insert({
      user_id: 'demo-user',
      mock_exam_id: selectedMock!.id,
      score: Math.round(score),
      time_spent_minutes: timeSpent,
      answers: Object.fromEntries(answers)
    });

    const xpReward = Math.floor(score * 5);
    await addXP(xpReward);
  }

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading mock exams...</div>
      </div>
    );
  }

  if (state === 'menu') {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Exam Simulator</h1>
          <p className="text-gray-600">
            Take full-length timed mock exams to prepare for the real CFE exam
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mockExams.map(mock => (
            <div
              key={mock.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{mock.title}</h3>
                  <p className="text-gray-600 mb-4">{mock.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Questions</div>
                    <div className="font-bold text-gray-900">{mock.question_count}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Time Limit</div>
                    <div className="font-bold text-gray-900">{mock.time_limit_minutes} min</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                    <div className="font-bold text-gray-900">{mock.passing_score}%</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startMockExam(mock)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Mock Exam
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <h3 className="font-bold text-gray-900 mb-2">Exam Day Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Simulate real exam conditions: find a quiet space and avoid interruptions</li>
            <li>• Manage your time wisely: aim for 1-2 minutes per question</li>
            <li>• Flag difficult questions and return to them later</li>
            <li>• Review all questions before submitting</li>
            <li>• The real CFE exam is open-book, so have your materials ready</li>
          </ul>
        </div>
      </div>
    );
  }

  if (state === 'results') {
    const correctCount = questions.filter((q, idx) => {
      return answers.get(idx) === q.correct_answer;
    }).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= selectedMock!.passing_score;

    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 ${passed ? 'bg-green-100' : 'bg-orange-100'} rounded-full mb-4`}>
              <Award className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mock Exam Complete!</h2>
            <div className={`text-5xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'} mb-2`}>
              {score}%
            </div>
            <p className="text-gray-600 mb-4">
              You answered {correctCount} out of {questions.length} questions correctly
            </p>
            {passed ? (
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                PASSED - Score ≥ {selectedMock!.passing_score}%
              </div>
            ) : (
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold">
                Score below passing threshold of {selectedMock!.passing_score}%
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Correct</div>
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Incorrect</div>
              <div className="text-2xl font-bold text-red-600">{questions.length - correctCount}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Unanswered</div>
              <div className="text-2xl font-bold text-gray-600">{questions.length - answers.size}</div>
            </div>
          </div>

          <button
            onClick={() => {
              setState('menu');
              setSelectedMock(null);
              setQuestions([]);
              setAnswers(new Map());
              setFlaggedQuestions(new Set());
              setCurrentQuestionIndex(0);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Mock Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = answers.size;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className={`w-6 h-6 mr-2 ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`} />
                <span className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={finishExam}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit Exam
              </button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm text-gray-600">
                Answered: {answeredCount}/{questions.length}
              </div>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Section {currentQuestion.section_id}
              </span>
              <button
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flag className="w-4 h-4 mr-1" />
                {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3 mb-6">
              {[
                { key: 'A', value: currentQuestion.option_a },
                { key: 'B', value: currentQuestion.option_b },
                { key: 'C', value: currentQuestion.option_c },
                { key: 'D', value: currentQuestion.option_d }
              ]
                .filter(opt => opt.value)
                .map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(currentQuestionIndex, opt.key)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers.get(currentQuestionIndex) === opt.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-gray-700 mr-3">{opt.key}.</span>
                      <span className="text-gray-800">{opt.value}</span>
                    </div>
                  </button>
                ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="font-bold text-gray-900 mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`aspect-square rounded-lg font-semibold text-sm transition-colors ${
                currentQuestionIndex === idx
                  ? 'bg-blue-600 text-white'
                  : answers.has(idx)
                  ? 'bg-green-100 text-green-700'
                  : flaggedQuestions.has(idx)
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded mr-2"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-orange-100 rounded mr-2"></div>
            <span className="text-gray-600">Flagged</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-100 rounded mr-2"></div>
            <span className="text-gray-600">Unanswered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
