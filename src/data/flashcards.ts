export interface Flashcard {
  id: string;
  sectionId: number;
  question: string;
  answer: string;
  category: string;
}

export const flashcards: Flashcard[] = [
  {
    id: "s1-f1",
    sectionId: 1,
    question: "What is skimming?",
    answer: "The theft of cash from a victim entity prior to its entry in an accounting system. Common examples include unrecorded sales, understated sales, and theft of incoming checks.",
    category: "Asset Misappropriation"
  },
  {
    id: "s1-f2",
    sectionId: 1,
    question: "What are the three stages of money laundering?",
    answer: "1) Placement - introducing illicit funds into the financial system, 2) Layering - complex transactions to disguise the source, 3) Integration - reintroducing laundered funds into the economy as legitimate wealth.",
    category: "Money Laundering"
  },
  {
    id: "s1-f3",
    sectionId: 1,
    question: "What is a shell company scheme?",
    answer: "A fraudulent billing scheme where an employee creates a false vendor (shell company) and submits fake invoices for payment. The employee controls the shell company and receives the fraudulent payments.",
    category: "Fraudulent Disbursements"
  },
  {
    id: "s1-f4",
    sectionId: 1,
    question: "What is the difference between skimming and cash larceny?",
    answer: "Skimming is theft before cash is recorded (off-book theft), while cash larceny is theft after cash has been recorded in the accounting system (on-book theft).",
    category: "Asset Misappropriation"
  },
  {
    id: "s2-f1",
    sectionId: 2,
    question: "What is the burden of proof in criminal cases?",
    answer: "Beyond a reasonable doubt - the prosecution must prove the defendant's guilt to such a degree that no reasonable person would question the verdict.",
    category: "Legal Systems"
  },
  {
    id: "s2-f2",
    sectionId: 2,
    question: "What are the FATF 40 Recommendations?",
    answer: "International standards for anti-money laundering (AML) and combating the financing of terrorism (CFT), covering legal frameworks, preventive measures, transparency, and international cooperation.",
    category: "Money Laundering Laws"
  },
  {
    id: "s2-f3",
    sectionId: 2,
    question: "What is the chain of custody?",
    answer: "The chronological documentation showing the seizure, custody, control, transfer, analysis, and disposition of evidence. It establishes that evidence has not been tampered with.",
    category: "Evidence"
  },
  {
    id: "s2-f4",
    sectionId: 2,
    question: "What is insider trading?",
    answer: "Trading securities based on material, non-public information in violation of a duty of trust or confidence. It's illegal because it gives unfair advantage and undermines market integrity.",
    category: "Securities Fraud"
  },
  {
    id: "s3-f1",
    sectionId: 3,
    question: "What are the three components of the Fraud Triangle?",
    answer: "1) Pressure (motivation to commit fraud), 2) Opportunity (ability to commit fraud without detection), 3) Rationalization (justification for the dishonest act).",
    category: "Fraud Theory"
  },
  {
    id: "s3-f2",
    sectionId: 3,
    question: "What is predication?",
    answer: "The totality of circumstances that would lead a reasonable, professionally trained person to believe a fraud has occurred, is occurring, or will occur. It's required before starting a fraud investigation.",
    category: "Investigation Planning"
  },
  {
    id: "s3-f3",
    sectionId: 3,
    question: "What is Benford's Law?",
    answer: "A mathematical principle stating that in naturally occurring datasets, the leading digit is more likely to be small (1 appears ~30% of the time). Deviations may indicate data manipulation or fraud.",
    category: "Data Analysis"
  },
  {
    id: "s3-f4",
    sectionId: 3,
    question: "What are the key elements of an effective interview?",
    answer: "Thorough planning, building rapport, asking open-ended questions, active listening, observing verbal and non-verbal behavior, maintaining control, and proper documentation.",
    category: "Interviewing"
  },
  {
    id: "s3-f5",
    sectionId: 3,
    question: "What is the difference between direct and circumstantial evidence?",
    answer: "Direct evidence directly proves a fact (e.g., eyewitness testimony). Circumstantial evidence requires inference to connect it to a conclusion (e.g., fingerprints at a crime scene).",
    category: "Evidence"
  },
  {
    id: "s4-f1",
    sectionId: 4,
    question: "What are the five components of COSO Internal Control Framework?",
    answer: "1) Control Environment, 2) Risk Assessment, 3) Control Activities, 4) Information & Communication, 5) Monitoring Activities.",
    category: "Internal Control"
  },
  {
    id: "s4-f2",
    sectionId: 4,
    question: "What is 'tone at the top'?",
    answer: "The ethical atmosphere created by an organization's leadership. It includes management's philosophy, operating style, integrity, and commitment to ethical values, significantly influencing organizational culture.",
    category: "Ethics & Culture"
  },
  {
    id: "s4-f3",
    sectionId: 4,
    question: "What is ISO 37001?",
    answer: "An international standard for Anti-Bribery Management Systems, outlining requirements to prevent, detect, and respond to bribery, including policies, risk assessments, due diligence, training, and monitoring.",
    category: "Compliance"
  },
  {
    id: "s4-f4",
    sectionId: 4,
    question: "According to ACFE research, what is the most common method of fraud detection?",
    answer: "Tips from whistleblowers (approximately 42% of cases). This highlights the importance of effective whistleblower hotlines and reporting mechanisms.",
    category: "Fraud Detection"
  },
  {
    id: "s4-f5",
    sectionId: 4,
    question: "What is segregation of duties?",
    answer: "A control principle that divides responsibilities so no single person has control over all aspects of a transaction, reducing opportunity for fraud. For example, authorization, recording, and custody should be separated.",
    category: "Internal Control"
  },
  {
    id: "s4-f6",
    sectionId: 4,
    question: "What is a fraud risk assessment?",
    answer: "A systematic process to identify potential fraud schemes, assess their likelihood and impact, evaluate existing controls, and determine where additional mitigation is needed.",
    category: "Risk Management"
  }
];
