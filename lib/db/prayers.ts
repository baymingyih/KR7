import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export interface Prayer {
  id?: string;
  userId: string;
  eventId?: string;
  content: string;
  author: string;
  createdAt: Date;
}

export async function createPrayer(prayerData: Omit<Prayer, 'id' | 'createdAt'>) {
  try {
    const prayersRef = collection(db, 'prayers');
    const docRef = await addDoc(prayersRef, {
      ...prayerData,
      createdAt: new Date()
    });
    return { id: docRef.id, ...prayerData };
  } catch (error) {
    console.error('Error creating prayer:', error);
    throw error;
  }
}

export async function getEventPrayers(eventId: string, limit = 50) {
  try {
    const prayersRef = collection(db, 'prayers');
    const q = query(
      prayersRef,
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prayer[];
  } catch (error) {
    console.error('Error getting event prayers:', error);
    throw error;
  }
}

export async function getRecentPrayers(limit = 10) {
  try {
    const prayersRef = collection(db, 'prayers');
    const q = query(
      prayersRef,
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prayer[];
  } catch (error) {
    console.error('Error getting recent prayers:', error);
    throw error;
  }
}