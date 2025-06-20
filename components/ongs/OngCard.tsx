import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ONG } from '@/types';
import { MapPin, Users, Calendar, ExternalLink } from 'lucide-react';

interface OngCardProps {
  ong: ONG;
}

export function OngCard({ ong }: OngCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      humanitaire: 'bg-red-100 text-red-800',
      environnement: 'bg-green-100 text-green-800',
      education: 'bg-blue-100 text-blue-800',
      sante: 'bg-purple-100 text-purple-800',
      culture: 'bg-pink-100 text-pink-800',
      sport: 'bg-orange-100 text-orange-800',
      social: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      humanitaire: 'Humanitaire',
      environnement: 'Environnement',
      education: 'Éducation',
      sante: 'Santé',
      culture: 'Culture',
      sport: 'Sport',
      social: 'Social',
    };
    return labels[category as keyof typeof labels] || 'Autre';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 relative flex items-center justify-center">
          {ong.logo ? (
            <div className="relative w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
              <Image
                src={ong.logo}
                alt={`${ong.name} logo`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {ong.acronym || ong.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <Badge className={getCategoryColor(ong.category)}>
            {getCategoryLabel(ong.category)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
            <Link href={`/ongs/${ong.id}`}>
              {ong.name}
            </Link>
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">{ong.description}</p>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{ong.city}, {ong.country}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{ong.stats.totalVolunteers.toLocaleString()} bénévoles</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{ong.stats.totalEvents} événements</span>
          </div>

          {ong.website && (
            <div className="flex items-center text-sm text-primary">
              <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
              <a 
                href={ong.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                Site web
              </a>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-x-2">
        <Link href={`/ongs/${ong.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Découvrir
          </Button>
        </Link>
        <Link href={`/ongs/${ong.id}`} className="flex-1">
          <Button className="w-full">
            Rejoindre
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}