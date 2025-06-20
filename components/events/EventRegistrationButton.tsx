'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventRegistrationButtonProps {
  eventId: string;
  isFull: boolean;
  className?: string;
}

export function EventRegistrationButton({ eventId, isFull, className }: EventRegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleRegistration = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Inscription confirmée !', 'Vous êtes maintenant inscrit à cet événement.');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription', 'Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFull) {
    return (
      <Button variant="outline" disabled className={className}>
        Événement complet
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleRegistration}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Inscription...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'S\'inscrire à l\'événement' : 'Se connecter pour s\'inscrire'}
        </>
      )}
    </Button>
  );
}