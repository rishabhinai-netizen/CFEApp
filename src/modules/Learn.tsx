import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ChevronDown, FileText, Lightbulb, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';

interface StudyContent {
  id: string;
  section_id: number;
  domain_id: string;
  subtopic_id: string | null;
  content_type: 'lesson' | 'micro-lesson' | 'framework' | 'red-flags' | 'example';
  title: string;
  content: string;
  order_index: number;
}

interface Domain {
  id: string;
  name: string;
  subtopics: string[];
}

interface Section {
  id: number;
  title: string;
  domains: Domain[];
}

export default function Learn() {
  const { addXP } = useGame();
  const [sections] = useState<Section[]>([
    {
      id: 1,
      title: 'Financial Transactions & Fraud Schemes',
      domains: [
        { id: '1-1', name: 'Accounting & Finance Basics', subtopics: ['Financial Statements', 'Accounting Methods', 'Internal Controls'] },
        { id: '1-2', name: 'Fraud Schemes', subtopics: ['Asset Misappropriation', 'Corruption', 'Financial Statement Fraud'] },
        { id: '1-3', name: 'Cyber & Identity Fraud', subtopics: ['Digital Fraud', 'Identity Theft', 'Cybersecurity'] }
      ]
    },
    {
      id: 2,
      title: 'Law',
      domains: [
        { id: '2-1', name: 'Legal Foundations', subtopics: ['Criminal Law', 'Civil Law', 'Evidence Rules'] },
        { id: '2-2', name: 'Fraud-Related Laws', subtopics: ['Money Laundering', 'Bribery', 'Securities Fraud'] },
        { id: '2-3', name: 'Legal Procedures', subtopics: ['Court Procedures', 'Expert Testimony', 'Legal Rights'] }
      ]
    },
    {
      id: 3,
      title: 'Investigation',
      domains: [
        { id: '3-1', name: 'Investigation Process', subtopics: ['Planning', 'Evidence Collection', 'Documentation'] },
        { id: '3-2', name: 'Interviewing Techniques', subtopics: ['Interview Planning', 'Questioning Methods', 'Statement Analysis'] },
        { id: '3-3', name: 'Digital Forensics', subtopics: ['Data Recovery', 'Email Analysis', 'Network Forensics'] }
      ]
    },
    {
      id: 4,
      title: 'Fraud Prevention & Deterrence',
      domains: [
        { id: '4-1', name: 'Fraud Prevention Programs', subtopics: ['Risk Assessment', 'Control Activities', 'Monitoring'] },
        { id: '4-2', name: 'Fraud Deterrence', subtopics: ['Ethics Programs', 'Whistleblower Programs', 'Anti-Fraud Culture'] },
        { id: '4-3', name: 'Fraud Risk Management', subtopics: ['Risk Identification', 'Risk Mitigation', 'Continuous Improvement'] }
      ]
    }
  ]);

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1]));
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [selectedContent, setSelectedContent] = useState<StudyContent | null>(null);
  const [studyContent, setStudyContent] = useState<StudyContent[]>([]);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyContent();
  }, []);

  async function loadStudyContent() {
    const { data, error } = await supabase
      .from('study_content')
      .select('*')
      .order('section_id', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading study content:', error);
    } else if (data) {
      setStudyContent(data);
      if (data.length > 0 && !selectedContent) {
        setSelectedContent(data[0]);
      }
    }
    setLoading(false);
  }

  function toggleSection(sectionId: number) {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  }

  function toggleDomain(domainId: string) {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  }

  function getContentForLocation(sectionId: number, domainId: string, subtopicId?: string) {
    return studyContent.filter(c =>
      c.section_id === sectionId &&
      c.domain_id === domainId &&
      (subtopicId ? c.subtopic_id === subtopicId : !c.subtopic_id)
    );
  }

  function getContentIcon(type: string) {
    switch (type) {
      case 'lesson': return FileText;
      case 'micro-lesson': return Lightbulb;
      case 'framework': return Target;
      case 'red-flags': return AlertTriangle;
      case 'example': return BookOpen;
      default: return FileText;
    }
  }

  function getContentColor(type: string) {
    switch (type) {
      case 'lesson': return 'text-blue-600 bg-blue-50';
      case 'micro-lesson': return 'text-purple-600 bg-purple-50';
      case 'framework': return 'text-green-600 bg-green-50';
      case 'red-flags': return 'text-red-600 bg-red-50';
      case 'example': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  async function markAsComplete(contentId: string) {
    if (!completedContent.has(contentId)) {
      setCompletedContent(new Set([...completedContent, contentId]));
      await addXP(20);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading study content...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Content Library</h2>
          <p className="text-sm text-gray-600 mt-1">Explore CFE study materials</p>
        </div>

        <div className="p-2">
          {sections.map(section => (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />
                  )}
                  <span className="font-semibold text-gray-900 text-sm">Section {section.id}</span>
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="ml-4 space-y-1">
                  {section.domains.map(domain => (
                    <div key={domain.id}>
                      <button
                        onClick={() => toggleDomain(domain.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-left"
                      >
                        <div className="flex items-center">
                          {expandedDomains.has(domain.id) ? (
                            <ChevronDown className="w-3 h-3 mr-2 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 mr-2 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{domain.name}</span>
                        </div>
                      </button>

                      {expandedDomains.has(domain.id) && (
                        <div className="ml-6 space-y-1">
                          {getContentForLocation(section.id, domain.id).map(content => {
                            const Icon = getContentIcon(content.content_type);
                            const isCompleted = completedContent.has(content.id);
                            return (
                              <button
                                key={content.id}
                                onClick={() => setSelectedContent(content)}
                                className={`w-full flex items-center justify-between p-2 rounded text-left text-xs ${
                                  selectedContent?.id === content.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'hover:bg-gray-50 text-gray-600'
                                }`}
                              >
                                <div className="flex items-center">
                                  <Icon className="w-3 h-3 mr-2" />
                                  <span className="truncate">{content.title}</span>
                                </div>
                                {isCompleted && <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedContent ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getContentColor(selectedContent.content_type)}`}>
                {selectedContent.content_type.replace('-', ' ').toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedContent.title}</h1>
              <div className="flex items-center text-sm text-gray-500">
                <span>Section {selectedContent.section_id}</span>
                <span className="mx-2">•</span>
                <span>Domain {selectedContent.domain_id}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedContent.content}
                </div>
              </div>
            </div>

            {!completedContent.has(selectedContent.id) && (
              <button
                onClick={() => markAsComplete(selectedContent.id)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Mark as Complete (+20 XP)
              </button>
            )}

            {completedContent.has(selectedContent.id) && (
              <div className="flex items-center justify-center py-3 text-green-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a topic to start learning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
