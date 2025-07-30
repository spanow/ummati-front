import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  showOngName?: boolean;
}

export function EventCard({ event, showOngName = true }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      mission: 'bg-blue-100 text-blue-800',
      collecte: 'bg-green-100 text-green-800',
      formation: 'bg-purple-100 text-purple-800',
      sensibilisation: 'bg-yellow-100 text-yellow-800',
      autre: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.autre;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      mission: 'Mission',
      collecte: 'Collecte',
      formation: 'Formation',
      sensibilisation: 'Sensibilisation',
      autre: 'Autre',
    };
    return labels[category as keyof typeof labels] || 'Autre';
  };

  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isAlmostFull = spotsLeft <= 3;
  const isFull = spotsLeft <= 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <div className="h-48 bg-gray-200 relative">
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute top-4 left-4">
          <Badge className={getCategoryColor(event.category)}>
            {getCategoryLabel(event.category)}
          </Badge>
        </div>
        {isFull && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive">Complet</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
            <Link href={`/events/${event.id}`}>
              {event.title}
            </Link>
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(event.startDate)} à {formatTime(event.startDate)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{event.city}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {event.currentParticipants} / {event.maxParticipants} participants
            </span>
            {isAlmostFull && !isFull && (
              <Badge variant="outline" className="ml-2 text-xs">
                Plus que {spotsLeft} places
              </Badge>
            )}
          </div>

          {new Date(event.endDate).getTime() - new Date(event.startDate).getTime() > 24 * 60 * 60 * 1000 && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Jusqu'au {formatDate(event.endDate)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/events/${event.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={isFull}
            variant={isFull ? "outline" : "default"}
          >
            {isFull ? 'Événement complet' : 'Voir les détails'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}