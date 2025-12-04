import { ArrowLeft, BookOpen, Brain, FileText } from 'lucide-react';
import { sections } from '../data/sections';
import KeyConcepts from '../components/KeyConcepts';
import { keyConcepts } from '../data/keyConcepts';

interface SectionPageProps {
  sectionId: number;
  onBack: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
}

export default function SectionPage({ sectionId, onBack, onFlashcards, onQuiz }: SectionPageProps) {
  const section = sections.find((s) => s.id === sectionId);

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Section not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Sections
        </button>

        <div className="mb-8">
          <div className={`inline-block px-4 py-1 bg-gradient-to-r ${section.color} text-white text-sm font-semibold rounded-full mb-4`}>
            Section {section.id}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{section.description}</p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={onFlashcards}
              className={`flex items-center px-6 py-3 bg-gradient-to-r ${section.color} text-white rounded-lg hover:shadow-lg transition-all`}
            >
              <Brain className="w-5 h-5 mr-2" />
              Study Flashcards
            </button>
            <button
              onClick={onQuiz}
              className="flex items-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
            >
              <FileText className="w-5 h-5 mr-2" />
              Practice Quiz
            </button>
          </div>
        </div>

        <div className="mb-8">
          <KeyConcepts
            concepts={keyConcepts
              .filter((kc) => kc.sectionId === sectionId)
              .map((kc) => ({ title: kc.title, description: kc.description }))}
            sectionColor={section.color}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Domains Covered</h2>
          {section.domains.map((domain) => (
            <div key={domain.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} bg-opacity-10 mr-4 flex-shrink-0`}>
                    <BookOpen className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{domain.name}</h3>
                    <p className="text-gray-600 mb-3">{domain.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 bg-gradient-to-r ${section.color} text-white text-xs font-semibold rounded-full flex-shrink-0`}>
                  {domain.weight}
                </span>
              </div>
              <div className="ml-14">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {domain.keyTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
