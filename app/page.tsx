import Hero from '@/components/Hero';
import EventCountdown from '@/components/EventCountdown';
import DailyPrayer from '@/components/DailyPrayer';
import FeaturedEvents from '@/components/FeaturedEvents';
import GuidedPrayers from '@/components/GuidedPrayers';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4">
        <EventCountdown />
        <DailyPrayer />
        <GuidedPrayers />
        <FeaturedEvents />
      </div>
    </main>
  );
}