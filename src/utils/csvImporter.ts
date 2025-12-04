import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

export interface CSVQuestion {
  section_id: string;
  domain_id: string;
  subtopic_id?: string;
  question_type: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty?: string;
  tags?: string;
  pdf_reference?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}

export function validateCSVRow(row: any, rowNumber: number): string | null {
  const requiredFields = [
    'section_id',
    'domain_id',
    'question_type',
    'question_text',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_answer',
    'explanation'
  ];

  for (const field of requiredFields) {
    if (!row[field] || row[field].trim() === '') {
      return `Row ${rowNumber}: Missing required field "${field}"`;
    }
  }

  const sectionId = parseInt(row.section_id);
  if (isNaN(sectionId) || sectionId < 1 || sectionId > 4) {
    return `Row ${rowNumber}: section_id must be between 1 and 4`;
  }

  const correctAnswer = row.correct_answer.trim().toUpperCase();
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    return `Row ${rowNumber}: correct_answer must be A, B, C, or D`;
  }

  const questionType = row.question_type.trim().toLowerCase();
  if (!['single', 'multiple', 'true-false'].includes(questionType)) {
    return `Row ${rowNumber}: question_type must be "single", "multiple", or "true-false"`;
  }

  return null;
}

export function mapCSVRowToQuestion(row: any): any {
  return {
    section_id: parseInt(row.section_id),
    domain_id: row.domain_id.trim(),
    subtopic_id: row.subtopic_id?.trim() || null,
    question_type: row.question_type.trim().toLowerCase(),
    question_text: row.question_text.trim(),
    option_a: row.option_a.trim(),
    option_b: row.option_b.trim(),
    option_c: row.option_c.trim(),
    option_d: row.option_d.trim(),
    correct_answer: row.correct_answer.trim().toUpperCase(),
    explanation: row.explanation.trim(),
    difficulty: row.difficulty?.trim().toLowerCase() || 'medium',
    tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
    pdf_reference: row.pdf_reference?.trim() || null
  };
}

export async function importQuestionsFromCSV(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const errors: string[] = [];
    let imported = 0;
    let failed = 0;

    Papa.parse<CSVQuestion>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const validQuestions: any[] = [];

        results.data.forEach((row, index) => {
          const validationError = validateCSVRow(row, index + 2);
          if (validationError) {
            errors.push(validationError);
            failed++;
          } else {
            try {
              const question = mapCSVRowToQuestion(row);
              validQuestions.push(question);
            } catch (error) {
              errors.push(`Row ${index + 2}: Error mapping data - ${error}`);
              failed++;
            }
          }
        });

        if (validQuestions.length > 0) {
          const BATCH_SIZE = 100;
          for (let i = 0; i < validQuestions.length; i += BATCH_SIZE) {
            const batch = validQuestions.slice(i, i + BATCH_SIZE);

            const { error, count } = await supabase
              .from('questions')
              .insert(batch)
              .select('id', { count: 'exact', head: true });

            if (error) {
              errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: Database error - ${error.message}`);
              failed += batch.length;
            } else {
              imported += batch.length;
            }
          }
        }

        resolve({
          success: errors.length === 0,
          imported,
          failed,
          errors
        });
      },
      error: (error) => {
        resolve({
          success: false,
          imported: 0,
          failed: 0,
          errors: [`CSV parsing error: ${error.message}`]
        });
      }
    });
  });
}

export function generateSampleCSV(): string {
  const headers = [
    'section_id',
    'domain_id',
    'subtopic_id',
    'question_type',
    'question_text',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_answer',
    'explanation',
    'difficulty',
    'tags',
    'pdf_reference'
  ];

  const sampleRows = [
    [
      '1',
      '1-1',
      'accounting-basics',
      'single',
      'What is the accounting equation?',
      'Assets = Liabilities + Equity',
      'Assets = Revenue - Expenses',
      'Assets + Liabilities = Equity',
      'Revenue = Assets + Liabilities',
      'A',
      'The fundamental accounting equation states that Assets = Liabilities + Equity, which must always balance.',
      'easy',
      'accounting,fundamentals',
      'Section 1, Page 3'
    ],
    [
      '2',
      '2-1',
      'legal-systems',
      'single',
      'What is the burden of proof in criminal cases?',
      'Preponderance of evidence',
      'Clear and convincing',
      'Beyond a reasonable doubt',
      'Probable cause',
      'C',
      'Criminal cases require proof beyond a reasonable doubt, the highest standard of proof.',
      'medium',
      'law,burden-of-proof',
      'Section 2, Page 4'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadSampleCSV() {
  const csvContent = generateSampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'cfe_questions_template.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
