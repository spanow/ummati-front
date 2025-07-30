'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { EventRegistrationButton } from '@/components/events/EventRegistrationButton';
import { EventEvaluations } from '@/components/events/EventEvaluations';
import { EventEvaluationForm } from '@/components/events/EventEvaluationForm';
import { api } from '@/services/api';
import { Event, ONG } from '@/types';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

const CATEGORY_COLORS = {
  mission: 'bg-blue-100 text-blue-800',
  collecte: 'bg-green-100 text-green-800',
  formation: 'bg-purple-100 text-purple-800',
  sensibilisation: 'bg-yellow-100 text-yellow-800',
  autre: 'bg-gray-100 text-gray-800',
} as const;

const CATEGORY_LABELS = {
  mission: 'Mission',
  collecte: 'Collecte',
  formation: 'Formation',
  sensibilisation: 'Sensibilisation',
  autre: 'Autre',
} as const;

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [ong, setOng] = useState<ONG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const eventData = await api.events.getById(params.id);
        setEvent(eventData);

        // Fetch ONG data
        if (eventData.ongId) {
          try {
            const ongData = await api.ongs.getById(eventData.ongId);
            setOng(ongData);
          } catch (ongError) {
            console.error('Error fetching ONG data:', ongError);
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Événement non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    notFound();
  }
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.autre;
  };

  const getCategoryLabel = (category: string): string => {
    return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || CATEGORY_LABELS.autre;
  };

  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isAlmostFull = spotsLeft <= 3;
  const isFull = spotsLeft <= 0;
  const isMultiDay = event.endDate.getTime() - event.startDate.getTime() > 24 * 60 * 60 * 1000;
  const isEventCompleted = event.endDate.getTime() < new Date().getTime();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4">
          <Link href="/events">
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux événements
            </Button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className={getCategoryColor(event.category)}>
            {getCategoryLabel(event.category)}
          </Badge>
          {isFull && (
            <Badge variant="destructive">Complet</Badge>
          )}
          {isAlmostFull && !isFull && (
            <Badge variant="outline" className="bg-white/90">
              Plus que {spotsLeft} places
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and description */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* ONG information */}
            {ong && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>Organisé par</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {ong.logo && (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={ong.logo}
                          alt={`${ong.name} logo`}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{ong.name}</h3>
                      <p className="text-sm text-gray-600">{ong.description}</p>
                      <Link href={`/ongs/${ong.id}`} className="text-primary hover:underline text-sm">
                        Voir le profil de l'ONG
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Prérequis et informations importantes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={`requirement-${index}`} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Evaluation Form - Only show if event is completed */}
            {isEventCompleted && (
              <EventEvaluationForm
                eventId={event.id}
                eventTitle={event.title}
              />
            )}

            {/* Evaluations */}
            <EventEvaluations eventId={event.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Practical information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and time */}
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      De {formatTime(event.startDate)} à {formatTime(event.endDate)}
                    </p>
                    {isMultiDay && (
                      <p className="text-sm text-gray-600">
                        Jusqu'au {formatDate(event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                    <p className="text-sm text-gray-600">{event.address}</p>
                    <p className="text-sm text-gray-600">{event.city}</p>
                  </div>
                </div>

                <Separator />

                {/* Participants */}
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.currentParticipants} / {event.maxParticipants} participants
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(event.currentParticipants / event.maxParticipants) * 100}%` 
                        }}
                      />
                    </div>
                    {spotsLeft > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {spotsLeft} place{spotsLeft > 1 ? 's' : ''} restante{spotsLeft > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {!isEventCompleted && (
                <EventRegistrationButton 
                  eventId={event.id}
                  isFull={isFull}
                  className="w-full"
                />
              )}
              
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Partager l'événement
              </Button>
            </div>

            {/* Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {isEventCompleted ? 'Événement terminé' : 'Événement confirmé'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Créé le {formatDate(event.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}