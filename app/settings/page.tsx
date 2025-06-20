'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { currentLanguage, setLanguage, t, isRTL } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    weeklyDigest: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(profileData);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Mot de passe mis à jour avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Paramètres de notification mis à jour');
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    toast.success('Paramètres de confidentialité mis à jour');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Settings className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          <p className="text-gray-600">
            Gérez vos préférences de compte et de confidentialité
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <User className="h-5 w-5" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? (
                    <>
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Shield className="h-5 w-5" />
                <span>Sécurité</span>
              </CardTitle>
              <CardDescription>
                Modifiez votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 hover:bg-transparent`}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 hover:bg-transparent`}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 hover:bg-transparent`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? (
                    <>
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      Mettre à jour le mot de passe
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Globe className="h-5 w-5" />
                <span>Langue et région</span>
              </CardTitle>
              <CardDescription>
                Choisissez votre langue préférée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as any)}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-gray-500">
                    Recevez des notifications par email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-gray-500">
                    Recevez des notifications push sur votre appareil
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Rappels d'événements</Label>
                  <p className="text-sm text-gray-500">
                    Recevez des rappels avant vos événements
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.eventReminders}
                  onCheckedChange={(checked) => handleNotificationChange('eventReminders', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Résumé hebdomadaire</Label>
                  <p className="text-sm text-gray-500">
                    Recevez un résumé de vos activités chaque semaine
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Shield className="h-5 w-5" />
                <span>Confidentialité</span>
              </CardTitle>
              <CardDescription>
                Contrôlez la visibilité de vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Profil visible</Label>
                  <p className="text-sm text-gray-500">
                    Permettre aux autres utilisateurs de voir votre profil
                  </p>
                </div>
                <Switch
                  checked={privacySettings.profileVisible}
                  onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Afficher l'email</Label>
                  <p className="text-sm text-gray-500">
                    Permettre aux autres de voir votre adresse email
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-0.5">
                  <Label>Afficher le téléphone</Label>
                  <p className="text-sm text-gray-500">
                    Permettre aux autres de voir votre numéro de téléphone
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showPhone}
                  onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  La suppression de votre compte est définitive et ne peut pas être annulée. 
                  Toutes vos données seront supprimées de manière permanente.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button variant="destructive" onClick={() => toast.error('Fonctionnalité non implémentée')}>
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}