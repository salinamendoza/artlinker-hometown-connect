import { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { AuthError } from '@supabase/supabase-js';

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/profile');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/profile');
      }
      if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
      if (event === 'SIGNED_OUT') {
        setErrorMessage('');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email. Please check your email address and try again.';
      case 'Email not confirmed':
        return 'Please check your email for the magic link to sign in.';
      default:
        if (error.message.includes('email_provider_disabled')) {
          return 'Email authentication is not enabled. Please contact the administrator.';
        }
        return error.message;
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
          redirectTo={window.location.origin + '/auth'}
        />
      </div>
    </div>
  );
};

export default Auth;