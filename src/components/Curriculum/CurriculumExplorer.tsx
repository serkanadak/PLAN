import React, { useState } from 'react';
import { CalendarTask, Grade, SubjectId, TopicItem } from '../../types';
import { CURRICULUM_DATA, SUBJECT_CONFIGS } from '../../data/curriculumData';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Layers,
  Calculator,
  Atom,
  Landmark,
  Globe,
  HeartHandshake,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Clock,
  Target,
  ListTodo,
  X,
  ArrowRight,
  Plus,
  ChevronRight,
  Award,
  Coffee,
  BookMarked,
} from 'lucide-react';

interface CurriculumExplorerProps {
  currentGrade: Grade;
  onPlanTopic: (subjectId: SubjectId, topic: TopicItem, unitName: string) => void;
  completedTopicIds?: Set<string>;
  tasks?: CalendarTask[];
  onSelectTask?: (task: CalendarTask) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  currentGrade,
  onPlanTopic,
  completedTopicIds = new Set(),
  tasks = [],
  onSelectTask,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<{
    topic: TopicItem;
    unitName: string;
    subjectId: SubjectId;
  } | null>(null);
  
  // Accordion state for all subjects listed vertically
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    matematik: true,
    fen: true,
    turkce: false,
    sosyal: false,
    ingilizce: false,
    din: false,
  });

  const curriculum = CURRICULUM_DATA[currentGrade] || [];

  const toggleSubject = (subjectId: SubjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {
      matematik: true,
      fen: true,
      turkce: true,
      sosyal: true,
      ingilizce: true,
      din: true,
    };
    setExpandedSubjects(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {
      matematik: false,
      fen: false,
      turkce: false,
      sosyal: false,
      ingilizce: false,
      din: false,
    };
    setExpandedSubjects(allClosed);
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-sky-600" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-purple-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-indigo-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-slate-600" />;
    }
  };

  const totalTopicsInGrade = curriculum.reduce(
    (sum, s) => sum + s.units.reduce((uSum, u) => uSum + u.topics.length, 0),
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {currentGrade}. Sınıf Yeni Maarif Modeli Tüm Müfredat Listesi
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {totalTopicsInGrade} Konu / Kazanım
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tüm ana dersler alt alta listelenmiştir; ders başlıklarına tıklayarak veya toplu olarak genişletip daraltabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Global Expand/Collapse Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Konu veya ünite ara..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={expandAll}
              className="cursor-pointer px-2.5 py-1 rounded-lg bg-white text-slate-700 font-semibold shadow-2xs hover:text-blue-600 flex items-center gap-1 transition-colors"
              title="Tüm derslerin detaylarını aç"
            >
              <Maximize2 className="w-3 h-3 text-blue-600" />
              <span>Tümünü Genişlet</span>
            </button>
            <button
              onClick={collapseAll}
              className="cursor-pointer px-2.5 py-1 rounded-lg bg-white text-slate-700 font-semibold shadow-2xs hover:text-slate-900 flex items-center gap-1 transition-colors"
              title="Tüm dersleri daralt"
            >
              <Minimize2 className="w-3 h-3 text-slate-500" />
              <span>Tümünü Daralt</span>
            </button>
          </div>
        </div>
      </div>

      {/* VERTICAL SUBJECT ACCORDIONS (Dersler Alt Alta) */}
      <div className="space-y-4">
        {curriculum.map((subjCurriculum) => {
          const cfg = SUBJECT_CONFIGS[subjCurriculum.subjectId];
          const isExpanded = expandedSubjects[subjCurriculum.subjectId] || search.trim().length > 0;
          const subjectTopicCount = subjCurriculum.units.reduce((acc, u) => acc + u.topics.length, 0);

          // Filter by search query if any
          const filteredUnits = subjCurriculum.units
            .map((unit) => {
              const matchingTopics = unit.topics.filter(
                (t) =>
                  t.name.toLowerCase().includes(search.toLowerCase()) ||
                  unit.name.toLowerCase().includes(search.toLowerCase())
              );
              return { ...unit, topics: matchingTopics };
            })
            .filter((unit) => search.trim().length === 0 || unit.topics.length > 0);

          if (filteredUnits.length === 0 && search.trim().length > 0) return null;

          return (
            <div
              key={subjCurriculum.subjectId}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all hover:border-slate-300"
            >
              {/* Subject Clickable Banner Header */}
              <button
                type="button"
                onClick={() => toggleSubject(subjCurriculum.subjectId)}
                className={`cursor-pointer w-full flex items-center justify-between p-4 text-left transition-colors ${
                  cfg ? cfg.themeColor.bg : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-black/5">
                    {cfg && getSubjectIcon(cfg.icon)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${cfg ? cfg.themeColor.text : 'text-slate-900'}`}>
                      {cfg?.name || subjCurriculum.subjectId}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {subjCurriculum.units.length} Ünite &bull; {subjectTopicCount} Kazanım Konusu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-slate-700">
                    {isExpanded ? 'Detayları Gizle' : 'Konuları Göster'}
                  </span>
                  <div className="p-1 rounded-full bg-white/60 text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Units & Topics (Expanded Content) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50/40 border-t border-slate-200/70 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                      >
                        {/* Unit Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <h4 className="font-bold text-xs text-slate-900 truncate pr-2">
                            {unit.name}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {unit.topics.length} Konu
                          </span>
                        </div>

                        {/* Topics List */}
                        <div className="space-y-2">
                          {unit.topics.map((topic) => {
                            const isCompleted = completedTopicIds.has(topic.id);
                            
                            // Find all tasks related to this topic
                            const topicTasks = tasks.filter(
                              (t) =>
                                t.topicId === topic.id ||
                                (t.topicName && t.topicName.toLowerCase().includes(topic.name.toLowerCase()))
                            );
                            const completedCount = topicTasks.filter((t) => t.completed).length;

                            return (
                              <div
                                key={topic.id}
                                onClick={() =>
                                  setSelectedTopicDetail({
                                    topic,
                                    unitName: unit.name,
                                    subjectId: subjCurriculum.subjectId,
                                  })
                                }
                                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer group ${
                                  isCompleted
                                    ? 'bg-slate-50/80 border-slate-200 text-slate-500 hover:border-slate-300'
                                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs'
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {isCompleted && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    )}
                                    <span
                                      className={`text-xs font-semibold block truncate group-hover:text-blue-700 transition-colors ${
                                        isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                                      }`}
                                    >
                                      {topic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {topic.recommendedQuestions && (
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        Hedef: ~{topic.recommendedQuestions} soru
                                      </span>
                                    )}

                                    {topicTasks.length > 0 ? (
                                      <span
                                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold flex items-center gap-1 ${
                                          completedCount === topicTasks.length
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : completedCount > 0
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}
                                      >
                                        <ListTodo className="w-3 h-3" />
                                        {completedCount}/{topicTasks.length} Görev Tamamlandı
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">
                                        Planlı görev yok &bull; İncelemek için tıkla
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onPlanTopic(subjCurriculum.subjectId, topic, unit.name);
                                    }}
                                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white transition-colors text-xs font-semibold shadow-2xs"
                                    title="Bu konuyu takvime görev olarak ekle"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span className="hidden sm:inline">Takvime</span> Planla
                                  </button>
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TOPIC TASKS & STATUS MODAL */}
      {selectedTopicDetail && (() => {
        const { topic, unitName, subjectId } = selectedTopicDetail;
        const cfg = SUBJECT_CONFIGS[subjectId];
        const topicTasks = tasks.filter(
          (t) =>
            t.topicId === topic.id ||
            (t.topicName && t.topicName.toLowerCase().includes(topic.name.toLowerCase()))
        );
        const completedTasks = topicTasks.filter((t) => t.completed);
        const pendingTasks = topicTasks.filter((t) => !t.completed);
        const totalSolvedQuestions = topicTasks.reduce((acc, t) => acc + (t.actualCount || 0), 0);
        const totalTargetQuestions = topicTasks.reduce((acc, t) => acc + (t.targetCount || 0), 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 font-semibold">
                        {cfg?.name || subjectId} &bull; {currentGrade}. Sınıf
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-1">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-blue-200/80 mt-0.5 truncate max-w-md">
                      {unitName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTopicDetail(null)}
                  className="cursor-pointer p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Topic KPI Overview Strip */}
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-3 gap-2 text-center shrink-0">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block font-medium">Toplam Görev</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    {topicTasks.length} adet
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block font-medium">Tamamlanan</span>
                  <span className="text-base font-bold font-mono text-emerald-600">
                    {completedTasks.length} / {topicTasks.length}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block font-medium">Çözülen Soru</span>
                  <span className="text-base font-bold font-mono text-blue-600">
                    {totalSolvedQuestions} / {totalTargetQuestions || topic.recommendedQuestions || 40}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-blue-600" />
                    Bu Konuyla İlgili Görevler ({topicTasks.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicDetail(null);
                      onPlanTopic(subjectId, topic, unitName);
                    }}
                    className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Yeni Görev Ekle</span>
                  </button>
                </div>

                {topicTasks.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                      <Target className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Bu Konu İçin Henüz Görev Planlanmamış
                    </h5>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Yeni Maarif Modeli kazanımı için soru çözümü, konu tekrarı veya deneme planlayarak takviminize ekleyin.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTopicDetail(null);
                        onPlanTopic(subjectId, topic, unitName);
                      }}
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Bu Konu İçin İlk Görevi Planla</span>
                    </button>
                  </div>
                ) : (
                  topicTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                            📅 {task.date} &bull; {task.startTime} ({task.durationMinutes} dk)
                          </span>

                          {task.targetCount && (
                            <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                              🎯 Hedef: {task.targetCount} soru
                            </span>
                          )}

                          {task.actualCount !== undefined && task.actualCount > 0 && (
                            <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                              ✓ Çözülen: {task.actualCount} soru
                              {task.correctCount !== undefined && ` (${task.correctCount}D / ${task.wrongCount || 0}Y)`}
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            &ldquo;{task.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Status and Action */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                            task.completed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {task.completed ? (
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
                              setSelectedTopicDetail(null);
                              onSelectTask(task);
                            }}
                            className="cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all flex items-center gap-1"
                          >
                            <span>Takvimde Aç</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopicDetail(null);
                    onPlanTopic(subjectId, topic, unitName);
                  }}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Yeni Görev Planla</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTopicDetail(null)}
                  className="cursor-pointer px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
