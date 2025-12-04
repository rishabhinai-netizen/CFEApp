export interface QuizQuestion {
  id: string;
  sectionId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1-1",
    sectionId: 1,
    question: "Which of the following is NOT a component of the fraud triangle?",
    options: [
      "Perceived Pressure",
      "Perceived Opportunity",
      "Personal Capability",
      "Rationalization"
    ],
    correctAnswer: 2,
    explanation: "Personal Capability is part of the Fraud Diamond, not the original Fraud Triangle. The three components of the fraud triangle are: Pressure, Opportunity, and Rationalization.",
    category: "Fraud Theory"
  },
  {
    id: "q1-2",
    sectionId: 1,
    question: "What type of fraud scheme involves creating a fake vendor to submit fraudulent invoices?",
    options: [
      "Check tampering",
      "Shell company scheme",
      "Payroll fraud",
      "Expense reimbursement fraud"
    ],
    correctAnswer: 1,
    explanation: "A shell company scheme is a billing fraud where an employee creates a fictitious vendor and submits fake invoices for payment to that vendor.",
    category: "Fraudulent Disbursements"
  },
  {
    id: "q1-3",
    sectionId: 1,
    question: "Which stage of money laundering involves introducing illicit funds into the financial system?",
    options: [
      "Layering",
      "Integration",
      "Placement",
      "Structuring"
    ],
    correctAnswer: 2,
    explanation: "Placement is the first stage where illicit funds are introduced into the financial system. Layering involves complex transactions to obscure the source, and integration reintroduces the laundered funds as legitimate wealth.",
    category: "Money Laundering"
  },
  {
    id: "q2-1",
    sectionId: 2,
    question: "What is the burden of proof in criminal fraud cases?",
    options: [
      "Preponderance of the evidence",
      "Clear and convincing evidence",
      "Beyond a reasonable doubt",
      "Probable cause"
    ],
    correctAnswer: 2,
    explanation: "In criminal cases, the prosecution must prove guilt 'beyond a reasonable doubt,' the highest standard of proof. Civil cases only require 'preponderance of the evidence' (more likely than not).",
    category: "Legal Systems"
  },
  {
    id: "q2-2",
    sectionId: 2,
    question: "What does the chain of custody document?",
    options: [
      "The organizational hierarchy",
      "The sequence of interviews conducted",
      "The chronological documentation of evidence handling",
      "The corporate structure"
    ],
    correctAnswer: 2,
    explanation: "Chain of custody is the chronological documentation showing seizure, custody, control, transfer, analysis, and disposition of evidence to prove it hasn't been tampered with.",
    category: "Evidence"
  },
  {
    id: "q3-1",
    sectionId: 3,
    question: "What is predication in fraud investigations?",
    options: [
      "The final conclusion of an investigation",
      "The totality of circumstances suggesting fraud has occurred",
      "The prediction of future fraud",
      "The documentation of evidence"
    ],
    correctAnswer: 1,
    explanation: "Predication is the totality of circumstances that would lead a reasonable, professionally trained person to believe fraud has occurred, is occurring, or will occur. It's required before starting an investigation.",
    category: "Investigation Planning"
  },
  {
    id: "q3-2",
    sectionId: 3,
    question: "According to Benford's Law, which leading digit appears most frequently in naturally occurring datasets?",
    options: [
      "5",
      "1",
      "9",
      "All digits appear equally"
    ],
    correctAnswer: 1,
    explanation: "In naturally occurring datasets, the digit 1 appears as the leading digit approximately 30% of the time. Deviations from Benford's Law may indicate data manipulation or fraud.",
    category: "Data Analysis"
  },
  {
    id: "q3-3",
    sectionId: 3,
    question: "What percentage of fraud cases are detected by tips according to ACFE research?",
    options: [
      "15%",
      "25%",
      "42%",
      "60%"
    ],
    correctAnswer: 2,
    explanation: "Approximately 42% of fraud cases are detected by tips, making it the most common detection method. This highlights the importance of whistleblower hotlines and reporting mechanisms.",
    category: "Fraud Detection"
  },
  {
    id: "q4-1",
    sectionId: 4,
    question: "Which action best addresses the 'control environment' component of COSO?",
    options: [
      "Implementing surprise cash counts",
      "Management communicating zero-tolerance for fraud and modeling ethical behavior",
      "Using data analytics to scan for unusual transactions",
      "Requiring two signatures on checks above a threshold"
    ],
    correctAnswer: 1,
    explanation: "The control environment relates to tone at the top and ethical culture. Management communicating zero-tolerance and modeling ethics directly improves this. The other options are control activities or monitoring techniques.",
    category: "Internal Control"
  },
  {
    id: "q4-2",
    sectionId: 4,
    question: "Under India's Companies Act, which body must oversee the whistleblower mechanism?",
    options: [
      "The CEO",
      "The CFO",
      "The Audit Committee",
      "The External Auditor"
    ],
    correctAnswer: 2,
    explanation: "Section 177 of the Companies Act, 2013 requires the Audit Committee to oversee the vigil (whistleblower) mechanism and ensure adequate protections for reporters.",
    category: "Compliance"
  },
  {
    id: "q4-3",
    sectionId: 4,
    question: "What are the five components of the COSO Internal Control Framework?",
    options: [
      "Planning, Organizing, Directing, Controlling, Evaluating",
      "Control Environment, Risk Assessment, Control Activities, Information & Communication, Monitoring",
      "Prevention, Detection, Investigation, Prosecution, Recovery",
      "Governance, Risk Management, Compliance, Ethics, Reporting"
    ],
    correctAnswer: 1,
    explanation: "The COSO framework consists of five interrelated components: Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities.",
    category: "Internal Control"
  },
  {
    id: "q4-4",
    sectionId: 4,
    question: "Which scenario best illustrates 'increasing the perception of detection'?",
    options: [
      "Updating the code of conduct annually",
      "Requiring department heads to sign financial statements",
      "Performing unannounced audits and publicizing that fraud will be caught",
      "Providing annual ethics training"
    ],
    correctAnswer: 2,
    explanation: "Unannounced audits and management emphasizing detection directly increase employees' perception that fraud will be caught, which is a powerful deterrent. The other measures are useful but don't as explicitly signal detection capability.",
    category: "Fraud Deterrence"
  },
  {
    id: "q4-5",
    sectionId: 4,
    question: "What is ISO 37001?",
    options: [
      "International standard for quality management",
      "Anti-Bribery Management System standard",
      "Environmental management standard",
      "Information security standard"
    ],
    correctAnswer: 1,
    explanation: "ISO 37001 is an international standard for Anti-Bribery Management Systems. It outlines requirements for organizations to prevent, detect, and respond to bribery.",
    category: "Compliance"
  }
];
