import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { PreferencesStep } from "./registration/PreferencesStep";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // First, send the magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (authError) {
        if (authError.message.includes('rate_limit')) {
          throw new Error("Please wait a moment before requesting another magic link.");
        }
        throw authError;
      }

      // Store form data in localStorage to be used after authentication
      localStorage.setItem('pendingCollectorData', JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        city: formData.city,
        preferences: {
          mediums: formData.mediums,
          priceRange: formData.priceRange,
          goals: formData.goals
        }
      }));

      toast({
        title: "Registration started!",
        description: "Please check your email for the magic link to complete your registration.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
      />
    </form>
  );
};