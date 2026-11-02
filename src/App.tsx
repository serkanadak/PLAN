import React, { useState, useMemo, useEffect } from 'react';
import type { User } from 'firebase/auth';
import {
  CalendarTask,
  Grade,
  SubjectId,
  TaskType,
  TopicItem,
  ViewTab,
  MockExam,
} from './types';
import { INITIAL_TASKS } from './data/initialTasks';
import { INITIAL_MOCK_EXAMS } from './data/mockExamsData';
import { IMPORTANT_DATES, SUBJECT_CONFIGS } from './data/curriculumData';
import { Header } from './components/Header';
import { OutlookCalendar } from './components/Calendar/OutlookCalendar';
import { TaskModal } from './components/Calendar/TaskModal';
import { AnalyticsDashboard } from './components/Dashboard/AnalyticsDashboard';
import { MockExamsView } from './components/Exams/MockExamsView';
import { CurriculumExplorer } from './components/Curriculum/CurriculumExplorer';
import { DataBackupModal } from './components/Storage/DataBackupModal';
import { NotificationModal } from './components/Notifications/NotificationModal';
import { formatDateToISO, generateRecurringTasks } from './utils/dateUtils';
import {
  NotificationSettings,
  loadNotificationSettings,
  saveNotificationSettings,
  checkUpcomingTasksAndNotify,
} from './utils/notifications';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadExamsFromStorage,
  saveExamsToStorage,
  clearAllLocalData,
} from './utils/storage';
import {
  signInWithGoogle,
  signInGuest,
  signInWithEmail,
  registerWithEmail,
  getAuthErrorMessage,
  signOutUser,
  subscribeToAuth,
  listenToUserTasks,
  listenToUserExams,
  saveTaskToCloud,
  deleteTaskFromCloud,
  saveExamToCloud,
  deleteExamFromCloud,
  uploadLocalDataToCloud,
} from './lib/firebase';

