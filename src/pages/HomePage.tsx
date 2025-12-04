import { GraduationCap } from 'lucide-react';
import SectionCard from '../components/SectionCard';
import { sections } from '../data/sections';

interface HomePageProps {
  onSectionSelect: (sectionId: number) => void;
}

export default function HomePage({ onSectionSelect }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CFE Exam Study Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master all four sections of the Certified Fraud Examiner exam with comprehensive study materials,
            flashcards, and practice questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
              color={section.color}
              domainCount={section.domains.length}
              onClick={() => onSectionSelect(section.id)}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About the CFE Exam</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Exam Format</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>4 sections, 125 questions each</li>
                <li>Multiple choice format</li>
                <li>75 hours to complete all sections</li>
                <li>Open-book exam</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Passing Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>75% minimum score per section</li>
                <li>All 4 sections must be passed</li>
                <li>Self-paced study approach</li>
                <li>Access to study materials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
