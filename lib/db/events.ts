import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, orderBy, limit } from 'firebase/firestore';

export interface Event {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  description: string;
  image: string;
  participants: number;
  createdAt: Date;
}

export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt'>) {
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: new Date(),
      participants: 0
    });
    return { id: docRef.id, ...eventData };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function getEvent(eventId: string) {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    return { id: eventDoc.id, ...eventDoc.data() } as Event;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
}

export async function getUpcomingEvents(limit = 3) {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('endDate', '>=', new Date().toISOString()),
      orderBy('endDate'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw error;
  }
}

export async function updateEventParticipants(eventId: string, increment: number) {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    const currentParticipants = eventDoc.data().participants || 0;
    await updateDoc(eventRef, {
      participants: currentParticipants + increment
    });
    
    return { id: eventDoc.id, ...eventDoc.data(), participants: currentParticipants + increment };
  } catch (error) {
    console.error('Error updating event participants:', error);
    throw error;
  }
}