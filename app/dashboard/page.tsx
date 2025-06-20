'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/common/StatCard';
import { EventCard } from '@/components/events/EventCard';
import { 
  Calendar, 
  Users, 
  Heart, 
  Clock,
  MapPin,
  Award,
  TrendingUp,
  Plus,
  Bell,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Event } from '@/types';
import { api } from '@/services/api';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.events.getAll({ limit: 3 });
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isVolunteer = user.role === 'volunteer';
  const isOngAdmin = user.role === 'ong_admin';

  const volunteerStats = [
    { icon: Calendar, label: 'Événements participés', value: '12' },
    { icon: Clock, label: 'Heures de bénévolat', value: '48h' },
    { icon: Award, label: 'Missions accomplies', value: '8' },
    { icon: Heart, label: 'Impact créé', value: '156' },
  ];

  const ongStats = [
    { icon: Users, label: 'Bénévoles actifs', value: '67' },
    { icon: Calendar, label: 'Événements organisés', value: '24' },
    { icon: Clock, label: 'Heures coordonnées', value: '340h' },
    { icon: TrendingUp, label: 'Taux de participation', value: '89%' },
  ];

  const stats = isVolunteer ? volunteerStats : ongStats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bonjour, {user.firstName} ! 👋
            </h1>
            <p className="text-gray-600">
              {isVolunteer 
                ? 'Découvrez vos prochaines missions et votre impact.'
                : 'Gérez vos événements et suivez l\'engagement de vos bénévoles.'
              }
            </p>
          </div>
          
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button variant="outline" size="sm">
              <Bell className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Notifications
            </Button>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Paramètres
              </Button>
            </Link>
            {isOngAdmin && (
              <Link href="/admin/events/create">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Créer un événement
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={`stat-${index}`}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              className="hover:shadow-lg transition-shadow duration-200"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <Card>
              <CardHeader className={`flex flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span>
                    {isVolunteer ? 'Événements recommandés' : 'Vos prochains événements'}
                  </span>
                </CardTitle>
                <Link href="/events">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className={`flex items-center justify-between text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.startDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
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
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun événement à venir</p>
                    <Link href="/events" className="mt-2 inline-block">
                      <Button variant="outline" size="sm">
                        Découvrir des événements
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span>Activité récente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {isVolunteer 
                          ? 'Inscription à "Formation premiers secours"'
                          : 'Nouvel événement publié'
                        }
                      </p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {isVolunteer 
                          ? 'Mission "Collecte de vêtements" terminée'
                          : '5 nouveaux bénévoles inscrits'
                        }
                      </p>
                      <p className="text-xs text-gray-500">Hier</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {isVolunteer 
                          ? 'Nouveau badge "Première mission" obtenu'
                          : 'Rapport mensuel généré'
                        }
                      </p>
                      <p className="text-xs text-gray-500">Il y a 3 jours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isVolunteer ? (
                  <>
                    <Link href="/events" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Parcourir les événements
                      </Button>
                    </Link>
                    <Link href="/ongs" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Découvrir les ONG
                      </Button>
                    </Link>
                    <Link href="/profile" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Modifier mon profil
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin/events/create" className="block">
                      <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700">
                        <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Créer un événement
                      </Button>
                    </Link>
                    <Link href="/admin/events" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Gérer mes événements
                      </Button>
                    </Link>
                    <Link href="/admin/volunteers" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Mes bénévoles
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Mon profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-emerald-700">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {isVolunteer ? 'Bénévole' : 'Administrateur ONG'}
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {isVolunteer ? 'Actif' : 'Vérifié'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Conseil du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {isVolunteer 
                    ? 'Complétez votre profil avec vos compétences pour recevoir des recommandations d\'événements personnalisées.'
                    : 'Ajoutez des photos à vos événements pour augmenter le taux de participation de 40% !'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}