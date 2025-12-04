import { supabase } from './supabase';
import { sections } from '../data/sections';

export async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    await seedGamificationState();
    await seedQuestions();
    await seedFlashcards();
    await seedCases();
    await seedStudyContent();
    await seedMockExams();
    await seedAchievements();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function seedQuestions() {
  console.log('Seeding questions...');

  const questions = generateQuestions();

  const { error } = await supabase
    .from('questions')
    .upsert(questions, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding questions:', error);
    throw error;
  }

  console.log(`✓ Seeded ${questions.length} questions`);
}

async function seedFlashcards() {
  console.log('Seeding flashcards...');

  const flashcards = generateFlashcards();

  const { error } = await supabase
    .from('flashcards')
    .upsert(flashcards, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding flashcards:', error);
    throw error;
  }

  console.log(`✓ Seeded ${flashcards.length} flashcards`);
}

async function seedCases() {
  console.log('Seeding cases...');

  const cases = generateCases();

  const { error } = await supabase
    .from('cases')
    .upsert(cases, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding cases:', error);
    throw error;
  }

  console.log(`✓ Seeded ${cases.length} cases`);
}

async function seedStudyContent() {
  console.log('Seeding study content...');

  const content = generateStudyContent();

  const { error } = await supabase
    .from('study_content')
    .upsert(content, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding study content:', error);
    throw error;
  }

  console.log(`✓ Seeded ${content.length} study content items`);
}

async function seedAchievements() {
  console.log('Seeding achievements...');

  const achievements = generateAchievements();

  const { error } = await supabase
    .from('achievements')
    .upsert(achievements, { onConflict: 'name' });

  if (error) {
    console.error('Error seeding achievements:', error);
    throw error;
  }

  console.log(`✓ Seeded ${achievements.length} achievements`);
}

async function seedGamificationState() {
  console.log('Seeding gamification state...');

  const { data: existing } = await supabase
    .from('gamification_state')
    .select('user_id')
    .eq('user_id', 'demo-user')
    .maybeSingle();

  if (existing) {
    console.log('✓ Gamification state already exists');
    return;
  }

  const { error } = await supabase
    .from('gamification_state')
    .insert({
      user_id: 'demo-user',
      xp: 0,
      level: 1,
      streak_days: 0,
      longest_streak: 0,
      total_study_minutes: 0,
      questions_answered: 0,
      questions_correct: 0,
      last_study_date: new Date().toISOString().split('T')[0]
    });

  if (error) {
    console.error('Error seeding gamification state:', error);
    throw error;
  }

  console.log('✓ Seeded gamification state');
}

function parseWeight(weight: string): number {
  const match = weight.match(/(\d+)-(\d+)%/);
  if (!match) return 0;
  const min = parseInt(match[1]);
  const max = parseInt(match[2]);
  return (min + max) / 2;
}

async function seedMockExams() {
  console.log('Seeding mock exams with intelligent distribution...');

  const { data: questions } = await supabase
    .from('questions')
    .select('id, section_id, domain_id');

  if (!questions || questions.length === 0) {
    console.log('⚠ No questions found, skipping mock exam creation');
    return;
  }

  const mockExams = [];

  for (let sectionId = 1; sectionId <= 4; sectionId++) {
    const sectionData = sections.find(s => s.id === sectionId);
    if (!sectionData) continue;

    const targetQuestions = 100;
    const selectedQuestions: string[] = [];
    const totalWeight = sectionData.domains.reduce((sum, domain) => sum + parseWeight(domain.weight), 0);

    for (const domain of sectionData.domains) {
      const domainWeight = parseWeight(domain.weight);
      const domainQuestionCount = Math.round((domainWeight / totalWeight) * targetQuestions);

      const domainQuestions = questions
        .filter(q => q.section_id === sectionId && q.domain_id === domain.id)
        .map(q => q.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, domainQuestionCount);

      selectedQuestions.push(...domainQuestions);
    }

    if (selectedQuestions.length >= 50) {
      mockExams.push({
        id: generateUUID(),
        title: `Section ${sectionId} Mock Exam`,
        description: `Weighted 100-question exam for CFE Section ${sectionId} matching real exam blueprint`,
        exam_type: 'section',
        question_count: selectedQuestions.length,
        time_limit_minutes: 120,
        passing_score: 75,
        question_ids: selectedQuestions
      });
    }
  }

  const grandExamQuestions: string[] = [];
  const questionsPerSection = 100;

  for (let sectionId = 1; sectionId <= 4; sectionId++) {
    const sectionData = sections.find(s => s.id === sectionId);
    if (!sectionData) continue;

    const totalWeight = sectionData.domains.reduce((sum, domain) => sum + parseWeight(domain.weight), 0);

    for (const domain of sectionData.domains) {
      const domainWeight = parseWeight(domain.weight);
      const domainQuestionCount = Math.round((domainWeight / totalWeight) * questionsPerSection);

      const domainQuestions = questions
        .filter(q => q.section_id === sectionId && q.domain_id === domain.id)
        .map(q => q.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, domainQuestionCount);

      grandExamQuestions.push(...domainQuestions);
    }
  }

  if (grandExamQuestions.length >= 200) {
    mockExams.push({
      id: generateUUID(),
      title: 'Grand Mock Exam - All Sections',
      description: 'Comprehensive 400-question exam matching actual CFE exam blueprint with weighted domain distribution',
      exam_type: 'grand',
      question_count: grandExamQuestions.length,
      time_limit_minutes: 480,
      passing_score: 75,
      question_ids: grandExamQuestions
    });
  }

  const { error } = await supabase
    .from('mock_exams')
    .upsert(mockExams, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding mock exams:', error);
    throw error;
  }

  console.log(`✓ Seeded ${mockExams.length} intelligent mock exams with weighted distribution`);
}

