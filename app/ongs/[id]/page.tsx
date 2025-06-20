import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  Clock,
  ExternalLink,
  Heart,
  ArrowLeft
} from 'lucide-react';
import ongsData from '@/data/ongs.json';
import eventsData from '@/data/events.json';
import { ONG, Event } from '@/types';

// Generate static params for all ONGs
export async function generateStaticParams() {
  return ongsData.map((ong) => ({
    id: ong.id.toString(),
  }));
}

interface OngDetailPageProps {
  params: {
    id: string;
  };
}

export default function OngDetailPage({ params }: OngDetailPageProps) {
  const ong = ongsData.find(o => o.id === params.id) as ONG | undefined;
  
  if (!ong) {
    notFound();
  }

  // Get events for this ONG
  const ongEvents = eventsData
    .filter(event => event.ongId === ong.id)
    .map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
    })) as Event[];

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/ongs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux ONG
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Logo et infos principales */}
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                {ong.logo ? (
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={ong.logo}
                      alt={`${ong.name} logo`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {ong.acronym || ong.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{ong.name}</h1>
                  <Badge className={getCategoryColor(ong.category)}>
                    {getCategoryLabel(ong.category)}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{ong.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{ong.city}, {ong.country}</span>
                  </div>
                  {ong.website && (
                    <a 
                      href={ong.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Site web</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3 lg:flex-shrink-0">
              <Button size="lg" className="w-full lg:w-auto">
                <Heart className="h-4 w-4 mr-2" />
                Rejoindre cette ONG
              </Button>
              <Button variant="outline" size="lg" className="w-full lg:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle>Notre mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{ong.mission}</p>
              </CardContent>
            </Card>

            {/* Événements à venir */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Événements à venir</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ongEvents.length > 0 ? (
                  <div className="space-y-4">
                    {ongEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.city}</span>
                            </div>
                          </div>
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {ongEvents.length > 3 && (
                      <div className="text-center pt-4">
                        <Link href={`/events?ong=${ong.id}`}>
                          <Button variant="outline">
                            Voir tous les événements ({ongEvents.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun événement programmé pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>En chiffres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bénévoles</span>
                  </div>
                  <span className="font-semibold">{ong.stats.totalVolunteers.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Événements</span>
                  </div>
                  <span className="font-semibold">{ong.stats.totalEvents}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Heures de bénévolat</span>
                  </div>
                  <span className="font-semibold">{ong.stats.totalHours.toLocaleString()}h</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${ong.email}`} className="text-primary hover:underline">
                      {ong.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <a href={`tel:${ong.phone}`} className="text-primary hover:underline">
                      {ong.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="text-gray-900">
                      {ong.address}<br />
                      {ong.postalCode} {ong.city}<br />
                      {ong.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statut de vérification */}
            <Card>
              <CardHeader>
                <CardTitle>Vérification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {ong.documentsVerified ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">Organisation vérifiée</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-700">En cours de vérification</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}