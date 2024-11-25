"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const prayerPoints = [
  {
    title: "Physical Strength",
    prayer: "Lord, grant us the strength to run with perseverance the race marked out for us. (Hebrews 12:1)",
    focus: "Pray for physical endurance and protection from injuries."
  },
  {
    title: "Mental Resilience",
    prayer: "I can do all things through Christ who strengthens me. (Philippians 4:13)",
    focus: "Pray for mental toughness and focus during challenging runs."
  },
  {
    title: "Community Unity",
    prayer: "How good and pleasant it is when God's people live together in unity! (Psalm 133:1)",
    focus: "Pray for our global running community and the bonds we share."
  },
  {
    title: "Purpose in Running",
    prayer: "Whatever you do, do it all for the glory of God. (1 Corinthians 10:31)",
    focus: "Pray for clarity in using our running to glorify God."
  },
  {
    title: "Gratitude",
    prayer: "Give thanks in all circumstances. (1 Thessalonians 5:18)",
    focus: "Thank God for the ability to run and the joy it brings."
  }
];

export default function DailyPrayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex >= prayerPoints.length) return 0;
      if (nextIndex < 0) return prayerPoints.length - 1;
      return nextIndex;
    });
  };

  const currentPoint = prayerPoints[currentIndex];

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Daily Prayer Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden px-4">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold mb-4">{currentPoint.title}</h3>
              <p className="italic mb-4">{currentPoint.prayer}</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{currentPoint.focus}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-1 mt-6">
            {prayerPoints.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}