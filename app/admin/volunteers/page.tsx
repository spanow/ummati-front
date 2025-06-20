'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  Star,
  UserPlus,
  Download,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Volunteer } from '@/types';
import usersData from '@/data/users.json';

export default function AdminVolunteersPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ong_admin') {
      window.location.href = '/login';
      return;
    }

    // Simulate loading volunteers data
    const loadVolunteers = async () => {
      try {
        // Filter volunteers from users data
        const volunteerUsers = usersData.filter(u => u.role === 'volunteer') as Volunteer[];
        setVolunteers(volunteerUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des bénévoles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, [isAuthenticated, user]);

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (volunteer.skills && volunteer.skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvailabilityDays = (availability: any) => {
    if (!availability) return 0;
    return Object.values(availability).filter(Boolean).length;
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
              Gestion des bénévoles
            </h1>
            <p className="text-gray-600">
              Gérez votre équipe de bénévoles et suivez leur engagement.
            </p>
          </div>
          
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button variant="outline" size="sm">
              <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Exporter
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <UserPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Inviter un bénévole
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total bénévoles</p>
                  <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(volunteers.length * 0.8)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Heures totales</p>
                  <p className="text-2xl font-bold text-gray-900">1,240h</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un bénévole..."
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

        {/* Volunteers List */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Users className="h-5 w-5" />
              <span>Bénévoles ({filteredVolunteers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredVolunteers.length > 0 ? (
              <div className="space-y-4">
                {filteredVolunteers.map((volunteer) => (
                  <div key={volunteer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={volunteer.avatar} alt={volunteer.firstName} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {getInitials(volunteer.firstName, volunteer.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className={`flex items-center space-x-2 mb-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <h3 className="font-semibold text-gray-900">
                              {volunteer.firstName} {volunteer.lastName}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              Bénévole
                            </Badge>
                          </div>
                          
                          <div className={`flex items-center space-x-4 text-sm text-gray-500 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <Mail className="h-4 w-4" />
                              <span>{volunteer.email}</span>
                            </div>
                            {volunteer.phone && (
                              <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <Phone className="h-4 w-4" />
                                <span>{volunteer.phone}</span>
                              </div>
                            )}
                            {volunteer.location && (
                              <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <MapPin className="h-4 w-4" />
                                <span>{volunteer.location}</span>
                              </div>
                            )}
                          </div>
                          
                          {volunteer.skills && volunteer.skills.length > 0 && (
                            <div className="mt-2">
                              <div className={`flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {volunteer.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {volunteer.skills.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{volunteer.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">
                            {volunteer.availability ? getAvailabilityDays(volunteer.availability) : 0}
                          </p>
                          <p className="text-xs text-gray-500">jours/semaine</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">4.8</p>
                          <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">Note</span>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem>
                              <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              Contacter
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Award className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              Voir profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              Historique
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun bénévole trouvé</p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Réinitialiser la recherche
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}