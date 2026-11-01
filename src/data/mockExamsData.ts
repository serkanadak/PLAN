import { MockExam, AcademicSubjectId, ExamSubjectResult, Grade } from '../types';

export const STANDARD_QUESTION_COUNTS: Record<Grade, Record<AcademicSubjectId, number>> = {
  '8': {
    turkce: 20,
    matematik: 20,
    fen: 20,
    sosyal: 10,
    din: 10,
    ingilizce: 10,
  },
  '7': {
    turkce: 20,
    matematik: 20,
    fen: 20,
    sosyal: 10,
    din: 10,
    ingilizce: 10,
  },
  '6': {
    turkce: 20,
    matematik: 20,
    fen: 20,
    sosyal: 10,
    din: 10,
    ingilizce: 10,
  },
};

export function calculateExamTotals(
  results: Record<AcademicSubjectId, { totalQuestions: number; correct: number; wrong: number; empty: number }>
): {
  processedResults: Record<AcademicSubjectId, ExamSubjectResult>;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  totalNet: number;
  overallSuccessRate: number;
  calculatedScore: number;
} {
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalEmpty = 0;
  let totalNet = 0;

  const processedResults = {} as Record<AcademicSubjectId, ExamSubjectResult>;

  (Object.keys(results) as AcademicSubjectId[]).forEach((subj) => {
    const r = results[subj];
    const net = Math.max(0, Number((r.correct - r.wrong / 3).toFixed(2)));
    const successRate = r.totalQuestions > 0 ? Number(((r.correct / r.totalQuestions) * 100).toFixed(1)) : 0;

    processedResults[subj] = {
      subjectId: subj,
      totalQuestions: r.totalQuestions,
      correct: r.correct,
      wrong: r.wrong,
      empty: r.empty,
      net,
      successRate,
    };

    totalQuestions += r.totalQuestions;
    totalCorrect += r.correct;
    totalWrong += r.wrong;
    totalEmpty += r.empty;
    totalNet += net;
  });

  const overallSuccessRate =
    totalQuestions > 0 ? Number(((totalCorrect / totalQuestions) * 100).toFixed(1)) : 0;

  // LGS Standard MEB Approximation (Base 195 + Weighted net points)
  const turNet = processedResults.turkce?.net || 0;
  const matNet = processedResults.matematik?.net || 0;
  const fenNet = processedResults.fen?.net || 0;
  const inkNet = processedResults.sosyal?.net || 0;
  const dinNet = processedResults.din?.net || 0;
  const ingNet = processedResults.ingilizce?.net || 0;

  const weightedSum =
    turNet * 4.34 +
    matNet * 4.28 +
    fenNet * 4.12 +
    inkNet * 1.66 +
    dinNet * 1.62 +
    ingNet * 1.58;

  const calculatedScore = Number(Math.min(500, Math.max(100, 195 + weightedSum)).toFixed(2));

  return {
    processedResults,
    totalQuestions,
    totalCorrect,
    totalWrong,
    totalEmpty,
    totalNet: Number(totalNet.toFixed(2)),
    overallSuccessRate,
    calculatedScore,
  };
}

export const INITIAL_MOCK_EXAMS: MockExam[] = [];
