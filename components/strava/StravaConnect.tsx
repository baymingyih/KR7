"use client"

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getStravaAuthUrl } from '@/lib/strava';

interface StravaConnectProps {
  onSuccess: () => void;
}

export default function StravaConnect({ onSuccess }: StravaConnectProps) {
  const { toast } = useToast();

  const handleConnect = () => {
    try {
      const authUrl = getStravaAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to Strava. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      className="bg-[#FC4C02] hover:bg-[#E34402] text-white"
    >
      Connect with Strava
    </Button>
  );
}