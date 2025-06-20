'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useEffect as useEffectHook, useState as useStateHook } from 'react';
import { Event } from '@/types';
import { api } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminEventsPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ong_admin') {
      window.location.href = '/login';
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.events.getAll({ limit: 100 });
        // Filter events created by this admin (in a real app, this would be done server-side)
        const adminEvents = response.data.filter(event => event.createdBy === user.id);
        setEvents(adminEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, user]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status as keyof typeof labels] || 'Brouillon';
  };

  if (!isAuthenticated || user?.role !== 'ong_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes événements
            </h1>
            <p className="text-gray-600">
              Gérez tous vos événements et suivez leur performance.
            </p>
          </div>
          
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link href="/admin/events/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Créer un événement
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total événements</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Événements publiés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => e.status === 'published').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.reduce((sum, event) => sum + event.currentParticipants, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de remplissage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.length > 0 
                      ? Math.round((events.reduce((sum, event) => sum + event.currentParticipants, 0) / 
                          events.reduce((sum, event) => sum + event.maxParticipants, 0)) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge className={getCategoryColor(event.category)}>
                          {getCategoryLabel(event.category)}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                          <MapPin className="h-4 w-4" />
                          <span>{event.city}</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                          <Users className="h-4 w-4" />
                          <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                          <DropdownMenuItem>
                            <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Aucun événement ne correspond à votre recherche.'
                  : 'Vous n\'avez pas encore créé d\'événement.'
                }
              </p>
              {!searchTerm && (
                <Link href="/admin/events/create">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    Créer mon premier événement
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}