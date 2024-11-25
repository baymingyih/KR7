"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getUser, type UserProfile } from '@/lib/db/users';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      if (!authLoading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        try {
          const userProfile = await getUser(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile. Please try logging in again.",
            variant: "destructive",
          });
          router.push('/login');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user, authLoading, router, toast]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {profile.firstName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile.totalDistance?.toFixed(1) || '0'} km</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prayers Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile.totalPrayers || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}