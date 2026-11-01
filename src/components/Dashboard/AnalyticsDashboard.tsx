import React, { useState, useMemo } from 'react';
import { CalendarTask, Grade, SubjectId, DailyInsight, TaskType } from '../../types';
import { SUBJECT_CONFIGS } from '../../data/curriculumData';
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Flame,
  ArrowUpRight,
  Filter,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
  X,
  BookOpen,
  Layers,
  Coffee,
  Check,
  Search,
  BookMarked,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { formatDuration } from '../../utils/dateUtils';

interface AnalyticsDashboardProps {
  tasks: CalendarTask[];
  currentGrade: Grade;
  onSelectTask?: (task: CalendarTask) => void;
}

interface DrillDownState {
  title: string;
  subtitle?: string;
  filterType: 'all' | 'completed' | 'pending' | 'subject' | 'day' | 'question_tasks';
  filterValue?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tasks,
  currentGrade,
  onSelectTask,
}) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [activeDetail, setActiveDetail] = useState<DrillDownState | null>(null);
  const [detailSearch, setDetailSearch] = useState('');
  const [detailStatusFilter, setDetailStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const WEEK_DAYS = [
    { name: 'Pazartesi', short: 'Pzt', date: '2026-10-26', dayNum: '26', dateFormatted: '26 Ekim 2026' },
    { name: 'Salı', short: 'Sal', date: '2026-10-27', dayNum: '27', dateFormatted: '27 Ekim 2026' },
    { name: 'Çarşamba', short: 'Çar', date: '2026-10-28', dayNum: '28', dateFormatted: '28 Ekim 2026' },
    { name: 'Perşembe', short: 'Per', date: '2026-10-29', dayNum: '29', dateFormatted: '29 Ekim 2026' },
    { name: 'Cuma', short: 'Cum', date: '2026-10-30', dayNum: '30', dateFormatted: '30 Ekim 2026' },
    { name: 'Cumartesi', short: 'Cmt', date: '2026-10-31', dayNum: '31', dateFormatted: '31 Ekim 2026' },
    { name: 'Pazar', short: 'Paz', date: '2026-11-01', dayNum: '1', dateFormatted: '1 Kasım 2026' },
  ];

  const renderTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'soru':
        return <Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'konu':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'deneme':
        return <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'kitap':
        return <BookMarked className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'aktivite':
        return <Coffee className="w-3.5 h-3.5 text-slate-600 shrink-0" />;
    }
  };

  // Filter tasks according to selected time filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (timeFilter === 'week') {
        // 2026-10-26 to 2026-11-01
        return t.date >= '2026-10-26' && t.date <= '2026-11-01';
      }
      if (timeFilter === 'month') {
        return t.date.startsWith('2026-10');
      }
      return true;
    });
  }, [tasks, timeFilter]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    let totalTargetQuestions = 0;
    let totalActualQuestions = 0;
    let totalMinutes = 0;
    let totalCompletedTasks = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    const subjectStats: Record<
      SubjectId,
      {
        targetQuestions: number;
        actualQuestions: number;
        minutes: number;
        tasksCount: number;
        completedTasks: number;
        correct: number;
        wrong: number;
      }
    > = {
      matematik: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      fen: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      turkce: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      sosyal: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      ingilizce: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      din: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      genel: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
      diger: { targetQuestions: 0, actualQuestions: 0, minutes: 0, tasksCount: 0, completedTasks: 0, correct: 0, wrong: 0 },
    };

    // Day of week analysis (0=Sun, 1=Mon, ..., 6=Sat)
    const dayStats: Record<number, { planned: number; completed: number; questions: number }> = {
      0: { planned: 0, completed: 0, questions: 0 },
      1: { planned: 0, completed: 0, questions: 0 },
      2: { planned: 0, completed: 0, questions: 0 },
      3: { planned: 0, completed: 0, questions: 0 },
      4: { planned: 0, completed: 0, questions: 0 },
      5: { planned: 0, completed: 0, questions: 0 },
      6: { planned: 0, completed: 0, questions: 0 },
    };

    filteredTasks.forEach((t) => {
      const [y, m, d] = t.date.split('-').map(Number);
      const dayOfWeek = new Date(y, m - 1, d).getDay();

      dayStats[dayOfWeek].planned += 1;
      if (t.completed) dayStats[dayOfWeek].completed += 1;
      dayStats[dayOfWeek].questions += t.actualCount || 0;

      if (t.targetCount && (t.taskType === 'soru' || t.taskType === 'deneme')) {
        totalTargetQuestions += t.targetCount;
        subjectStats[t.subjectId].targetQuestions += t.targetCount;
      }

      if (t.actualCount && (t.taskType === 'soru' || t.taskType === 'deneme')) {
        totalActualQuestions += t.actualCount;
        subjectStats[t.subjectId].actualQuestions += t.actualCount;
      }

      if (t.completed) {
        totalCompletedTasks += 1;
        totalMinutes += t.durationMinutes;
        subjectStats[t.subjectId].completedTasks += 1;
        subjectStats[t.subjectId].minutes += t.durationMinutes;

        if (t.correctCount) {
          totalCorrect += t.correctCount;
          subjectStats[t.subjectId].correct += t.correctCount;
        }
        if (t.wrongCount) {
          totalWrong += t.wrongCount;
          subjectStats[t.subjectId].wrong += t.wrongCount;
        }
      }

      subjectStats[t.subjectId].tasksCount += 1;
    });

    const completionRate =
      filteredTasks.length > 0 ? Math.round((totalCompletedTasks / filteredTasks.length) * 100) : 0;

    const questionRate =
      totalTargetQuestions > 0 ? Math.round((totalActualQuestions / totalTargetQuestions) * 100) : 0;

    return {
      totalTargetQuestions,
      totalActualQuestions,
      totalMinutes,
      totalCompletedTasks,
      totalTasksCount: filteredTasks.length,
      completionRate,
      questionRate,
      totalCorrect,
      totalWrong,
      subjectStats,
      dayStats,
    };
  }, [filteredTasks]);

  // Behavioral Insights Engine (Tamamen gerçek öğrenci verilerinden dinamik üretilir)
  const insights: DailyInsight[] = useMemo(() => {
    const list: DailyInsight[] = [];
    if (filteredTasks.length === 0) return list;

    // En verimli gün tespiti
    let bestDayName = '';
    let maxCompleted = 0;
    const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    Object.entries(stats.dayStats).forEach(([dayIdx, day]) => {
      if (day.completed > maxCompleted) {
        maxCompleted = day.completed;
        bestDayName = DAY_NAMES[Number(dayIdx)] || '';
      }
    });

    if (maxCompleted > 0 && bestDayName) {
      list.push({
        id: 'ins-best-day',
        type: 'success',
        title: `En Aktif Günün: ${bestDayName}`,
        message: `${bestDayName} günleri toplam ${maxCompleted} görev tamamladın. Bu çalışma temposunu sürdürmelisin.`,
        metric: `${maxCompleted} Görev`,
      });
    }

    // Yüksek tamamlama oranı tespiti
    if (stats.completionRate >= 75 && stats.totalTasksCount >= 2) {
      list.push({
        id: 'ins-completion',
        type: 'tip',
        title: 'Harika Tamamlama Oranı',
        message: `Planlanan görevlerin %${stats.completionRate}'ini başarıyla tamamladın. Düzenli çalışma LGS başarısının anahtarıdır.`,
        metric: `%${stats.completionRate} Başarı`,
      });
    }

    // Soru hedefine ulaşma durumu
    if (stats.totalTargetQuestions > 0 && stats.totalActualQuestions > 0) {
      const qRate = Math.round((stats.totalActualQuestions / stats.totalTargetQuestions) * 100);
      list.push({
        id: 'ins-questions',
        type: qRate >= 100 ? 'success' : 'info',
        title: qRate >= 100 ? 'Soru Çözüm Hedefi Yakalandı!' : 'Soru Çözüm İlerlemesi',
        message: `Hedeflenen ${stats.totalTargetQuestions} sorunun ${stats.totalActualQuestions} tanesi tamamlandı (%${qRate}).`,
        metric: `${stats.totalActualQuestions}/${stats.totalTargetQuestions}`,
      });
    }

    return list;
  }, [stats, filteredTasks]);

  // Total study hours
  const totalHours = (stats.totalMinutes / 60).toFixed(1);

  // Filtered tasks for Drill-down detail modal
  const drillDownTasks = useMemo(() => {
    if (!activeDetail) return [];
    let baseList = filteredTasks;

    if (activeDetail.filterType === 'completed') {
      baseList = baseList.filter((t) => t.completed);
    } else if (activeDetail.filterType === 'pending') {
      baseList = baseList.filter((t) => !t.completed);
    } else if (activeDetail.filterType === 'subject' && activeDetail.filterValue) {
      baseList = baseList.filter((t) => t.subjectId === activeDetail.filterValue);
    } else if (activeDetail.filterType === 'day' && activeDetail.filterValue) {
      baseList = baseList.filter((t) => t.date === activeDetail.filterValue);
    } else if (activeDetail.filterType === 'question_tasks') {
      baseList = baseList.filter((t) => t.taskType === 'soru' || t.taskType === 'deneme');
    }

    if (detailStatusFilter === 'completed') {
      baseList = baseList.filter((t) => t.completed);
    } else if (detailStatusFilter === 'pending') {
      baseList = baseList.filter((t) => !t.completed);
    }

    if (detailSearch.trim()) {
      const q = detailSearch.toLowerCase();
      baseList = baseList.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.topicName?.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
      );
    }

    return baseList;
  }, [filteredTasks, activeDetail, detailSearch, detailStatusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Time Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Gelişmiş Başarı & Öğrenci Analitiği
              </h2>
              <p className="text-xs text-slate-500">
                Kişisel Gelişim Paneli: Hedeflenen vs. gerçekleşen çalışma ve soru çözüm metriklerin
              </p>
            </div>
          </div>
        </div>

        {/* Time period filter */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setTimeFilter('week')}
            className={`cursor-pointer px-3 py-1.5 font-semibold rounded-lg transition-all ${
              timeFilter === 'week'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bu Hafta
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`cursor-pointer px-3 py-1.5 font-semibold rounded-lg transition-all ${
              timeFilter === 'month'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bu Ay (Ekim)
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`cursor-pointer px-3 py-1.5 font-semibold rounded-lg transition-all ${
              timeFilter === 'all'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Dönem
          </button>
        </div>
      </div>

      {/* HAFTALIK ÖZET KARTI (Weekly Summary Card) */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800/60 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10 text-amber-300 border border-white/10 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Haftalık Çalışma Özeti
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  26 Ekim - 1 Kasım 2026
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Bu haftanın hedeflenen ve gerçekleşen soru, süre ve tamamlanan görev dökümü
              </p>
            </div>
          </div>

          {/* Quick action button to view all weekly tasks */}
          <button
            type="button"
            onClick={() =>
              setActiveDetail({
                title: 'Haftalık Tüm Görevler',
                subtitle: '26 Ekim - 1 Kasım 2026 haftasındaki tüm planlı çalışmalar',
                filterType: 'all',
              })
            }
            className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-xs font-semibold border border-white/15 flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
          >
            <ListTodo className="w-4 h-4 text-amber-300" />
            <span>Tüm Görevleri Gör ({filteredTasks.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
          </button>
        </div>

        {/* 4 Weekly KPI Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Tamamlanan Görev Sayısı */}
          <div
            onClick={() =>
              setActiveDetail({
                title: 'Haftalık Tamamlanan Görevler',
                subtitle: 'Bu hafta başarıyla bitirilen çalışma ve hedefler',
                filterType: 'completed',
              })
            }
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span className="font-semibold text-[11px]">Tamamlanan Görevler</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {stats.totalCompletedTasks}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                / {stats.totalTasksCount} Görev
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Tamamlanma: %{stats.completionRate}</span>
              <span className="text-emerald-300 font-semibold group-hover:underline">Detaylar ↗</span>
            </div>
          </div>

          {/* 2. Bekleyen / Planlanan Görevler */}
          <div
            onClick={() =>
              setActiveDetail({
                title: 'Bekleyen / Planlanan Görevler',
                subtitle: 'Bu hafta henüz tamamlanmamış çalışma hedefleri',
                filterType: 'pending',
              })
            }
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span className="font-semibold text-[11px]">Bekleyen Görevler</span>
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-black font-mono text-amber-400">
                {stats.totalTasksCount - stats.totalCompletedTasks}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Kalan Görev
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full"
                style={{
                  width: `${100 - stats.completionRate}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Kalan: %{100 - stats.completionRate}</span>
              <span className="text-amber-300 font-semibold group-hover:underline">Detaylar ↗</span>
            </div>
          </div>

          {/* 3. Haftalık Soru Çözüm Hedefi */}
          <div
            onClick={() =>
              setActiveDetail({
                title: 'Haftalık Soru Çözüm Görevleri',
                subtitle: 'Soru ve deneme çözümü içeren tüm çalışma hedefleri',
                filterType: 'question_tasks',
              })
            }
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span className="font-semibold text-[11px]">Haftalık Soru Hedefi</span>
              <Target className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-black font-mono text-blue-300">
                {stats.totalActualQuestions}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                / {stats.totalTargetQuestions} Soru
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="bg-blue-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, stats.questionRate)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Ulaşma Oranı: %{stats.questionRate}</span>
              <span className="text-blue-300 font-semibold group-hover:underline">Detaylar ↗</span>
            </div>
          </div>

          {/* 4. Haftalık Odak Süresi Hedefi */}
          <div
            onClick={() =>
              setActiveDetail({
                title: 'Haftalık Odak ve Çalışma Süresi',
                subtitle: 'Ders ve aktiviteler için harcanan çalışma süreleri',
                filterType: 'all',
              })
            }
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span className="font-semibold text-[11px]">Haftalık Odak Süresi</span>
              <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-black font-mono text-purple-300">
                {totalHours} sa
              </span>
              <span className="text-xs text-slate-300 font-mono">
                / 20 sa Hedef
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="bg-purple-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (stats.totalMinutes / (20 * 60)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Hedefe Kalan: {Math.max(0, 20 - Number(totalHours)).toFixed(1)} sa</span>
              <span className="text-purple-300 font-semibold group-hover:underline">Detaylar ↗</span>
            </div>
          </div>
        </div>

        {/* Haftalık Günlük Çizelge (Pzt - Paz) - Clickable day cards */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Haftanın Günlük İlerlemesi (Güne tıklayarak o günün görevlerini inceleyin):
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Tıklanan günün tüm görevleri açılır
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {WEEK_DAYS.map((day) => {
              const dayTasks = tasks.filter((t) => t.date === day.date);
              const completedCount = dayTasks.filter((t) => t.completed).length;
              const totalCount = dayTasks.length;
              const isToday = day.date === '2026-10-30';

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() =>
                    setActiveDetail({
                      title: `${day.name} Günü Görevleri`,
                      subtitle: `${day.dateFormatted} tarihindeki planlanan ve tamamlanan tüm görevler`,
                      filterType: 'day',
                      filterValue: day.date,
                    })
                  }
                  className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    isToday
                      ? 'bg-blue-600/40 border-blue-400 text-white shadow-xs ring-1 ring-blue-400'
                      : totalCount > 0 && completedCount === totalCount
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:bg-emerald-950/60'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-slate-300">
                    {day.short}
                  </span>
                  <span className="text-xs font-bold font-mono my-0.5">
                    {day.dayNum}
                  </span>
                  <div className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/20 font-semibold">
                    {completedCount}/{totalCount}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary KPI Cards - Clickable to open drill-down */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Question Goal vs Actual */}
        <div
          onClick={() =>
            setActiveDetail({
              title: 'Soru ve Deneme Çözüm Hedefleri',
              subtitle: 'Hedeflenen ve fiilen çözülen soruların detaylı dökümü',
              filterType: 'question_tasks',
            })
          }
          className="cursor-pointer bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-2xl p-4 shadow-xs relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Soru Çözüm Hedefi
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {stats.totalActualQuestions}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {stats.totalTargetQuestions} Hedef
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.questionRate)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Tamamlanma:</span>
            <span className="font-bold text-blue-600 font-mono">%{stats.questionRate} &bull; İncele ↗</span>
          </div>
        </div>

        {/* Card 2: Total Study Time */}
        <div
          onClick={() =>
            setActiveDetail({
              title: 'Odak ve Çalışma Süresi Dağılımı',
              subtitle: 'Ders ve aktiviteler için harcanan çalışma süreleri',
              filterType: 'all',
            })
          }
          className="cursor-pointer bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all rounded-2xl p-4 shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Toplam Odak Süresi
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{totalHours}</span>
            <span className="text-xs text-slate-500 font-semibold">saat ({formatDuration(stats.totalMinutes)})</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, (stats.totalMinutes / (20 * 60)) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Haftalık 20 sa hedefine:</span>
            <span className="font-bold text-emerald-600 font-mono">
              %{Math.min(100, Math.round((stats.totalMinutes / (20 * 60)) * 100))} &bull; İncele ↗
            </span>
          </div>
        </div>

        {/* Card 3: Task Completion Rate */}
        <div
          onClick={() =>
            setActiveDetail({
              title: 'Görev Disiplini & Tamamlanma Durumu',
              subtitle: 'Planlanan tüm çalışma görevlerinin başarı analizi',
              filterType: 'all',
            })
          }
          className="cursor-pointer bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all rounded-2xl p-4 shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Görev Disiplini
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {stats.totalCompletedTasks}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {stats.totalTasksCount} Görev
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Görev Başarısı:</span>
            <span className="font-bold text-indigo-600 font-mono">%{stats.completionRate} &bull; İncele ↗</span>
          </div>
        </div>

        {/* Card 4: Accuracy & Correct Rate */}
        <div
          onClick={() =>
            setActiveDetail({
              title: 'Doğruluk ve Net Analizi',
              subtitle: 'Doğru, yanlış ve boş soru sayıları ile net dağılımı',
              filterType: 'question_tasks',
            })
          }
          className="cursor-pointer bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all rounded-2xl p-4 shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doğruluk Oranı (Net)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {stats.totalCorrect} D
            </span>
            <span className="text-xs text-red-500 font-mono font-semibold">
              / {stats.totalWrong} Y
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-2"
              style={{
                width: `${
                  stats.totalCorrect + stats.totalWrong > 0
                    ? (stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100
                    : 100
                }%`,
              }}
            />
            <div
              className="bg-red-400 h-2"
              style={{
                width: `${
                  stats.totalCorrect + stats.totalWrong > 0
                    ? (stats.totalWrong / (stats.totalCorrect + stats.totalWrong)) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Net Başarısı:</span>
            <span className="font-bold text-emerald-600 font-mono">
              %{stats.totalCorrect + stats.totalWrong > 0
                ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
                : 90} &bull; İncele ↗
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Target vs Actual (Hedef vs. Gerçekleşen Oranı) - 7 cols */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Ders Bazında Hedef vs. Gerçekleşen Soru Sayıları
                </h3>
                <p className="text-xs text-slate-500">
                  Planlanan soru hedefi ile öğrencinin çözdüğü fiili soru karşılaştırması
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-200" />
                <span className="text-slate-600">Hedef</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600" />
                <span className="text-slate-900 font-semibold">Gerçekleşen</span>
              </div>
            </div>
          </div>

          {/* Interactive Bars */}
          <div className="space-y-4 flex-1 flex flex-col justify-around">
            {(Object.keys(stats.subjectStats) as SubjectId[]).map((subjId) => {
              const cfg = SUBJECT_CONFIGS[subjId];
              const subjData = stats.subjectStats[subjId];
              const target = subjData.targetQuestions || 40;
              const actual = subjData.actualQuestions;
              const maxScale = Math.max(target, actual, 120);
              const targetPercent = Math.round((target / maxScale) * 100);
              const actualPercent = Math.round((actual / maxScale) * 100);
              const ratio = target > 0 ? Math.round((actual / target) * 100) : 0;

              return (
                <div
                  key={subjId}
                  onClick={() =>
                    setActiveDetail({
                      title: `${cfg.name} Çalışma & Soru Dökümü`,
                      subtitle: `${cfg.name} dersine ait tüm hedefler, çözülen sorular ve durumlar`,
                      filterType: 'subject',
                      filterValue: subjId,
                    })
                  }
                  className="space-y-1 cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${cfg.themeColor.accent} group-hover:scale-125 transition-transform`}
                      />
                      <span className="font-bold text-slate-800 group-hover:text-blue-700">
                        {cfg.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">
                        {actual} / {target} soru
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold text-[11px] ${
                          ratio >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : ratio >= 70
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        %{ratio}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>

                  {/* Dual Bar Representation */}
                  <div className="relative h-6 bg-slate-100/70 rounded-lg overflow-hidden border border-slate-200/80 flex items-center p-0.5">
                    {/* Target outline/background marker */}
                    <div
                      style={{ width: `${targetPercent}%` }}
                      className="absolute top-0 bottom-0 left-0 bg-slate-200/80 border-r-2 border-slate-400 z-0"
                      title={`Hedef: ${target}`}
                    />
                    {/* Actual filled bar */}
                    <div
                      style={{ width: `${actualPercent}%` }}
                      className={`h-full rounded-md transition-all duration-700 z-10 ${
                        ratio >= 100
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      title={`Gerçekleşen: ${actual}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {stats.totalActualQuestions > 0 ? (
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
              <span>
                💡 Toplam <strong>{stats.totalActualQuestions} soru</strong> çözüldü {stats.totalTargetQuestions > 0 ? `(Hedef tamamlama: %${stats.questionRate})` : ''}
              </span>
              <span className="font-semibold text-blue-600">Ders satırına tıklayarak inceleyin</span>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl text-center">
              Dersler için henüz soru çözümü kaydedilmedi. Takvimden soru görevlerinizi ekleyip tamamlayabilirsiniz.
            </div>
          )}
        </div>

        {/* CHART 2: Subject Time Distribution (Ders Bazlı Dağılım) - 5 cols */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Ders Bazlı Çalışma Süresi Dağılımı
                </h3>
                <p className="text-xs text-slate-500">
                  Toplam sürenin derslere göre yüzdesel dağılımı (Tıklanabilir)
                </p>
              </div>
            </div>
          </div>

          {/* Donut / Stacked Bar representation */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Multi-segment progress visual */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-2xs mb-4">
              {(Object.keys(stats.subjectStats) as SubjectId[]).map((subjId) => {
                const cfg = SUBJECT_CONFIGS[subjId];
                const minutes = stats.subjectStats[subjId].minutes;
                const percent =
                  stats.totalMinutes > 0 ? (minutes / stats.totalMinutes) * 100 : 0;
                if (percent === 0) return null;

                return (
                  <div
                    key={subjId}
                    onClick={() =>
                      setActiveDetail({
                        title: `${cfg.name} Çalışmaları`,
                        subtitle: `${cfg.name} dersi için ayrılan ${formatDuration(minutes)} süresi ve görevleri`,
                        filterType: 'subject',
                        filterValue: subjId,
                      })
                    }
                    style={{ width: `${percent}%` }}
                    className={`${cfg.themeColor.accent} hover:opacity-90 transition-all relative group cursor-pointer`}
                    title={`${cfg.name}: ${formatDuration(minutes)} (%${Math.round(percent)})`}
                  />
                );
              })}
            </div>

            {/* Breakdown legend cards */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {(Object.keys(stats.subjectStats) as SubjectId[]).map((subjId) => {
                const cfg = SUBJECT_CONFIGS[subjId];
                const minutes = stats.subjectStats[subjId].minutes;
                const percent =
                  stats.totalMinutes > 0
                    ? Math.round((minutes / stats.totalMinutes) * 100)
                    : 0;

                return (
                  <div
                    key={subjId}
                    onClick={() =>
                      setActiveDetail({
                        title: `${cfg.name} Süre ve Görev Detayı`,
                        subtitle: `${cfg.name} için ayrılan toplam ${formatDuration(minutes)} çalışma süresi`,
                        filterType: 'subject',
                        filterValue: subjId,
                      })
                    }
                    className="cursor-pointer p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 bg-slate-50/60 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cfg.themeColor.accent} group-hover:scale-110 transition-transform`} />
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700 block leading-tight">
                          {cfg.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDuration(minutes)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono text-sm block">
                        %{percent}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 text-center">
            Önerilen LGS Ağırlığı: <span className="font-semibold">Matematik %35, Fen %30, Türkçe %25, Diğer %10</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Behavioral Insights (Davranışsal İçgörüler) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Davranışsal İçgörüler & Akıllı Öğrenci Analizleri (Insights Engine)
              </h3>
              <p className="text-xs text-slate-400">
                Öğrencinin çalışma alışkanlıkları ve zamanlama kalıplarından otomatik üretilen öneriler
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold font-mono">
            {insights.length} Aktif İçgörü
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length === 0 && (
            <div className="md:col-span-2 py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/10">
              <Sparkles className="w-6 h-6 text-amber-400/70" />
              <p className="font-semibold text-slate-300">Henüz yeterli çalışma verisi toplanmadı.</p>
              <p className="max-w-md text-slate-400 text-[11px]">
                Takvimden yeni çalışma görevleri ekleyip tamamladıkça; en verimli günleriniz, soru başarı oranlarınız ve pekiştirme önerileriniz burada otomatik olarak analiz edilecektir.
              </p>
            </div>
          )}
          {insights.map((item) => {
            const isWarning = item.type === 'warning';
            const isSuccess = item.type === 'success';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSuccess
                    ? 'bg-emerald-950/40 border-emerald-500/30'
                    : isWarning
                    ? 'bg-amber-950/40 border-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                    <h4 className="font-bold text-xs text-white">{item.title}</h4>
                  </div>
                  {item.metric && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}
                    >
                      {item.metric}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.message}
                </p>

                {item.actionText && (
                  <button
                    onClick={() => {
                      if (item.id === 'ins-thu') {
                        setActiveDetail({
                          title: 'Perşembe Günü Görevleri',
                          subtitle: 'Perşembe gününe ait planlanmış görevler ve tamamlama durumları',
                          filterType: 'day',
                          filterValue: '2026-10-29',
                        });
                      } else {
                        setActiveDetail({
                          title: 'Fen Bilimleri Görevleri',
                          subtitle: 'Fen bilimleri dersi kapsamındaki pekiştirme ve soru çalışmaları',
                          filterType: 'subject',
                          filterValue: 'fen',
                        });
                      }
                    }}
                    className="cursor-pointer text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DRILL-DOWN DETAIL MODAL */}
      {activeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {activeDetail.title}
                  </h3>
                  {activeDetail.subtitle && (
                    <p className="text-xs text-blue-200/80 mt-0.5">
                      {activeDetail.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveDetail(null);
                  setDetailSearch('');
                  setDetailStatusFilter('all');
                }}
                className="cursor-pointer p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Strip & Search */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={detailSearch}
                  onChange={(e) => setDetailSearch(e.target.value)}
                  placeholder="Görev adı veya konu ara..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDetailStatusFilter('all')}
                  className={`cursor-pointer flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition-all ${
                    detailStatusFilter === 'all'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tümü ({drillDownTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailStatusFilter('completed')}
                  className={`cursor-pointer flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition-all ${
                    detailStatusFilter === 'completed'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tamamlanan ({drillDownTasks.filter((t) => t.completed).length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailStatusFilter('pending')}
                  className={`cursor-pointer flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition-all ${
                    detailStatusFilter === 'pending'
                      ? 'bg-white text-amber-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bekleyen ({drillDownTasks.filter((t) => !t.completed).length})
                </button>
              </div>
            </div>

            {/* Task List (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 divide-y divide-slate-100">
              {drillDownTasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <ListTodo className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Eşleşen Görev Bulunamadı</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Bu filtreleme kriterlerine uygun herhangi bir çalışma görevi bulunmamaktadır.
                  </p>
                </div>
              ) : (
                drillDownTasks.map((t) => {
                  const cfg = SUBJECT_CONFIGS[t.subjectId];

                  return (
                    <div
                      key={t.id}
                      className="pt-2.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span
                          className={`mt-0.5 p-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider shrink-0 ${
                            cfg
                              ? `${cfg.themeColor.cardBg} ${cfg.themeColor.border} ${cfg.themeColor.text}`
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {cfg ? cfg.shortName : t.subjectId}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-bold ${
                                t.completed ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {t.title}
                            </span>
                            {renderTaskTypeIcon(t.taskType)}
                          </div>

                          {t.topicName && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {t.topicName}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                              📅 {t.date} &bull; {t.startTime} ({t.durationMinutes} dk)
                            </span>

                            {t.targetCount && (
                              <span className="font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                🎯 Hedef: {t.targetCount} soru
                              </span>
                            )}

                            {t.actualCount !== undefined && t.actualCount > 0 && (
                              <span className="font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                                ✓ Çözülen: {t.actualCount} soru
                                {t.correctCount !== undefined && ` (${t.correctCount}D / ${t.wrongCount || 0}Y)`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 ${
                            t.completed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {t.completed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tamamlandı</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Bekliyor</span>
                            </>
                          )}
                        </span>

                        {onSelectTask && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDetail(null);
                              onSelectTask(t);
                            }}
                            className="cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all flex items-center gap-1"
                          >
                            <span>Düzenle</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Toplam {drillDownTasks.length} adet görev listelendi.</span>
              <button
                type="button"
                onClick={() => {
                  setActiveDetail(null);
                  setDetailSearch('');
                  setDetailStatusFilter('all');
                }}
                className="cursor-pointer px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
