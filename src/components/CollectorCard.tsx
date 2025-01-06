import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CollectorCardProps {
  name: string;
  id: string;
}

export const CollectorCard = ({ name, id }: CollectorCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Art Collector Registration</h1>
        <p className="text-muted-foreground">Your card is ready!</p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-xl font-semibold">Your Art Collector Card</h2>
        
        <div
          className={`flip-card w-[350px] h-[200px] cursor-pointer ${isFlipped ? "flipped" : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className="w-full h-full bg-primary text-primary-foreground rounded-xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-sm">Art Collector Card</span>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded-full" />
                    <div className="w-4 h-4 bg-white/20 rounded-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg font-mono">{id}</div>
                  <div>
                    <div className="text-sm">Card Member</div>
                    <div className="text-lg font-semibold">{name}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card-back">
              <div className="w-full h-full bg-accent text-accent-foreground rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-sm">Member Since</div>
                  <div className="font-mono">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Authorized Signature</div>
                  <div className="font-serif italic">{name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Click card to flip</p>

        <Button onClick={() => navigate("/profile")} className="w-full">
          Go to Profile
        </Button>
      </div>
    </div>
  );
};