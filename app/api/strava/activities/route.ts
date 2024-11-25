import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getStravaTokens, updateStravaTokens } from '@/lib/db/stravaTokens';

const STRAVA_CLIENT_ID = "139909";
const STRAVA_CLIENT_SECRET = "35e4559937cb4e340411c03d6a7395f3b81450fa";

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function GET() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tokens = await getStravaTokens(user.uid);
    if (!tokens) {
      return NextResponse.json({ error: 'Strava not connected' }, { status: 404 });
    }

    // Check if token needs refresh
    if (Date.now() / 1000 > tokens.expiresAt) {
      const newTokens = await refreshAccessToken(tokens.refreshToken);
      await updateStravaTokens(user.uid, {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        expiresAt: newTokens.expires_at,
      });
      tokens.accessToken = newTokens.access_token;
    }

    // Fetch activities
    const activitiesResponse = await fetch(
      'https://www.strava.com/api/v3/athlete/activities?per_page=30',
      {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      throw new Error('Failed to fetch activities');
    }

    const activities = await activitiesResponse.json();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}