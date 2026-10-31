import { CalendarTask, MockExam } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';
import { INITIAL_MOCK_EXAMS } from '../data/mockExamsData';

const TASKS_STORAGE_KEY = 'maarifplan_tasks_v1';
const EXAMS_STORAGE_KEY = 'maarifplan_exams_v1';

export function loadTasksFromStorage(): CalendarTask[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
  }
  return INITIAL_TASKS;
}

export function saveTasksToStorage(tasks: CalendarTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadExamsFromStorage(): MockExam[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_EXAMS;
  try {
    const raw = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (!raw) return INITIAL_MOCK_EXAMS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load exams from localStorage', err);
  }
  return INITIAL_MOCK_EXAMS;
}

export function saveExamsToStorage(exams: MockExam[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
  } catch (err) {
    console.error('Failed to save exams to localStorage', err);
  }
}

export interface BackupData {
  appName: string;
  version: string;
  exportedAt: string;
  tasks: CalendarTask[];
  mockExams: MockExam[];
}

export function exportBackupJSON(tasks: CalendarTask[], mockExams: MockExam[]): void {
  const backup: BackupData = {
    appName: 'MaarifPlan',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    tasks,
    mockExams,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(backup, null, 2)
  )}`;
  const dateStr = new Date().toISOString().split('T')[0];
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `maarifplan-yedek-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseBackupJSON(jsonStr: string): { tasks: CalendarTask[]; mockExams: MockExam[] } {
  const data = JSON.parse(jsonStr);
  if (!data || typeof data !== 'object') {
    throw new Error('Geçersiz yedek dosyası formatı.');
  }

  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  const mockExams = Array.isArray(data.mockExams) ? data.mockExams : [];

  return { tasks, mockExams };
}
