import { events } from '@/lib/data/events';
import { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = events.find(e => e.id === parseInt(params.id));
  
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    };
  }

  return {
    title: `${event.name} - Kingdom Runners`,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      images: [event.image],
    },
  };
}

export function generateStaticParams() {
  return events.map((event) => ({
    id: event.id.toString(),
  }));
}

export default function EventDetailPage({ params }: Props) {
  const event = events.find(e => e.id === parseInt(params.id));

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Event not found</h1>
      </div>
    );
  }

  return <EventDetailClient event={event} />;
}