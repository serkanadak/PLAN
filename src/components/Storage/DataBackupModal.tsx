import React, { useRef, useState } from 'react';
import { CalendarTask, MockExam } from '../../types';
import { exportBackupJSON, parseBackupJSON } from '../../utils/storage';
import { usePWAInstall } from '../../utils/usePWAInstall';
import type { User } from 'firebase/auth';
import {
  Database,
  Download,
  Upload,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  FileJson,
  ShieldCheck,
  HardDrive,
  Info,
  Share,
  ArrowRight,
  Sparkles,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  RefreshCw,
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: CalendarTask[];
  mockExams: MockExam[];
  onRestoreData: (restoredTasks: CalendarTask[], restoredExams: MockExam[]) => void;
  onResetToDefaults: () => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
  onGuestSignIn?: () => Promise<void>;
  onEmailSignIn?: (email: string, pass: string) => Promise<void>;
  onEmailRegister?: (name: string, email: string, pass: string) => Promise<void>;
  onSignOut?: () => Promise<void>;
  onUploadLocalToCloud?: () => Promise<void>;
  authError?: string | null;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  mockExams,
  onRestoreData,
  onResetToDefaults,
  user,
  onSignIn,
  onGuestSignIn,
  onEmailSignIn,
  onEmailRegister,
  onSignOut,
  onUploadLocalToCloud,
  authError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'cloud' | 'backup' | 'pwa_guide'>('cloud');

  // Email Auth Form State
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      exportBackupJSON(tasks, mockExams);
      setSuccessMessage('Yedek dosyanız (JSON) başarıyla indirildi!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage('Yedek dosyası oluşturulurken bir hata oluştu.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleCloudUpload = async () => {
    if (!onUploadLocalToCloud) return;
    try {
      setIsUploading(true);
      await onUploadLocalToCloud();
      setSuccessMessage('Tüm yerel verileriniz Firebase bulutuna başarıyla aktarıldı!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setErrorMessage('Buluta aktarım sırasında bir hata oluştu.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const { tasks: restoredTasks, mockExams: restoredExams } = parseBackupJSON(content);

        if (restoredTasks.length === 0 && restoredExams.length === 0) {
          throw new Error('Yedek dosyasında veri bulunamadı.');
        }

        onRestoreData(restoredTasks, restoredExams);
        setSuccessMessage(
          `Yedek başarıyla yüklendi: ${restoredTasks.length} görev ve ${restoredExams.length} deneme sınavı aktarıldı!`
        );
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setErrorMessage(
          'Yedek dosyası okunamadı veya biçimi hatalı. Lütfen geçerli bir MaarifPlan JSON yedeği seçin.'
        );
        setTimeout(() => setErrorMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    onResetToDefaults();
    setSuccessMessage('Tüm örnek görev ve hedef planlamaları kaldırıldı. Temiz bir başlangıç hazırlandı.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10 shadow-xs">
              <Database className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Kişisel Veri Yönetimi &amp; Bulut Senkronizasyonu
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Kalıcı Depolama
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Firebase bulut veritabanı, çevrimdışı yerel hafıza ve JSON dosya yedekleme
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 shrink-0 px-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>Firebase Bulut (Canlı Senkron)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Dosya Yedeği (JSON &amp; Yerel)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pwa_guide')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pwa_guide'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>Ana Ekrana Ekleme (PWA)</span>
          </button>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              {/* Cloud Hero Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 border border-white/10 flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Firebase Cloud Firestore Bulut Senkronizasyonu
                      </h4>
                      <p className="text-[11px] text-blue-200/80">
                        Google altyapısıyla her cihazdan anlık senkronizasyon ve sıfır veri kaybı
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                    {user ? 'Aktif' : 'Beklemede'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Tüm Cihazlarda Canlı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Güvenli Google Girişi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Çevrimdışı Ön Bellek</span>
                  </div>
                </div>
              </div>

              {/* User Account State Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'Kullanıcı'}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-xs object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {user.displayName?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xs text-slate-900">
                              {user.displayName || 'Google Kullanıcısı'}
                            </h5>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                              Bağlı
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {onSignOut && (
                        <button
                          type="button"
                          onClick={onSignOut}
                          className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5 text-slate-500" />
                          <span>Çıkış Yap</span>
                        </button>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CloudCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Bulut bağlantısı aktif. Yaptığınız tüm değişiklikler anında kaydedilmektedir.</span>
                      </div>
                    </div>

                    {/* Migration/Upload button if user wants to push local items */}
                    {onUploadLocalToCloud && (
                      <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-slate-600">
                          Cihazınızdaki {tasks.length} görevi ve {mockExams.length} denemeyi buluta aktarın:
                        </span>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={handleCloudUpload}
                          className="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                          <span>{isUploading ? 'Aktarılıyor...' : 'Yerel Verileri Buluta Aktar'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-2 space-y-4">
                    {/* Error Banner if auth failed */}
                    {authError && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 text-left">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold">Giriş Bildirimi:</p>
                          <p className="text-[11px] leading-relaxed">{authError}</p>
                          <p className="text-[11px] font-semibold text-blue-700">
                            💡 İpucu: Aşağıdaki <strong>&ldquo;Hızlı Bulut Girişi&rdquo;</strong> veya <strong>&ldquo;E-posta ile Giriş&rdquo;</strong> seçeneğiyle hiçbir tarayıcı kısıtlamasına takılmadan hemen bağlanabilirsiniz.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="text-center space-y-1.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                        <Cloud className="w-6 h-6 text-blue-600" />
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        Bulut Senkronizasyon Yöntemini Seçin
                      </h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Hesabınızı bağlayarak görevlerinizi ve deneme sonuçlarınızı Google Cloud Firestore'da kalıcı hale getirin.
                      </p>
                    </div>

                    {/* Auth Option Buttons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mx-auto pt-1">
                      {/* Option A: Google Sign-In */}
                      {onSignIn && (
                        <button
                          type="button"
                          disabled={isAuthSubmitting}
                          onClick={async () => {
                            setIsAuthSubmitting(true);
                            try {
                              await onSignIn();
                            } finally {
                              setIsAuthSubmitting(false);
                            }
                          }}
                          className="cursor-pointer p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Google ile Giriş Yap</span>
                        </button>
                      )}

                      {/* Option B: Fast Guest Cloud Sign-In */}
                      {onGuestSignIn && (
                        <button
                          type="button"
                          disabled={isAuthSubmitting}
                          onClick={async () => {
                            setIsAuthSubmitting(true);
                            try {
                              await onGuestSignIn();
                              setSuccessMessage('Hızlı Bulut Hesabı ile bağlanıldı! Verileriniz Firestore ile senkronize.');
                              setTimeout(() => setSuccessMessage(null), 4000);
                            } finally {
                              setIsAuthSubmitting(false);
                            }
                          }}
                          className="cursor-pointer p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                        >
                          <CloudCheck className="w-4 h-4 text-emerald-300" />
                          <span>⚡ Hızlı Bulut Girişi</span>
                        </button>
                      )}
                    </div>

                    {/* Option C: Email/Password Collapsible Form */}
                    <div className="max-w-md mx-auto pt-2">
                      <button
                        type="button"
                        onClick={() => setShowEmailForm(!showEmailForm)}
                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 underline block mx-auto transition-colors"
                      >
                        {showEmailForm ? '▲ E-posta Formunu Kapat' : '▼ E-posta ve Şifre ile Giriş Yap / Kayıt Ol'}
                      </button>

                      {showEmailForm && (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setIsAuthSubmitting(true);
                            try {
                              if (emailMode === 'login' && onEmailSignIn) {
                                await onEmailSignIn(emailInput, passwordInput);
                                setSuccessMessage('Giriş başarılı! Bulut senkronizasyonu aktif.');
                              } else if (emailMode === 'register' && onEmailRegister) {
                                await onEmailRegister(nameInput, emailInput, passwordInput);
                                setSuccessMessage('Hesabınız oluşturuldu! Bulut senkronizasyonu aktif.');
                              }
                              setTimeout(() => setSuccessMessage(null), 4000);
                            } catch (err: any) {
                              setErrorMessage(err.message || 'İşlem başarısız oldu.');
                              setTimeout(() => setErrorMessage(null), 5000);
                            } finally {
                              setIsAuthSubmitting(false);
                            }
                          }}
                          className="mt-3 p-3.5 rounded-xl border border-slate-200 bg-white text-left space-y-2.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-800">
                              {emailMode === 'login' ? 'E-posta ile Giriş' : 'Yeni Bulut Hesabı Oluştur'}
                            </span>
                            <div className="flex gap-1 text-[11px]">
                              <button
                                type="button"
                                onClick={() => setEmailMode('login')}
                                className={`cursor-pointer px-2 py-0.5 rounded font-semibold ${
                                  emailMode === 'login' ? 'bg-blue-100 text-blue-800' : 'text-slate-500'
                                }`}
                              >
                                Giriş
                              </button>
                              <button
                                type="button"
                                onClick={() => setEmailMode('register')}
                                className={`cursor-pointer px-2 py-0.5 rounded font-semibold ${
                                  emailMode === 'register' ? 'bg-blue-100 text-blue-800' : 'text-slate-500'
                                }`}
                              >
                                Kayıt
                              </button>
                            </div>
                          </div>

                          {emailMode === 'register' && (
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                                Adınız &amp; Soyadınız
                              </label>
                              <input
                                type="text"
                                required
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Örn: Ahmet Yılmaz"
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                              E-posta Adresi
                            </label>
                            <input
                              type="email"
                              required
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              placeholder="ogrenci@ornek.com"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                              Şifre (En az 6 karakter)
                            </label>
                            <input
                              type="password"
                              required
                              minLength={6}
                              value={passwordInput}
                              onChange={(e) => setPasswordInput(e.target.value)}
                              placeholder="••••••"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isAuthSubmitting}
                            className="cursor-pointer w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold shadow-2xs transition-all"
                          >
                            {isAuthSubmitting
                              ? 'Lütfen bekleyin...'
                              : emailMode === 'login'
                              ? 'Giriş Yap ve Senkronize Et'
                              : 'Kayıt Ol ve Bulutu Başlat'}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              {/* How it works info card */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Kişisel Verileriniz Nasıl Korunuyor?</span>
                </div>
                <p className="text-xs text-blue-800/90 leading-relaxed">
                  HTML dosyasını elle kaydetmenize gerek yoktur. MaarifPlan, tarayıcınızın yerleşik <strong>Yerel Depolama (LocalStorage)</strong> motorunu kullanır. Planladığınız her görev, çözülen soru sayıları ve deneme sonuçları anında cihazınızın hafızasına kaydedilir. Sayfayı yenilediğinizde veya tarayıcıyı kapattığınızda verileriniz <strong>asla silinmez</strong>.
                </p>
                <p className="text-xs text-blue-800/90 leading-relaxed">
                  Ayrıca cihaz değiştirme veya veri güvenliği için <strong>JSON formatında dosya yedeği</strong> indirebilir ve istediğiniz zaman tek tıkla geri yükleyebilirsiniz.
                </p>
              </div>

              {/* Current Data Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block">Kayıtlı Görev</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    {tasks.length}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block">Kayıtlı Deneme</span>
                  <span className="text-xl font-black font-mono text-amber-600">
                    {mockExams.length}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 font-semibold block">Depolama Durumu</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aktif &amp; Senkron
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. Export JSON */}
                <button
                  type="button"
                  onClick={handleExport}
                  className="cursor-pointer p-4 rounded-xl border-2 border-blue-500 bg-blue-50/40 hover:bg-blue-100/50 text-left transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs group-hover:scale-105 transition-transform">
                      <Download className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      .JSON
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Yedek İndir (JSON Dosyası)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tüm görev, takvim ve deneme sınavı verilerini güvenli bir dosya olarak bilgisayarınıza veya telefonunuza indirin.
                    </p>
                  </div>
                </button>

                {/* 2. Import JSON */}
                <div className="p-4 rounded-xl border-2 border-indigo-400 bg-indigo-50/40 hover:bg-indigo-100/50 text-left transition-all group flex flex-col justify-between space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="backup-file-input"
                  />
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-indigo-600 text-white shadow-2xs group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                      Geri Yükle
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Yedekten Geri Yükle
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 mb-2">
                      Daha önce indirdiğiniz bir `.json` yedek dosyasını seçerek tüm verilerinizi hemen geri getirin.
                    </p>
                    <label
                      htmlFor="backup-file-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      <span>Dosya Seç ve Geri Yükle</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reset to clean slate */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tüm örnek görev ve hedef planlamalarını sıfırlamak isterseniz:</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tüm Görev ve Hedefleri Sıfırla (Temiz Sayfa)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pwa_guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/70 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Uygulama Platformuna veya Web Sitesine İhtiyaç Var mı?</span>
                </div>
                <p className="text-xs text-purple-900/90 leading-relaxed">
                  <strong>Hayır!</strong> Bu uygulama modern bir <strong>Progressive Web App (PWA)</strong> standardında kodlanmıştır. App Store veya Play Store üzerinden bir şey indirmenize, hesap açmanıza veya her seferinde tarayıcıya girip web adresi yazmanıza gerek yoktur.
                </p>
                <p className="text-xs text-purple-900/90 leading-relaxed">
                  Cihazınıza &ldquo;Ana Ekrana Ekle&rdquo; dediğinizde telefonunuzun ana ekranında tıpkı WhatsApp veya Spotify gibi bağımsız bir uygulama simgesi oluşur. Tıkladığınızda tarayıcı çubukları olmadan tam ekran çalışır ve çevrimdışı (internetsiz) bile açılır.
                </p>
              </div>

              {/* Install Trigger Button if installable */}
              {isInstallable && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <h4 className="text-sm font-bold">Tek Tıkla Yükleme Hazır</h4>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Cihazınız bu uygulamayı doğrudan yüklemeyi destekliyor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={install}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-xs transition-transform active:scale-95 shrink-0 flex items-center gap-1.5"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Uygulamayı Cihaza Yükle</span>
                  </button>
                </div>
              )}

              {/* iOS and Android Step-by-Step guides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* iPhone / iPad (Safari) */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-xs">
                      🍎
                    </span>
                    <span>iPhone &amp; iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Safari tarayıcısının altındaki <strong>Paylaş (Share <Share className="w-3 h-3 inline text-blue-600" />)</strong> butonuna dokunun.</li>
                    <li>Açılan menüde aşağı kaydırıp <strong>&ldquo;Ana Ekrana Ekle&rdquo;</strong> seçeneğini seçin.</li>
                    <li>Sağ üstteki <strong>&ldquo;Ekle&rdquo;</strong> tuşuna basın. MaarifPlan artık ana ekranınızda bağımsız bir uygulamadır.</li>
                  </ol>
                </div>

                {/* Android / Chrome */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                      🤖
                    </span>
                    <span>Android &amp; Chrome</span>
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Chrome tarayıcısının sağ üstündeki <strong>üç nokta (⋮)</strong> menüsüne dokunun.</li>
                    <li><strong>&ldquo;Uygulamayı Yükle&rdquo;</strong> veya <strong>&ldquo;Ana Ekrana Ekle&rdquo;</strong> seçeneğine tıklayın.</li>
                    <li>Onayladığınızda telefonunuzun uygulamalar listesine ve ana ekranına eklenir.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-mono text-[11px]">
            MaarifPlan &bull; v1.0.0 &bull; Güvenli Çevrimdışı Depolama
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
