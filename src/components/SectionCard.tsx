import { BookOpen, ChevronRight } from 'lucide-react';

interface SectionCardProps {
  id: number;
  title: string;
  description: string;
  color: string;
  domainCount: number;
  onClick: () => void;
}

export default function SectionCard({ title, description, color, domainCount, onClick }: SectionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
            <BookOpen className="w-6 h-6 text-gray-700" />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">{domainCount} Domains</span>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
}
