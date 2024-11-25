"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import EventLeaderboard from './EventLeaderboard';
import EventPrayerGuide from './EventPrayerGuide';
import EventPrayers from './EventPrayers';
import EventRecentRuns from './EventRecentRuns';
import EventUserProgress from './EventUserProgress';
import { type Event } from '@/lib/data/events';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface EventDetailClientProps {
  event: Event;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { user } = useAuthContext();
  const [imageLoading, setImageLoading] = useState(true);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isOngoing = new Date() >= startDate && new Date() <= endDate;
  const isFuture = new Date() < startDate;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabs = [
    ["overview", "Overview"],
    ["prayer-guide", "Prayer Guide"],
    ["leaderboard", "Leaderboard"],
    ["prayers", "Prayers"],
    ["recent-runs", "Recent Runs"],
    ...(user ? [["my-progress", "My Progress"]] : []),
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative"
      >
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-8">
          <div className={`absolute inset-0 bg-black/50 z-10 transition-opacity duration-300 ${imageLoading ? 'opacity-100' : 'opacity-60'}`} />
          <Image
            src={event.image}
            alt={event.name}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setImageLoading(false)}
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {event.name}
            </motion.h1>
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="secondary" className="text-lg py-1.5">
                <Calendar className="w-4 h-4 mr-2" />
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </Badge>
              <Badge variant="secondary" className="text-lg py-1.5">
                <Users className="w-4 h-4 mr-2" />
                {event.participants} Participants
              </Badge>
              {isOngoing && (
                <Badge variant="secondary" className="text-lg py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  <Clock className="w-4 h-4 mr-2" />
                  Event in Progress
                </Badge>
              )}
              {isFuture && (
                <Badge variant="secondary" className="text-lg py-1.5">
                  <Clock className="w-4 h-4 mr-2" />
                  Upcoming Event
                </Badge>
              )}
            </motion.div>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Register Now
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white">
                Share Event
              </Button>
            </motion.div>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-transparent">
                {tabs.map(([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeIn}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-semibold mb-4">About this Event</h3>
                          <p className="text-lg leading-relaxed text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                          <h3 className="text-2xl font-semibold">Event Details</h3>
                          <div className="grid gap-4">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">Duration</p>
                                <p className="text-sm text-muted-foreground">
                                  {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">Virtual Event - Run Anywhere</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">Community</p>
                                <p className="text-sm text-muted-foreground">
                                  Join {event.participants} runners from around the world
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Event Prayer Guide</h3>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="grid gap-4">
                            {event.prayerGuide.map((guide, index) => (
                              <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                  <CardTitle className="text-lg">Day {guide.day}: {guide.title}</CardTitle>
                                  <p className="text-sm italic text-muted-foreground">{guide.verse}</p>
                                </CardHeader>
                                <CardContent>
                                  <p className="leading-relaxed">{guide.prayer}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prayer-guide">
                    <EventPrayerGuide prayerGuide={event.prayerGuide} />
                  </TabsContent>

                  <TabsContent value="leaderboard">
                    <EventLeaderboard leaderboard={event.leaderboard} />
                  </TabsContent>

                  <TabsContent value="prayers">
                    <EventPrayers prayers={event.prayers} />
                  </TabsContent>

                  <TabsContent value="recent-runs">
                    <EventRecentRuns eventId={event.id} />
                  </TabsContent>

                  {user && (
                    <TabsContent value="my-progress">
                      <EventUserProgress eventId={event.id} />
                    </TabsContent>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}