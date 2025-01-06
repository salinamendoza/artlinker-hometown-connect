import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PreferencesStepProps {
  formData: {
    mediums: string[];
    priceRange: string;
    goals: string;
  };
  setFormData: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

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

export const PreferencesStep = ({ formData, setFormData, onBack, onSubmit }: PreferencesStepProps) => {
  const handleMediumToggle = (medium: string) => {
    setFormData((prev: any) => ({
      ...prev,
      mediums: prev.mediums.includes(medium)
        ? prev.mediums.filter((m: string) => m !== medium)
        : [...prev.mediums, medium],
    }));
  };

  return (
    <div className="space-y-6">
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
        <Button variant="outline" onClick={onBack} className="w-full">
          Back
        </Button>
        <Button onClick={onSubmit} className="w-full">
          Complete Registration
        </Button>
      </div>
    </div>
  );
};