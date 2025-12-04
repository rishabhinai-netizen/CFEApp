import { useState, useEffect } from 'react';
import { TrendingUp, Target, BarChart3, Clock, Award, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface SectionProgress {
  section_id: number;
  section_name: string;
  domains: DomainProgress[];
  overall_accuracy: number;
  questions_attempted: number;
}

interface DomainProgress {
  domain_id: string;
  domain_name: string;
  correct: number;
  incorrect: number;
  accuracy: number;
}

interface MockAttempt {
  id: string;
  mock_exam_id: string;
  score: number;
  time_spent_minutes: number;
  created_at: string;
}

interface StudySession {
  id: string;
  duration_minutes: number;
  xp_earned: number;
  created_at: string;
}

export default function Progress() {
  const { gameState } = useGame();
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [mockAttempts, setMockAttempts] = useState<MockAttempt[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionNames = [
    'Financial Transactions & Fraud Schemes',
    'Law',
    'Investigation',
    'Fraud Prevention & Deterrence'
  ];

  const domainNames: Record<string, string> = {
    '1-1': 'Accounting & Finance Basics',
    '1-2': 'Fraud Schemes',
    '1-3': 'Cyber & Identity Fraud',
    '2-1': 'Legal Foundations',
    '2-2': 'Fraud-Related Laws',
    '2-3': 'Legal Procedures',
    '3-1': 'Investigation Process',
    '3-2': 'Interviewing Techniques',
    '3-3': 'Digital Forensics',
    '4-1': 'Fraud Prevention Programs',
    '4-2': 'Fraud Deterrence',
    '4-3': 'Fraud Risk Management'
  };

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    await Promise.all([
      loadSectionProgress(),
      loadMockAttempts(),
      loadStudySessions()
    ]);
    setLoading(false);
  }

  async function loadSectionProgress() {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', 'demo-user');

    if (data) {
      const sections: SectionProgress[] = [1, 2, 3, 4].map(sectionId => {
        const sectionData = data.filter(d => d.section_id === sectionId);

        const domainMap = new Map<string, { correct: number; incorrect: number }>();
        sectionData.forEach(d => {
          const existing = domainMap.get(d.domain_id) || { correct: 0, incorrect: 0 };
          domainMap.set(d.domain_id, {
            correct: existing.correct + d.correct,
            incorrect: existing.incorrect + d.incorrect
          });
        });

        const domains: DomainProgress[] = Array.from(domainMap.entries()).map(([domainId, stats]) => {
          const total = stats.correct + stats.incorrect;
          return {
            domain_id: domainId,
            domain_name: domainNames[domainId] || domainId,
            correct: stats.correct,
            incorrect: stats.incorrect,
            accuracy: total > 0 ? Math.round((stats.correct / total) * 100) : 0
          };
        });

        const totalCorrect = domains.reduce((sum, d) => sum + d.correct, 0);
        const totalIncorrect = domains.reduce((sum, d) => sum + d.incorrect, 0);
        const total = totalCorrect + totalIncorrect;

        return {
          section_id: sectionId,
          section_name: sectionNames[sectionId - 1],
          domains,
          overall_accuracy: total > 0 ? Math.round((totalCorrect / total) * 100) : 0,
          questions_attempted: total
        };
      });

      setSectionProgress(sections);
    }
  }

  async function loadMockAttempts() {
    const { data } = await supabase
      .from('mock_exam_attempts')
      .select('*')
      .eq('user_id', 'demo-user')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setMockAttempts(data);
    }
  }

  async function loadStudySessions() {
    const { data } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', 'demo-user')
      .order('created_at', { ascending: false })
      .limit(30);

    if (data) {
      setStudySessions(data);
    }
  }

  function getWeakestDomains() {
    const allDomains = sectionProgress.flatMap(s => s.domains);
    return allDomains
      .filter(d => d.correct + d.incorrect >= 5)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);
  }

  function getOverallReadiness() {
    const validSections = sectionProgress.filter(s => s.questions_attempted > 0);
    if (validSections.length === 0) return 0;

    const avgAccuracy = validSections.reduce((sum, s) => sum + s.overall_accuracy, 0) / validSections.length;
    return Math.round(avgAccuracy);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const overallReadiness = getOverallReadiness();
  const weakestDomains = getWeakestDomains();
  const totalStudyTime = gameState.total_study_minutes;
  const avgMockScore = mockAttempts.length > 0
    ? Math.round(mockAttempts.reduce((sum, a) => sum + a.score, 0) / mockAttempts.length)
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress & Analytics</h1>
        <p className="text-gray-600">Track your learning progress and identify areas for improvement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Exam Readiness</span>
            <Target className="w-5 h-5" />
          </div>
          <div className="text-4xl font-bold">{overallReadiness}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Study Time</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStudyTime}</div>
          <div className="text-xs text-gray-500">minutes</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Questions</span>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{gameState.questions_answered}</div>
          <div className="text-xs text-gray-500">{gameState.questions_correct} correct</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Avg Mock Score</span>
            <Award className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{avgMockScore}%</div>
          <div className="text-xs text-gray-500">{mockAttempts.length} attempts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Section Performance</h2>
          <div className="space-y-6">
            {sectionProgress.map(section => (
              <div key={section.section_id}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">Section {section.section_id}</div>
                    <div className="text-sm text-gray-500">{section.section_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{section.overall_accuracy}%</div>
                    <div className="text-xs text-gray-500">{section.questions_attempted} questions</div>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${section.overall_accuracy}%` }}
                  ></div>
                </div>

                <div className="ml-4 space-y-2">
                  {section.domains.map(domain => (
                    <div key={domain.domain_id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{domain.domain_name}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <div
                            className={`h-full rounded-full transition-all ${
                              domain.accuracy >= 70 ? 'bg-green-500' :
                              domain.accuracy >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${domain.accuracy}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900 w-12 text-right">{domain.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Weakest Areas</h3>
            </div>
            <div className="space-y-3">
              {weakestDomains.length > 0 ? (
                weakestDomains.map(domain => (
                  <div key={domain.domain_id} className="border-l-4 border-orange-500 pl-3">
                    <div className="font-semibold text-gray-900 text-sm">{domain.domain_name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {domain.correct}/{domain.correct + domain.incorrect} correct
                      </span>
                      <span className="text-sm font-bold text-orange-600">{domain.accuracy}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Start practicing to see weak areas</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Study Streak</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {gameState.streak_days} days
              </div>
              <div className="text-sm text-gray-600">
                Longest streak: {gameState.longest_streak} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {mockAttempts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mock Exam History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Exam</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAttempts.map(attempt => (
                  <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(attempt.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">Mock Exam</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        attempt.score >= 75 ? 'text-green-600' :
                        attempt.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700">
                      {attempt.time_spent_minutes} min
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        attempt.score >= 75
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {attempt.score >= 75 ? 'PASSED' : 'REVIEW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
