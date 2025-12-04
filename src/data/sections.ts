export interface Domain {
  id: string;
  name: string;
  weight: string;
  description: string;
  keyTopics: string[];
}

export interface Section {
  id: number;
  title: string;
  description: string;
  color: string;
  domains: Domain[];
}

export const sections: Section[] = [
  {
    id: 1,
    title: "Financial Transactions & Fraud Schemes",
    description: "Asset misappropriation, financial statement fraud, corruption, money laundering, and various fraud schemes",
    color: "from-blue-500 to-blue-700",
    domains: [
      {
        id: "1-1",
        name: "Accounting and Finance Concepts",
        weight: "5-10%",
        description: "Fundamental accounting principles and financial statement basics",
        keyTopics: ["Financial statements", "Accounting cycles", "Internal controls", "Cash vs. accrual accounting"]
      },
      {
        id: "1-2",
        name: "Financial Statement Fraud Schemes",
        weight: "10-15%",
        description: "Fraudulent manipulation of financial statements",
        keyTopics: ["Revenue recognition schemes", "Concealed liabilities", "Improper asset valuations", "Timing differences"]
      },
      {
        id: "1-3",
        name: "Asset Misappropriation: Cash Receipts",
        weight: "5-10%",
        description: "Skimming and cash larceny schemes",
        keyTopics: ["Skimming", "Cash larceny", "Register manipulation", "Deposit tampering"]
      },
      {
        id: "1-4",
        name: "Asset Misappropriation: Fraudulent Disbursements",
        weight: "15-20%",
        description: "Billing schemes, check tampering, payroll fraud, expense reimbursement",
        keyTopics: ["Billing schemes", "Check tampering", "Payroll fraud", "Expense reimbursement fraud"]
      },
      {
        id: "1-5",
        name: "Corruption",
        weight: "10-15%",
        description: "Bribery, kickbacks, conflicts of interest, bid rigging",
        keyTopics: ["Bribery", "Kickbacks", "Conflicts of interest", "Bid rigging", "Economic extortion"]
      },
      {
        id: "1-6",
        name: "Money Laundering",
        weight: "5-10%",
        description: "Three stages: placement, layering, integration",
        keyTopics: ["Placement", "Layering", "Integration", "FATF 40 Recommendations", "Red flags"]
      },
      {
        id: "1-7",
        name: "Identity Theft and Payment Fraud",
        weight: "5-10%",
        description: "Identity theft, card fraud, payment fraud schemes",
        keyTopics: ["Credit card fraud", "Check fraud", "ACH fraud", "Identity theft methods"]
      }
    ]
  },
  {
    id: 2,
    title: "Law",
    description: "Legal systems, fraud-related laws, evidence principles, and criminal/civil proceedings",
    color: "from-green-500 to-green-700",
    domains: [
      {
        id: "2-1",
        name: "Legal Systems Overview",
        weight: "5-10%",
        description: "Common law vs. civil law, criminal vs. civil proceedings",
        keyTopics: ["Common law systems", "Civil law systems", "Burden of proof", "Criminal vs. civil actions"]
      },
      {
        id: "2-2",
        name: "Securities Fraud",
        weight: "10-15%",
        description: "IOSCO standards, Howey test, insider trading",
        keyTopics: ["Securities regulation", "Insider trading", "Market manipulation", "Disclosure requirements"]
      },
      {
        id: "2-3",
        name: "Money Laundering Laws",
        weight: "10-15%",
        description: "FATF 40 Recommendations, AML compliance",
        keyTopics: ["FATF standards", "KYC requirements", "Suspicious activity reporting", "AML programs"]
      },
      {
        id: "2-4",
        name: "Individual Rights",
        weight: "10-15%",
        description: "GDPR, whistleblower protections, attorney-client privilege",
        keyTopics: ["Privacy rights", "GDPR", "Whistleblower protections", "Legal privilege"]
      },
      {
        id: "2-5",
        name: "Evidence Principles",
        weight: "10-15%",
        description: "Authentication, chain of custody, admissibility",
        keyTopics: ["Authentication", "Chain of custody", "Best evidence rule", "Hearsay", "Impeachment"]
      },
      {
        id: "2-6",
        name: "Expert Witness Testimony",
        weight: "5-10%",
        description: "Expert qualifications and testimony standards",
        keyTopics: ["Expert qualifications", "Daubert standard", "Expert reports", "Cross-examination"]
      }
    ]
  },
  {
    id: 3,
    title: "Investigation",
    description: "Fraud examination methodology, interviewing, evidence collection, and digital forensics",
    color: "from-purple-500 to-purple-700",
    domains: [
      {
        id: "3-1",
        name: "Planning & Conducting Fraud Examinations",
        weight: "5-10%",
        description: "Predication, scope, and planning requirements",
        keyTopics: ["Predication", "Investigation planning", "Scope determination", "Resource allocation"]
      },
      {
        id: "3-2",
        name: "Collecting Evidence",
        weight: "1-5%",
        description: "Types and rules for obtaining evidence",
        keyTopics: ["Documentary evidence", "Physical evidence", "Electronic evidence", "Chain of custody"]
      },
      {
        id: "3-3",
        name: "Interview Theory",
        weight: "15-20%",
        description: "Fundamentals of investigative interviewing",
        keyTopics: ["Interview planning", "Rapport building", "Questioning techniques", "Deception detection", "Behavior analysis"]
      },
      {
        id: "3-4",
        name: "Suspect Interviews",
        weight: "10-15%",
        description: "Admission-seeking techniques and signed statements",
        keyTopics: ["Admission-seeking", "Statement analysis", "Closing techniques", "Signed statements"]
      },
      {
        id: "3-5",
        name: "Sources of Information",
        weight: "15-20%",
        description: "Public records, databases, OSINT",
        keyTopics: ["Public records", "Court filings", "Corporate records", "Securities filings", "OSINT", "GDPR compliance"]
      },
      {
        id: "3-6",
        name: "Data Analysis Tools",
        weight: "5-10%",
        description: "Benford's Law, AI/ML, predictive modeling",
        keyTopics: ["Benford's Law", "Data analytics", "AI and machine learning", "Predictive modeling"]
      },
      {
        id: "3-7",
        name: "Digital Forensics",
        weight: "5-10%",
        description: "Collecting electronic evidence and chain of custody",
        keyTopics: ["Computer forensics", "Mobile forensics", "E-discovery", "Digital evidence preservation"]
      },
      {
        id: "3-8",
        name: "Tracing Illicit Transactions",
        weight: "10-15%",
        description: "Following money trail and cryptocurrency",
        keyTopics: ["Asset tracing", "Bank records analysis", "Cryptocurrency tracing", "Shell companies"]
      }
    ]
  },
  {
    id: 4,
    title: "Fraud Prevention & Deterrence",
    description: "Criminology theories, internal controls, fraud risk management, and ethics",
    color: "from-orange-500 to-orange-700",
    domains: [
      {
        id: "4-1",
        name: "Understanding Criminal Behavior",
        weight: "5-10%",
        description: "Criminology theories and behavioral psychology",
        keyTopics: ["Differential association", "Social control theory", "Rational choice theory", "Routine activities theory"]
      },
      {
        id: "4-2",
        name: "White-Collar Crime",
        weight: "15-20%",
        description: "Fraud triangle, organizational crime factors",
        keyTopics: ["Fraud triangle", "Pressure", "Opportunity", "Rationalization", "Organizational factors"]
      },
      {
        id: "4-3",
        name: "Corporate Governance",
        weight: "5-10%",
        description: "OECD principles and Treadway Commission",
        keyTopics: ["Board responsibilities", "OECD principles", "Governance frameworks", "Accountability"]
      },
      {
        id: "4-4",
        name: "Management's Fraud-Related Responsibilities",
        weight: "5-10%",
        description: "COSO framework and internal control",
        keyTopics: ["COSO 5 components", "Control environment", "Risk assessment", "Control activities", "Monitoring"]
      },
      {
        id: "4-5",
        name: "Auditors' Fraud-Related Responsibilities",
        weight: "5-10%",
        description: "External, internal, and government auditors",
        keyTopics: ["External auditor duties", "Internal audit function", "Fraud risk assessment", "Materiality"]
      },
      {
        id: "4-6",
        name: "Fraud Prevention Programs",
        weight: "10-15%",
        description: "Proactive measures and anti-fraud culture",
        keyTopics: ["Perception of detection", "Anti-fraud training", "Whistleblower hotlines", "Tone at the top", "Ethics programs"]
      },
      {
        id: "4-7",
        name: "Fraud Risk Assessment",
        weight: "10-15%",
        description: "Identifying and assessing fraud risks",
        keyTopics: ["Risk assessment process", "Fraud schemes identification", "Control mapping", "Residual risk"]
      },
      {
        id: "4-8",
        name: "Fraud Risk Management",
        weight: "5-10%",
        description: "ISO 31000 and COSO ERM frameworks",
        keyTopics: ["ISO 31000", "COSO ERM", "Risk appetite", "Governance structure", "Third-party risk"]
      },
      {
        id: "4-9",
        name: "Ethics for Fraud Examiners",
        weight: "10-15%",
        description: "Code of ethics and professional responsibilities",
        keyTopics: ["Code of ethics", "Conflicts of interest", "Integrity", "Objectivity", "Professional skepticism"]
      }
    ]
  }
];
