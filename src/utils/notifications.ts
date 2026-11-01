import { CalendarTask } from '../types';
import { formatDateToISO } from './dateUtils';
import { SUBJECT_CONFIGS } from '../data/curriculumData';

export interface NotificationSettings {
  enabled: boolean;
  leadTimeMinutes: number; // 0, 10, 15, 30
  soundEnabled: boolean;
}

const STORAGE_KEY_SETTINGS = 'maarif_notification_settings';
const STORAGE_KEY_NOTIFIED = 'maarif_notified_tasks';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  leadTimeMinutes: 15,
  soundEnabled: true,
};

// Load notification settings from localStorage
export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
};

// Save notification settings to localStorage
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save notification settings:', err);
  }
};

// Track which tasks have already alerted today so we avoid repeats
const getNotifiedTaskMap = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFIED);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const markTaskNotified = (taskId: string): void => {
  try {
    const map = getNotifiedTaskMap();
    map[taskId] = Date.now();
    localStorage.setItem(STORAGE_KEY_NOTIFIED, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to mark task notified:', err);
  }
};

// Play a pleasant two-tone study chime using Web Audio API (no external file needed)
export const playNotificationChime = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Resume context if suspended by browser autoplay policy
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // Pleasant melodic chime: D5 (587.33Hz) -> A5 (880Hz)
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    console.warn('Audio chime could not play:', e);
  }
};

// Check if browser supports notifications
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Request notification permission from user
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Notification permission error:', err);
    return 'denied';
  }
};

// Dispatch a notification via Service Worker or native Window Notification
export const sendBrowserNotification = async (
  title: string,
  options: NotificationOptions
): Promise<boolean> => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    // Try via Service Worker first for maximum mobile & desktop reliability
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready.catch(() => null);
      if (registration && registration.showNotification) {
        await registration.showNotification(title, {
          icon: '/icon.svg',
          badge: '/icon.svg',
          ...options,
        });
        return true;
      }
    }

    // Fallback to standard window Notification
    new Notification(title, {
      icon: '/icon.svg',
      ...options,
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
};

// Send an immediate test notification with sound
export const sendTestNotification = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    alert('Tarayıcınız bildirim özelliğini desteklemiyor.');
    return false;
  }

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return false;
  }

  playNotificationChime();
  return sendBrowserNotification('🔔 MaarifPlan Test Bildirimi', {
    body: 'Harika! Ders çalışma hatırlatmaları başarıyla çalışıyor. Yaklaşan görevlerinizde anlık bildirim alacaksınız.',
    tag: 'test-notification',
  });
};

// Check today's tasks and notify if approaching
export const checkUpcomingTasksAndNotify = async (
  tasks: CalendarTask[],
  settings: NotificationSettings
): Promise<void> => {
  if (!settings.enabled || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const todayISO = formatDateToISO(now);
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const notifiedMap = getNotifiedTaskMap();

  for (const task of tasks) {
    // Only check today's incomplete tasks
    if (task.date !== todayISO || task.completed) continue;

    // Check if task was already alerted today
    if (notifiedMap[task.id]) continue;

    // Parse task start time (e.g. "15:30")
    const [hours, minutes] = task.startTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) continue;

    const taskMinutesFromMidnight = hours * 60 + minutes;
    const diffMinutes = taskMinutesFromMidnight - currentMinutesFromMidnight;

    // Check if task is within lead time (e.g. 0 to leadTimeMinutes away)
    // or if leadTimeMinutes is 0, when it's within the current 5-minute window
    const isInWindow =
      settings.leadTimeMinutes === 0
        ? diffMinutes >= 0 && diffMinutes <= 5
        : diffMinutes >= 0 && diffMinutes <= settings.leadTimeMinutes;

    if (isInWindow) {
      const subjectName = SUBJECT_CONFIGS[task.subjectId]?.name || 'Ders';
      const timeText =
        diffMinutes === 0
          ? 'Şimdi başlıyor!'
          : `${diffMinutes} dakika sonra (${task.startTime}) başlıyor!`;

      const targetText = task.targetCount ? ` | Hedef: ${task.targetCount}` : '';

      if (settings.soundEnabled) {
        playNotificationChime();
      }

      await sendBrowserNotification(`⏰ Ders Vakti: ${task.title}`, {
        body: `${subjectName} | ${timeText}${targetText}`,
        tag: `task-${task.id}`,
      });

      markTaskNotified(task.id);
    }
  }
};
