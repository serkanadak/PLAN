import React, { useState, useMemo } from 'react';
import { MockExam, Grade, AcademicSubjectId, ExamSubjectResult } from '../../types';
import { SUBJECT_CONFIGS } from '../../data/curriculumData';
import { STANDARD_QUESTION_COUNTS, calculateExamTotals } from '../../data/mockExamsData';

const ACADEMIC_SUBJECTS: AcademicSubjectId[] = ['turkce', 'matematik', 'fen', 'sosyal', 'din', 'ingilizce'];
import {
  Award,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  BarChart3,
  Percent,
  Calculator,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockExamsViewProps {
  exams: MockExam[];
  onAddExam: (exam: MockExam) => void;
  onDeleteExam: (examId: string) => void;
  currentGrade: Grade;
}

export const MockExamsView: React.FC<MockExamsViewProps> = ({
  exams,
  onAddExam,
  onDeleteExam,
  currentGrade,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(
    exams.length > 0 ? exams[exams.length - 1].id : null
  );

  // Comparison selection: pick 2 exams to compare side-by-side
  const [compareExamAId, setCompareExamAId] = useState<string>(
    exams.length >= 2 ? exams[exams.length - 2].id : exams[0]?.id || ''
  );
  const [compareExamBId, setCompareExamBId] = useState<string>(
    exams.length >= 1 ? exams[exams.length - 1].id : ''
  );
  const [compareMode, setCompareMode] = useState<'cards' | 'table' | 'trends'>('cards');

  // New Exam Form State
  const [examTitle, setExamTitle] = useState('');
  const [examPublisher, setExamPublisher] = useState('');
  const [examDate, setExamDate] = useState('2026-10-30');
  const [examNotes, setExamNotes] = useState('');

  const initialSubjectInputs = useMemo(() => {
    const counts = STANDARD_QUESTION_COUNTS[currentGrade] || STANDARD_QUESTION_COUNTS['8'];
    const inputs: Record<AcademicSubjectId, { totalQuestions: number; correct: number; wrong: number; empty: number }> = {
      turkce: { totalQuestions: counts.turkce, correct: 17, wrong: 2, empty: 1 },
      matematik: { totalQuestions: counts.matematik, correct: 14, wrong: 4, empty: 2 },
      fen: { totalQuestions: counts.fen, correct: 16, wrong: 3, empty: 1 },
      sosyal: { totalQuestions: counts.sosyal, correct: 9, wrong: 1, empty: 0 },
      din: { totalQuestions: counts.din, correct: 9, wrong: 1, empty: 0 },
      ingilizce: { totalQuestions: counts.ingilizce, correct: 8, wrong: 2, empty: 0 },
    };
    return inputs;
  }, [currentGrade]);

  const [subjectInputs, setSubjectInputs] = useState(initialSubjectInputs);

  // Real-time calculation for modal preview
  const previewTotals = useMemo(() => {
    return calculateExamTotals(subjectInputs);
  }, [subjectInputs]);

  // Handle subject change
  const handleInputChange = (
    subj: AcademicSubjectId,
    field: 'correct' | 'wrong' | 'empty',
    val: number
  ) => {
    setSubjectInputs((prev) => {
      const current = { ...prev[subj] };
      const num = Math.max(0, val);

      if (field === 'correct') {
        current.correct = num;
        // Auto adjust empty
        current.empty = Math.max(0, current.totalQuestions - current.correct - current.wrong);
      } else if (field === 'wrong') {
        current.wrong = num;
        current.empty = Math.max(0, current.totalQuestions - current.correct - current.wrong);
      } else if (field === 'empty') {
        current.empty = num;
      }

      return { ...prev, [subj]: current };
    });
  };

  // Submit new exam
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();

    const title = examTitle.trim() || `Deneme Sınavı #${exams.length + 1}`;
    const { processedResults, totalQuestions, totalCorrect, totalWrong, totalEmpty, totalNet, overallSuccessRate, calculatedScore } =
      calculateExamTotals(subjectInputs);

    const newExam: MockExam = {
      id: `exam-${Date.now()}`,
      title,
      publisher: examPublisher.trim() || 'Kurumsal Yayın',
      date: examDate,
      grade: currentGrade,
      results: processedResults,
      totalQuestions,
      totalCorrect,
      totalWrong,
      totalEmpty,
      totalNet,
      overallSuccessRate,
      calculatedScore,
      notes: examNotes.trim() || undefined,
    };

    onAddExam(newExam);
    setIsModalOpen(false);
    setExpandedExamId(newExam.id);
    setCompareExamBId(newExam.id);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }

    // Reset inputs
    setExamTitle('');
    setExamPublisher('');
    setExamNotes('');
  };

  // Selected Comparison Exams
  const examA = exams.find((e) => e.id === compareExamAId);
  const examB = exams.find((e) => e.id === compareExamBId);

  // Compute subject comparison stats (most improved, top scorer, needs attention)
  const comparisonStats = useMemo(() => {
    if (!examA || !examB) return null;
    let maxImprovedSubj: { id: AcademicSubjectId; diff: number } | null = null;
    let highestSuccessSubj: { id: AcademicSubjectId; rate: number } | null = null;
    let lowestSuccessSubj: { id: AcademicSubjectId; rate: number } | null = null;

    for (const subjId of ACADEMIC_SUBJECTS) {
      const resA = examA.results[subjId];
      const resB = examB.results[subjId];
      if (!resA || !resB) continue;

      const diff = Number((resB.successRate - resA.successRate).toFixed(1));
      if (!maxImprovedSubj || diff > maxImprovedSubj.diff) {
        maxImprovedSubj = { id: subjId, diff };
      }
      if (!highestSuccessSubj || resB.successRate > highestSuccessSubj.rate) {
        highestSuccessSubj = { id: subjId, rate: resB.successRate };
      }
      if (!lowestSuccessSubj || resB.successRate < lowestSuccessSubj.rate) {
        lowestSuccessSubj = { id: subjId, rate: resB.successRate };
      }
    }

    return { maxImprovedSubj, highestSuccessSubj, lowestSuccessSubj };
  }, [examA, examB]);

  // Overall Stats
  const latestExam = exams[exams.length - 1];
  const firstExam = exams[0];
  const netProgress =
    exams.length >= 2 && latestExam && firstExam
      ? Number((latestExam.totalNet - firstExam.totalNet).toFixed(2))
      : 0;

  const averageSuccessRate =
    exams.length > 0
      ? Number(
          (exams.reduce((acc, e) => acc + e.overallSuccessRate, 0) / exams.length).toFixed(1)
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Deneme Sınav Takibi ve Gelişim Analizi
              </h2>
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                {currentGrade}. Sınıf
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Doğru, yanlış, boş girişleri, net hesaplaması, başarı yüzdesi (% Doğru/Toplam) ve sınav karşılaştırmaları
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Deneme Sonucu Gir</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Son Sınav Başarı % */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Son Sınav Doğru / Toplam %
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              %{latestExam ? latestExam.overallSuccessRate : 0}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({latestExam ? `${latestExam.totalCorrect}/${latestExam.totalQuestions} Doğru` : '0/0'})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${latestExam ? latestExam.overallSuccessRate : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Hedef: LGS için <span className="font-bold text-slate-800">%85+ başarı</span>
          </span>
        </div>

        {/* Card 2: Son Sınav Toplam Net */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Son Sınav Neti
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {latestExam ? latestExam.totalNet : 0}
            </span>
            <span className="text-xs text-slate-500 font-semibold font-mono">/ 90 Net</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {netProgress >= 0 ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />+{netProgress} Net
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-red-500 font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                {netProgress} Net
              </span>
            )}
            <span className="text-slate-400">ilk sınava göre gelişim</span>
          </div>
        </div>

        {/* Card 3: Tahmini LGS Puanı */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tahmini LGS Puanı
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-purple-700 font-mono">
              {latestExam?.calculatedScore || 0}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 500 Puan</span>
          </div>
          <div className="text-[11px] text-slate-500">
            MEB standart standart sapma & katsayı hesaplamalı
          </div>
        </div>

        {/* Card 4: Toplam Çözülen Deneme */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kayıtlı Deneme Sınavı
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{exams.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Adet Sınav</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Ortalama Doğru Oranı: <span className="font-bold text-blue-600 font-mono">%{averageSuccessRate}</span>
          </div>
        </div>
      </div>

      {/* COMPARISON MODULE (Geçmiş Sınavlarla Karşılaştırma) */}
      {exams.length >= 2 && examA && examB && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Header & Exam Selectors */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Sınav Karşılaştırma Modülü (Ders Ders Başarı Yüzdesi Analizi)
                  </h3>
                  <p className="text-xs text-slate-500">
                    İki sınav seçerek ders bazında başarı yüzdelerini (% Doğru/Toplam), net gelişimlerini ve soru karnelerini kıyaslayın
                  </p>
                </div>
              </div>

              {/* Selectors for comparison */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">1. Sınav:</span>
                  <select
                    value={compareExamAId}
                    onChange={(e) => setCompareExamAId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.title} ({ex.date})
                      </option>
                    ))}
                  </select>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">2. Sınav:</span>
                  <select
                    value={compareExamBId}
                    onChange={(e) => setCompareExamBId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.title} ({ex.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-view switcher tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCompareMode('cards')}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    compareMode === 'cards'
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ders Ders Başarı Yüzdesi (% Doğru)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode('table')}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    compareMode === 'table'
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Detaylı Net & Doğru Tablosu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode('trends')}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    compareMode === 'trends'
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tüm Sınavlar Boyunca Ders İlerleme Trendi</span>
                </button>
              </div>

              {/* Quick Overall Summary Pill */}
              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                Genel: %{examA.overallSuccessRate} ➔ %{examB.overallSuccessRate}{' '}
                {examB.overallSuccessRate >= examA.overallSuccessRate ? (
                  <span className="text-emerald-600 font-bold">
                    (+%{(examB.overallSuccessRate - examA.overallSuccessRate).toFixed(1)})
                  </span>
                ) : (
                  <span className="text-red-500 font-bold">
                    (%{(examB.overallSuccessRate - examA.overallSuccessRate).toFixed(1)})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Insight Highlights */}
            {comparisonStats?.maxImprovedSubj && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">🚀 En Yüksek Artış:</span>
                    <span className="font-semibold text-slate-800">
                      {SUBJECT_CONFIGS[comparisonStats.maxImprovedSubj.id]?.name}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-700">
                    +{comparisonStats.maxImprovedSubj.diff}%
                  </span>
                </div>

                {comparisonStats.highestSuccessSubj && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold">🏆 Zirve Başarı:</span>
                      <span className="font-semibold text-slate-800">
                        {SUBJECT_CONFIGS[comparisonStats.highestSuccessSubj.id]?.name}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-blue-700">
                      %{comparisonStats.highestSuccessSubj.rate}
                    </span>
                  </div>
                )}

                {comparisonStats.lowestSuccessSubj && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-800 font-bold">💡 Odaklanılacak:</span>
                      <span className="font-semibold text-slate-800">
                        {SUBJECT_CONFIGS[comparisonStats.lowestSuccessSubj.id]?.name}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-amber-800">
                      %{comparisonStats.lowestSuccessSubj.rate}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 1: CARDS - DERS DERS BAŞARI YÜZDESİ KARŞILAŞTIRMASI */}
            {compareMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {ACADEMIC_SUBJECTS.map((subjId) => {
                  const cfg = SUBJECT_CONFIGS[subjId];
                  const resA = examA.results[subjId];
                  const resB = examB.results[subjId];
                  if (!resA || !resB) return null;

                  const rateDiff = Number((resB.successRate - resA.successRate).toFixed(1));
                  const netDiff = Number((resB.net - resA.net).toFixed(2));
                  const isPositive = rateDiff > 0;
                  const isNegative = rateDiff < 0;

                  return (
                    <div
                      key={subjId}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${cfg.themeColor.accent}`} />
                          <span className="font-bold text-xs text-slate-900">{cfg.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({resA.totalQuestions} Soru)
                          </span>
                        </div>

                        {/* Percentage diff badge */}
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isNegative
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPositive && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                          {isNegative && <TrendingDown className="w-3 h-3 text-red-600" />}
                          {isPositive ? `+${rateDiff}% Artış` : isNegative ? `${rateDiff}% Düşüş` : '%0 Eşit'}
                        </span>
                      </div>

                      {/* Side by side percentage comparison bars */}
                      <div className="space-y-2.5 text-xs">
                        {/* Exam A Bar */}
                        <div>
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-slate-500 font-medium truncate max-w-[130px]">
                              {examA.title}
                            </span>
                            <span className="font-mono font-bold text-slate-700">
                              %{resA.successRate}{' '}
                              <span className="text-slate-400 font-normal">
                                ({resA.correct}/{resA.totalQuestions} D)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-slate-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${resA.successRate}%` }}
                            />
                          </div>
                        </div>

                        {/* Exam B Bar */}
                        <div>
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-slate-900 font-bold truncate max-w-[130px]">
                              {examB.title}
                            </span>
                            <span className="font-mono font-extrabold text-blue-600">
                              %{resB.successRate}{' '}
                              <span className="text-slate-500 font-semibold">
                                ({resB.correct}/{resB.totalQuestions} D)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                isPositive
                                  ? 'bg-emerald-500'
                                  : isNegative
                                  ? 'bg-amber-500'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${resB.successRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Net Difference & Counts */}
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">
                          Net:{' '}
                          <span className="font-bold text-slate-800">
                            {resA.net} ➔ {resB.net}
                          </span>
                        </span>

                        <span
                          className={`font-bold ${
                            netDiff > 0
                              ? 'text-emerald-700'
                              : netDiff < 0
                              ? 'text-red-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {netDiff > 0 ? `+${netDiff}` : netDiff} Net
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2: TABLE - DETAYLI KARŞILAŞTIRMA TABLOSU */}
            {compareMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Ders</th>
                      <th className="py-2.5 px-3 text-center">
                        <span className="block">{examA.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{examA.date}</span>
                      </th>
                      <th className="py-2.5 px-3 text-center">
                        <span className="block">{examB.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{examB.date}</span>
                      </th>
                      <th className="py-2.5 px-3 text-center">Net Değişimi</th>
                      <th className="py-2.5 px-3 text-center">Doğru / Toplam % Değişimi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ACADEMIC_SUBJECTS.map((subjId) => {
                      const cfg = SUBJECT_CONFIGS[subjId];
                      const resA = examA.results[subjId];
                      const resB = examB.results[subjId];
                      if (!resA || !resB) return null;

                      const netDiff = Number((resB.net - resA.net).toFixed(2));
                      const rateDiff = Number((resB.successRate - resA.successRate).toFixed(1));

                      return (
                        <tr key={subjId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${cfg.themeColor.accent}`} />
                            <span>{cfg.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono">
                            <span className="text-emerald-700 font-bold">{resA.correct} D</span>{' '}
                            <span className="text-red-600">{resA.wrong} Y</span>{' '}
                            <span className="text-slate-400">({resA.empty} B)</span>{' '}
                            <span className="ml-1 font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                              {resA.net} Net (%{resA.successRate})
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono">
                            <span className="text-emerald-700 font-bold">{resB.correct} D</span>{' '}
                            <span className="text-red-600">{resB.wrong} Y</span>{' '}
                            <span className="text-slate-400">({resB.empty} B)</span>{' '}
                            <span className="ml-1 font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                              {resB.net} Net (%{resB.successRate})
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            {netDiff > 0 ? (
                              <span className="text-emerald-600 inline-flex items-center gap-0.5">
                                <TrendingUp className="w-3.5 h-3.5" />+{netDiff} Net
                              </span>
                            ) : netDiff < 0 ? (
                              <span className="text-red-500 inline-flex items-center gap-0.5">
                                <TrendingDown className="w-3.5 h-3.5" />
                                {netDiff} Net
                              </span>
                            ) : (
                              <span className="text-slate-400">0.00 Net</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            {rateDiff > 0 ? (
                              <span className="text-emerald-600">%{resA.successRate} ➔ %{resB.successRate} (+%{rateDiff})</span>
                            ) : rateDiff < 0 ? (
                              <span className="text-red-500">%{resA.successRate} ➔ %{resB.successRate} (%{rateDiff})</span>
                            ) : (
                              <span className="text-slate-500">%{resA.successRate} (Aynı)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Summary Row */}
                    <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td className="py-3 px-3">TOPLAM & PUAN</td>
                      <td className="py-3 px-3 text-center font-mono">
                        {examA.totalNet} Net | %{examA.overallSuccessRate} ({examA.calculatedScore} P)
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {examB.totalNet} Net | %{examB.overallSuccessRate} ({examB.calculatedScore} P)
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {examB.totalNet - examA.totalNet > 0 ? (
                          <span className="text-emerald-700 font-extrabold text-sm">
                            +{(examB.totalNet - examA.totalNet).toFixed(2)} Net Artış 🚀
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {(examB.totalNet - examA.totalNet).toFixed(2)} Net
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-sm text-blue-700">
                        %{(examB.overallSuccessRate - examA.overallSuccessRate).toFixed(1)} Başarı Farkı
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 3: TRENDS - TÜM SINAVLAR BOYUNCA DERS GELİŞİMİ */}
            {compareMode === 'trends' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACADEMIC_SUBJECTS.map((subjId) => {
                    const cfg = SUBJECT_CONFIGS[subjId];
                    const examRates = exams.map((ex) => ({
                      title: ex.title,
                      date: ex.date,
                      rate: ex.results[subjId]?.successRate || 0,
                      net: ex.results[subjId]?.net || 0,
                    }));

                    const maxRate = Math.max(...examRates.map((r) => r.rate));
                    const latestRate = examRates[examRates.length - 1]?.rate || 0;
                    const avgRate = Math.round(
                      examRates.reduce((acc, r) => acc + r.rate, 0) / (examRates.length || 1)
                    );

                    return (
                      <div
                        key={subjId}
                        className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${cfg.themeColor.accent}`} />
                            <span className="font-bold text-xs text-slate-900">{cfg.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-slate-500">Ort: %{avgRate}</span>
                            <span className="text-emerald-700 font-bold">En Yüksek: %{maxRate}</span>
                          </div>
                        </div>

                        {/* Timeline step badges */}
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {examRates.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 min-w-[70px] p-2 rounded-lg border text-center transition-all ${
                                idx === examRates.length - 1
                                  ? 'bg-blue-50 border-blue-300 font-bold'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                #{idx + 1}
                              </div>
                              <div className="text-xs font-mono font-extrabold text-blue-600">
                                %{item.rate}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {item.net} Net
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      {/* ALL EXAMS LIST & EXPANDABLE REPORT CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Kayıtlı Tüm Deneme Sınavı Raporları ({exams.length})
          </h3>
          <span className="text-xs text-slate-500">
            Karta tıklayarak ders bazlı detay karnesini açıp kapatabilirsiniz
          </span>
        </div>

        <div className="space-y-3">
          {exams.map((exam, idx) => {
            const isExpanded = expandedExamId === exam.id;

            return (
              <div
                key={exam.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all hover:border-slate-300"
              >
                {/* Exam Card Header */}
                <div
                  onClick={() => setExpandedExamId(isExpanded ? null : exam.id)}
                  className="cursor-pointer p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm border border-blue-200">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{exam.title}</h4>
                        {exam.publisher && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {exam.publisher}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {exam.date}
                        </span>
                        {exam.notes && (
                          <span className="italic text-slate-400 truncate max-w-xs">
                            &ldquo;{exam.notes}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Score Badges */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Correct / Total Rate */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Doğru / Toplam
                      </span>
                      <span className="font-mono font-bold text-sm text-blue-600">
                        %{exam.overallSuccessRate}
                      </span>
                    </div>

                    {/* Net Badge */}
                    <div className="text-right pl-3 border-l border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Toplam Net
                      </span>
                      <span className="font-mono font-extrabold text-sm text-emerald-600">
                        {exam.totalNet} Net
                      </span>
                    </div>

                    {/* Score */}
                    {exam.calculatedScore && (
                      <div className="text-right pl-3 border-l border-slate-200 hidden md:block">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                          Tahmini Puan
                        </span>
                        <span className="font-mono font-bold text-sm text-purple-700">
                          {exam.calculatedScore}
                        </span>
                      </div>
                    )}

                    <div className="text-slate-400 pl-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {ACADEMIC_SUBJECTS.map((subjId) => {
                        const cfg = SUBJECT_CONFIGS[subjId];
                        const subjRes = exam.results[subjId];
                        if (!subjRes) return null;

                        return (
                          <div
                            key={subjId}
                            className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                              <span className="font-bold text-xs text-slate-800">{cfg.shortName}</span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {subjRes.totalQuestions} Soru
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-emerald-700 font-bold">{subjRes.correct} D</span>
                              <span className="text-red-600 font-semibold">{subjRes.wrong} Y</span>
                              <span className="text-slate-400">{subjRes.empty} B</span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                              <span className="font-mono font-extrabold text-slate-900">
                                {subjRes.net} Net
                              </span>
                              <span className="font-mono font-bold text-blue-600 text-[11px]">
                                %{subjRes.successRate}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-500">
                        Toplam: <strong>{exam.totalCorrect} Doğru</strong>,{' '}
                        <strong>{exam.totalWrong} Yanlış</strong>,{' '}
                        <strong>{exam.totalEmpty} Boş</strong>
                      </span>

                      <button
                        onClick={() => {
                          if (confirm(`"${exam.title}" sınav sonucunu silmek istediğinize emin misiniz?`)) {
                            onDeleteExam(exam.id);
                          }
                        }}
                        className="cursor-pointer text-red-500 hover:text-red-700 inline-flex items-center gap-1 font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Sınavı Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW EXAM RESULT ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-2.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Yeni Deneme Sınavı Sonucu Girişi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Form with Fixed Bottom Action Bar */}
            <form onSubmit={handleSaveExam} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 text-xs sm:text-sm">
                {/* Meta Info: Title, Publisher, Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Deneme Sınavı Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="Örn: Özdebir LGS Deneme 2"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Yayın / Kurum
                    </label>
                    <input
                      type="text"
                      value={examPublisher}
                      onChange={(e) => setExamPublisher(e.target.value)}
                      placeholder="Örn: TÖDER, Özdebir, Hız"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Sınav Tarihi</label>
                    <input
                      type="date"
                      required
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Subject Results Inputs Table - Horizontally scrollable and ultra-compact on mobile */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-800">
                      Ders Bazında Doğru, Yanlış ve Boş Sayıları
                    </label>
                    <span className="text-[10px] text-slate-400">MEB Standart</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto bg-slate-50/50 shadow-2xs">
                    <table className="w-full text-xs text-left min-w-[340px]">
                      <thead className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2 px-2.5">Ders</th>
                          <th className="py-2 px-1 text-center">Soru</th>
                          <th className="py-2 px-1 text-center text-emerald-700">Doğru</th>
                          <th className="py-2 px-1 text-center text-red-600">Yanlış</th>
                          <th className="py-2 px-1 text-center text-slate-500">Boş</th>
                          <th className="py-2 px-1.5 text-center">Net</th>
                          <th className="py-2 px-2 text-center text-blue-700">Başarı %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/80 bg-white">
                        {ACADEMIC_SUBJECTS.map((subjId) => {
                          const cfg = SUBJECT_CONFIGS[subjId];
                          const input = subjectInputs[subjId];
                          const net = Math.max(0, Number((input.correct - input.wrong / 3).toFixed(2)));
                          const rate =
                            input.totalQuestions > 0
                              ? Math.round((input.correct / input.totalQuestions) * 100)
                              : 0;

                          return (
                            <tr key={subjId} className="hover:bg-slate-50">
                              <td className="py-1.5 px-2.5 font-semibold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.themeColor.accent}`} />
                                <span className="hidden sm:inline">{cfg.name}</span>
                                <span className="sm:hidden text-xs">{cfg.shortName}</span>
                              </td>
                              <td className="py-1 px-1 text-center font-mono text-slate-500 text-[11px]">
                                {input.totalQuestions}
                              </td>
                              <td className="py-1 px-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={input.totalQuestions}
                                  value={input.correct}
                                  onChange={(e) =>
                                    handleInputChange(subjId, 'correct', Number(e.target.value))
                                  }
                                  className="w-11 sm:w-14 h-7 sm:h-8 px-1 text-center font-bold text-emerald-700 border border-slate-200 rounded-md bg-emerald-50/40 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                                />
                              </td>
                              <td className="py-1 px-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={input.totalQuestions}
                                  value={input.wrong}
                                  onChange={(e) =>
                                    handleInputChange(subjId, 'wrong', Number(e.target.value))
                                  }
                                  className="w-11 sm:w-14 h-7 sm:h-8 px-1 text-center font-bold text-red-600 border border-slate-200 rounded-md bg-red-50/40 focus:outline-none focus:ring-1 focus:ring-red-500 text-xs font-mono"
                                />
                              </td>
                              <td className="py-1 px-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={input.totalQuestions}
                                  value={input.empty}
                                  onChange={(e) =>
                                    handleInputChange(subjId, 'empty', Number(e.target.value))
                                  }
                                  className="w-11 sm:w-14 h-7 sm:h-8 px-1 text-center font-bold text-slate-600 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-mono"
                                />
                              </td>
                              <td className="py-1 px-1.5 text-center font-mono font-bold text-slate-900 text-xs">
                                {net}
                              </td>
                              <td className="py-1 px-2 text-center font-mono font-bold text-blue-600 text-[11px]">
                                %{rate}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live Preview Summary Bar - Fully responsive cards */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">
                      Hesaplanan Başarı:
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">{previewTotals.totalCorrect} Doğru</span>
                      <span className="text-red-400 font-bold">{previewTotals.totalWrong} Yanlış</span>
                      <span className="text-slate-300">{previewTotals.totalEmpty} Boş</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-800 text-center">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">
                        Toplam Net
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
                        {previewTotals.totalNet}
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">
                        Doğru / Toplam
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-blue-400 font-mono">
                        %{previewTotals.overallSuccessRate}
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">
                        Tahmini Puan
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-mono">
                        {previewTotals.calculatedScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Sınav Notu & Öğrenci Değerlendirmesi
                  </label>
                  <textarea
                    rows={2}
                    value={examNotes}
                    onChange={(e) => setExamNotes(e.target.value)}
                    placeholder="Örn: Matematikte yeni nesil sorular yetiştirildi. Fen Bilimlerinde basınç sorularında dikkat hatası yapıldı."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Fixed Modal Action Footer */}
              <div className="px-4 py-2 sm:px-6 sm:py-3 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs"
                >
                  Sonuçları Kaydet ve Karşılaştır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