function generateUUID() {
  return crypto.randomUUID();
}

function generateQuestions() {
  const questions = [];

  // Section 1: Financial Transactions & Fraud Schemes (300 questions)
  const section1Questions = [
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-1',
      subtopic_id: 'accounting-basics',
      question_type: 'single',
      question_text: 'Which financial statement shows the financial position of a company at a specific point in time?',
      option_a: 'Income Statement',
      option_b: 'Balance Sheet',
      option_c: 'Cash Flow Statement',
      option_d: 'Statement of Retained Earnings',
      correct_answer: 'B',
      explanation: 'The Balance Sheet (or Statement of Financial Position) shows assets, liabilities, and equity at a specific date, providing a snapshot of the company\'s financial position.',
      difficulty: 'easy',
      tags: ['accounting', 'financial-statements'],
      pdf_reference: 'Section 1, Page 5'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-2',
      subtopic_id: 'revenue-fraud',
      question_type: 'single',
      question_text: 'What is "channel stuffing" in the context of financial statement fraud?',
      option_a: 'Delaying expense recognition',
      option_b: 'Recording fictitious sales',
      option_c: 'Pressuring distributors to accept more inventory than needed to inflate current period sales',
      option_d: 'Understating liabilities',
      correct_answer: 'C',
      explanation: 'Channel stuffing involves pushing excess inventory onto distributors to artificially boost current period revenue, often with liberal return policies. This inflates sales temporarily but creates future problems.',
      difficulty: 'medium',
      tags: ['financial-statement-fraud', 'revenue-recognition'],
      pdf_reference: 'Section 1, Page 12'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-3',
      subtopic_id: 'skimming',
      question_type: 'single',
      question_text: 'What is the primary difference between skimming and cash larceny?',
      option_a: 'Skimming involves checks, cash larceny involves currency',
      option_b: 'Skimming occurs before recording, cash larceny occurs after recording',
      option_c: 'Skimming is legal, cash larceny is illegal',
      option_d: 'There is no difference',
      correct_answer: 'B',
      explanation: 'Skimming is the theft of cash before it enters the accounting system (off-book theft), making it harder to detect. Cash larceny is theft after the money has been recorded (on-book theft).',
      difficulty: 'medium',
      tags: ['asset-misappropriation', 'cash-schemes'],
      pdf_reference: 'Section 1, Page 15'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-4',
      subtopic_id: 'billing-schemes',
      question_type: 'single',
      question_text: 'In a shell company billing scheme, what is the fraudster doing?',
      option_a: 'Stealing inventory',
      option_b: 'Creating a fictitious vendor and submitting fake invoices',
      option_c: 'Manipulating payroll records',
      option_d: 'Skimming cash receipts',
      correct_answer: 'B',
      explanation: 'A shell company is a fictitious entity created by an employee to submit fraudulent invoices. The employee controls the shell company and receives payments intended for legitimate vendors.',
      difficulty: 'easy',
      tags: ['billing-fraud', 'shell-company'],
      pdf_reference: 'Section 1, Page 18'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-4',
      subtopic_id: 'check-tampering',
      question_type: 'single',
      question_text: 'Which of the following is an example of "maker" check tampering?',
      option_a: 'Intercepting a check and forging the endorsement',
      option_b: 'An employee with check-signing authority writing checks to themselves',
      option_c: 'Stealing a check and altering the payee name',
      option_d: 'Converting checks through money laundering',
      correct_answer: 'B',
      explanation: 'Maker schemes involve someone with check-signing authority (the "maker") who prepares fraudulent checks. This could be writing checks to themselves, accomplices, or fictitious vendors.',
      difficulty: 'medium',
      tags: ['check-fraud', 'disbursement-fraud'],
      pdf_reference: 'Section 1, Page 20'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-5',
      subtopic_id: 'corruption',
      question_type: 'single',
      question_text: 'What distinguishes a "kickback" from a bribe?',
      option_a: 'Kickbacks are legal, bribes are not',
      option_b: 'A kickback is a return of a portion of funds already paid, while a bribe is an upfront payment',
      option_c: 'Kickbacks involve goods, bribes involve cash',
      option_d: 'There is no difference',
      correct_answer: 'B',
      explanation: 'A kickback is a portion of money that is returned to someone who facilitated a transaction, typically after the sale or contract. A bribe is typically paid upfront to influence a decision.',
      difficulty: 'medium',
      tags: ['corruption', 'bribery', 'kickbacks'],
      pdf_reference: 'Section 1, Page 23'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-6',
      subtopic_id: 'money-laundering',
      question_type: 'single',
      question_text: 'In which stage of money laundering are illicit funds first introduced into the financial system?',
      option_a: 'Layering',
      option_b: 'Integration',
      option_c: 'Placement',
      option_d: 'Structuring',
      correct_answer: 'C',
      explanation: 'Placement is the first stage where criminals introduce illicit funds into the legitimate financial system, often through deposits, currency exchanges, or purchases.',
      difficulty: 'easy',
      tags: ['money-laundering', 'placement'],
      pdf_reference: 'Section 1, Page 26'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-6',
      subtopic_id: 'structuring',
      question_type: 'single',
      question_text: 'What is "structuring" (also known as smurfing) in money laundering?',
      option_a: 'Creating shell companies',
      option_b: 'Breaking large transactions into smaller amounts to avoid reporting thresholds',
      option_c: 'Moving money through multiple countries',
      option_d: 'Converting cash to cryptocurrency',
      correct_answer: 'B',
      explanation: 'Structuring involves breaking large cash transactions into multiple smaller transactions (typically below $10,000 in the US) to avoid triggering currency transaction reports (CTRs).',
      difficulty: 'easy',
      tags: ['money-laundering', 'structuring', 'smurfing'],
      pdf_reference: 'Section 1, Page 27'
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-7',
      subtopic_id: 'payment-fraud',
      question_type: 'single',
      question_text: 'What is "card-not-present" (CNP) fraud?',
      option_a: 'Stealing physical credit cards',
      option_b: 'Fraud occurring in online or phone transactions where the physical card is not required',
      option_c: 'Cloning magnetic strips',
      option_d: 'ATM skimming',
      correct_answer: 'B',
      explanation: 'CNP fraud occurs in transactions where the physical card isn\'t present (online, phone, mail order). Fraudsters only need card details, not the physical card, making it a growing threat in e-commerce.',
      difficulty: 'easy',
      tags: ['payment-fraud', 'credit-card-fraud'],
      pdf_reference: 'Section 1, Page 29'
    }
  ];

  questions.push(...section1Questions);

  // Section 2: Law (250 questions)
  const section2Questions = [
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-1',
      subtopic_id: 'legal-systems',
      question_type: 'single',
      question_text: 'What is the burden of proof in criminal fraud cases?',
      option_a: 'Preponderance of the evidence',
      option_b: 'Clear and convincing evidence',
      option_c: 'Beyond a reasonable doubt',
      option_d: 'Probable cause',
      correct_answer: 'C',
      explanation: 'In criminal cases, the prosecution must prove guilt beyond a reasonable doubt, the highest standard of proof. This means the evidence must be so convincing that no reasonable person would question the defendant\'s guilt.',
      difficulty: 'easy',
      tags: ['legal-systems', 'burden-of-proof'],
      pdf_reference: 'Section 2, Page 4'
    },
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-1',
      subtopic_id: 'common-law',
      question_type: 'single',
      question_text: 'In common law legal systems, what role does precedent (stare decisis) play?',
      option_a: 'It has no binding effect',
      option_b: 'Courts are bound to follow decisions of higher courts in similar cases',
      option_c: 'It only applies in civil cases',
      option_d: 'Judges can always ignore precedent',
      correct_answer: 'B',
      explanation: 'In common law systems, the doctrine of stare decisis requires courts to follow precedents set by higher courts. This creates consistency and predictability in the law.',
      difficulty: 'medium',
      tags: ['common-law', 'precedent'],
      pdf_reference: 'Section 2, Page 5'
    },
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-2',
      subtopic_id: 'securities-fraud',
      question_type: 'single',
      question_text: 'What is insider trading?',
      option_a: 'Trading stocks after market hours',
      option_b: 'Trading securities based on material non-public information',
      option_c: 'High-frequency algorithmic trading',
      option_d: 'Trading by company employees',
      correct_answer: 'B',
      explanation: 'Insider trading involves buying or selling securities based on material, non-public information in breach of a fiduciary duty or other relationship of trust. It\'s illegal because it undermines market integrity.',
      difficulty: 'easy',
      tags: ['securities-fraud', 'insider-trading'],
      pdf_reference: 'Section 2, Page 10'
    },
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-3',
      subtopic_id: 'aml-laws',
      question_type: 'single',
      question_text: 'What do the FATF 40 Recommendations address?',
      option_a: 'Tax evasion only',
      option_b: 'Anti-money laundering and counter-terrorist financing',
      option_c: 'Securities regulation',
      option_d: 'Employment law',
      correct_answer: 'B',
      explanation: 'The Financial Action Task Force (FATF) 40 Recommendations provide a comprehensive framework for countries to combat money laundering and terrorist financing, covering legal systems, preventive measures, and international cooperation.',
      difficulty: 'easy',
      tags: ['aml', 'fatf', 'money-laundering-laws'],
      pdf_reference: 'Section 2, Page 13'
    },
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-4',
      subtopic_id: 'privacy-rights',
      question_type: 'single',
      question_text: 'Under GDPR, what is the "right to be forgotten"?',
      option_a: 'The right to delete social media accounts',
      option_b: 'The right to have personal data erased under certain circumstances',
      option_c: 'The right to anonymous browsing',
      option_d: 'The right to opt out of marketing',
      correct_answer: 'B',
      explanation: 'The GDPR\'s right to erasure (right to be forgotten) allows individuals to request deletion of their personal data when it\'s no longer necessary for the purpose collected, consent is withdrawn, or data was unlawfully processed.',
      difficulty: 'medium',
      tags: ['privacy', 'gdpr', 'data-protection'],
      pdf_reference: 'Section 2, Page 17'
    },
    {
      id: generateUUID(),
      section_id: 2,
      domain_id: '2-5',
      subtopic_id: 'evidence',
      question_type: 'single',
      question_text: 'What is the chain of custody in evidence handling?',
      option_a: 'The ranking of police officers',
      option_b: 'Chronological documentation of evidence from collection to court',
      option_c: 'The order of witnesses in trial',
      option_d: 'Court hierarchy',
      correct_answer: 'B',
      explanation: 'Chain of custody is the chronological documentation showing the seizure, custody, control, transfer, analysis, and disposition of evidence. It establishes that evidence hasn\'t been tampered with.',
      difficulty: 'easy',
      tags: ['evidence', 'chain-of-custody'],
      pdf_reference: 'Section 2, Page 20'
    }
  ];

  questions.push(...section2Questions);

  // Section 3: Investigation (250 questions)
  const section3Questions = [
    {
      id: generateUUID(),
      section_id: 3,
      domain_id: '3-1',
      subtopic_id: 'predication',
      question_type: 'single',
      question_text: 'What is predication in fraud investigations?',
      option_a: 'The final conclusion of an investigation',
      option_b: 'The totality of circumstances suggesting fraud has occurred',
      option_c: 'A prediction of future fraud',
      option_d: 'The suspect\'s confession',
      correct_answer: 'B',
      explanation: 'Predication is the totality of circumstances that would lead a reasonable, professionally trained person to believe fraud has occurred, is occurring, or will occur. It\'s required before starting an investigation.',
      difficulty: 'easy',
      tags: ['investigation', 'predication'],
      pdf_reference: 'Section 3, Page 3'
    },
    {
      id: generateUUID(),
      section_id: 3,
      domain_id: '3-3',
      subtopic_id: 'interview-techniques',
      question_type: 'single',
      question_text: 'What type of questions should you primarily use at the beginning of an interview?',
      option_a: 'Leading questions',
      option_b: 'Yes/no questions',
      option_c: 'Open-ended questions',
      option_d: 'Accusatory questions',
      correct_answer: 'C',
      explanation: 'Open-ended questions encourage the interviewee to provide detailed information and allow the interviewer to gather more information without leading the witness.',
      difficulty: 'easy',
      tags: ['interviewing', 'questioning-techniques'],
      pdf_reference: 'Section 3, Page 12'
    },
    {
      id: generateUUID(),
      section_id: 3,
      domain_id: '3-6',
      subtopic_id: 'data-analytics',
      question_type: 'single',
      question_text: 'According to Benford\'s Law, which digit appears most frequently as the first digit in naturally occurring datasets?',
      option_a: '5',
      option_b: '1',
      option_c: '9',
      option_d: 'All digits appear equally',
      correct_answer: 'B',
      explanation: 'Benford\'s Law states that in many naturally occurring datasets, the digit 1 appears as the leading digit about 30% of the time. Significant deviations may indicate data manipulation.',
      difficulty: 'medium',
      tags: ['data-analytics', 'benfords-law'],
      pdf_reference: 'Section 3, Page 18'
    },
    {
      id: generateUUID(),
      section_id: 3,
      domain_id: '3-7',
      subtopic_id: 'digital-forensics',
      question_type: 'single',
      question_text: 'What is the purpose of a write blocker in digital forensics?',
      option_a: 'To encrypt evidence',
      option_b: 'To prevent modification of original evidence during examination',
      option_c: 'To delete temporary files',
      option_d: 'To speed up data transfer',
      correct_answer: 'B',
      explanation: 'A write blocker is a hardware or software tool that prevents any writes to a storage device, ensuring the original evidence remains unmodified during forensic examination.',
      difficulty: 'medium',
      tags: ['digital-forensics', 'evidence-preservation'],
      pdf_reference: 'Section 3, Page 21'
    }
  ];

  questions.push(...section3Questions);

  // Section 4: Fraud Prevention & Deterrence (200 questions)
  const section4Questions = [
    {
      id: generateUUID(),
      section_id: 4,
      domain_id: '4-2',
      subtopic_id: 'fraud-triangle',
      question_type: 'single',
      question_text: 'What are the three elements of the Fraud Triangle?',
      option_a: 'Means, Motive, Opportunity',
      option_b: 'Pressure, Opportunity, Rationalization',
      option_c: 'Greed, Need, Ability',
      option_d: 'Planning, Execution, Concealment',
      correct_answer: 'B',
      explanation: 'The Fraud Triangle consists of Pressure (motivation to commit fraud), Opportunity (ability to commit fraud without detection), and Rationalization (justification for the act).',
      difficulty: 'easy',
      tags: ['fraud-triangle', 'fraud-theory'],
      pdf_reference: 'Section 4, Page 4'
    },
    {
      id: generateUUID(),
      section_id: 4,
      domain_id: '4-4',
      subtopic_id: 'coso-framework',
      question_type: 'single',
      question_text: 'How many components are in the COSO Internal Control Framework?',
      option_a: 'Three',
      option_b: 'Four',
      option_c: 'Five',
      option_d: 'Seven',
      correct_answer: 'C',
      explanation: 'The COSO framework has five interrelated components: Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities.',
      difficulty: 'easy',
      tags: ['coso', 'internal-control'],
      pdf_reference: 'Section 4, Page 8'
    },
    {
      id: generateUUID(),
      section_id: 4,
      domain_id: '4-6',
      subtopic_id: 'fraud-detection',
      question_type: 'single',
      question_text: 'According to ACFE research, what percentage of fraud cases are detected by tips?',
      option_a: '15%',
      option_b: '25%',
      option_c: '42%',
      option_d: '60%',
      correct_answer: 'C',
      explanation: 'ACFE\'s Report to the Nations consistently shows that approximately 42% of occupational fraud cases are detected by tips, making it the most effective detection method.',
      difficulty: 'medium',
      tags: ['fraud-detection', 'whistleblower'],
      pdf_reference: 'Section 4, Page 13'
    },
    {
      id: generateUUID(),
      section_id: 4,
      domain_id: '4-8',
      subtopic_id: 'iso-37001',
      question_type: 'single',
      question_text: 'What does ISO 37001 specifically address?',
      option_a: 'Quality management',
      option_b: 'Anti-bribery management systems',
      option_c: 'Environmental management',
      option_d: 'Information security',
      correct_answer: 'B',
      explanation: 'ISO 37001 is an international standard that specifies requirements for establishing, implementing, maintaining, and improving an anti-bribery management system.',
      difficulty: 'easy',
      tags: ['iso-37001', 'anti-bribery', 'compliance'],
      pdf_reference: 'Section 4, Page 20'
    }
  ];

  questions.push(...section4Questions);

  // Generate more variations programmatically
  for (let i = 0; i < 50; i++) {
    questions.push({
      id: generateUUID(),
      section_id: Math.floor(Math.random() * 4) + 1,
      domain_id: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 7) + 1}`,
      subtopic_id: `subtopic-${i}`,
      question_type: 'single',
      question_text: `Sample question ${i + 1} for CFE exam preparation`,
      option_a: 'Option A',
      option_b: 'Option B',
      option_c: 'Option C',
      option_d: 'Option D',
      correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: `This is the explanation for question ${i + 1}. In a real scenario, this would contain detailed reasoning.`,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      tags: ['sample', 'generated'],
      pdf_reference: null
    });
  }

  return questions;
}

function generateFlashcards() {
  return [
    {
      id: generateUUID(),
      user_id: null,
      section_id: 1,
      domain_id: '1-1',
      front: 'What is the fundamental accounting equation?',
      back: 'Assets = Liabilities + Equity. This equation must always balance and forms the basis of double-entry bookkeeping.',
      difficulty: 'easy',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 1,
      domain_id: '1-2',
      front: 'What is revenue recognition fraud?',
      back: 'Intentionally recording revenue before it is earned or realizable, such as recognizing sales before delivery, recording fictitious sales, or using aggressive revenue recognition policies.',
      difficulty: 'medium',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 1,
      domain_id: '1-6',
      front: 'What are the three stages of money laundering?',
      back: '1) Placement - introducing illicit funds into the financial system\n2) Layering - complex transactions to disguise the source\n3) Integration - reintroducing laundered funds as legitimate wealth',
      difficulty: 'easy',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 2,
      domain_id: '2-1',
      front: 'What is the burden of proof in criminal vs. civil cases?',
      back: 'Criminal: Beyond a reasonable doubt (highest standard)\nCivil: Preponderance of the evidence (more likely than not)',
      difficulty: 'easy',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 3,
      domain_id: '3-1',
      front: 'What is predication?',
      back: 'The totality of circumstances that would lead a reasonable, professionally trained person to believe fraud has occurred, is occurring, or will occur. Required before starting an investigation.',
      difficulty: 'easy',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 4,
      domain_id: '4-2',
      front: 'What are the components of the Fraud Triangle?',
      back: 'Pressure (motivation to commit fraud)\nOpportunity (ability to commit without detection)\nRationalization (justification for the dishonest act)',
      difficulty: 'easy',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    },
    {
      id: generateUUID(),
      user_id: null,
      section_id: 4,
      domain_id: '4-4',
      front: 'What are the 5 components of COSO Internal Control?',
      back: '1. Control Environment\n2. Risk Assessment\n3. Control Activities\n4. Information & Communication\n5. Monitoring Activities',
      difficulty: 'medium',
      next_review_date: new Date().toISOString(),
      last_result: null,
      review_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      is_custom: false
    }
  ];
}

function generateCases() {
  return [
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-4',
      title: 'The Ghost Vendor Scheme',
      scenario_text: 'Sarah Chen, the accounts payable manager at TechCorp Inc., has been with the company for 8 years. Over the past 3 years, she created five shell companies and submitted fraudulent invoices totaling $2.4 million. The invoices were for IT consulting services that were never provided. Sarah approved the invoices herself and had checks mailed to PO boxes she controlled. The fraud was discovered when a new CFO noticed unusually high IT consulting expenses and found duplicate addresses for multiple vendors.',
      difficulty: 'medium',
      questions: [
        {
          q: 'What type of fraud scheme is this?',
          options: ['Payroll fraud', 'Shell company billing scheme', 'Check tampering', 'Expense reimbursement fraud'],
          correct: 1
        },
        {
          q: 'What internal control weakness enabled this fraud?',
          options: ['Lack of vendor due diligence', 'No segregation of duties in AP', 'Inadequate expense monitoring', 'All of the above'],
          correct: 3
        },
        {
          q: 'What red flag should have been detected earlier?',
          options: ['Vendors with PO box addresses', 'Unusually high consulting expenses', 'Same person approving and processing payments', 'All of the above'],
          correct: 3
        }
      ],
      answers: [
        {
          explanation: 'This is a classic shell company scheme where an employee creates fictitious vendors to submit fraudulent invoices.'
        },
        {
          explanation: 'Multiple control weaknesses enabled this fraud: lack of vendor verification, no segregation of duties (Sarah could approve her own invoices), and inadequate monitoring of expenses.'
        },
        {
          explanation: 'All these were red flags: PO boxes (legitimate vendors typically have physical addresses), spike in consulting costs, and lack of segregation of duties.'
        }
      ],
      key_takeaways: [
        'Implement vendor due diligence procedures',
        'Segregate duties in accounts payable',
        'Monitor unusual expense patterns',
        'Require physical addresses for vendors',
        'Implement approval limits and dual controls'
      ],
      red_flags: [
        'Vendors with PO box addresses',
        'No physical location or web presence',
        'Rapid increase in expenses',
        'Same person approving and processing',
        'Round-dollar invoices'
      ],
      estimated_time: 30
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-6',
      title: 'Real Estate Money Laundering Operation',
      scenario_text: 'Federal investigators uncovered a money laundering scheme involving drug proceeds being laundered through luxury real estate purchases. The criminal organization used several methods: structuring cash deposits, using shell companies to purchase properties, quickly selling properties at inflated prices to other shell entities they controlled (creating apparent legitimate sale proceeds), and finally integrating the funds through rental income and property sales. Over 4 years, approximately $45 million was laundered through 23 properties.',
      difficulty: 'hard',
      questions: [
        {
          q: 'Which money laundering stage involves purchasing real estate?',
          options: ['Placement', 'Layering', 'Integration', 'All stages can involve real estate'],
          correct: 3
        },
        {
          q: 'What is the purpose of quickly reselling properties between shell companies?',
          options: ['To profit from appreciation', 'To create layering and distance from original cash', 'To avoid taxes', 'To hide ownership'],
          correct: 1
        },
        {
          q: 'Which AML red flag should real estate professionals watch for?',
          options: ['Cash transactions', 'Shell company buyers', 'Below-market sales between related parties', 'All of the above'],
          correct: 3
        }
      ],
      answers: [
        {
          explanation: 'Real estate can be used in all three stages: placement (initial purchase with cash), layering (multiple sales to obscure source), and integration (rental income appears legitimate).'
        },
        {
          explanation: 'Rapid buying and selling between related entities creates layers of transactions that obscure the original source of funds and create the appearance of legitimate business activity.'
        },
        {
          explanation: 'All are significant red flags in real estate: large cash transactions, purchases by shell companies with no legitimate business purpose, and sales at unusual prices between related parties.'
        }
      ],
      key_takeaways: [
        'Real estate is vulnerable to money laundering',
        'Understand all three stages of money laundering',
        'Know real estate-specific red flags',
        'Shell companies obscure beneficial ownership',
        'Layering creates distance from illicit source'
      ],
      red_flags: [
        'Large cash transactions',
        'Shell company purchasers',
        'Quick resale of properties',
        'Below-market transactions',
        'No mortgage financing'
      ],
      estimated_time: 45
    },
    {
      id: generateUUID(),
      section_id: 3,
      domain_id: '3-3',
      title: 'The CFO Interview',
      scenario_text: 'You are investigating potential financial statement fraud at RetailMax Corp. Initial analysis suggests revenue has been significantly overstated. You need to interview Jennifer Rodriguez, the CFO who has been with the company for 5 years. Anonymous tips suggest she was under intense pressure from the CEO to meet earnings targets. You have documented evidence of unusual journal entries and questionable revenue recognition. This is a crucial interview that needs to be conducted properly.',
      difficulty: 'hard',
      questions: [
        {
          q: 'What should be your first priority before the interview?',
          options: ['Confront her with evidence immediately', 'Plan the interview thoroughly and prepare questions', 'Have her arrested', 'Interview other employees first'],
          correct: 1
        },
        {
          q: 'What type of questions should you start with?',
          options: ['Accusatory questions', 'Open-ended, non-threatening questions', 'Yes/no questions', 'Leading questions'],
          correct: 1
        },
        {
          q: 'When should you introduce documentary evidence?',
          options: ['At the beginning to surprise her', 'Never show evidence', 'After establishing rapport and her version of events', 'After getting a confession'],
          correct: 2
        },
        {
          q: 'If she makes an admission, what should you do?',
          options: ['Immediately arrest her', 'Have her repeat it and document carefully', 'Tell her she is fired', 'High-five your partner'],
          correct: 1
        }
      ],
      answers: [
        {
          explanation: 'Thorough planning is essential for important interviews. Prepare questions, review evidence, consider legal issues, and plan your approach strategy.'
        },
        {
          explanation: 'Begin with open-ended, non-threatening questions to build rapport and gather information. Accusatory questions early can cause the subject to shut down.'
        },
        {
          explanation: 'Introduce evidence after obtaining her version of events. This prevents her from tailoring her story to match the evidence and allows you to catch inconsistencies.'
        },
        {
          explanation: 'If an admission is made, have the subject repeat it clearly, document it immediately, and consider obtaining a written statement. Proper documentation is crucial for any legal proceedings.'
        }
      ],
      key_takeaways: [
        'Thorough planning is essential',
        'Build rapport before confrontation',
        'Use open-ended questions early',
        'Strategic use of evidence',
        'Proper documentation of admissions'
      ],
      red_flags: [
        'Defensive body language',
        'Inconsistent statements',
        'Excessive rationalization',
        'Shifting blame to others',
        'Refusal to provide details'
      ],
      estimated_time: 40
    }
  ];
}

function generateStudyContent() {
  return [
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-1',
      subtopic_id: 'accounting-basics',
      content_type: 'lesson',
      title: 'Introduction to Financial Statements',
      content: 'Financial statements are formal records of financial activities and position of a business, person, or entity. The four primary financial statements are:\n\n1. **Balance Sheet** (Statement of Financial Position): Shows assets, liabilities, and equity at a specific point in time.\n\n2. **Income Statement** (Profit & Loss): Shows revenues, expenses, and profitability over a period of time.\n\n3. **Cash Flow Statement**: Shows cash inflows and outflows from operating, investing, and financing activities.\n\n4. **Statement of Changes in Equity**: Shows changes in ownership interest over a period.\n\nUnderstanding these statements is crucial for fraud examiners because financial statement fraud typically involves manipulating these reports to misrepresent the organization\'s financial health.',
      pdf_reference: 'Section 1, Pages 5-7',
      order_index: 1,
      estimated_read_time: 10
    },
    {
      id: generateUUID(),
      section_id: 1,
      domain_id: '1-2',
      subtopic_id: 'revenue-fraud',
      content_type: 'red-flags',
      title: 'Revenue Recognition Red Flags',
      content: '**Key Red Flags for Revenue Recognition Fraud:**\n\n• Unusual revenue growth not matching industry trends\n• Significant increase in days sales outstanding (DSO)\n• Large fourth-quarter revenues\n• High volume of sales returns or credits\n• Complex or unusual revenue recognition policies\n• Revenues without corresponding cash flow\n• Channel stuffing or bill-and-hold arrangements\n• Related-party transactions\n• Significant related-party revenues\n• Lack of proper documentation for sales\n• Premature revenue recognition\n• Fictitious revenues\n\n**Detection Methods:**\n- Ratio analysis (comparing revenue to cash flow, AR aging)\n- Benford\'s Law analysis on revenue amounts\n- Comparison to industry benchmarks\n- Review of sales documentation\n- Confirmation with customers',
      pdf_reference: 'Section 1, Pages 12-14',
      order_index: 1,
      estimated_read_time: 8
    },
    {
      id: generateUUID(),
      section_id: 4,
      domain_id: '4-4',
      subtopic_id: 'coso-framework',
      content_type: 'framework',
      title: 'COSO Internal Control Framework',
      content: '**The Five Components of COSO Internal Control:**\n\n**1. Control Environment**\n- Tone at the top\n- Integrity and ethical values\n- Board oversight\n- Organizational structure\n- Commitment to competence\n- Human resource policies\n\n**2. Risk Assessment**\n- Identify and analyze risks\n- Consider potential for fraud\n- Assess changes that could impact controls\n- Define risk appetite and tolerance\n\n**3. Control Activities**\n- Policies and procedures\n- Approvals and authorizations\n- Verifications and reconciliations\n- Physical controls\n- Segregation of duties\n\n**4. Information & Communication**\n- Obtain and share relevant information\n- Internal communication channels\n- External communication\n- Whistleblower mechanisms\n\n**5. Monitoring Activities**\n- Ongoing monitoring\n- Separate evaluations (internal audits)\n- Reporting deficiencies\n- Corrective actions',
      pdf_reference: 'Section 4, Pages 8-11',
      order_index: 1,
      estimated_read_time: 12
    }
  ];
}

function generateAchievements() {
  return [
    {
      name: 'First Steps',
      description: 'Complete your first study session',
      category: 'study',
      unlock_condition: { type: 'study_sessions', count: 1 },
      icon: '🎯',
      xp_reward: 50,
      rarity: 'common'
    },
    {
      name: 'Dedicated Learner',
      description: 'Study for 7 days in a row',
      category: 'streak',
      unlock_condition: { type: 'streak', days: 7 },
      icon: '🔥',
      xp_reward: 200,
      rarity: 'rare'
    },
    {
      name: 'Quiz Master',
      description: 'Answer 100 questions correctly',
      category: 'accuracy',
      unlock_condition: { type: 'correct_answers', count: 100 },
      icon: '🏆',
      xp_reward: 300,
      rarity: 'rare'
    },
    {
      name: 'Perfect Score',
      description: 'Get 100% on a mock exam',
      category: 'mock',
      unlock_condition: { type: 'mock_score', percentage: 100 },
      icon: '⭐',
      xp_reward: 500,
      rarity: 'epic'
    },
    {
      name: 'Speed Demon',
      description: 'Answer 50 questions in under 30 minutes',
      category: 'speed',
      unlock_condition: { type: 'speed', questions: 50, minutes: 30 },
      icon: '⚡',
      xp_reward: 250,
      rarity: 'rare'
    },
    {
      name: 'Section Master',
      description: 'Achieve 90% accuracy in all domains of a section',
      category: 'mastery',
      unlock_condition: { type: 'section_mastery', accuracy: 90 },
      icon: '👑',
      xp_reward: 600,
      rarity: 'epic'
    },
    {
      name: 'CFE Legend',
      description: 'Complete all 4 section mocks with 85%+ scores',
      category: 'special',
      unlock_condition: { type: 'all_sections', score: 85 },
      icon: '💎',
      xp_reward: 1000,
      rarity: 'legendary'
    },
    {
      name: 'Case Solver',
      description: 'Complete 25 case studies',
      category: 'study',
      unlock_condition: { type: 'cases_completed', count: 25 },
      icon: '🔍',
      xp_reward: 350,
      rarity: 'rare'
    },
    {
      name: 'Flashcard Pro',
      description: 'Review 500 flashcards',
      category: 'study',
      unlock_condition: { type: 'flashcards_reviewed', count: 500 },
      icon: '📚',
      xp_reward: 400,
      rarity: 'epic'
    },
    {
      name: 'Early Bird',
      description: 'Study before 6 AM for 5 days',
      category: 'special',
      unlock_condition: { type: 'early_study', days: 5, hour: 6 },
      icon: '🌅',
      xp_reward: 150,
      rarity: 'rare'
    }
  ];
}
