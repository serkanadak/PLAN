import React, { useState } from 'react';
import { Grade, ViewTab } from '../types';
import type { User } from 'firebase/auth';
import {
  Calendar,
  BarChart3,
  BookOpen,
  Award,
  Sparkles,
  Timer,
  Database,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  User as UserIcon,
  Bell,
  BellRing,
} from 'lucide-react';
import { calculateCountdown } from '../utils/dateUtils';

interface HeaderProps {
  currentGrade: Grade;
  onGradeChange: (grade: Grade) => void;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenBackup?: () => void;
  onOpenNotifications?: () => void;
  notificationsEnabled?: boolean;
  user?: User | null;
  onSignIn?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onGradeChange,
  activeTab,
  onTabChange,
  onOpenBackup,
  onOpenNotifications,
  notificationsEnabled = false,
  user,
  onSignIn,
  onSignOut,
}) => {
  const countdown = calculateCountdown('2027-06-06T09:30:00');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top micro bar - ultra compact */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-6 py-0.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium text-[10px]">
            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
            Maarif Modeli
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-400">
            6, 7 ve 8. Sınıf Beceri Temelli Öğrenci Çalışma Takvimi & Analitik
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Pill */}
          {user ? (
            <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/30 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Bulut Senkron:</span>
              <span className="font-semibold text-emerald-200">Aktif</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800/60 px-2 py-0.2 rounded border border-slate-700 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="hidden sm:inline">Mod:</span>
              <span>Yerel / Çevrimdışı</span>
            </div>
          )}

          {/* LGS Countdown ticker */}
          <div className="flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded border border-amber-500/30 text-[11px]">
            <Timer className="w-3 h-3 text-amber-400" />
            <span className="font-semibold text-amber-200">LGS 2027:</span>
            <span className="font-mono text-white font-bold">{countdown.days}g {countdown.hours}s</span>
          </div>

        </div>
      </div>

      {/* Main navigation header - sleek compact bar */}
      <div className={`w-full mx-auto px-2 sm:px-4 ${activeTab === 'calendar' ? 'max-w-full' : 'max-w-7xl'}`}>
        <div className="flex items-center justify-between h-11 sm:h-12 gap-2 sm:gap-3">
          {/* Left: Brand Logo & Grade Pills */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">MaarifPlan</h1>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded hidden sm:inline">
                  Öğrenci
                </span>
              </div>
            </div>

            {/* Grade selection pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['6', '7', '8'] as Grade[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => onGradeChange(grade)}
                  className={`cursor-pointer px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                    currentGrade === grade
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {grade}. Sınıf
                </button>
              ))}
            </div>
          </div>

          {/* Center: View Tabs (Visible on lg screens) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('calendar')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Takvim
            </button>
            <button
              onClick={() => onTabChange('curriculum')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'curriculum'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Müfredat
            </button>
            <button
              onClick={() => onTabChange('deneme')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'deneme'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Deneme Sınavları
            </button>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Dashboard
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </button>
          </nav>

          {/* Right: ALWAYS VISIBLE Cloud & Auth Action (Both mobile & desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Alert Trigger */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className={`cursor-pointer relative p-1.5 sm:p-2 rounded-lg border transition-all ${
                  notificationsEnabled
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
                title={notificationsEnabled ? 'Ders Hatırlatıcıları: Açık' : 'Ders Hatırlatıcılarını Aç'}
              >
                {notificationsEnabled ? (
                  <BellRing className="w-4 h-4 text-amber-600" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-600" />
                )}
                {notificationsEnabled ? (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                ) : (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            )}

            {onOpenBackup && (
              <button
                type="button"
                onClick={onOpenBackup}
                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
                title="Bulut Senkronizasyonu, Giriş ve Veri Yedekleme"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-100" />
                <span className="inline">Bulut &amp; Giriş</span>
                {user ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-blue-700" title="Bulut Bağlı" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-300 ring-2 ring-blue-700" title="Giriş Yapılmadı" />
                )}
              </button>
            )}

            {/* User Profile dropdown menu (when signed in) */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="cursor-pointer flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold transition-all"
                  title="Hesap Menüsü"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Kullanıcı'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.displayName?.[0] || '✓'}
                    </div>
                  )}
                  <span className="text-slate-800 max-w-[70px] sm:max-w-[100px] truncate text-[11px] font-medium hidden sm:inline">
                    {user.displayName?.split(' ')[0] || (user.isAnonymous ? 'Misafir' : 'Bulut')}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="font-bold text-slate-800 truncate">
                        {user.displayName || (user.isAnonymous ? 'Misafir Kullanıcı (Bulut)' : 'Kullanıcı')}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Bulut Senkron Aktif
                      </p>
                    </div>
                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="cursor-pointer w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 font-medium transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Çıkış Yap</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Tabs Row - Ordered: Takvim, Müfredat, Deneme Sınavları, Dashboard */}
        <div className="flex lg:hidden overflow-x-auto py-1 border-t border-slate-100 gap-1.5 text-xs">
          <button
            onClick={() => onTabChange('calendar')}
            className={`cursor-pointer px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'calendar' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Takvim
          </button>
          <button
            onClick={() => onTabChange('curriculum')}
            className={`cursor-pointer px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'curriculum' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Müfredat
          </button>
          <button
            onClick={() => onTabChange('deneme')}
            className={`cursor-pointer px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'deneme' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Deneme Sınavları
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`cursor-pointer px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};
