const STRAVA_CLIENT_ID = '139909';
const STRAVA_CLIENT_SECRET = '35e4559937cb4e340411c03d6a7395f3b81450fa';

// Use localhost for development
const REDIRECT_URI = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/strava/callback'
  : 'https://kingdomrunners.vercel.app/api/strava/callback';

interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: any;
}

export function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getStravaAuthUrl(): string {
  const scope = 'read,activity:read_all';
  const state = generateRandomState();
  // Store state in sessionStorage for verification
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('stravaAuthState', state);
  }
  return `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}&state=${state}`;
}

export async function exchangeToken(code: string): Promise<StravaTokenResponse> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange token');
  }

  return response.json();
}

export async function refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
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

export async function getStravaActivities(accessToken: string): Promise<any[]> {
  const response = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=30',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }

  return response.json();
}