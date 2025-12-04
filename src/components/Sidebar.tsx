import { Home, BookOpen, Brain, Layers, FlaskConical, FileCheck, TrendingUp, Trophy, Heart, Settings, X } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: Brain },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'caselab', label: 'Case Lab', icon: FlaskConical },
  { id: 'exam', label: 'Exam Simulator', icon: FileCheck },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'buddy', label: 'Buddy Mode', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ currentPage, onNavigate, mobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CFE Prep Pro</h1>
            <p className="text-blue-200 text-sm mt-1">Exam Ready. Career Ready.</p>
          </div>
          <button
            onClick={onMobileMenuClose}
            className="lg:hidden text-white hover:bg-blue-700 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="text-xs text-blue-200 text-center">
            © 2025 CFE Prep Pro
          </div>
        </div>
      </div>
    </>
  );
}
