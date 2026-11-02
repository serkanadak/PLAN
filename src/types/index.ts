export type Grade = '6' | '7' | '8';

export type AcademicSubjectId = 'matematik' | 'fen' | 'turkce' | 'sosyal' | 'ingilizce' | 'din';

export type SubjectId = AcademicSubjectId | 'genel' | 'diger';

export type TaskType = 'soru' | 'konu' | 'deneme' | 'kitap' | 'aktivite';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'weekdays';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  shortName: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    cardBg: string;
    badgeBg: string;
    lightBg: string;
  };
  icon: string;
}

export interface TopicItem {
  id: string;
  name: string;
  estimatedHours?: number;
  recommendedQuestions?: number;
  completed?: boolean;
}

export interface UnitItem {
  id: string;
  name: string;
  topics: TopicItem[];
}

export interface SubjectCurriculum {
  subjectId: SubjectId;
  units: UnitItem[];
}

export interface CurriculumDatabase {
  [grade: string]: SubjectCurriculum[];
}

export interface CalendarTask {
  id: string;
  title: string;
  grade: Grade;
  subjectId: SubjectId;
  unitId?: string;
  topicId?: string;
  topicName?: string;
  customActivityName?: string; // For 'diger' (e.g. Uyku, Başka kurs, Hobi, Spor vb.)
  taskType: TaskType;
  
  // Timing
  date: string; // YYYY-MM-DD
  startTime: string; // "17:00"
  durationMinutes: number; // e.g. 60
  
  // Recurrence
  recurrence: RecurrenceType;
  recurrenceDayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  recurrenceGroupId?: string; // Group ID to link recurring instances together
  recurrenceCount?: number; // Total number of repetitions specified by user
  
  // Goals & Actuals
  targetCount?: number; // Target questions or pages
  actualCount?: number; // Solved questions or pages
  correctCount?: number;
  wrongCount?: number;
  emptyCount?: number;
  
  // Completion
  completed: boolean;
  completedAt?: string;
  
  // Student notes
  notes?: string;
  difficultyRating?: 'easy' | 'medium' | 'hard';
}

export interface ImportantDate {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: 'lgs' | 'tatil' | 'sinav';
  badgeColor: string;
  description: string;
}

export interface DailyInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  message: string;
  metric?: string;
  actionText?: string;
}

export interface ExamSubjectResult {
  subjectId: AcademicSubjectId;
  totalQuestions: number;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
  successRate: number; // (correct / totalQuestions) * 100
}

export interface MockExam {
  id: string;
  title: string;
  publisher?: string;
  date: string; // YYYY-MM-DD
  grade: Grade;
  results: Record<AcademicSubjectId, ExamSubjectResult>;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  totalNet: number;
  overallSuccessRate: number; // (totalCorrect / totalQuestions) * 100
  calculatedScore?: number; // Estimated LGS score (e.g. 435.60)
  notes?: string;
}

export type ViewTab = 'calendar' | 'dashboard' | 'deneme' | 'curriculum';

export type CalendarView = 'day' | 'week' | 'month' | 'year';
