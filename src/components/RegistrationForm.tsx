import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { PreferencesStep } from "./registration/PreferencesStep";

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

  const handleSubmit = async () => {
    try {
      // First, save the collector data
      const { error: collectorError } = await supabase
        .from('collectors')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          city: formData.city,
          preferences: {
            mediums: formData.mediums,
            priceRange: formData.priceRange,
            goals: formData.goals
          }
        })
        .eq('email', formData.email);

      if (collectorError) throw collectorError;

      // Then send the magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (authError) throw authError;

      toast({
        title: "Registration successful!",
        description: "Please check your email for the magic link to complete your registration.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (step === 1) {
    return (
      <form className="space-y-6 max-w-md mx-auto p-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <PersonalInfoStep
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(2)}
        />
      </form>
    );
  }

  return (
    <form className="space-y-6 max-w-md mx-auto p-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <PreferencesStep
        formData={formData}
        setFormData={setFormData}
        onBack={() => setStep(1)}
        onSubmit={handleSubmit}
      />
    </form>
  );
};