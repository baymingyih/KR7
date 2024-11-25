"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Timer } from 'lucide-react';
import { getEventActivities, type Activity } from '@/lib/db/activities';
import { Loader2 } from 'lucide-react';

export default function EventRecentRuns({ eventId }: { eventId: number }) {
  const [runs, setRuns] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activities = await getEventActivities(eventId.toString());
        setRuns(activities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [eventId]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${minutes}m`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No activities recorded yet. Be the first to log a run!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {runs.map((run) => (
          <Card key={run.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-start gap-4 pt-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={run.userAvatar} alt={run.userName} />
                <AvatarFallback>{run.userName ? getInitials(run.userName) : 'UK'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{run.userName}</h3>
                  <span className="text-sm text-muted-foreground">
                    {run.timestamp.toLocaleDateString()} at {run.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(run.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{run.location}</span>
                  </div>
                  <div className="font-semibold text-primary">
                    {run.distance.toFixed(1)} km
                  </div>
                </div>
                
                {run.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {run.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}