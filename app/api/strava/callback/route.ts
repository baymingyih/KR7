import { NextResponse } from 'next/server';
import { saveStravaTokens } from '@/lib/db/stravaTokens';
import { getCurrentUser } from '@/lib/auth';
import { exchangeToken } from '@/lib/strava';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      return NextResponse.redirect('/dashboard?error=strava_auth_denied');
    }

    if (!code) {
      return NextResponse.redirect('/dashboard?error=no_code');
    }

    // Verify state if you stored it in session
    const savedState = typeof window !== 'undefined' ? sessionStorage.getItem('stravaAuthState') : null;
    if (savedState && state !== savedState) {
      return NextResponse.redirect('/dashboard?error=invalid_state');
    }

    const user = getCurrentUser();
    if (!user) {
      return NextResponse.redirect('/login?error=auth_required');
    }

    // Exchange the authorization code for tokens
    const tokens = await exchangeToken(code);

    // Save the tokens
    await saveStravaTokens(user.uid, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at,
    });

    // Clear the state from session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('stravaAuthState');
    }

    return NextResponse.redirect('/dashboard?success=strava_connected');
  } catch (error) {
    console.error('Strava callback error:', error);
    return NextResponse.redirect('/dashboard?error=strava_connection_failed');
  }
}