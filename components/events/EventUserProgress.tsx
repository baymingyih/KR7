"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { logActivity, getUserActivities } from '@/lib/db/activities';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StravaConnect from '@/components/strava/StravaConnect';
import StravaActivities from '@/components/strava/StravaActivities';
import { getStravaTokens } from '@/lib/db/stravaTokens';

const activitySchema = z.object({
  kilometers: z.string().transform(val => Number(val))
    .refine(val => val >= 0, "Kilometers must be 0 or greater"),
  meters: z.string().transform(val => Number(val))
    .refine(val => val >= 0 && val < 1000, "Meters must be between 0 and 999"),
  hours: z.string().transform(val => Number(val))
    .refine(val => val >= 0, "Hours must be 0 or greater"),
  minutes: z.string().transform(val => Number(val))
    .refine(val => val >= 0 && val < 60, "Minutes must be between 0 and 59"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
}).refine(data => {
  const totalTime = (Number(data.hours) * 60) + Number(data.minutes);
  return totalTime > 0;
}, {
  message: "Total duration must be greater than 0",
  path: ["minutes"],
});

type ActivityFormData = z.infer<typeof activitySchema>;

export default function EventUserProgress({ eventId }: { eventId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [progress, setProgress] = useState({
    totalDistance: 0,
    targetDistance: 42.2,
    totalPrayers: 0,
    targetPrayers: 21,
  });
  
  const { user } = useAuthContext();
  const { toast } = useToast();

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      kilometers: '',
      meters: '',
      hours: '0',
      minutes: '',
      location: '',
      notes: '',
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load activities
        const activities = await getUserActivities(user.uid);
        const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
        
        setProgress(prev => ({
          ...prev,
          totalDistance,
          totalPrayers: activities.length,
        }));

        // Check Strava connection
        const tokens = await getStravaTokens(user.uid);
        setStravaConnected(!!tokens);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error loading progress",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, toast]);

  const onSubmit = async (data: ActivityFormData) => {
    if (!user) return;

    try {
      const totalDistance = Number(data.kilometers) + (Number(data.meters) / 1000);
      const totalMinutes = (Number(data.hours) * 60) + Number(data.minutes);

      await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: totalDistance,
        duration: totalMinutes * 60,
        location: data.location,
        notes: data.notes,
      });

      setProgress(prev => ({
        ...prev,
        totalDistance: prev.totalDistance + totalDistance,
        totalPrayers: prev.totalPrayers + 1,
      }));

      toast({
        title: "Activity logged successfully!",
        description: "Your run has been recorded.",
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error logging activity",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleStravaSuccess = () => {
    setStravaConnected(true);
    toast({
      title: "Strava Connected",
      description: "Your Strava account has been successfully connected.",
    });
  };

  const handleActivityImported = () => {
    toast({
      title: "Activity Imported",
      description: "Your Strava activity has been successfully imported.",
    });
    // Refresh progress
    if (user) {
      getUserActivities(user.uid).then(activities => {
        const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
        setProgress(prev => ({
          ...prev,
          totalDistance,
          totalPrayers: activities.length,
        }));
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to track your progress</p>
        <Button className="mt-4" asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="manual">Manual Log</TabsTrigger>
          <TabsTrigger value="strava">Strava</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distance Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={(progress.totalDistance / progress.targetDistance) * 100} 
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {progress.totalDistance.toFixed(1)} km of {progress.targetDistance} km
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prayer Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={(progress.totalPrayers / progress.targetPrayers) * 100} 
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {progress.totalPrayers} of {progress.targetPrayers} prayers shared
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Log Run Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="kilometers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kilometers</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meters</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="999"
                              placeholder="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minutes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="59"
                              placeholder="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strava">
          <Card>
            <CardHeader>
              <CardTitle>Strava Integration</CardTitle>
            </CardHeader>
            <CardContent>
              {!stravaConnected ? (
                <div className="text-center">
                  <p className="mb-4 text-muted-foreground">
                    Connect your Strava account to automatically import your activities
                  </p>
                  <StravaConnect onSuccess={handleStravaSuccess} />
                </div>
              ) : (
                <StravaActivities 
                  eventId={eventId} 
                  onActivityLogged={handleActivityImported}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}