'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Email envoyé !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vérifiez votre boîte de réception
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Mail className="h-16 w-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Instructions envoyées
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nous avons envoyé un lien de réinitialisation à{' '}
                    <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Si vous ne recevez pas l'email dans les 5 minutes, vérifiez votre dossier spam.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Link href="/login" className="w-full">
                <Button className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full"
              >
                Renvoyer l'email
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Nous vous enverrons un lien pour créer un nouveau mot de passe
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}