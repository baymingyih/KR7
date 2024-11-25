import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  runTransaction,
  doc,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUser } from './users';

export interface Activity {
  id?: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  eventId: string;
  distance: number;
  duration: number;
  location: string;
  notes?: string;
  timestamp: Date;
}

export async function logActivity(activityData: Omit<Activity, 'id' | 'userName' | 'userAvatar' | 'timestamp'>) {
  try {
    // Get user details to include in the activity
    const userProfile = await getUser(activityData.userId);
    
    // Start a transaction to ensure both activity logging and user stats update succeed
    await runTransaction(db, async (transaction) => {
      // Add the activity
      const activitiesRef = collection(db, 'activities');
      const activityDocRef = doc(activitiesRef);
      
      transaction.set(activityDocRef, {
        ...activityData,
        userName: `${userProfile.firstName} ${userProfile.lastName}`,
        timestamp: Timestamp.now(),
      });

      // Update user's total distance
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', activityData.userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const currentDistance = userDoc.data().totalDistance || 0;
        
        transaction.update(userDoc.ref, {
          totalDistance: currentDistance + activityData.distance
        });
      }
    });

    return {
      ...activityData,
      userName: `${userProfile.firstName} ${userProfile.lastName}`,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    if (error instanceof Error && error.message.includes('indexes')) {
      throw new Error('System is being initialized. Please try again in a few moments.');
    }
    throw new Error('Failed to log activity. Please try again.');
  }
}

export async function getEventActivities(eventId: string, limitCount = 20) {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('eventId', '==', eventId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Activity[];
  } catch (error) {
    console.error('Error getting event activities:', error);
    if (error instanceof Error && error.message.includes('indexes')) {
      throw new Error('System is being initialized. Please try again in a few moments.');
    }
    throw new Error('Failed to load activities. Please try again.');
  }
}

export async function getUserActivities(userId: string, limitCount = 20) {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Activity[];
  } catch (error) {
    console.error('Error getting user activities:', error);
    if (error instanceof Error && error.message.includes('indexes')) {
      throw new Error('System is being initialized. Please try again in a few moments.');
    }
    throw new Error('Failed to load user activities. Please try again.');
  }
}