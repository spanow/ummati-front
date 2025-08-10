'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Award, 
  Star,
  MapPin,
  Clock,
  Plus,
  X,
  Edit,
  Save,
  Camera,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils/format';
import { formatDate } from '@/lib/utils/date';
import { getEventCategoryColor, getEventCategoryLabel } from '@/lib/utils/category';

/** Debounce hook pour éviter de spam l’API pendant la saisie */
function useDebounce<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface Participation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: Date;
  eventLocation: string;
  eventCity: string;
  status: 'registered' | 'attended' | 'cancelled' | 'no_show';
  hoursContributed: number;
  rating?: number;
  feedback?: string;
  organizerRating?: number;
  organizerFeedback?: string;
}

interface Evaluation {
  id: string;
  eventId: string;
  eventTitle: string;
  participantId: string;
  participantName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  isPublic: boolean;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike';
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loadingParticipations, setLoadingParticipations] = useState(true);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: [] as string[],
    avatar: '',
    /** optionnel mais pratique pour sauvegarder côté back */
    wilayaId: undefined as number | undefined,
    cityId: undefined as number | undefined,
  });

  /** --- Autocomplete Localisation (backend) --- */
  const [wilayas, setWilayas] = useState<{id:number; name:string}[]>([]);
  const [selectedWilayaId, setSelectedWilayaId] = useState<number | ''>('');
  const [locQuery, setLocQuery] = useState('');
  const debouncedLocQuery = useDebounce(locQuery, 250);
  const [citySuggestions, setCitySuggestions] = useState<
    { id:number; name:string; wilayaId:number; wilayaName:string }[]
  >([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        bio: (user as any).bio || '',
        location: (user as any).location || '',
        skills: (user as any).skills || [],
        avatar: user.avatar || '',
        wilayaId: (user as any).wilayaId,   // si tu les enregistres côté back
        cityId: (user as any).cityId,
      }));
    }

    // Load participations & evaluations (mock)
    loadParticipations();
    loadEvaluations();
  }, [isAuthenticated, user, router]);

  // Charger la liste des wilayas au montage
  useEffect(() => {
    fetch('http://localhost:8080/api/locations/wilayas')
      .then(r => r.json())
      .then(setWilayas)
      .catch(console.error);
  }, []);

  // Rechercher des villes au fil de la frappe (avec filtre wilaya optionnel)
  useEffect(() => {
    if (!debouncedLocQuery || debouncedLocQuery.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({ q: debouncedLocQuery });
    if (selectedWilayaId) params.set('wilayaId', String(selectedWilayaId));
    fetch(`http://localhost:8080/api/locations/cities/search?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setCitySuggestions)
      .catch(e => { if (e.name !== 'AbortError') console.error(e); });
    return () => controller.abort();
  }, [debouncedLocQuery, selectedWilayaId]);

  const loadParticipations = async () => {
    try {
      // Mock
      const mockParticipations: Participation[] = [
        {
          id: '1',
          eventId: '1',
          eventTitle: 'Formation premiers secours - Session janvier',
          eventCategory: 'formation',
          eventDate: new Date('2024-02-15'),
          eventLocation: 'Centre de formation Croix-Rouge',
          eventCity: 'Paris',
          status: 'attended',
          hoursContributed: 16,
          rating: 5,
          feedback: 'Formation excellente, très bien organisée !',
          organizerRating: 4,
          organizerFeedback: 'Participant très engagé et ponctuel.',
        },
        {
          id: '2',
          eventId: '2',
          eventTitle: "Collecte de vêtements d'hiver",
          eventCategory: 'collecte',
          eventDate: new Date('2024-02-20'),
          eventLocation: "Entrepôt Croix-Rouge",
          eventCity: 'Paris',
          status: 'attended',
          hoursContributed: 8,
          rating: 4,
          feedback: "Bonne organisation, travail d'équipe efficace.",
          organizerRating: 5,
          organizerFeedback: 'Excellent bénévole, très motivé !',
        },
        {
          id: '3',
          eventId: '3',
          eventTitle: 'Service repas - Centre Bastille',
          eventCategory: 'mission',
          eventDate: new Date('2024-03-10'),
          eventLocation: 'Centre Restos du Cœur Bastille',
          eventCity: 'Paris',
          status: 'registered',
          hoursContributed: 0,
        },
      ];
      setParticipations(mockParticipations);
    } catch (error) {
      console.error('Erreur lors du chargement des participations:', error);
    } finally {
      setLoadingParticipations(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      // Mock
      const mockEvaluations: Evaluation[] = [
        {
          id: '1',
          eventId: '1',
          eventTitle: 'Formation premiers secours - Session janvier',
          participantId: '2',
          participantName: 'Marie Dupont',
          rating: 5,
          comment: 'Formation excellente ! Les formateurs étaient très pédagogues et les exercices pratiques vraiment utiles.',
          createdAt: new Date('2024-02-16'),
          isPublic: true,
          likes: 12,
          dislikes: 0,
          userReaction: 'like',
        },
        {
          id: '2',
          eventId: '2',
          eventTitle: "Collecte de vêtements d'hiver",
          participantId: '4',
          participantName: 'Pierre Durand',
          rating: 4,
          comment: "Très bonne organisation de la collecte. L'équipe était motivée et l'ambiance excellente.",
          createdAt: new Date('2024-02-22'),
          isPublic: true,
          likes: 8,
          dislikes: 1,
        },
        {
          id: '3',
          eventId: '1',
          eventTitle: 'Formation premiers secours - Session janvier',
          participantId: '5',
          participantName: 'Sophie Martin',
          rating: 5,
          comment: "Une formation indispensable ! J'ai appris énormément de choses.",
          createdAt: new Date('2024-02-17'),
          isPublic: true,
          likes: 15,
          dislikes: 0,
        },
      ];
      setEvaluations(mockEvaluations);
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setProfileData(prev => ({ ...prev, [field]: value as any }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData as any); // inclut wilayaId/cityId éventuellement
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      attended: 'bg-green-100 text-green-800',
      registered: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.registered;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      attended: 'Participé',
      registered: 'Inscrit',
      cancelled: 'Annulé',
      no_show: 'Absent',
    };
    return labels[status as keyof typeof labels] || 'Inscrit';
  };

  const totalHours = participations
    .filter(p => p.status === 'attended')
    .reduce((sum, p) => sum + p.hoursContributed, 0);

  const averageRating = participations
    .filter(p => p.organizerRating)
    .reduce((sum, p, _, arr) => sum + (p.organizerRating || 0) / arr.length, 0);

  const handleEvaluationReaction = (evaluationId: string, reaction: 'like' | 'dislike') => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.id === evaluationId) {
        const currentReaction = evaluation.userReaction;
        let newLikes = evaluation.likes;
        let newDislikes = evaluation.dislikes;
        let newReaction: 'like' | 'dislike' | undefined = reaction;

        if (currentReaction === 'like') newLikes--;
        if (currentReaction === 'dislike') newDislikes--;

        if (currentReaction === reaction) {
          newReaction = undefined;
        } else {
          if (reaction === 'like') newLikes++;
          if (reaction === 'dislike') newDislikes++;
        }

        return {
          ...evaluation,
          likes: newLikes,
          dislikes: newDislikes,
          userReaction: newReaction,
        };
      }
      return evaluation;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.avatar} alt={user.firstName} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={() => toast.info('Fonctionnalité à venir')}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">
                  {user.role === 'volunteer' ? 'Bénévole' : 'Administrateur ONG'}
                </p>
                {profileData.location && (
                  <div className={`flex items-center space-x-1 text-gray-500 mt-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                      <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    )}
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {user.role === 'volunteer' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {participations.filter(p => p.status === 'attended').length}
                </p>
                <p className="text-sm text-gray-600">Événements participés</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
                <p className="text-sm text-gray-600">Heures de bénévolat</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{profileData.skills.length}</p>
                <p className="text-sm text-gray-600">Compétences</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* -------- Localisation avec autocomplete (wilaya + ville) -------- */}
                <div className="space-y-2 relative">
                  <Label htmlFor="location">Localisation</Label>

                  {/* Filtre wilaya (optionnel) */}
                  <select
                    className="w-full border p-2 rounded mb-2"
                    disabled={!isEditing}
                    value={selectedWilayaId}
                    onChange={(e) => setSelectedWilayaId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">— Toutes les wilayas —</option>
                    {wilayas.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>

                  {/* Champ ville avec suggestions */}
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => {
                      handleInputChange('location', e.target.value);
                      setLocQuery(e.target.value);
                    }}
                    disabled={!isEditing}
                    placeholder="Tape une ville…"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    autoComplete="off"
                  />

                  {isEditing && citySuggestions.length > 0 && (
                    <ul className="absolute z-20 bg-white border rounded shadow w-full max-h-64 overflow-y-auto mt-1">
                      {citySuggestions.map(s => (
                        <li
                          key={s.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            // hydrate l’affichage + stocke les IDs
                            handleInputChange('location', `${s.wilayaName}, ${s.name}`);
                            handleInputChange('wilayaId', s.wilayaId);
                            handleInputChange('cityId', s.id);
                            setLocQuery(s.name);
                            setCitySuggestions([]);
                            setSelectedWilayaId(s.wilayaId);
                          }}
                        >
                          {s.wilayaName}, {s.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* ---------------------------------------------------------------- */}

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Parlez-nous de vous, vos motivations, votre expérience..."
                    rows={4}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Mes compétences</CardTitle>
                <CardDescription>
                  Ajoutez vos compétences pour recevoir des recommandations personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing && (
                  <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Ajouter une compétence..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Button onClick={addSkill} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <Label>Compétences actuelles :</Label>
                  {profileData.skills.length > 0 ? (
                    <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Aucune compétence ajoutée. {isEditing && 'Commencez par en ajouter une !'}
                    </p>
                  )}
                </div>

                {!isEditing && profileData.skills.length === 0 && (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Ajoutez vos compétences pour améliorer votre profil
                    </p>
                    <Button onClick={() => setIsEditing(true)}>
                      Ajouter des compétences
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des participations</CardTitle>
                <CardDescription>
                  Votre historique complet d'événements et de missions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingParticipations ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : participations.length > 0 ? (
                  <div className="space-y-4">
                    {participations.map((participation) => (
                      <div key={participation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <h4 className="font-semibold text-gray-900">{participation.eventTitle}</h4>
                              <Badge className={getEventCategoryColor(participation.eventCategory)}>
                                {getEventCategoryLabel(participation.eventCategory)}
                              </Badge>
                              <Badge className={getStatusColor(participation.status)}>
                                {getStatusLabel(participation.status)}
                              </Badge>
                            </div>
                            
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3 ${isRTL ? 'text-right' : ''}`}>
                              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(participation.eventDate)}</span>
                              </div>
                              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <MapPin className="h-4 w-4" />
                                <span>{participation.eventCity}</span>
                              </div>
                              {participation.status === 'attended' && (
                                <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                  <Clock className="h-4 w-4" />
                                  <span>{participation.hoursContributed}h contribuées</span>
                                </div>
                              )}
                            </div>

                            {participation.status === 'attended' && (
                              <div className="space-y-3 mt-4">
                                {participation.rating && (
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className={`flex items-center space-x-2 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span className="font-medium text-sm">Ma note : {participation.rating}/5</span>
                                    </div>
                                    {participation.feedback && (
                                      <p className="text-sm text-gray-700">{participation.feedback}</p>
                                    )}
                                  </div>
                                )}

                                {participation.organizerRating && (
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <div className={`flex items-center space-x-2 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                      <Award className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">Note de l'organisateur : {participation.organizerRating}/5</span>
                                    </div>
                                    {participation.organizerFeedback && (
                                      <p className="text-sm text-gray-700">{participation.organizerFeedback}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune participation pour le moment</p>
                    <p className="text-sm mt-2">Inscrivez-vous à des événements pour commencer votre historique !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations publiques</CardTitle>
                <CardDescription>
                  Commentaires et évaluations des participants sur les événements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEvaluations ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : evaluations.length > 0 ? (
                  <div className="space-y-6">
                    {evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="border rounded-lg p-4 bg-white">
                        <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <h4 className="font-semibold text-gray-900">{evaluation.eventTitle}</h4>
                              <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < evaluation.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Par {evaluation.participantName} • {formatDate(evaluation.createdAt)}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">{evaluation.comment}</p>

                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEvaluationReaction(evaluation.id, 'like')}
                              className={`${
                                evaluation.userReaction === 'like'
                                  ? 'text-green-600 bg-green-50'
                                  : 'text-gray-500'
                              }`}
                            >
                              <ThumbsUp className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {evaluation.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEvaluationReaction(evaluation.id, 'dislike')}
                              className={`${
                                evaluation.userReaction === 'dislike'
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-gray-500'
                              }`}
                            >
                              <ThumbsDown className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {evaluation.dislikes}
                            </Button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                            Public
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune évaluation publique pour le moment</p>
                    <p className="text-sm mt-2">Les évaluations des participants apparaîtront ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
