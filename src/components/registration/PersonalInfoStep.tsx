import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

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

export const PersonalInfoStep = ({ formData, setFormData, onNext }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
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

      <Button 
        type="button" 
        className="w-full"
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
};