export default function App() {
  const [currentGrade, setCurrentGrade] = useState<Grade>('8');
  const [activeTab, setActiveTab] = useState<ViewTab>('calendar');
  
  // Persistent State (Hydrated from LocalStorage)
  const [tasks, setTasks] = useState<CalendarTask[]>(() => loadTasksFromStorage());
  const [mockExams, setMockExams] = useState<MockExam[]>(() => loadExamsFromStorage());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2026-10-30T07:52:00'));

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTask, setModalTask] = useState<Partial<CalendarTask> | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() =>
    loadNotificationSettings()
  );

  const handleUpdateNotificationSettings = (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  // Register Service Worker for PWA and Notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker could not register:', err);
      });
    }
  }, []);

  // Periodic reminder checker for upcoming tasks
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    // Run immediate check
    checkUpcomingTasksAndNotify(tasks, notificationSettings);

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkUpcomingTasksAndNotify(tasks, notificationSettings);
    }, 30000);

    return () => clearInterval(interval);
  }, [tasks, notificationSettings]);

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Cloud Firestore when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubTasks = listenToUserTasks(user.uid, (cloudTasks) => {
      if (cloudTasks && cloudTasks.length > 0) {
        setTasks(cloudTasks);
      }
    });

    const unsubExams = listenToUserExams(user.uid, (cloudExams) => {
      if (cloudExams && cloudExams.length > 0) {
        setMockExams(cloudExams);
      }
    });

    return () => {
      unsubTasks();
      unsubExams();
    };
  }, [user]);

  // Auto-save changes to localStorage (always acts as offline cache)
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveExamsToStorage(mockExams);
  }, [mockExams]);

  // Firebase Auth Actions
  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser && tasks.length > 0) {
        // Migrate/sync local tasks to cloud on initial login
        await uploadLocalDataToCloud(loggedUser.uid, tasks, mockExams);
      }
    } catch (err: any) {
      console.warn('Google Sign-In notice:', err?.code, err?.message);
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      // Open backup modal to present fallback auth methods (Guest / Email)
      setIsBackupModalOpen(true);
    }
  };

  const handleGuestSignIn = async () => {
    setAuthError(null);
    try {
      const guestUser = await signInGuest();
      if (guestUser && tasks.length > 0) {
        await uploadLocalDataToCloud(guestUser.uid, tasks, mockExams);
      }
    } catch (err: any) {
      console.error('Guest Sign-In failed:', err);
      setAuthError(getAuthErrorMessage(err));
    }
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const loggedUser = await signInWithEmail(email, pass);
      if (loggedUser && tasks.length > 0) {
        await uploadLocalDataToCloud(loggedUser.uid, tasks, mockExams);
      }
    } catch (err: any) {
      console.error('Email Sign-In failed:', err);
      setAuthError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const handleEmailRegister = async (name: string, email: string, pass: string) => {
    setAuthError(null);
    try {
      const loggedUser = await registerWithEmail(name, email, pass);
      if (loggedUser && tasks.length > 0) {
        await uploadLocalDataToCloud(loggedUser.uid, tasks, mockExams);
      }
    } catch (err: any) {
      console.error('Email Registration failed:', err);
      setAuthError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign-Out failed:', err);
    }
  };

  const handleUploadLocalToCloud = async () => {
    if (!user) return;
    await uploadLocalDataToCloud(user.uid, tasks, mockExams);
  };

  // Restore backup from JSON
  const handleRestoreData = (restoredTasks: CalendarTask[], restoredExams: MockExam[]) => {
    setTasks(restoredTasks);
    setMockExams(restoredExams);
    if (user) {
      uploadLocalDataToCloud(user.uid, restoredTasks, restoredExams);
    }
  };

  // Reset all tasks and mock exams to clean slate
  const handleResetToDefaults = () => {
    setTasks([]);
    setMockExams([]);
    saveTasksToStorage([]);
    saveExamsToStorage([]);
    clearAllLocalData();
    if (user) {
      uploadLocalDataToCloud(user.uid, [], []);
    }
  };

  // Completed Topic IDs Set for visual strikethrough in curriculum
  const completedTopicIds = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.completed && t.topicId) {
        set.add(t.topicId);
      }
    });
    return set;
  }, [tasks]);

  // Save or Update Task (Local + Cloud) with automatic recurring generation
  const handleSaveTask = (savedTask: CalendarTask) => {
    if (savedTask.recurrence && savedTask.recurrence !== 'none') {
      const generated = generateRecurringTasks(savedTask);

      setTasks((prev) => {
        // If updating an existing recurring group, remove previous instances of this group
        const targetGroupId = savedTask.recurrenceGroupId;
        const cleaned = targetGroupId
          ? prev.filter((t) => t.recurrenceGroupId !== targetGroupId && t.id !== savedTask.id)
          : prev.filter((t) => t.id !== savedTask.id);

        return [...cleaned, ...generated];
      });

      if (user) {
        generated.forEach((t) => saveTaskToCloud(user.uid, t));
      }
    } else {
      setTasks((prev) => {
        const exists = prev.some((t) => t.id === savedTask.id);
        if (exists) {
          return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
        }
        return [...prev, savedTask];
      });

      if (user) {
        saveTaskToCloud(user.uid, savedTask);
      }
    }
  };

  // Delete Task (Local + Cloud)
  const handleDeleteTask = (taskId: string, deleteAllRecurring: boolean = false) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (deleteAllRecurring && taskToDelete?.recurrenceGroupId) {
      const gId = taskToDelete.recurrenceGroupId;
      const groupTasks = tasks.filter((t) => t.recurrenceGroupId === gId);
      setTasks((prev) => prev.filter((t) => t.recurrenceGroupId !== gId));
      if (user) {
        groupTasks.forEach((t) => deleteTaskFromCloud(user.uid, t.id));
      }
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (user) {
        deleteTaskFromCloud(user.uid, taskId);
      }
    }
  };

  // Quick Inline Update (from drag move or duration resize)
  const handleUpdateTask = (updatedTask: CalendarTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (user) {
      saveTaskToCloud(user.uid, updatedTask);
    }
  };

  // Mock Exam handlers (Local + Cloud)
  const handleAddMockExam = (newExam: MockExam) => {
    setMockExams((prev) => [...prev, newExam]);
    if (user) {
      saveExamToCloud(user.uid, newExam);
    }
  };

  const handleDeleteMockExam = (examId: string) => {
    setMockExams((prev) => prev.filter((e) => e.id !== examId));
    if (user) {
      deleteExamFromCloud(user.uid, examId);
    }
  };

  // Open modal for a specific day and hour slot clicked in calendar
  const handleCreateTaskAtTime = (date: string, startTime: string) => {
    setModalTask({
      grade: currentGrade,
      date,
      startTime,
      durationMinutes: 60,
      taskType: 'soru',
      targetCount: 40,
    });
    setIsModalOpen(true);
  };

  // Select topic for quick add from '+' icon in curriculum
  const handleSelectTopicForQuickAdd = (
    subjectId: SubjectId,
    topic: TopicItem,
    unitName: string
  ) => {
    const subjectName = SUBJECT_CONFIGS[subjectId]?.name || 'Ders';
    setModalTask({
      title: `${subjectName}: ${topic.name}`,
      grade: currentGrade,
      subjectId,
      topicId: topic.id,
      topicName: topic.name,
      taskType: 'soru',
      date: formatDateToISO(selectedDate),
      startTime: '17:00',
      durationMinutes: 60,
      targetCount: topic.recommendedQuestions || 40,
      notes: `${unitName} kapsamındaki kazanım çalışması.`,
    });
    setIsModalOpen(true);
  };

  // Filter tasks by grade if user chooses to scope (or keep all visible)
  const gradeTasks = useMemo(() => {
    return tasks.filter((t) => t.grade === currentGrade);
  }, [tasks, currentGrade]);

  const completedTodayCount = useMemo(() => {
    return tasks.filter((t) => t.date === '2026-10-30' && t.completed).length;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Header */}
      <Header
        currentGrade={currentGrade}
        onGradeChange={(g) => setCurrentGrade(g)}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        notificationsEnabled={notificationSettings.enabled}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto flex flex-col ${
          activeTab === 'calendar'
            ? 'max-w-full px-1.5 sm:px-3 py-1.5'
            : 'max-w-7xl p-3 sm:p-5 lg:p-6 gap-4'
        }`}
      >
        {/* TAB 1: CALENDAR VIEW (Tam Genişlik Outlook Takvimi) */}
        {activeTab === 'calendar' && (
          <div className="w-full">
            <OutlookCalendar
              tasks={gradeTasks}
              onSelectTask={(task) => {
                setModalTask(task);
                setIsModalOpen(true);
              }}
              onUpdateTask={handleUpdateTask}
              onCreateTaskAtTime={handleCreateTaskAtTime}
              importantDates={IMPORTANT_DATES}
              selectedDate={selectedDate}
              onSelectedDateChange={setSelectedDate}
            />
          </div>
        )}

        {/* TAB 2: CURRICULUM EXPLORER */}
        {activeTab === 'curriculum' && (
          <CurriculumExplorer
            currentGrade={currentGrade}
            onPlanTopic={(subjId, topic, unitName) => {
              handleSelectTopicForQuickAdd(subjId, topic, unitName);
            }}
            completedTopicIds={completedTopicIds}
            tasks={gradeTasks}
            onSelectTask={(task) => {
              setModalTask(task);
              setIsModalOpen(true);
            }}
          />
        )}

        {/* TAB 3: MOCK EXAMS (Deneme Sınavları & Karşılaştırma) */}
        {activeTab === 'deneme' && (
          <MockExamsView
            exams={mockExams.filter((e) => e.grade === currentGrade)}
            onAddExam={handleAddMockExam}
            onDeleteExam={handleDeleteMockExam}
            currentGrade={currentGrade}
          />
        )}

        {/* TAB 4: ADVANCED ANALYTICS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            tasks={gradeTasks}
            currentGrade={currentGrade}
            onSelectTask={(task) => {
              setModalTask(task);
              setIsModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Task Creation & Completion Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        initialTask={modalTask}
        currentGrade={currentGrade}
      />

      {/* Personal Data Backup & PWA Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        tasks={tasks}
        mockExams={mockExams}
        onRestoreData={handleRestoreData}
        onResetToDefaults={handleResetToDefaults}
        user={user}
        onSignIn={handleSignIn}
        onGuestSignIn={handleGuestSignIn}
        onEmailSignIn={handleEmailSignIn}
        onEmailRegister={handleEmailRegister}
        onSignOut={handleSignOut}
        onUploadLocalToCloud={handleUploadLocalToCloud}
        authError={authError}
      />

      {/* Notification Settings & PWA Links Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={handleUpdateNotificationSettings}
      />
    </div>
  );
}
