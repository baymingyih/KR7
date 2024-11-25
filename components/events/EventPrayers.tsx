"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prayer } from '@/lib/data/events';

interface EventPrayersProps {
  prayers: Prayer[];
}

export default function EventPrayers({ prayers }: EventPrayersProps) {
  return (
    <div>
      <ScrollArea className="h-[500px] pr-4">
        {prayers.map((prayer) => (
          <Card key={prayer.id} className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">{prayer.runner}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(prayer.timestamp).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <p>{prayer.content}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
      <Button className="w-full mt-4">Share Your Prayer</Button>
    </div>
  );
}