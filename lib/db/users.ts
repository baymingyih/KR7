import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  totalDistance: number;
  totalPrayers: number;
  createdAt: Date;
}

export async function createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'totalDistance' | 'totalPrayers'>) {
  try {
    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userData.uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User profile already exists');
    }

    // Add new user with initial values
    const newUser = {
      ...userData,
      totalDistance: 0,
      totalPrayers: 0,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(usersRef, newUser);
    return { 
      id: docRef.id, 
      ...newUser,
      createdAt: newUser.createdAt.toDate(),
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user profile');
  }
}

export async function getUser(uid: string): Promise<UserProfile> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User profile not found');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    return { 
      id: userDoc.id, 
      ...userData,
      createdAt: userData.createdAt.toDate(),
    } as UserProfile;
  } catch (error: any) {
    console.error('Error getting user:', error);
    throw new Error(error.message || 'Failed to retrieve user profile');
  }
}

export async function updateUserStats(userId: string, distanceToAdd: number, prayersToAdd: number) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const currentStats = userDoc.data();
    const updatedStats = {
      totalDistance: (currentStats.totalDistance || 0) + distanceToAdd,
      totalPrayers: (currentStats.totalPrayers || 0) + prayersToAdd
    };

    await updateDoc(userRef, updatedStats);
    
    return { 
      id: userDoc.id, 
      ...userDoc.data(),
      ...updatedStats,
      createdAt: currentStats.createdAt.toDate(),
    };
  } catch (error: any) {
    console.error('Error updating user stats:', error);
    throw new Error(error.message || 'Failed to update user statistics');
  }
}