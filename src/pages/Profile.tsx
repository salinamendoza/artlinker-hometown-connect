import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Share2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';
import { ArtworkCard } from '@/components/ArtworkCard';
import { ProfileError } from '@/components/profile/ProfileError';

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

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<CollectorProfile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Try to get the collector profile
        const { data: collectorData, error: collectorError } = await supabase
          .from('collectors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (collectorError) throw collectorError;
        
        if (!collectorData) {
          setError('Profile not found. Please try registering again.');
          return;
        }

        // Check if we have pending data to save
        const pendingData = localStorage.getItem('pendingCollectorData');
        if (pendingData) {
          const parsedData = JSON.parse(pendingData);
          const { error: updateError } = await supabase
            .from('collectors')
            .update(parsedData)
            .eq('id', session.user.id);

          if (updateError) throw updateError;
          
          // Clear pending data and reload the profile
          localStorage.removeItem('pendingCollectorData');
          const { data: updatedData } = await supabase
            .from('collectors')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (updatedData) {
            setProfile(updatedData);
          }
        } else {
          setProfile(collectorData);
        }

        // Load artworks
        await fetchArtworks(session.user.id);
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const fetchArtworks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, artist, image_url')
        .eq('collector_id', userId);

      if (error) throw error;
      setArtworks(data || []);
    } catch (error: any) {
      console.error('Error loading artworks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load artworks",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
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

  if (error) {
    return <ProfileError message={error} />;
  }

  if (!profile) {
    return <ProfileError message="Profile not found. Please try registering again." />;
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
              {profile?.city && (
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.city}</span>
                </div>
              )}
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
            <Button onClick={() => navigate('/add-artwork')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Artwork
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                id={artwork.id}
                title={artwork.title}
                artist={artwork.artist}
                imageUrl={artwork.image_url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;