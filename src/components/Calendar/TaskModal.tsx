import React, { useState, useEffect } from 'react';
import { CalendarTask, Grade, SubjectId, TaskType, RecurrenceType } from '../../types';
import { SUBJECT_CONFIGS, CURRICULUM_DATA } from '../../data/curriculumData';
import {
  X,
  CheckCircle2,
  Trash2,
  Clock,
  Target,
  BookOpen,
  Award,
  BookMarked,
  Repeat,
  Sparkles,
  Calendar,
  Coffee,
  Activity,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: CalendarTask) => void;
  onDeleteTask?: (taskId: string, deleteAllRecurring?: boolean) => void;
  initialTask?: Partial<CalendarTask> | null;
  currentGrade: Grade;
}

const ACTIVITY_SUGGESTIONS = [
  { label: '🛌 Uyku & Dinlenme', value: 'Uyku & Dinlenme', duration: 60 },
  { label: '🏫 Başka Kurs / Dershane', value: 'Kurs / Dershane', duration: 90 },
  { label: '🎸 Hobi & Müzik', value: 'Hobi / Enstrüman', duration: 45 },
  { label: '⚽ Spor & Egzersiz', value: 'Spor & Egzersiz', duration: 60 },
  { label: '📖 Kitap / Kültür', value: 'Serbest Kitap Okuma', duration: 30 },
  { label: '☕ Mola / Sosyal', value: 'Dinlenme & Mola', duration: 30 },
  { label: '💻 Kodlama & Proje', value: 'Kodlama / Proje', duration: 60 },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  onDeleteTask,
  initialTask,
  currentGrade,
}) => {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<Grade>(currentGrade);
  const [subjectId, setSubjectId] = useState<SubjectId>('matematik');
  const [customActivityName, setCustomActivityName] = useState<string>('');
  const [unitId, setUnitId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [topicName, setTopicName] = useState<string>('');
  const [taskType, setTaskType] = useState<TaskType>('soru');
  const [date, setDate] = useState<string>('2026-10-30');
  const [startTime, setStartTime] = useState<string>('17:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [targetCount, setTargetCount] = useState<number>(40);
  const [actualCount, setActualCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setGrade(initialTask.grade || currentGrade);
      setSubjectId(initialTask.subjectId || 'matematik');
      setCustomActivityName(initialTask.customActivityName || '');
      setUnitId(initialTask.unitId || '');
      setTopicId(initialTask.topicId || '');
      setTopicName(initialTask.topicName || '');
      setTaskType(initialTask.taskType || 'soru');
      setDate(initialTask.date || '2026-10-30');
      setStartTime(initialTask.startTime || '17:00');
      setDurationMinutes(initialTask.durationMinutes || 60);
      setRecurrence(initialTask.recurrence || 'none');
      setTargetCount(initialTask.targetCount || (initialTask.taskType === 'kitap' ? 30 : 40));
      setActualCount(initialTask.actualCount || 0);
      setCorrectCount(initialTask.correctCount || 0);
      setWrongCount(initialTask.wrongCount || 0);
      setCompleted(initialTask.completed || false);
      setNotes(initialTask.notes || '');
    } else {
      // Default new task
      setTitle('');
      setGrade(currentGrade);
      setSubjectId('matematik');
      setCustomActivityName('');
      setUnitId('');
      setTopicId('');
      setTopicName('');
      setTaskType('soru');
      setDate('2026-10-30');
      setStartTime('17:00');
      setDurationMinutes(60);
      setRecurrence('none');
      setTargetCount(40);
      setActualCount(0);
      setCorrectCount(0);
      setWrongCount(0);
      setCompleted(false);
      setNotes('');
    }
  }, [initialTask, currentGrade, isOpen]);

  if (!isOpen) return null;

  const isAcademic = subjectId !== 'genel' && subjectId !== 'diger';
  const currentCurriculum = isAcademic ? CURRICULUM_DATA[grade]?.find((s) => s.subjectId === subjectId) : null;

  const handleCompleteToggle = () => {
    const nextCompleted = !completed;
    setCompleted(nextCompleted);

    if (nextCompleted) {
      if (actualCount === 0 && targetCount > 0) {
        setActualCount(targetCount);
      }
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSelectActivitySuggestion = (act: { label: string; value: string; duration: number }) => {
    setCustomActivityName(act.value);
    setTitle(act.value);
    setDurationMinutes(act.duration);
    setTaskType('aktivite');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTitle = title.trim();
    if (!finalTitle) {
      if (subjectId === 'diger') {
        finalTitle = customActivityName.trim() || 'Ders Dışı Aktivite';
      } else if (subjectId === 'genel') {
        finalTitle = 'Genel Çalışma & Tekrar';
      } else {
        const selectedSubjectName = SUBJECT_CONFIGS[subjectId]?.name || 'Ders';
        finalTitle = topicName ? `${selectedSubjectName}: ${topicName}` : `${selectedSubjectName} Çalışması`;
      }
    }

    const task: CalendarTask = {
      id: initialTask?.id || `task-${Date.now()}`,
      title: finalTitle,
      grade,
      subjectId,
      customActivityName: subjectId === 'diger' ? (customActivityName.trim() || finalTitle) : undefined,
      unitId: isAcademic ? (unitId || undefined) : undefined,
      topicId: isAcademic ? (topicId || undefined) : undefined,
      topicName: isAcademic ? (topicName || undefined) : undefined,
      taskType,
      date,
      startTime,
      durationMinutes,
      recurrence,
      recurrenceGroupId: initialTask?.recurrenceGroupId,
      targetCount: (taskType === 'soru' || taskType === 'kitap' || taskType === 'deneme') && targetCount ? Number(targetCount) : undefined,
      actualCount: completed ? Number(actualCount) : Number(actualCount) || 0,
      correctCount: Number(correctCount) || 0,
      wrongCount: Number(wrongCount) || 0,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
      notes: notes.trim() || undefined,
    };

    onSaveTask(task);
    onClose();
  };

  const taskTypeOptions: { type: TaskType; label: string; icon: React.ReactNode }[] = [
    { type: 'soru', label: 'Soru', icon: <Target className="w-3 h-3 text-blue-600 shrink-0" /> },
    { type: 'konu', label: 'Konu', icon: <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" /> },
    { type: 'deneme', label: 'Deneme', icon: <Award className="w-3 h-3 text-amber-500 shrink-0" /> },
    { type: 'kitap', label: 'Kitap', icon: <BookMarked className="w-3 h-3 text-purple-600 shrink-0" /> },
    { type: 'aktivite', label: 'Aktivite', icon: <Coffee className="w-3 h-3 text-slate-600 shrink-0" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl sm:max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Compact Header */}
        <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <Calendar className="w-3 h-3" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              {initialTask?.id ? 'Görevi Düzenle' : 'Yeni Hedef & Görev Planla'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Form Container */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Form Body (if needed, but fits naturally on standard mobile screens) */}
          <div className="p-2.5 sm:p-3.5 space-y-1.5 sm:space-y-2 text-xs overflow-y-auto flex-1">
            {/* Row 1: Görev Başlığı / Hedef Tanımı (Tüm Satır) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                Görev Başlığı / Hedef Tanımı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  subjectId === 'diger'
                    ? 'Örn: Öğle Uykusu, Gitar Dersi, Yüzme Antrenmanı vb.'
                    : subjectId === 'genel'
                    ? 'Örn: Haftalık Genel Tekrar & Deneme Analizi'
                    : 'Örn: 40 Matematik Sorusu Çöz & EBOB Pekiştir'
                }
                className="w-full px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium text-xs h-7 sm:h-8"
              />
            </div>

            {/* Row 2: Ders ve Aktivite Seçimi (Kompakt yatay butonlar) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                Ders / Kategori Seçimi
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                {(Object.keys(SUBJECT_CONFIGS) as SubjectId[]).map((sId) => {
                  const cfg = SUBJECT_CONFIGS[sId];
                  const isSelected = subjectId === sId;

                  return (
                    <button
                      key={sId}
                      type="button"
                      onClick={() => {
                        setSubjectId(sId);
                        setUnitId('');
                        setTopicId('');
                        setTopicName('');
                        if (sId === 'diger') {
                          setTaskType('aktivite');
                          if (!title) setTitle('Ders Dışı Aktivite');
                        } else if (sId === 'genel') {
                          if (!title) setTitle('Genel Çalışma');
                        }
                      }}
                      className={`cursor-pointer px-1.5 py-0.5 rounded-md border text-center transition-all flex items-center justify-center gap-1 h-6 sm:h-7 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.themeColor.accent}`} />
                      <span className="text-[10px] sm:text-[11px] truncate">{cfg.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional Sub-row: If 'Diğer' is selected -> Show quick non-academic activity chips */}
            {subjectId === 'diger' && (
              <div className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-amber-600" />
                    Ders Dışı Aktivite Hızlı Seçim
                  </span>
                  <span className="text-[9px] text-slate-400">Tek tıkla ayarlar</span>
                </div>

                {/* Quick suggestions chips */}
                <div className="flex flex-wrap gap-1">
                  {ACTIVITY_SUGGESTIONS.map((act) => (
                    <button
                      key={act.value}
                      type="button"
                      onClick={() => handleSelectActivitySuggestion(act)}
                      className={`cursor-pointer px-2 py-0.5 rounded border text-[10px] transition-all ${
                        customActivityName === act.value
                          ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Custom activity name free input */}
                <div>
                  <input
                    type="text"
                    value={customActivityName}
                    onChange={(e) => {
                      setCustomActivityName(e.target.value);
                      if (!title || ACTIVITY_SUGGESTIONS.some((a) => a.value === title)) {
                        setTitle(e.target.value);
                      }
                    }}
                    placeholder="Veya özel aktivite yazın (Örn: Piyano Dersi, Yüzme Kursu, Dinlenme)"
                    className="w-full px-2 py-0.5 rounded border border-slate-300 text-[11px] text-slate-800 bg-white h-6 sm:h-7 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Conditional Sub-row: If Academic Subject -> Show Müfredat Konusu (Tüm Satır) */}
            {isAcademic && (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  Müfredat Konusu (Yeni Maarif Modeli)
                </label>
                <select
                  value={topicId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    setTopicId(tId);
                    const foundUnit = currentCurriculum?.units.find((u) =>
                      u.topics.some((t) => t.id === tId)
                    );
                    const foundTopic = foundUnit?.topics.find((t) => t.id === tId);
                    if (foundTopic) {
                      setTopicName(foundTopic.name);
                      setUnitId(foundUnit?.id || '');
                      if (foundTopic.recommendedQuestions) {
                        setTargetCount(foundTopic.recommendedQuestions);
                      }
                    }
                  }}
                  className="w-full px-2 py-0.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs h-7 sm:h-8"
                >
                  <option value="">Genel / Konu Seçilmedi</option>
                  {currentCurriculum?.units.map((u) => (
                    <optgroup key={u.id} label={u.name}>
                      {u.topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Row 3: Görev Tipi & Hedef Sayısı (Yan yana 2 sütun) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-2 items-end">
              {/* Col A: Görev Tipi (Segmented Buttons) - 7 cols */}
              <div className="sm:col-span-7">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  Görev Tipi
                </label>
                <div className="grid grid-cols-5 gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-7 sm:h-8">
                  {taskTypeOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setTaskType(opt.type)}
                      className={`cursor-pointer px-0.5 rounded text-center transition-all flex items-center justify-center gap-1 ${
                        taskType === opt.type
                          ? 'bg-white text-blue-900 shadow-2xs font-bold border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-[10px] truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Col B: Hedef Miktarı (Soru/Sayfa veya Süre) - 5 cols */}
              <div className="sm:col-span-5">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  {taskType === 'kitap'
                    ? 'Hedef Sayfa'
                    : taskType === 'soru' || taskType === 'deneme'
                    ? 'Hedef Soru Sayısı'
                    : 'Hedef Türü'}
                </label>

                {taskType === 'soru' || taskType === 'kitap' || taskType === 'deneme' ? (
                  <div className="flex items-center gap-1 h-7 sm:h-8">
                    <input
                      type="number"
                      min="5"
                      max="200"
                      step="5"
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value))}
                      className="w-14 sm:w-16 h-full px-1 rounded-lg border border-slate-300 font-mono font-bold text-blue-700 text-center text-xs"
                    />
                    <div className="flex items-center gap-0.5 flex-1 h-full">
                      {[20, 40, 60, 80].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTargetCount(num)}
                          className={`cursor-pointer px-1 rounded-md text-[10px] font-semibold border flex-1 h-full flex items-center justify-center ${
                            targetCount === num
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-7 sm:h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Süre odaklı planlama</span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Zamanlama (Tarih, Saat, Süre) */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5 truncate">Tarih</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2 py-0.5 rounded-lg border border-slate-300 font-mono text-slate-800 text-[11px] h-7 sm:h-8"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5 truncate">Saat</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-0.5 rounded-lg border border-slate-300 font-mono text-slate-800 text-[11px] h-7 sm:h-8"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5 truncate">Süre</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-1.5 py-0.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-[11px] h-7 sm:h-8"
                >
                  <option value={30}>30 dk</option>
                  <option value={45}>45 dk</option>
                  <option value={60}>60 dk (1 sa)</option>
                  <option value={75}>75 dk</option>
                  <option value={90}>90 dk (1.5 sa)</option>
                  <option value={120}>120 dk (2 sa)</option>
                  <option value={135}>135 dk (Deneme)</option>
                </select>
              </div>
            </div>

            {/* Row 4.5: Tekrar Segmesi (Segmented Control Buttons) */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-blue-600" />
                  Tekrar Segmesi
                </label>
                {recurrence !== 'none' && (
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                    Takvime otomatik kopyalanır
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-7 sm:h-8">
                {[
                  { value: 'none', label: 'Tek Sefer' },
                  { value: 'daily', label: 'Her Gün' },
                  { value: 'weekdays', label: 'Hafta İçi' },
                  { value: 'weekly', label: 'Haftalık' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRecurrence(opt.value as RecurrenceType)}
                    className={`cursor-pointer px-1 rounded-md text-[10px] font-semibold transition-all flex items-center justify-center truncate ${
                      recurrence === opt.value
                        ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {recurrence !== 'none' && (
                <p className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md mt-1 flex items-center gap-1.5 leading-tight">
                  <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>
                    {recurrence === 'daily' && 'Seçilen saatte 4 hafta boyunca her gün takviminize otomatik eklenecektir.'}
                    {recurrence === 'weekdays' && 'Pazartesi - Cuma günleri arasında takviminize otomatik eklenecektir.'}
                    {recurrence === 'weekly' && 'Her hafta aynı günde 8 hafta boyunca takviminize otomatik eklenecektir.'}
                  </span>
                </p>
              )}
            </div>

            {/* Row 5: Hızlı Tamamlama & Çalışma Notu (Tek Kompakt Satırda!) */}
            <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCompleteToggle}
                  className={`cursor-pointer px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all h-6 sm:h-7 shadow-2xs ${
                    completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {completed ? 'Tamamlandı ✓' : 'Tamamla'}
                </button>
              </div>

              {completed && (taskType === 'soru' || taskType === 'kitap' || taskType === 'deneme') && (
                <div className="flex items-center gap-1 text-[10px]">
                  <div className="flex items-center gap-0.5">
                    <span className="text-slate-500 text-[9px]">Çöz:</span>
                    <input
                      type="number"
                      min="0"
                      value={actualCount}
                      onChange={(e) => setActualCount(Number(e.target.value))}
                      className="w-11 px-1 py-0.5 rounded border border-slate-300 text-center font-bold text-emerald-700 bg-white h-6"
                    />
                  </div>
                  {taskType === 'soru' && (
                    <>
                      <div className="flex items-center gap-0.5">
                        <span className="text-emerald-700 text-[9px]">D:</span>
                        <input
                          type="number"
                          min="0"
                          value={correctCount}
                          onChange={(e) => setCorrectCount(Number(e.target.value))}
                          className="w-10 px-1 py-0.5 rounded border border-slate-300 text-center font-bold text-emerald-700 bg-white h-6"
                        />
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-red-600 text-[9px]">Y:</span>
                        <input
                          type="number"
                          min="0"
                          value={wrongCount}
                          onChange={(e) => setWrongCount(Number(e.target.value))}
                          className="w-10 px-1 py-0.5 rounded border border-slate-300 text-center font-bold text-red-600 bg-white h-6"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Çalışma notu / hedefler..."
                className="flex-1 min-w-[130px] px-2 py-0.5 rounded border border-slate-200 text-slate-800 text-[10px] h-6 sm:h-7 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fixed Modal Footer - Always in view, never hidden behind screen bottom! */}
          <div className="px-3.5 py-1.5 sm:py-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/80 shrink-0">
            {initialTask?.id && onDeleteTask ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteTask(initialTask.id!, false);
                    onClose();
                  }}
                  className="cursor-pointer px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1 transition-colors"
                  title="Sadece seçili gündeki görevi siler"
                >
                  <Trash2 className="w-3 h-3" />
                  {initialTask.recurrenceGroupId ? 'Bu Günü Sil' : 'Sil'}
                </button>

                {initialTask.recurrenceGroupId && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTask(initialTask.id!, true);
                      onClose();
                    }}
                    className="cursor-pointer px-2 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md flex items-center gap-1 transition-colors"
                    title="Tüm tekrarlayan görevleri takvimden siler"
                  >
                    <Repeat className="w-3 h-3" />
                    Tüm Tekrarları Sil
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="cursor-pointer px-3.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[11px] font-bold shadow-2xs"
              >
                {initialTask?.id ? 'Kaydet' : 'Takvime Ekle'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
