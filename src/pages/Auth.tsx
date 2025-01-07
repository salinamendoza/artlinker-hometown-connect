import { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase/client';
import { Alert, AlertDescription } from './components/ui/alert';

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      
      if (session) {
        // Check for pending collector data first
        const pendingData = localStorage.getItem('pendingCollectorData');
        if (pendingData) {
          try {
            const { error: updateError } = await supabase
              .from('collectors')
              .update(JSON.parse(pendingData))
              .eq('id', session.user.id);

            if (updateError) throw updateError;
            localStorage.removeItem('pendingCollectorData');
            
            // After updating collector data, get their name for the card
            const { data: collectorData, error: fetchError } = await supabase
              .from('collectors')
              .select('first_name, last_name')
              .eq('id', session.user.id)
              .single();
            
            if (fetchError) throw fetchError;
            
            if (collectorData) {
              navigate('/card', { 
                state: { 
                  name: `${collectorData.first_name} ${collectorData.last_name}`,
                  id: session.user.id 
                }
              });
            }
          } catch (error: any) {
            console.error('Error updating collector profile:', error);
            setErrorMessage(error.message);
          }
        } else {
          // If no pending data, simply redirect to card page
          navigate('/card');
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN' && session) {
        await checkSession();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
        />
      </div>
    </div>
  );
};

export default Auth;
