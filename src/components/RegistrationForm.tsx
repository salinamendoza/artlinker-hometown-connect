import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
  "London",
  "Paris",
  "Berlin",
  "Tokyo",
];

const artMediums = [
  { id: "paintings", label: "Paintings" },
  { id: "sculptures", label: "Sculptures" },
  { id: "photography", label: "Photography" },
  { id: "digital", label: "Digital Art" },
  { id: "prints", label: "Prints" },
  { id: "installation", label: "Installation Art" },
  { id: "mixed", label: "Mixed Media" },
];

const priceRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $50,000",
  "Over $50,000",
];

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    mediums: [] as string[],
    priceRange: "",
    goals: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here we would typically send the data to Supabase
      toast({
        title: "Registration successful!",
        description: "Your collector card is being generated.",
      });
      navigate("/card");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediumToggle = (medium: string) => {
    setFormData((prev) => ({
      ...prev,
      mediums: prev.mediums.includes(medium)
        ? prev.mediums.filter((m) => m !== medium)
        : [...prev.mediums, medium],
    }));
  };

  if (step === 1) {
    return (
      <form className="space-y-6 max-w-md mx-auto p-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Art Collector Registration</h1>
          <p className="text-muted-foreground">Enter your personal information</p>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData({ ...formData, city: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">Continue</Button>
      </form>
    );
  }

  return (
    <form className="space-y-6 max-w-md mx-auto p-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Art Collector Registration</h1>
        <p className="text-muted-foreground">Tell us about your art preferences</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Art Mediums of Interest</Label>
          <div className="grid grid-cols-2 gap-4">
            {artMediums.map((medium) => (
              <div key={medium.id} className="flex items-center space-x-2">
                <Checkbox
                  id={medium.id}
                  checked={formData.mediums.includes(medium.id)}
                  onCheckedChange={() => handleMediumToggle(medium.id)}
                />
                <Label htmlFor={medium.id}>{medium.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceRange">Preferred Price Range</Label>
          <Select
            value={formData.priceRange}
            onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Collection Goals</Label>
          <Input
            id="goals"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="What are your goals as an art collector?"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="w-full">
          Back
        </Button>
        <Button type="submit" className="w-full">
          Complete Registration
        </Button>
      </div>
    </form>
  );
};