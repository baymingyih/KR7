import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const events = [
  { id: 1, name: "Global Unity 5K", date: "2023-11-15", theme: "Unity in Diversity" },
  { id: 2, name: "Marathon of Hope", date: "2023-12-01", theme: "Running for a Cause" },
  { id: 3, name: "New Year's Resolution Run", date: "2024-01-01", theme: "Fresh Starts" },
];

export default function FeaturedEvents() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Date: {event.date}</p>
              <p className="mb-4">Theme: {event.theme}</p>
              <Button asChild>
                <Link href={`/events/${event.id}`}>Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}