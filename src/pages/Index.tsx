import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Connect with Local Artists
        </h1>
        <p className="text-xl text-muted-foreground">
          Join our community of art collectors and discover amazing local artists in your city.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/register")}>
            Register as Collector
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/artist-signup")}>
            I'm an Artist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;