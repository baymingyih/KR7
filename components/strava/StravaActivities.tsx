"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MapPin, Timer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { logActivity } from '@/lib/db/activities';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  location_city?: string;
  location_country?: string;
}

interface StravaActivitiesProps {
  eventId: number;
  onActivityLogged: () => void;
}

export default function StravaActivities({ eventId, onActivityLogged }: StravaActivitiesProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const { user } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/strava/activities');
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        toast({
          title: "Error loading activities",
          description: "Could not load your Strava activities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  const handleImport = async (activity: StravaActivity) => {
    if (!user) return;
    
    setImporting(activity.id);
    try {
      await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: activity.distance / 1000, // Convert meters to kilometers
        duration: activity.moving_time,
        location: [activity.location_city, activity.location_country].filter(Boolean).join(', ') || 'Unknown location',
        notes: `Imported from Strava: ${activity.name}`,
      });

      toast({
        title: "Activity imported",
        description: "Your Strava activity has been successfully logged.",
      });

      onActivityLogged();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activities found on Strava</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{activity.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span>{Math.floor(activity.moving_time / 60)} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{(activity.distance / 1000).toFixed(2)} km</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleImport(activity)}
                disabled={importing === activity.id}
              >
                {importing === activity.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Import'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}