import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CalendarTask, MockExam } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Friendly Turkish error messages
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'Bilinmeyen bir hata oluştu.';
  const code = error.code || '';
  switch (code) {
    case 'auth/unauthorized-domain':
      return 'Bu web adresi henüz Google OAuth izin listesinde yer almadığı için Google ile giriş yapılamadı. Bunun yerine "Hızlı Bulut Girişi" veya "E-posta ile Giriş" seçeneğini kullanabilirsiniz.';
    case 'auth/popup-blocked':
      return 'Tarayıcınız açılır pencereyi (popup) engelledi. Lütfen adres çubuğundaki kilit simgesinden açılır pencerelere izin verin.';
    case 'auth/popup-closed-by-user':
      return 'Giriş penceresi tamamlanmadan kapatıldı.';
    case 'auth/cancelled-popup-request':
      return 'Önceki oturum açma isteği iptal edildi.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Hatalı e-posta veya şifre girdiniz.';
    case 'auth/user-not-found':
      return 'Bu e-posta adresine ait bir hesap bulunamadı.';
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanımda. Giriş yapmayı deneyin.';
    case 'auth/weak-password':
      return 'Şifre en az 6 karakterden oluşmalıdır.';
    case 'auth/invalid-email':
      return 'Geçerli bir e-posta adresi giriniz.';
    case 'auth/operation-not-allowed':
      return 'Bu oturum yöntemi henüz Firebase konsolunda etkinleştirilmemiş.';
    default:
      return error.message || 'Giriş yapılırken bir hata oluştu.';
  }
}

// 1. Google ile Giriş Yap
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// 2. Hızlı Bulut Hesabı ile Giriş (Anonim / Misafir Bulut Girişi)
export async function signInGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  if (!result.user.displayName) {
    await updateProfile(result.user, { displayName: 'Misafir Öğrenci' }).catch(() => {});
  }
  return result.user;
}

// 3. E-posta ile Giriş Yap
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

// 4. E-posta ile Yeni Hesap Oluştur
export async function registerWithEmail(name: string, email: string, pass: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(result.user, { displayName: name.trim() }).catch(() => {});
  }
  return result.user;
}

// 5. Çıkış Yap
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// 6. Oturum Dinleyicisi
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore Realtime Task Listeners
export function listenToUserTasks(
  userId: string,
  onUpdate: (tasks: CalendarTask[]) => void,
  onError?: (err: Error) => void
) {
  const tasksCol = collection(db, 'users', userId, 'tasks');
  return onSnapshot(
    tasksCol,
    (snapshot) => {
      const items: CalendarTask[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as CalendarTask);
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Error listening to user tasks from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

// Firestore Realtime Exam Listeners
export function listenToUserExams(
  userId: string,
  onUpdate: (exams: MockExam[]) => void,
  onError?: (err: Error) => void
) {
  const examsCol = collection(db, 'users', userId, 'mockExams');
  return onSnapshot(
    examsCol,
    (snapshot) => {
      const items: MockExam[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as MockExam);
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Error listening to user exams from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

// Single Task Save/Update
export async function saveTaskToCloud(userId: string, task: CalendarTask): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', task.id);
  const sanitized = JSON.parse(JSON.stringify(task));
  await setDoc(taskRef, sanitized, { merge: true });
}

// Single Task Delete
export async function deleteTaskFromCloud(userId: string, taskId: string): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
}

// Single Exam Save/Update
export async function saveExamToCloud(userId: string, exam: MockExam): Promise<void> {
  const examRef = doc(db, 'users', userId, 'mockExams', exam.id);
  const sanitized = JSON.parse(JSON.stringify(exam));
  await setDoc(examRef, sanitized, { merge: true });
}

// Single Exam Delete
export async function deleteExamFromCloud(userId: string, examId: string): Promise<void> {
  const examRef = doc(db, 'users', userId, 'mockExams', examId);
  await deleteDoc(examRef);
}

// Bulk Upload (Migration from Local to Cloud on First Login)
export async function uploadLocalDataToCloud(
  userId: string,
  tasks: CalendarTask[],
  exams: MockExam[]
): Promise<void> {
  const batch = writeBatch(db);

  tasks.forEach((t) => {
    const ref = doc(db, 'users', userId, 'tasks', t.id);
    batch.set(ref, JSON.parse(JSON.stringify(t)), { merge: true });
  });

  exams.forEach((e) => {
    const ref = doc(db, 'users', userId, 'mockExams', e.id);
    batch.set(ref, JSON.parse(JSON.stringify(e)), { merge: true });
  });

  await batch.commit();
}
