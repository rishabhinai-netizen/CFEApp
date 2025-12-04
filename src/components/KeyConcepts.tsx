import { Lightbulb } from 'lucide-react';

interface KeyConceptsProps {
  concepts: {
    title: string;
    description: string;
  }[];
  sectionColor: string;
}

export default function KeyConcepts({ concepts, sectionColor }: KeyConceptsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${sectionColor} bg-opacity-10 mr-3`}>
          <Lightbulb className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Key Concepts</h2>
      </div>
      <div className="space-y-4">
        {concepts.map((concept, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold text-gray-800 mb-1">{concept.title}</h3>
            <p className="text-gray-600 text-sm">{concept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
