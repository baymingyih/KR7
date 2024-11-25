"use client"

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialRunners = [
  { id: 1, name: "Emma Johnson", country: "USA", distance: 150.5 },
  { id: 2, name: "Liam Chen", country: "China", distance: 142.3 },
  { id: 3, name: "Sophia Müller", country: "Germany", distance: 138.7 },
  { id: 4, name: "Mohammed Al-Fayed", country: "Egypt", distance: 135.2 },
  { id: 5, name: "Isabella García", country: "Spain", distance: 130.9 },
];

export default function LeaderboardPage() {
  const [runners, setRunners] = useState(initialRunners);
  const [sortBy, setSortBy] = useState('distance');

  const sortedRunners = [...runners].sort((a, b) => {
    if (sortBy === 'distance') {
      return b.distance - a.distance;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'country') {
      return a.country.localeCompare(b.country);
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>
      
      <div className="mb-4">
        <Select onValueChange={setSortBy} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="country">Country</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Distance (km)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRunners.map((runner, index) => (
            <TableRow key={runner.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{runner.name}</TableCell>
              <TableCell>{runner.country}</TableCell>
              <TableCell>{runner.distance.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}