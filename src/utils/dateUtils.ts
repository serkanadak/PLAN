export const TURKISH_DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
export const TURKISH_DAYS_FULL = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];
export const TURKISH_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Get Monday of the week for given date
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Return 7 dates of the week starting Monday
export function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d);
  }
  return dates;
}

// Time string "17:30" to minutes from 00:00
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Minutes to "17:30"
export function minutesToTimeString(minutes: number): string {
  const totalMins = Math.max(0, Math.min(24 * 60 - 1, Math.round(minutes)));
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} sa ${m} dk` : `${h} saat`;
}

// Format date in Turkish "30 Ekim 2026, Cuma"
export function formatTurkishDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISODate(date) : date;
  const day = d.getDate();
  const month = TURKISH_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  // In JS, getDay() 0 is Sunday, 1 is Monday ... 6 is Saturday
  const jsDay = d.getDay();
  const turkishDayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const dayName = TURKISH_DAYS_FULL[turkishDayIndex];
  return `${day} ${month} ${year}, ${dayName}`;
}

// Format short date "30 Eki"
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISODate(date) : date;
  const day = d.getDate();
  const month = TURKISH_MONTHS[d.getMonth()].slice(0, 3);
  return `${day} ${month}`;
}

// Countdown to target date
export function calculateCountdown(targetDateStr: string) {
  const target = new Date(targetDateStr).getTime();
  const now = new Date('2026-10-30T07:52:33').getTime(); // Applet current anchor
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes, diff };
}
