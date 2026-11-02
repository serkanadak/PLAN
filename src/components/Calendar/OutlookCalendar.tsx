import React, { useState, useRef, useEffect } from 'react';
import {
  CalendarTask,
  CalendarView,
  SubjectId,
  TaskType,
  ImportantDate,
} from '../../types';
import { SUBJECT_CONFIGS, getImportantDatesForDate } from '../../data/curriculumData';
import {
  TURKISH_DAYS_FULL,
  TURKISH_DAYS_SHORT,
  TURKISH_MONTHS,
  formatDateToISO,
  formatDuration,
  getWeekDates,
  getWeekStart,
  timeStringToMinutes,
} from '../../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  BookOpen,
  Award,
  BookMarked,
  CheckCircle2,
  Repeat,
  Sparkles,
  Calendar as CalendarIcon,
  Flag,
  AlertCircle,
  Coffee,
  Layers,
} from 'lucide-react';

interface OutlookCalendarProps {
  tasks: CalendarTask[];
  onSelectTask: (task: CalendarTask) => void;
  onUpdateTask: (task: CalendarTask) => void;
  onCreateTaskAtTime: (date: string, startTime: string) => void;
  importantDates: ImportantDate[];
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export const OutlookCalendar: React.FC<OutlookCalendarProps> = ({
  tasks,
  onSelectTask,
  onUpdateTask,
  onCreateTaskAtTime,
  importantDates,
  selectedDate,
  onSelectedDateChange,
}) => {
  const [view, setView] = useState<CalendarView>('week');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [resizingTaskId, setResizingTaskId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Time grid hours: 07:00 to 24:00 (17 hours: 07:00 through 23:59 / 24:00)
  const START_HOUR = 7;
  const END_HOUR = 24;
  const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const HOUR_HEIGHT = 44; // Compact 44px per hour so almost all 07:00-24:00 fits on screen!

  // Scroll to 07:00 at the top on initial mount
  useEffect(() => {
    if (scrollContainerRef.current && (view === 'week' || view === 'day')) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [view]);

  const weekStart = getWeekStart(selectedDate);
  const weekDates = getWeekDates(weekStart);

  const prevPeriod = () => {
    const d = new Date(selectedDate);
    if (view === 'day') d.setDate(d.getDate() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else if (view === 'month') d.setMonth(d.getMonth() - 1);
    else if (view === 'year') d.setFullYear(d.getFullYear() - 1);
    onSelectedDateChange(d);
  };

  const nextPeriod = () => {
    const d = new Date(selectedDate);
    if (view === 'day') d.setDate(d.getDate() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else if (view === 'month') d.setMonth(d.getMonth() + 1);
    else if (view === 'year') d.setFullYear(d.getFullYear() + 1);
    onSelectedDateChange(d);
  };

  const goToToday = () => {
    onSelectedDateChange(new Date('2026-10-30T07:52:00'));
  };

  // Get Task Icon according to task type
  const renderTaskIcon = (type: TaskType) => {
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

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Drop handler for moving existing tasks
  const handleSlotDrop = (e: React.DragEvent, dateStr: string, hour: number) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;

    try {
      const payload = JSON.parse(rawData);
      if (payload.type === 'existing-task') {
        const task = tasks.find((t) => t.id === payload.taskId);
        if (task) {
          const newStartTime = `${String(hour).padStart(2, '0')}:00`;
          onUpdateTask({
            ...task,
            date: dateStr,
            startTime: newStartTime,
          });
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleTaskDragStart = (e: React.DragEvent, task: CalendarTask) => {
    e.stopPropagation();
    setDraggedTaskId(task.id);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'existing-task', taskId: task.id })
    );
  };

  // Resize Task Duration Logic
  const handleResizeStart = (e: React.MouseEvent, task: CalendarTask) => {
    e.stopPropagation();
    setResizingTaskId(task.id);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - e.clientY;
      const deltaMinutes = Math.round((deltaY / HOUR_HEIGHT) * 60 / 15) * 15;
      const newDuration = Math.max(15, Math.min(240, task.durationMinutes + deltaMinutes));

      onUpdateTask({
        ...task,
        durationMinutes: newDuration,
      });
    };

    const onMouseUp = () => {
      setResizingTaskId(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Header Title
  const getHeaderTitle = () => {
    if (view === 'day') {
      const day = selectedDate.getDate();
      const month = TURKISH_MONTHS[selectedDate.getMonth()];
      const year = selectedDate.getFullYear();
      const jsDay = selectedDate.getDay();
      const dayName = TURKISH_DAYS_FULL[jsDay === 0 ? 6 : jsDay - 1];
      return `${day} ${month} ${year}, ${dayName}`;
    }
    if (view === 'week') {
      const startDay = weekDates[0].getDate();
      const startMonth = TURKISH_MONTHS[weekDates[0].getMonth()];
      const endDay = weekDates[6].getDate();
      const endMonth = TURKISH_MONTHS[weekDates[6].getMonth()];
      const year = weekDates[6].getFullYear();
      if (startMonth === endMonth) {
        return `${startDay} - ${endDay} ${startMonth} ${year}`;
      }
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
    if (view === 'month') {
      return `${TURKISH_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
    return `${selectedDate.getFullYear()} Yıllık Görünüm`;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
      {/* Calendar Top Control Bar - Ultra Compact */}
      <div className="px-3 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50/90">
        {/* Left: Navigation Buttons & Compact Date */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToToday}
            className="cursor-pointer px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            Bugün
          </button>
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
            <button
              onClick={prevPeriod}
              className="cursor-pointer p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Önceki"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextPeriod}
              className="cursor-pointer p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Sonraki"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 ml-1">
            {getHeaderTitle()}
          </h2>
        </div>

        {/* Right: View Switcher - Compact Pills */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-200 text-[11px]">
          {(['day', 'week', 'month', 'year'] as CalendarView[]).map((v) => {
            const labels: Record<CalendarView, string> = {
              day: 'Günlük',
              week: 'Haftalık',
              month: 'Aylık',
              year: 'Yıllık',
            };
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`cursor-pointer px-2.5 py-0.5 font-semibold rounded-md transition-all ${
                  view === v
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW: WEEKLY (Outlook Time-Grid with Pinned MEB Important Milestones) */}
      {view === 'week' && (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto relative bg-white h-[calc(100vh-140px)] min-h-[580px]"
        >
          <div className="min-w-[800px] w-full relative">
            {/* Sticky Day Headers Row: Compact inline day and date */}
            <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] w-full sticky top-0 z-30 border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs shadow-xs">
              {/* Top-Left Corner: Frozen at BOTH Top and Left */}
              <div className="w-[60px] shrink-0 sticky left-0 top-0 z-40 bg-slate-100 px-1 py-1 border-r border-slate-200 text-center text-slate-500 font-mono flex flex-col justify-center shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]">
                <span className="text-[10px] font-bold text-slate-600">Saat</span>
                <span className="text-[8px] text-slate-400 font-semibold">07-24</span>
              </div>
              {weekDates.map((date, idx) => {
                const iso = formatDateToISO(date);
                const isToday = iso === '2026-10-30';
                const dayImportantDates = getImportantDatesForDate(iso);

                return (
                  <div
                    key={iso}
                    onClick={() => {
                      onSelectedDateChange(date);
                      setView('day');
                    }}
                    className={`min-w-0 w-full overflow-hidden cursor-pointer px-1 py-1 text-center border-r border-slate-200/80 transition-colors hover:bg-slate-100/80 flex flex-col items-center justify-center min-h-[40px] ${
                      isToday ? 'bg-blue-50/95 font-bold' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {TURKISH_DAYS_SHORT[idx]}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                          isToday
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-800'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* MEB Important Dates: Ultra-compact single line badge if any */}
                    {dayImportantDates.length > 0 && (
                      <div className="w-full mt-0.5 px-0.5">
                        {dayImportantDates.map((imp) => (
                          <div
                            key={imp.id}
                            className={`text-[8px] font-bold px-1 py-0.2 rounded leading-none truncate text-center shadow-2xs block ${
                              imp.type === 'lgs'
                                ? 'bg-purple-600 text-white'
                                : imp.type === 'sinav'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                            title={`${imp.title} - ${imp.description}`}
                          >
                            {imp.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time-Grid Body: Exact matching 60px grid columns as header */}
            <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] w-full relative">
              {/* Hours Column: Frozen at Left on horizontal scroll */}
              <div className="w-[60px] shrink-0 sticky left-0 z-20 bg-slate-50/95 backdrop-blur-xs border-r border-slate-200 select-none shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="border-b border-slate-200/60 pr-1.5 pt-0.5 text-right text-[10px] font-mono text-slate-400"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
                <div
                  style={{ height: '22px' }}
                  className="border-b border-slate-200 pr-1.5 pt-0.5 text-right text-[9px] font-mono text-slate-500 font-bold bg-slate-100/60"
                >
                  24:00
                </div>
              </div>

              {/* 7 Day Columns: Exactly identical widths to header cells */}
              {weekDates.map((date) => {
                const dateStr = formatDateToISO(date);
                const isToday = dateStr === '2026-10-30';
                const dayTasks = tasks.filter((t) => t.date === dateStr);
                const isExamPeriod = getImportantDatesForDate(dateStr).some((d) => d.type === 'sinav');
                const isHoliday = getImportantDatesForDate(dateStr).some((d) => d.type === 'tatil');

                return (
                  <div
                    key={dateStr}
                    className={`min-w-0 w-full border-r border-slate-200/60 relative ${
                      isToday
                        ? 'bg-blue-50/15'
                        : isExamPeriod
                        ? 'bg-rose-50/10'
                        : isHoliday
                        ? 'bg-amber-50/10'
                        : ''
                    }`}
                  >
                    {/* Hour Slot Drop Targets */}
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleSlotDrop(e, dateStr, hour)}
                        onClick={() =>
                          onCreateTaskAtTime(dateStr, `${String(hour).padStart(2, '0')}:00`)
                        }
                        className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors group cursor-pointer relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 absolute top-1 left-1.5 font-mono">
                          + {String(hour).padStart(2, '0')}:00
                        </span>
                      </div>
                    ))}
                    {/* Matching bottom cell for 24:00 marker */}
                    <div style={{ height: '22px' }} className="border-b border-slate-200 bg-slate-50/30" />

                    {/* Scheduled Tasks Positioned Absolutely */}
                    {dayTasks.map((task) => {
                      const cfg = SUBJECT_CONFIGS[task.subjectId];
                      const startMins = timeStringToMinutes(task.startTime);
                      const endMins = startMins + task.durationMinutes;

                      // Skip tasks completely outside 07:00 - 24:00
                      if (endMins <= START_HOUR * 60 || startMins >= END_HOUR * 60) {
                        return null;
                      }

                      const visibleStartMins = Math.max(START_HOUR * 60, startMins);
                      const visibleEndMins = Math.min(END_HOUR * 60, endMins);
                      const topPx = ((visibleStartMins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                      const heightPx = Math.max(22, ((visibleEndMins - visibleStartMins) / 60) * HOUR_HEIGHT);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleTaskDragStart(e, task)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTask(task);
                          }}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                            left: '2px',
                            right: '2px',
                          }}
                          className={`absolute z-10 rounded-md p-1.5 border text-[11px] shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                            cfg?.themeColor.cardBg || 'bg-slate-100 border-slate-300'
                          } ${task.completed ? 'ring-1 ring-emerald-500/50' : ''}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-semibold text-[11px] truncate flex items-center gap-1">
                                {renderTaskIcon(task.taskType)}
                                {task.title}
                              </span>
                              {task.completed ? (
                                <span className="bg-emerald-500 text-white rounded-full p-0.5 shrink-0" title="Tamamlandı">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                </span>
                              ) : task.recurrence !== 'none' ? (
                                <span title="Tekrarlayan">
                                  <Repeat className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                </span>
                              ) : null}
                            </div>

                            {task.customActivityName && (
                              <p className="text-[9px] font-medium text-slate-700 bg-black/5 px-1 rounded truncate leading-tight mb-0.5">
                                {task.customActivityName}
                              </p>
                            )}

                            {task.topicName && heightPx > 36 && (
                              <p className="text-[9px] opacity-75 truncate leading-tight">
                                {task.topicName}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[9px] opacity-90 pt-0.5 border-t border-black/5 mt-0.5">
                            <span className="font-mono flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {task.startTime} ({formatDuration(task.durationMinutes)})
                            </span>

                            {task.targetCount && (
                              <span className="font-semibold font-mono bg-white/70 px-1 py-0.2 rounded border border-black/5">
                                {task.completed && task.actualCount !== undefined
                                  ? `${task.actualCount}/${task.targetCount}`
                                  : `${task.targetCount} hdf`}
                              </span>
                            )}
                          </div>

                          {/* Bottom Resize Handle */}
                          <div
                            onMouseDown={(e) => handleResizeStart(e, task)}
                            className="cursor-ns-resize absolute bottom-0 left-0 right-0 h-1.5 bg-transparent hover:bg-black/10 flex items-center justify-center group/resize"
                            title="Süreyi uzatmak veya kısaltmak için aşağı/yukarı sürükleyin"
                          >
                            <div className="w-5 h-0.5 bg-black/20 group-hover/resize:bg-blue-600 rounded-full" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DAILY (Detailed Single Day View with Inset Milestones) */}
      {view === 'day' && (
        <div className="flex-1 flex flex-col h-[calc(100vh-140px)] min-h-[580px] overflow-hidden">
          {/* Day top notification if it falls on an exam or holiday */}
          {(() => {
            const dateStr = formatDateToISO(selectedDate);
            const imps = getImportantDatesForDate(dateStr);
            if (imps.length === 0) return null;

            return (
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-3 py-1 flex items-center justify-between text-[11px] border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-amber-300">MEB Takvim Uyarısı:</span>
                  <span>{imps.map((i) => `${i.title} (${i.description})`).join(' | ')}</span>
                </div>
                <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded font-mono">
                  Aktif Dönem
                </span>
              </div>
            );
          })()}

          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {TURKISH_DAYS_FULL[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]} Odak Çizelgesi
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {tasks.filter((t) => t.date === formatDateToISO(selectedDate)).length} Planlanmış Görev
            </span>
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-auto bg-white">
            <div className="grid grid-cols-[60px_1fr] relative min-w-[450px]">
              {/* Hours: Sticky on the left */}
              <div className="sticky left-0 z-20 border-r border-slate-200 bg-slate-50/95 backdrop-blur-xs select-none shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="border-b border-slate-200/60 pr-1.5 pt-0.5 text-right text-[10px] font-mono text-slate-400"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
                <div
                  style={{ height: '22px' }}
                  className="border-b border-slate-200 pr-1.5 pt-0.5 text-right text-[9px] font-mono text-slate-500 font-bold bg-slate-100/60"
                >
                  24:00
                </div>
              </div>

              {/* Day Slot */}
              <div className="relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleSlotDrop(e, formatDateToISO(selectedDate), hour)}
                    onClick={() =>
                      onCreateTaskAtTime(
                        formatDateToISO(selectedDate),
                        `${String(hour).padStart(2, '0')}:00`
                      )
                    }
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer px-2 py-1 flex items-start"
                  >
                    <span className="text-[10px] text-slate-300 font-mono">
                      {String(hour).padStart(2, '0')}:00 - {String(hour + 1 === 24 ? 24 : hour + 1).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
                {/* Matching bottom cell for 24:00 marker */}
                <div style={{ height: '22px' }} className="border-b border-slate-200 bg-slate-50/30" />

                {/* Day Tasks */}
                {tasks
                  .filter((t) => t.date === formatDateToISO(selectedDate))
                  .map((task) => {
                    const cfg = SUBJECT_CONFIGS[task.subjectId];
                    const startMins = timeStringToMinutes(task.startTime);
                    const endMins = startMins + task.durationMinutes;

                    if (endMins <= START_HOUR * 60 || startMins >= END_HOUR * 60) {
                      return null;
                    }

                    const visibleStartMins = Math.max(START_HOUR * 60, startMins);
                    const visibleEndMins = Math.min(END_HOUR * 60, endMins);
                    const topPx = ((visibleStartMins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                    const heightPx = Math.max(30, ((visibleEndMins - visibleStartMins) / 60) * HOUR_HEIGHT);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleTaskDragStart(e, task)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          left: '4px',
                          right: '4px',
                        }}
                        className={`absolute z-10 rounded-xl p-3 border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                          cfg?.themeColor.cardBg || 'bg-slate-100 border-slate-300'
                        } ${task.completed ? 'ring-2 ring-emerald-500/70' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-white/60 shadow-2xs">
                              {renderTaskIcon(task.taskType)}
                            </span>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                              <p className="text-xs text-slate-600">
                                {task.customActivityName
                                  ? `Aktivite: ${task.customActivityName}`
                                  : task.topicName || cfg?.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {task.targetCount && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-slate-800 border border-slate-200">
                                {task.completed && task.actualCount !== undefined
                                  ? `${task.actualCount} / ${task.targetCount} Çözüldü`
                                  : `Hedef: ${task.targetCount}`}
                              </span>
                            )}
                            {task.completed && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Tamamlandı
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-black/5">
                          <span className="font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {task.startTime} ({formatDuration(task.durationMinutes)})
                          </span>
                          {task.notes && (
                            <span className="italic text-slate-500 truncate max-w-xs">
                              &ldquo;{task.notes}&rdquo;
                            </span>
                          )}
                        </div>

                        {/* Resize handle */}
                        <div
                          onMouseDown={(e) => handleResizeStart(e, task)}
                          className="cursor-ns-resize absolute bottom-0 left-0 right-0 h-3 bg-transparent hover:bg-black/10 flex items-center justify-center"
                        >
                          <div className="w-12 h-1 bg-black/20 rounded-full" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MONTHLY (Classic Month Calendar Grid with Inset MEB Milestones) */}
      {view === 'month' && (
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase">
            {TURKISH_DAYS_FULL.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month Matrix (35 or 42 cells) */}
          <div className="grid grid-cols-7 gap-2 auto-rows-fr">
            {(() => {
              const year = selectedDate.getFullYear();
              const month = selectedDate.getMonth();
              const firstDay = new Date(year, month, 1);
              const lastDay = new Date(year, month + 1, 0);

              const firstDayJs = firstDay.getDay();
              const leadingOffset = firstDayJs === 0 ? 6 : firstDayJs - 1;

              const cells = [];

              for (let i = leadingOffset - 1; i >= 0; i--) {
                const prevDate = new Date(year, month, -i);
                cells.push({ date: prevDate, isCurrentMonth: false });
              }

              for (let d = 1; d <= lastDay.getDate(); d++) {
                cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
              }

              const remaining = 7 - (cells.length % 7);
              if (remaining < 7) {
                for (let i = 1; i <= remaining; i++) {
                  cells.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
                }
              }

              return cells.map(({ date, isCurrentMonth }, i) => {
                const dateStr = formatDateToISO(date);
                const isToday = dateStr === '2026-10-30';
                const dayTasks = tasks.filter((t) => t.date === dateStr);
                const dayImportantDates = getImportantDatesForDate(dateStr);

                return (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectedDateChange(date);
                      setView('day');
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleSlotDrop(e, dateStr, 17)}
                    className={`min-h-[110px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrentMonth
                        ? isToday
                          ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                          : dayImportantDates.some((d) => d.type === 'sinav')
                          ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                          : dayImportantDates.some((d) => d.type === 'tatil')
                          ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday ? 'bg-blue-600 text-white' : 'text-slate-800'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                          </span>
                        )}
                      </div>

                      {/* Plotted Important Date Pill in Month Cell */}
                      {dayImportantDates.length > 0 && (
                        <div className="space-y-0.5 mb-1">
                          {dayImportantDates.map((imp) => (
                            <div
                              key={imp.id}
                              className={`text-[9px] font-bold px-1 py-0.5 rounded truncate ${
                                imp.type === 'lgs'
                                  ? 'bg-purple-600 text-white'
                                  : imp.type === 'sinav'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-amber-600 text-white'
                              }`}
                              title={imp.description}
                            >
                              {imp.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Task chips */}
                    <div className="space-y-1 my-1 overflow-hidden">
                      {dayTasks.slice(0, 2).map((task) => {
                        const cfg = SUBJECT_CONFIGS[task.subjectId];
                        return (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTask(task);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 ${
                              cfg?.themeColor.cardBg || 'bg-slate-100'
                            }`}
                          >
                            {renderTaskIcon(task.taskType)}
                            <span className="truncate">{task.title}</span>
                          </div>
                        );
                      })}
                      {dayTasks.length > 2 && (
                        <div className="text-[10px] text-slate-400 font-semibold pl-1">
                          +{dayTasks.length - 2} görev daha
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono text-right">
                      {dayTasks.reduce((acc, t) => acc + (t.actualCount || 0), 0) > 0 && (
                        <span>
                          {dayTasks.reduce((acc, t) => acc + (t.actualCount || 0), 0)} soru
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* VIEW: YEARLY (12 Month Macro View with Exam Highlights) */}
      {view === 'year' && (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                {selectedDate.getFullYear()} MEB Akademik Takvimi & LGS Yol Haritası
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                Kırmızı günler: Ortak Yazılı Sınavları | Sarı günler: Ara & Sömestr Tatilleri | Mor gün: LGS 2027 Sınavı
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Sınavlar
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Tatiller
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> LGS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TURKISH_MONTHS.map((monthName, mIdx) => {
              const monthDate = new Date(selectedDate.getFullYear(), mIdx, 1);
              const daysInMonth = new Date(selectedDate.getFullYear(), mIdx + 1, 0).getDate();
              const tasksInThisMonth = tasks.filter((t) => {
                const [y, m] = t.date.split('-').map(Number);
                return y === selectedDate.getFullYear() && m === mIdx + 1;
              });

              return (
                <div
                  key={monthName}
                  onClick={() => {
                    onSelectedDateChange(monthDate);
                    setView('month');
                  }}
                  className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-800">{monthName}</span>
                    <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {tasksInThisMonth.length} Görev
                    </span>
                  </div>

                  {/* Micro mini calendar grid */}
                  <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-center text-slate-400 mb-2">
                    {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>

                  {/* Dot heatmap with MEB milestone colors */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: daysInMonth }, (_, dayNum) => {
                      const dStr = `${selectedDate.getFullYear()}-${String(mIdx + 1).padStart(2, '0')}-${String(dayNum + 1).padStart(2, '0')}`;
                      const imps = getImportantDatesForDate(dStr);
                      const isLgs = imps.some((d) => d.type === 'lgs');
                      const isExam = imps.some((d) => d.type === 'sinav');
                      const isTatil = imps.some((d) => d.type === 'tatil');
                      const count = tasks.filter((t) => t.date === dStr).length;

                      return (
                        <div
                          key={dayNum}
                          title={`${dayNum + 1} ${monthName}: ${imps.map((i) => i.title).join(', ') || `${count} görev`}`}
                          className={`w-full aspect-square rounded-xs text-[9px] flex items-center justify-center font-mono ${
                            isLgs
                              ? 'bg-purple-600 text-white font-bold ring-1 ring-purple-400'
                              : isExam
                              ? 'bg-rose-500 text-white font-bold'
                              : isTatil
                              ? 'bg-amber-400 text-slate-900 font-bold'
                              : count > 2
                              ? 'bg-blue-600 text-white font-bold'
                              : count > 0
                              ? 'bg-blue-200 text-blue-900'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {dayNum + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
