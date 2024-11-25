"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Runner } from '@/lib/data/events';

interface EventLeaderboardProps {
  leaderboard: Runner[];
}

const countryFlags: { [key: string]: string } = {
  US: "🇺🇸",
  CN: "🇨🇳",
  ES: "🇪🇸",
};

export default function EventLeaderboard({ leaderboard }: EventLeaderboardProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Runner</th>
              <th className="p-4 text-left">Country</th>
              <th className="p-4 text-left">Distance</th>
              <th className="p-4 text-left">Prayers</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((runner, index) => (
              <tr key={runner.id} className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{runner.name}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-xl">{countryFlags[runner.country]}</span>
                    {runner.country}
                  </span>
                </td>
                <td className="p-4">{runner.distance}km</td>
                <td className="p-4">{runner.prayers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}