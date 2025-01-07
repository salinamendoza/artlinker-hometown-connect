import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const AddArtworkForm = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const artist = formData.get("artist") as string;
      const description = formData.get("description") as string;
      const price = formData.get("price") ? Number(formData.get("price")) : null;
      const cityCollected = formData.get("cityCollected") as string;

      if (!title || !artist || !imageFile) {
        throw new Error("Please fill in all required fields");
      }

      // Upload image
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("artwork-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get image URL
      const { data: { publicUrl } } = supabase.storage
        .from("artwork-images")
        .getPublicUrl(filePath);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Save artwork data
      const { error: insertError } = await supabase
        .from("artworks")
        .insert({
          title,
          artist,
          description: description || null,
          price,
          city_collected: cityCollected || null,
          image_url: publicUrl,
          collector_id: session.user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Artwork added successfully",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Artwork</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist">Artist Name *</Label>
          <Input id="artist" name="artist" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Artwork Image *</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" name="description" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (Optional)</Label>
          <Input id="price" name="price" type="number" step="0.01" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cityCollected">City Collected (Optional)</Label>
          <Input id="cityCollected" name="cityCollected" />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Artwork...
            </>
          ) : (
            "Add Artwork"
          )}
        </Button>
      </form>
    </div>
  );
};