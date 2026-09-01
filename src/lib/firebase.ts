import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, deleteDoc, updateDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GeneratedPlan, TravelReminder } from '../types';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Test server connectivity on boot as per guidelines
(async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline, falling back gracefully to local persistence.');
    }
  }
})();

// Auth helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Upsert user profile document
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to sync user profile to firestore:', e);
  }

  return user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Firestore Saved Trips Persistence
export async function saveTripToCloud(userId: string, plan: GeneratedPlan): Promise<void> {
  if (!userId || !plan?.id) return;
  const tripRef = doc(db, 'users', userId, 'trips', plan.id);
  await setDoc(tripRef, {
    ...plan,
    userId,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteTripFromCloud(userId: string, tripId: string): Promise<void> {
  if (!userId || !tripId) return;
  const tripRef = doc(db, 'users', userId, 'trips', tripId);
  await deleteDoc(tripRef);
}

export async function fetchUserTripsFromCloud(userId: string): Promise<GeneratedPlan[]> {
  if (!userId) return [];
  try {
    const tripsColl = collection(db, 'users', userId, 'trips');
    const snapshot = await getDocs(tripsColl);
    const plans: GeneratedPlan[] = [];
    snapshot.forEach((d) => {
      plans.push(d.data() as GeneratedPlan);
    });
    return plans;
  } catch (err) {
    console.error('Error fetching trips from cloud:', err);
    return [];
  }
}

// Firestore Reminders Persistence
export async function saveReminderToCloud(userId: string, reminder: TravelReminder): Promise<void> {
  if (!userId || !reminder?.id) return;
  const remRef = doc(db, 'users', userId, 'reminders', reminder.id);
  await setDoc(remRef, {
    ...reminder,
    userId,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteReminderFromCloud(userId: string, reminderId: string): Promise<void> {
  if (!userId || !reminderId) return;
  const remRef = doc(db, 'users', userId, 'reminders', reminderId);
  await deleteDoc(remRef);
}

export async function fetchUserRemindersFromCloud(userId: string): Promise<TravelReminder[]> {
  if (!userId) return [];
  try {
    const remColl = collection(db, 'users', userId, 'reminders');
    const snapshot = await getDocs(remColl);
    const list: TravelReminder[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as TravelReminder);
    });
    return list;
  } catch (err) {
    console.error('Error fetching reminders from cloud:', err);
    return [];
  }
}
