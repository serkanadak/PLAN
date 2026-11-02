import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import {
  NotificationSettings,
  requestNotificationPermission,
  sendTestNotification,
  playNotificationChime,
} from '../../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });
  const [testSent, setTestSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'chrome' | 'ios-safari' | 'mac-safari'>('chrome');

  if (!isOpen) return null;

  const sharedUrl = 'https://ais-pre-pukodt5xio3qkhhgnl6k7x-656086352213.europe-west1.run.app';
  const devUrl = 'https://ais-dev-pukodt5xio3qkhhgnl6k7x-656086352213.europe-west1.run.app';

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      onUpdateSettings({ ...settings, enabled: true });
      playNotificationChime();
    }
  };

  const handleToggleEnabled = async () => {
    if (!settings.enabled && permission !== 'granted') {
      await handleRequestPermission();
    } else {
      onUpdateSettings({ ...settings, enabled: !settings.enabled });
    }
  };

  const handleTestNotification = async () => {
    setTestSent(true);
    await sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Ders Çalışma Bildirimleri</h3>
              <p className="text-blue-100 text-xs">Yaklaşan görevler için akıllı tarayıcı hatırlatıcıları</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700 text-xs">
          {/* Permission Status Banner */}
          <div className="rounded-xl p-3.5 border bg-slate-50 flex items-start gap-3">
            {permission === 'granted' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : permission === 'denied' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Tarayıcı Bildirim İzni</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    permission === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : permission === 'denied'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {permission === 'granted'
                    ? 'İzin Verildi'
                    : permission === 'denied'
                    ? 'Engellendi'
                    : 'İzin Bekleniyor'}
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                {permission === 'granted'
                  ? 'Harika! Tarayıcınız ders saati yaklaştığında masaüstünüzde veya kilit ekranınızda anlık uyarı gönderebilir.'
                  : permission === 'denied'
                  ? 'Chrome tarayıcınızda bildirimler engellenmiş. Adres çubuğundaki kilit simgesine (🔒) tıklayıp Bildirimlere "İzin Ver" demelisiniz.'
                  : 'Ders saatlerini kaçırmamak için tarayıcınızdan bildirim izni vermeniz önerilir.'}
              </p>
              {permission !== 'granted' && permission !== 'denied' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="cursor-pointer mt-2.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bildirim İzni Ver</span>
                </button>
              )}
            </div>
          </div>

          {/* Toggle & Options */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            {/* Main Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Ders Hatırlatıcılarını Aç</p>
                <p className="text-slate-500 text-xs">Planlanan ders çalışma saati gelmeden önce uyarı al</p>
              </div>
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`cursor-pointer w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sub-options (only if enabled or granted) */}
            <div className={`space-y-3 pt-3 border-t border-slate-100 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Lead Time Selection */}
              <div>
                <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ne zaman hatırlatılsın?</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: 0, label: 'Saatinde' },
                    { value: 10, label: '10 dk önce' },
                    { value: 15, label: '15 dk önce' },
                    { value: 30, label: '30 dk önce' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, leadTimeMinutes: opt.value })}
                      className={`cursor-pointer py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                        settings.leadTimeMinutes === opt.value
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-700">Sesli Uyarı (Melodi)</span>
                    <p className="text-[11px] text-slate-500">Bildirim geldiğinde hoş bir çalışma melodisi çalar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    onUpdateSettings({ ...settings, soundEnabled: next });
                    if (next) playNotificationChime();
                  }}
                  className={`cursor-pointer w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Test Notification Button */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
            <div>
              <p className="font-bold text-blue-900">Bildirimi Şimdi Test Edin</p>
              <p className="text-blue-700 text-[11px]">Chrome tarayıcınızda bildirim penceresinin nasıl göründüğünü deneyin.</p>
            </div>
            <button
              type="button"
              onClick={handleTestNotification}
              className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
            >
              {testSent ? <Check className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
              <span>{testSent ? 'Gönderildi!' : 'Test Et'}</span>
            </button>
          </div>

          {/* Step-by-Step Browser Permission Guide (Chrome & Safari) */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Chrome ve Safari&apos;de Bildirim İznini Açma Rehberi
              </span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-semibold">
                Çözüm Yolları
              </span>
            </div>

            {/* Guide Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
              {[
                { id: 'chrome', label: '🌐 Chrome' },
                { id: 'ios-safari', label: '📱 iPhone (Safari)' },
                { id: 'mac-safari', label: '💻 Mac (Safari)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveGuideTab(tab.id as 'chrome' | 'ios-safari' | 'mac-safari')}
                  className={`cursor-pointer py-1 px-1.5 rounded-md text-[11px] font-bold transition-all text-center truncate ${
                    activeGuideTab === tab.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Google Chrome */}
            {activeGuideTab === 'chrome' && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700 animate-in fade-in duration-150">
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <span>Google Chrome&apos;da Bildirim İzni Verme:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-0.5 text-slate-600">
                  <li>
                    Tarayıcının üst kısmında web adresinin (URL) hemen solundaki{' '}
                    <strong className="text-slate-900">ayar / kilit simgesine (🎛️ veya 🔒)</strong> tıklayın.
                  </li>
                  <li>
                    Açılan küçük pencerede <strong className="text-slate-900">&quot;Site ayarları&quot;</strong> veya{' '}
                    <strong className="text-slate-900">&quot;Bildirimler&quot;</strong> satırını bulun.
                  </li>
                  <li>
                    Seçeneği <strong className="text-emerald-700 font-bold">&quot;İzin Ver&quot; (Allow)</strong> olarak değiştirin.
                  </li>
                  <li>
                    Sayfayı bir kez yenileyin (F5 veya Yenile düğmesi). Artık ders vaktiniz geldiğinde anlık masaüstü uyarısı alacaksınız!
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 2: iPhone & iPad Safari */}
            {activeGuideTab === 'ios-safari' && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700 animate-in fade-in duration-150">
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 font-medium text-[11px] leading-snug">
                  ⚠️ <strong>Apple Güvenlik Kuralı:</strong> iPhone ve iPad&apos;lerde Safari sekmesinde web bildirimlerine izin verilemez. Apple, bildirimin çalışabilmesi için web uygulamasının Ana Ekrana eklenmesini şart koşar.
                </div>
                <p className="font-bold text-slate-900">iPhone / iPad&apos;de Bildirimi Açma Adımları (3 Kolay Adım):</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-0.5 text-slate-600">
                  <li>
                    Safari ekranının altındaki <strong className="text-slate-900">Paylaş (⬆️ kare içinden yukarı ok çıkan simge)</strong> düğmesine dokunun.
                  </li>
                  <li>
                    Aşağı kaydırıp <strong className="text-slate-900">&quot;Ana Ekrana Ekle&quot; (Add to Home Screen)</strong> seçeneğine tıklayın ve sağ üstteki <strong>&quot;Ekle&quot;</strong> butonuna basın.
                  </li>
                  <li>
                    Telefonunuzun ana ekranında beliren <strong className="text-blue-700 font-bold">MaarifPlan</strong> uygulama simgesine dokunarak açın.
                  </li>
                  <li>
                    Uygulama açılınca bu bildirim penceresindeki <strong className="text-slate-900">&quot;Bildirim İzni Ver&quot;</strong> butonuna dokunun. Karşınıza Apple&apos;ın onay penceresi çıkacaktır; <strong className="text-emerald-700 font-bold">&quot;İzin Ver&quot;</strong> deyin!
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 3: Mac Safari */}
            {activeGuideTab === 'mac-safari' && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700 animate-in fade-in duration-150">
                <p className="font-bold text-slate-900">Mac Bilgisayarda Safari Bildirimlerini Açma:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-0.5 text-slate-600">
                  <li>
                    Ekranın sol üst köşesindeki <strong className="text-slate-900">Safari</strong> menüsüne tıklayın ve{' '}
                    <strong className="text-slate-900">&quot;Ayarlar...&quot; (Settings)</strong> seçin.
                  </li>
                  <li>
                    Üst menüdeki <strong className="text-slate-900">&quot;Web Siteleri&quot; (Websites)</strong> sekmesine tıklayın.
                  </li>
                  <li>
                    Sol sütundaki menüden <strong className="text-slate-900">&quot;Bildirimler&quot; (Notifications)</strong> seçeneğini seçin.
                  </li>
                  <li>
                    Sağ listede MaarifPlan web sitesini bulun ve yanındaki açılır menüden{' '}
                    <strong className="text-emerald-700 font-bold">&quot;İzin Ver&quot; (Allow)</strong> seçeneğini işaretleyin.
                  </li>
                </ol>
              </div>
            )}

            {/* In-app sound note */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px]">
              <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Dahili Sesli Uyarı Garantisi:</strong> Tarayıcı izinlerini açmasanız bile, bu sekme arka planda açık kaldığında çalışma saatlerinizde hoş bir ses melodisi (chime) çalarak sizi uyaracaktır.
              </span>
            </div>
          </div>

          {/* Direct Links & Home Screen Installation Section */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Doğrudan Link &amp; Ana Ekrana Ekleme</h4>
            </div>
            <p className="text-slate-600 text-xs">
              Uygulamayı Chrome&apos;da tam ekran veya telefon/bilgisayar ana ekranına uygulama olarak eklemek için aşağıdaki linkleri kullanabilirsiniz:
            </p>

            {/* Link 1: Shared App URL */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Paylaşım Linki (Önerilen)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                  Canlı Yayın
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={sharedUrl}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(sharedUrl, 'shared')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center gap-1"
                >
                  {copiedLink === 'shared' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'shared' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <a
                  href={sharedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Aç</span>
                </a>
              </div>
            </div>

            {/* Link 2: Dev App URL */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Geliştirici / Önizleme Linki</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                  Dev Studio
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={devUrl}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(devUrl, 'dev')}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center gap-1"
                >
                  {copiedLink === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'dev' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <a
                  href={devUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Aç</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
