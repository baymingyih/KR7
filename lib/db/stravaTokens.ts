import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function saveStravaTokens(userId: string, tokens: StravaTokens) {
  try {
    const userTokenRef = doc(db, 'stravaTokens', userId);
    await setDoc(userTokenRef, {
      ...tokens,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving Strava tokens:', error);
    throw new Error('Failed to save Strava tokens');
  }
}

export async function getStravaTokens(userId: string): Promise<StravaTokens | null> {
  try {
    const userTokenRef = doc(db, 'stravaTokens', userId);
    const tokenDoc = await getDoc(userTokenRef);
    
    if (!tokenDoc.exists()) {
      return null;
    }

    return tokenDoc.data() as StravaTokens;
  } catch (error) {
    console.error('Error getting Strava tokens:', error);
    throw new Error('Failed to get Strava tokens');
  }
}

export async function updateStravaTokens(userId: string, tokens: Partial<StravaTokens>) {
  try {
    const userTokenRef = doc(db, 'stravaTokens', userId);
    await updateDoc(userTokenRef, {
      ...tokens,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating Strava tokens:', error);
    throw new Error('Failed to update Strava tokens');
  }
}