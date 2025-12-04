export interface KeyConcept {
  sectionId: number;
  title: string;
  description: string;
}

export const keyConcepts: KeyConcept[] = [
  {
    sectionId: 1,
    title: "Fraud Triangle",
    description: "Three factors must coexist for fraud: Pressure (motivation), Opportunity (ability to commit without detection), and Rationalization (justification). Prevention aims to remove at least one element."
  },
  {
    sectionId: 1,
    title: "Skimming vs. Cash Larceny",
    description: "Skimming is theft before cash is recorded (off-book), while cash larceny is theft after recording (on-book). Skimming is harder to detect because it never appears in accounting records."
  },
  {
    sectionId: 1,
    title: "Money Laundering Stages",
    description: "Placement (introducing illicit funds), Layering (complex transactions to obscure source), Integration (reintroducing as legitimate wealth). Each stage requires different detection strategies."
  },
  {
    sectionId: 1,
    title: "Shell Company Schemes",
    description: "Employee creates fictitious vendor and submits fake invoices. Detection methods include vendor due diligence, surprise audits, and analytics for duplicate addresses or unusual payment patterns."
  },
  {
    sectionId: 2,
    title: "Burden of Proof",
    description: "Criminal cases require 'beyond a reasonable doubt' (highest standard), while civil cases only need 'preponderance of evidence' (more likely than not). This affects litigation strategy."
  },
  {
    sectionId: 2,
    title: "Chain of Custody",
    description: "Chronological documentation of evidence handling from seizure to disposition. Critical for admissibility in court - any break can render evidence inadmissible."
  },
  {
    sectionId: 2,
    title: "FATF 40 Recommendations",
    description: "International standards for anti-money laundering (AML) covering legal frameworks, preventive measures, transparency, and international cooperation. Basis for most countries' AML laws."
  },
  {
    sectionId: 2,
    title: "Attorney-Client Privilege",
    description: "Protects confidential communications between attorney and client. Exceptions include crime-fraud exception (seeking legal advice to commit fraud) and waiver by client disclosure."
  },
  {
    sectionId: 3,
    title: "Predication",
    description: "Totality of circumstances suggesting fraud has occurred. Required before starting investigation - prevents fishing expeditions and protects individual rights."
  },
  {
    sectionId: 3,
    title: "Benford's Law",
    description: "In natural datasets, leading digit 1 appears ~30% of time. Deviations may indicate manipulation. Effective for financial data analysis but has limitations with assigned numbers."
  },
  {
    sectionId: 3,
    title: "Interview Techniques",
    description: "Build rapport first, use open-ended questions, active listening, observe verbal/non-verbal cues. The Reid Technique and Cognitive Interview are common approaches."
  },
  {
    sectionId: 3,
    title: "Digital Forensics",
    description: "Collecting electronic evidence while maintaining integrity. Write-blockers prevent modification, imaging creates exact copies, and hash values verify authenticity."
  },
  {
    sectionId: 4,
    title: "COSO Framework",
    description: "Five components: Control Environment (tone at top), Risk Assessment, Control Activities, Information & Communication, Monitoring. Foundation for internal control and fraud prevention."
  },
  {
    sectionId: 4,
    title: "Tone at the Top",
    description: "Leadership's ethical example and commitment to integrity. Most critical fraud prevention factor - sets organizational culture and employee behavior expectations."
  },
  {
    sectionId: 4,
    title: "Segregation of Duties",
    description: "No single person controls all transaction aspects. Authorization, recording, and custody should be separated. Reduces opportunity for fraud by requiring collusion."
  },
  {
    sectionId: 4,
    title: "Whistleblower Programs",
    description: "Tips are #1 fraud detection method (~42% of cases). Effective programs need confidentiality, non-retaliation policies, multiple reporting channels, and visible management support."
  },
  {
    sectionId: 4,
    title: "Fraud Risk Assessment",
    description: "Systematic identification of potential schemes, likelihood/impact evaluation, control effectiveness review, and mitigation planning. Should be ongoing, not one-time exercise."
  },
  {
    sectionId: 4,
    title: "ISO 37001",
    description: "International Anti-Bribery Management System standard. Requires policy, top management commitment, risk assessments, due diligence, training, reporting mechanisms, and monitoring."
  }
];
