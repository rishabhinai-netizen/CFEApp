import { CheckCircle, Circle } from 'lucide-react';

interface ProgressTrackerProps {
  completed: number;
  total: number;
  title: string;
}

export default function ProgressTracker({ completed, total, title }: ProgressTrackerProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-500">
          {completed} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{percentage}% Complete</span>
        {percentage === 100 ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Circle className="w-4 h-4 text-gray-300" />
        )}
      </div>
    </div>
  );
}
