import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileErrorProps {
  message: string;
}

export const ProfileError = ({ message }: ProfileErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-8">
      <div className="bg-destructive/10 text-destructive rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Error Loading Profile</h2>
        <p>{message}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')}
          className="bg-white hover:bg-white/90"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
};