import DailyPrayer from '@/components/DailyPrayer';

export default function PrayerPointsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Prayer Guide</h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-muted-foreground mb-8">
          Use these prayer points to guide your daily devotions and running meditation.
        </p>
        <DailyPrayer />
      </div>
    </div>
  );
}