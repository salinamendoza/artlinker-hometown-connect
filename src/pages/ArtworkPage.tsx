import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  price: number | null;
  city_collected: string | null;
  image_url: string;
}

const ArtworkPage = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setArtwork(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load artwork",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Artwork not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{artwork.artist}</p>
          </div>

          {artwork.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">About this piece</h2>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>
          )}

          {artwork.price && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Price</h2>
              <p className="text-muted-foreground">
                ${artwork.price.toLocaleString()}
              </p>
            </div>
          )}

          {artwork.city_collected && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Collected in</h2>
              <p className="text-muted-foreground">{artwork.city_collected}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkPage;