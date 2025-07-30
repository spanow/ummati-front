'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Loader2, Save, Eye } from 'lucide-react';
import { api } from '@/services/api';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  address: string;
  city: string;
  maxParticipants: number;
  requirements: string[];
  image: string;
  status: 'draft' | 'published';
}

export default function CreateEventPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    address: '',
    city: '',
    maxParticipants: 10,
    requirements: [],
    image: '',
    status: 'draft',
  });

  const [requirementInput, setRequirementInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle redirect on client side only
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Don't render if not authenticated or not an ONG admin
  if (!isAuthenticated || !user) {
    return null;
  }

  const categories = [
    { value: 'mission', label: 'Mission' },
    { value: 'collecte', label: 'Collecte' },
    { value: 'formation', label: 'Formation' },
    { value: 'sensibilisation', label: 'Sensibilisation' },
    { value: 'autre', label: 'Autre' },
  ];

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      return false;
    }
    if (!formData.category) {
      setError('La catégorie est obligatoire');
      return false;
    }
    if (!formData.startDate || !formData.startTime) {
      setError('La date et heure de début sont obligatoires');
      return false;
    }
    if (!formData.endDate || !formData.endTime) {
      setError('La date et heure de fin sont obligatoires');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Le lieu est obligatoire');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ville est obligatoire');
      return false;
    }
    if (formData.maxParticipants < 1) {
      setError('Le nombre maximum de participants doit être supérieur à 0');
      return false;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      setError('La date de fin doit être postérieure à la date de début');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        ongId: user.id, // Assuming user ID is the ONG ID for admins
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        startDate: startDateTime,
        endDate: endDateTime,
        location: formData.location,
        address: formData.address,
        city: formData.city,
        maxParticipants: formData.maxParticipants,
        requirements: formData.requirements.length > 0 ? formData.requirements : undefined,
        image: formData.image || undefined,
        status: isDraft ? 'draft' : 'published',
        createdBy: user.id,
      };

      await api.events.create(eventData);
      
      toast.success(
        isDraft ? 'Brouillon sauvegardé !' : 'Événement créé avec succès !',
        isDraft ? 'Votre événement a été sauvegardé en brouillon.' : 'Votre événement est maintenant publié et visible par les bénévoles.'
      );
      
      router.push('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link href="/admin/events">
              <Button variant="ghost" size="sm">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Retour aux événements
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créer un événement</h1>
              <p className="text-gray-600">Organisez une nouvelle mission pour vos bénévoles</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Calendar className="h-5 w-5 text-primary" />
                <span>Informations générales</span>
              </CardTitle>
              <CardDescription>
                Décrivez votre événement et ses objectifs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Titre de l'événement *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Formation premiers secours"
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez en détail votre événement, ses objectifs et ce que les bénévoles vont faire..."
                    rows={4}
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Nombre max de participants *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="image">URL de l'image (optionnel)</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date et heure */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Clock className="h-5 w-5 text-primary" />
                <span>Date et heure</span>
              </CardTitle>
              <CardDescription>
                Définissez quand aura lieu votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="startTime">Heure de début *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">Heure de fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lieu */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <MapPin className="h-5 w-5 text-primary" />
                <span>Lieu</span>
              </CardTitle>
              <CardDescription>
                Où se déroulera votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="location">Nom du lieu *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: Centre communautaire, Siège de l'association..."
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Ex: 123 rue de la République"
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ex: Paris"
                    className="mt-1"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prérequis */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Users className="h-5 w-5 text-primary" />
                <span>Prérequis et informations importantes</span>
              </CardTitle>
              <CardDescription>
                Ajoutez des informations importantes pour les bénévoles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Ex: Âge minimum 18 ans, Apporter une pièce d'identité..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <Button type="button" onClick={addRequirement} variant="outline">
                    Ajouter
                  </Button>
                </div>

                {formData.requirements.length > 0 && (
                  <div className="space-y-2">
                    <Label>Prérequis ajoutés :</Label>
                    <div className="space-y-2">
                      {formData.requirements.map((requirement, index) => (
                        <div key={index} className={`flex items-center justify-between bg-gray-50 p-3 rounded-md ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm">{requirement}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardFooter className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/admin/events">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>

              <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  Sauvegarder en brouillon
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  Publier l'événement
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}