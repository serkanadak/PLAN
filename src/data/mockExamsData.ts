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

export const INITIAL_MOCK_EXAMS: MockExam[] = [
  {
    id: 'exam-1',
    title: '1. Kurumsal LGS Seviye Tespit Sınavı',
    publisher: 'Hız Yayınları',
    date: '2026-09-28',
    grade: '8',
    notes: 'Dönem başı ilk kurumsal hazırbulunuşluk sınavı. Matematik süre yönetimi zorladı.',
    ...(() => {
      const { processedResults, totalQuestions, totalCorrect, totalWrong, totalEmpty, totalNet, overallSuccessRate, calculatedScore } =
        calculateExamTotals({
          turkce: { totalQuestions: 20, correct: 16, wrong: 3, empty: 1 },
          matematik: { totalQuestions: 20, correct: 11, wrong: 6, empty: 3 },
          fen: { totalQuestions: 20, correct: 15, wrong: 4, empty: 1 },
          sosyal: { totalQuestions: 10, correct: 8, wrong: 2, empty: 0 },
          din: { totalQuestions: 10, correct: 8, wrong: 1, empty: 1 },
          ingilizce: { totalQuestions: 10, correct: 7, wrong: 2, empty: 1 },
        });
      return {
        results: processedResults,
        totalQuestions,
        totalCorrect,
        totalWrong,
        totalEmpty,
        totalNet,
        overallSuccessRate,
        calculatedScore,
      };
    })(),
  },
  {
    id: 'exam-2',
    title: 'Özdebir Türkiye Geneli LGS Deneme-1',
    publisher: 'Özdebir Yayınları',
    date: '2026-10-12',
    grade: '8',
    notes: 'Fen Bilimleri ve Türkçe netlerinde belirgin artış var. Matematik yeni nesil sorular pekişti.',
    ...(() => {
      const { processedResults, totalQuestions, totalCorrect, totalWrong, totalEmpty, totalNet, overallSuccessRate, calculatedScore } =
        calculateExamTotals({
          turkce: { totalQuestions: 20, correct: 17, wrong: 2, empty: 1 },
          matematik: { totalQuestions: 20, correct: 13, wrong: 4, empty: 3 },
          fen: { totalQuestions: 20, correct: 17, wrong: 2, empty: 1 },
          sosyal: { totalQuestions: 10, correct: 9, wrong: 1, empty: 0 },
          din: { totalQuestions: 10, correct: 9, wrong: 1, empty: 0 },
          ingilizce: { totalQuestions: 10, correct: 8, wrong: 2, empty: 0 },
        });
      return {
        results: processedResults,
        totalQuestions,
        totalCorrect,
        totalWrong,
        totalEmpty,
        totalNet,
        overallSuccessRate,
        calculatedScore,
      };
    })(),
  },
  {
    id: 'exam-3',
    title: 'TÖDER LGS 1. Genel Deneme Sınavı',
    publisher: 'TÖDER',
    date: '2026-10-26',
    grade: '8',
    notes: 'Harika bir sınav performansı! Doğru oranı %84.4 seviyesine yükseldi, LGS hedef puanına çok yaklaşıldı.',
    ...(() => {
      const { processedResults, totalQuestions, totalCorrect, totalWrong, totalEmpty, totalNet, overallSuccessRate, calculatedScore } =
        calculateExamTotals({
          turkce: { totalQuestions: 20, correct: 18, wrong: 2, empty: 0 },
          matematik: { totalQuestions: 20, correct: 16, wrong: 3, empty: 1 },
          fen: { totalQuestions: 20, correct: 18, wrong: 2, empty: 0 },
          sosyal: { totalQuestions: 10, correct: 9, wrong: 1, empty: 0 },
          din: { totalQuestions: 10, correct: 10, wrong: 0, empty: 0 },
          ingilizce: { totalQuestions: 10, correct: 9, wrong: 1, empty: 0 },
        });
      return {
        results: processedResults,
        totalQuestions,
        totalCorrect,
        totalWrong,
        totalEmpty,
        totalNet,
        overallSuccessRate,
        calculatedScore,
      };
    })(),
  },
];
