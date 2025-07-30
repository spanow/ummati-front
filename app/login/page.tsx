'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {user,isAuthenticated} = useAuth();
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); 
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <LoadingSpinner />; // Attendre l'initialisation
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {t('loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('loginSubtitle')}
          </p>
        </div>

        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle>{t('loginTitle')}</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
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
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 hover:bg-transparent`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    Connexion...
                  </>
                ) : (
                  t('login')
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {t('noAccountYet')}{' '}
                <Link href="/register" className="text-emerald-600 hover:underline">
                  {t('register')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Comptes de démonstration */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-800">Comptes de démonstration</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-700 space-y-2">
            <div>
              <strong>Bénévole :</strong> marie.volunteer@example.com / password123
            </div>
            <div>
              <strong>Admin ONG :</strong> ong.admin@croixrouge.fr / password123
            </div>
            <div>
              <strong>Super Admin :</strong> admin@example.com / password123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}