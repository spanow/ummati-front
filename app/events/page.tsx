'use client';

import { useState, useEffect } from 'react';
import { SearchFilters } from '@/components/common/SearchFilters';
import { EventCard } from '@/components/events/EventCard';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Event, Filters } from '@/types';
import { api } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Calendar, Filter } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 12 });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedFilters = useDebounce(filters, 300);

  const categories = [
    { value: 'mission', label: 'Mission' },
    { value: 'collecte', label: 'Collecte' },
    { value: 'formation', label: 'Formation' },
    { value: 'sensibilisation', label: 'Sensibilisation' },
    { value: 'autre', label: 'Autre' },
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.events.getAll(debouncedFilters);
      
      // Vérifications de sécurité
      if (response && typeof response === 'object') {
        // Si la réponse a une structure paginée
        if ('data' in response && Array.isArray(response.data)) {
          // Convertir les dates string en objets Date
          const processedEvents = response.data.map(event => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            createdAt: new Date(event.createdAt),
          }));
          
          setEvents(processedEvents || []);
          setTotalPages(response.totalPages || 1);
          setTotal(response.total || 0);
        } 
        // Si la réponse est directement un array (fallback pour compatibilité)
        else if (Array.isArray(response)) {
          // Convertir les dates string en objets Date
          const processedEvents = response.map(event => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            createdAt: new Date(event.createdAt),
          }));
          
          setEvents(processedEvents);
          setTotalPages(1);
          setTotal(processedEvents.length);
        }
        // Sinon, structure inattendue
        else {
          console.warn('Structure de réponse inattendue:', response);
          setEvents([]);
          setTotalPages(1);
          setTotal(0);
        }
      } else {
        console.warn('Réponse invalide:', response);
        setEvents([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      setEvents([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [debouncedFilters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  const hasActiveFilters = filters.search || filters.category || filters.city;

  // Si erreur, afficher un message d'erreur
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchEvents}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Événements de bénévolat
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les opportunités de bénévolat près de chez vous et rejoignez des missions qui vous correspondent.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            placeholder="Rechercher un événement..."
            showCityFilter={true}
          />
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? (
                'Chargement...'
              ) : (
                <>
                  {total} événement{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                  {hasActiveFilters && ' avec les filtres appliqués'}
                </>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Triés par date</span>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Chargement des événements..." />
          </div>
        ) : (events && events.length > 0) ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {filters.page && filters.page < totalPages && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Voir plus d\'événements'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            type="events"
            title={hasActiveFilters ? 'Aucun événement trouvé' : 'Aucun événement disponible'}
            description={
              hasActiveFilters
                ? 'Essayez de modifier vos critères de recherche pour voir plus de résultats.'
                : 'Il n\'y a actuellement aucun événement disponible. Revenez bientôt pour découvrir de nouvelles opportunités.'
            }
            action={
              hasActiveFilters
                ? {
                    label: 'Réinitialiser les filtres',
                    onClick: () => setFilters({ page: 1, limit: 12 }),
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}