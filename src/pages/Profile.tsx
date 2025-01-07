import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

interface CollectorProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  city: string | null;
  preferences?: {
    mediums?: string[];
    priceRange?: string;
    goals?: string;
  } | Json | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<CollectorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('collectors')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name} ${profile?.last_name}`} />
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{profile?.city}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
            <Button className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Collection
            </Button>
          </div>
        </div>

        {/* Collection Preferences */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Collection Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-muted-foreground mb-3">Preferred Mediums</h3>
              <div className="flex flex-wrap gap-2">
                {(profile?.preferences as any)?.mediums?.map((medium: string) => (
                  <Badge key={medium} variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-100">
                    {medium}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-3">Price Range</h3>
              <p>{(profile?.preferences as any)?.priceRange}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-3">Collection Goals</h3>
              <p>{(profile?.preferences as any)?.goals}</p>
            </div>
          </div>
        </div>

        {/* My Collection */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Collection</h2>
            <Button className="flex items-center gap-2">
              + Add Artwork
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for artwork grid */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;