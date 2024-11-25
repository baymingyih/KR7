import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/login');
  }
}

export function checkGuest() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (token) {
    redirect('/dashboard');
  }
}