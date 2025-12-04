import { useState, useEffect } from 'react';
import { GameProvider } from './contexts/GameContext';
import { seedDatabase } from './lib/seedData';

// Pages
import Dashboard from './modules/Dashboard';
import Learn from './modules/Learn';
import Practice from './modules/Practice';
import Flashcards from './modules/Flashcards';
import CaseLab from './modules/CaseLab';
import ExamSimulator from './modules/ExamSimulator';
import Progress from './modules/Progress';
import Achievements from './modules/Achievements';
import BuddyMode from './modules/BuddyMode';
import Settings from './modules/Settings';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

type Page = 'dashboard' | 'learn' | 'practice' | 'flashcards' | 'caselab' | 'exam' | 'progress' | 'achievements' | 'buddy' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hasSeeded = localStorage.getItem('cfe_seeded');
    if (hasSeeded) {
      setSeeded(true);
    }
  }, []);

  const handleSeedDatabase = async () => {
    if (seeding || seeded) return;
    setSeeding(true);
    try {
      await seedDatabase();
      localStorage.setItem('cfe_seeded', 'true');
      setSeeded(true);
      alert('Database seeded successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
      alert('Error seeding database. Check console.');
    } finally {
      setSeeding(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'learn':
        return <Learn />;
      case 'practice':
        return <Practice />;
      case 'flashcards':
        return <Flashcards />;
      case 'caselab':
        return <CaseLab />;
      case 'exam':
        return <ExamSimulator />;
      case 'progress':
        return <Progress />;
      case 'achievements':
        return <Achievements />;
      case 'buddy':
        return <BuddyMode />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <GameProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setMobileMenuOpen(false);
          }}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar
            onSeedDatabase={handleSeedDatabase}
            seeded={seeded}
            seeding={seeding}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
