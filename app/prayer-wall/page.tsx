"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Prayer {
  id: number;
  author: string;
  content: string;
}

const initialPrayers: Prayer[] = [
  { id: 1, author: "John D.", content: "Praying for strength and endurance in my upcoming marathon." },
  { id: 2, author: "Sarah M.", content: "Asking for healing for my injured knee." },
  { id: 3, author: "Michael R.", content: "Grateful for the supportive community of runners. Bless them all!" },
];

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
  const [newPrayer, setNewPrayer] = useState({ author: '', content: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPrayer.author && newPrayer.content) {
      setPrayers([...prayers, { id: prayers.length + 1, ...newPrayer }]);
      setNewPrayer({ author: '', content: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Prayer Wall</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Prayer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={newPrayer.author}
              onChange={(e) => setNewPrayer({ ...newPrayer, author: e.target.value })}
            />
            <Textarea
              placeholder="Your Prayer"
              value={newPrayer.content}
              onChange={(e) => setNewPrayer({ ...newPrayer, content: e.target.value })}
            />
            <Button type="submit">Submit Prayer</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayers.map((prayer) => (
          <Card key={prayer.id}>
            <CardHeader>
              <CardTitle>{prayer.author}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{prayer.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}