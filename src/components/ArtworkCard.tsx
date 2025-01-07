import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtworkCardProps {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

export const ArtworkCard = ({ id, title, artist, imageUrl }: ArtworkCardProps) => {
  return (
    <Link to={`/artwork/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{artist}</p>
        </CardHeader>
      </Card>
    </Link>
  );
};