import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Download, Trash2, Calendar, Target, Bell, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';
import { importQuestionsFromCSV, downloadSampleCSV, ImportResult } from '../utils/csvImporter';

interface UserSettings {
  target_exam_date: string | null;
  daily_goal_minutes: number;
  notifications_enabled: boolean;
}

export default function Settings() {
  const { gameState } = useGame();
  const [settings, setSettings] = useState<UserSettings>({
    target_exam_date: null,
    daily_goal_minutes: 60,
    notifications_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', 'demo-user')
      .maybeSingle();

    if (data) {
      setSettings({
        target_exam_date: data.target_exam_date,
        daily_goal_minutes: data.daily_goal_minutes || 60,
        notifications_enabled: data.notifications_enabled ?? true
      });
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);

    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', 'demo-user')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', 'demo-user');
    } else {
      await supabase
        .from('user_settings')
        .insert({
          user_id: 'demo-user',
          ...settings
        });
    }

    setSaving(false);
    alert('Settings saved successfully!');
  }

  async function exportProgress() {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', 'demo-user');

    const { data: attempts } = await supabase
      .from('question_attempts')
      .select('*')
      .eq('user_id', 'demo-user');

    const { data: mockAttempts } = await supabase
      .from('mock_exam_attempts')
      .select('*')
      .eq('user_id', 'demo-user');

    const exportData = {
      exported_at: new Date().toISOString(),
      gamification_state: gameState,
      progress,
      question_attempts: attempts,
      mock_exam_attempts: mockAttempts,
      settings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfe-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function exportProgressCSV() {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', 'demo-user');

    if (!progress || progress.length === 0) {
      alert('No progress data to export');
      return;
    }

    const headers = ['Section ID', 'Domain ID', 'Subtopic ID', 'Correct', 'Incorrect', 'Accuracy'];
    const rows = progress.map(p => {
      const total = p.correct + p.incorrect;
      const accuracy = total > 0 ? ((p.correct / total) * 100).toFixed(1) : '0';
      return [
        p.section_id,
        p.domain_id,
        p.subtopic_id || '',
        p.correct,
        p.incorrect,
        `${accuracy}%`
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfe-progress-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function resetProgress() {
    const confirmed = window.confirm(
      'Are you sure you want to reset all progress? This action cannot be undone.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This will permanently delete all your study progress, achievements, and stats. Continue?'
    );

    if (!doubleConfirm) return;

    await Promise.all([
      supabase.from('user_progress').delete().eq('user_id', 'demo-user'),
      supabase.from('question_attempts').delete().eq('user_id', 'demo-user'),
      supabase.from('mock_exam_attempts').delete().eq('user_id', 'demo-user'),
      supabase.from('user_achievements').delete().eq('user_id', 'demo-user'),
      supabase.from('study_sessions').delete().eq('user_id', 'demo-user'),
      supabase.from('gamification_state').delete().eq('user_id', 'demo-user')
    ]);

    alert('Progress reset successfully. Please refresh the page.');
    window.location.reload();
  }

  async function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const result = await importQuestionsFromCSV(file);
      setImportResult(result);

      if (result.success) {
        setTimeout(() => {
          setImportResult(null);
        }, 5000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        failed: 0,
        errors: [`Unexpected error: ${error}`]
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  const daysUntilExam = settings.target_exam_date
    ? Math.ceil((new Date(settings.target_exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences and export your data</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Study Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Target Exam Date
              </label>
              <input
                type="date"
                value={settings.target_exam_date || ''}
                onChange={e => setSettings({ ...settings, target_exam_date: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              {daysUntilExam !== null && (
                <p className="text-sm text-gray-600 mt-2">
                  {daysUntilExam > 0 ? (
                    <>
                      <strong>{daysUntilExam}</strong> days until your exam
                    </>
                  ) : (
                    'Exam date has passed or is today'
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Target className="w-4 h-4 mr-2" />
                Daily Study Goal (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={settings.daily_goal_minutes}
                onChange={e => setSettings({ ...settings, daily_goal_minutes: parseInt(e.target.value) || 60 })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-sm text-gray-600 mt-2">
                Recommended: 60-120 minutes per day for optimal preparation
              </p>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={settings.notifications_enabled}
                  onChange={e => setSettings({ ...settings, notifications_enabled: e.target.checked })}
                  className="w-4 h-4 mr-3 text-blue-600"
                />
                <Bell className="w-4 h-4 mr-2" />
                Enable Study Reminders
              </label>
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Receive daily reminders to maintain your study streak
              </p>
            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <Upload className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Content Management</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Import custom questions from CSV files to expand your study material. Perfect for adding organization-specific scenarios or additional practice questions.
          </p>

          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors ${
                importing
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Upload className="w-5 h-5 mr-2" />
              {importing ? 'Importing...' : 'Import Questions from CSV'}
            </label>
          </div>

          <button
            onClick={downloadSampleCSV}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
          >
            <FileText className="w-5 h-5 mr-2" />
            Download CSV Template
          </button>

          {importResult && (
            <div className={`mt-4 p-4 rounded-lg ${importResult.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-center mb-2">
                {importResult.success ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-bold text-green-900">Import Successful!</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="font-bold text-red-900">Import Failed</h3>
                  </>
                )}
              </div>

              <div className="text-sm space-y-1 mb-3">
                <div className={importResult.success ? 'text-green-800' : 'text-red-800'}>
                  <strong>{importResult.imported}</strong> questions imported successfully
                </div>
                {importResult.failed > 0 && (
                  <div className="text-red-800">
                    <strong>{importResult.failed}</strong> questions failed
                  </div>
                )}
              </div>

              {importResult.errors.length > 0 && (
                <div className="text-sm">
                  <div className="font-semibold text-red-900 mb-1">Errors:</div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, idx) => (
                      <div key={idx} className="text-red-700">• {error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">CSV Format Requirements:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Required columns:</strong> section_id, domain_id, question_type, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation</li>
              <li>• <strong>section_id:</strong> Must be 1, 2, 3, or 4</li>
              <li>• <strong>correct_answer:</strong> Must be A, B, C, or D</li>
              <li>• <strong>question_type:</strong> Must be "single", "multiple", or "true-false"</li>
              <li>• Download the template for a properly formatted example</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <Download className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Download your progress data for backup or analysis. Includes all your study stats, achievements, and performance metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportProgress}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Export as JSON
            </button>
            <button
              onClick={exportProgressCSV}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Export as CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">User ID</span>
              <span className="font-semibold text-gray-900">demo-user</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Current Level</span>
              <span className="font-semibold text-gray-900">Level {gameState.level}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total XP</span>
              <span className="font-semibold text-gray-900">{gameState.xp} XP</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Questions Answered</span>
              <span className="font-semibold text-gray-900">{gameState.questions_answered}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold text-gray-900">{gameState.streak_days} days</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Trash2 className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
          </div>

          <p className="text-red-800 mb-4">
            Reset all your progress and start fresh. This action is permanent and cannot be undone.
          </p>

          <button
            onClick={resetProgress}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Reset All Progress
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">CFE Exam Prep</h3>
          <p className="text-sm text-gray-600 mb-1">Version 1.0.0</p>
          <p className="text-xs text-gray-500">
            Built for Certified Fraud Examiner candidates
          </p>
        </div>
      </div>
    </div>
  );
}
