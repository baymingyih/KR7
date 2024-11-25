"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import EventLeaderboard from '@/components/events/EventLeaderboard';
import EventPrayerGuide from '@/components/events/EventPrayerGuide';
import EventPrayers from '@/components/events/EventPrayers';
import EventRecentRuns from '@/components/events/EventRecentRuns';
import EventUserProgress from '@/components/events/EventUserProgress';
import { type Event } from '@/lib/data/events';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function EventDetail({ event }: { event: Event }) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { user } = useAuthContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{event.name}</CardTitle>
          <p className="text-muted-foreground">
            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="prayer-guide">Prayer Guide</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="prayers">Prayers</TabsTrigger>
              <TabsTrigger value="recent-runs">Recent Runs</TabsTrigger>
              {user && <TabsTrigger value="progress">Progress</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About this Event</h3>
                  <p className="mb-6">{event.description}</p>
                  <div className="flex gap-4">
                    <Button>Register Now</Button>
                    <Button variant="outline">Share Event</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Event Prayer Guide</h3>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid gap-4">
                      {event.prayerGuide.map((guide, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">Day {guide.day}: {guide.title}</CardTitle>
                            <p className="text-sm italic text-muted-foreground">{guide.verse}</p>
                          </CardHeader>
                          <CardContent>
                            <p>{guide.prayer}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prayer-guide" className="mt-6">
              <EventPrayerGuide prayerGuide={event.prayerGuide} />
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <EventLeaderboard leaderboard={event.leaderboard} />
            </TabsContent>

            <TabsContent value="prayers" className="mt-6">
              <EventPrayers prayers={event.prayers} />
            </TabsContent>

            <TabsContent value="recent-runs" className="mt-6">
              <EventRecentRuns eventId={event.id} />
            </TabsContent>

            {user && (
              <TabsContent value="progress" className="mt-6">
                <EventUserProgress eventId={event.id} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}