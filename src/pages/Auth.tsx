import { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthenticatedUser(session.user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        await handleAuthenticatedUser(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthenticatedUser = async (userId: string) => {
    try {
      // Check if there's pending collector data
      const pendingData = localStorage.getItem('pendingCollectorData');
      if (pendingData) {
        // Update the collector profile with the pending data
        const { error: updateError } = await supabase
          .from('collectors')
          .update(JSON.parse(pendingData))
          .eq('id', userId);

        if (updateError) throw updateError;
        
        // Clear the pending data
        localStorage.removeItem('pendingCollectorData');
      }
      
      // Navigate to profile
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating collector profile:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to Art Collector</h1>
        <p className="text-muted-foreground">Sign in with your email</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg p-6 shadow-sm">
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(37, 99, 235)',
                  brandAccent: 'rgb(29, 78, 216)',
                },
              },
            },
          }}
          providers={[]}
          view="magic_link"
          redirectTo="https://preview--artlinker-hometown-connect.lovable.app/profile"
        />
      </div>
    </div>
  );
};

export default Auth;