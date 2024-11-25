import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const guidedPrayers = [
  {
    id: 1,
    title: "Pre-Run Prayer",
    content: "Lord, as I prepare to run, I ask for Your strength and guidance. Help me to focus on You with each step I take.",
  },
  {
    id: 2,
    title: "Endurance Prayer",
    content: "Grant me the endurance to persevere, not just in this run, but in my spiritual journey. Let each mile strengthen my faith.",
  },
  {
    id: 3,
    title: "Gratitude Prayer",
    content: "Thank You for the ability to run and move freely. Help me use this gift to glorify You and inspire others.",
  },
];

export default function GuidedPrayers() {
  return (
    <section className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Guided Prayers</h2>
        <p className="text-muted-foreground">Strengthen your spiritual journey with these prayer guides</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guidedPrayers.map((prayer) => (
          <Card key={prayer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{prayer.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{prayer.content}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/prayer-wall">Share Your Prayer</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button asChild size="lg">
          <Link href="/prayer-wall">View All Prayers</Link>
        </Button>
      </div>
    </section>
  );
}