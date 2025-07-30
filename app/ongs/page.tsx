'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ONG, Filters } from '@/types';
import { api } from '@/services/api';
import { OngCard } from '@/components/ongs/OngCard';
import { SearchFilters } from '@/components/common/SearchFilters';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { value: 'humanitaire', label: 'Humanitaire' },
  { value: 'environnement', label: 'Environnement' },
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
  { value: 'culture', label: 'Culture' },
  { value: 'sport', label: 'Sport' },
  { value: 'social', label: 'Social' },
];

export default function OngsPage() {
  const searchParams = useSearchParams();
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || undefined,
    city: searchParams.get('city') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
  });

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const fetchOngs = async () => {
      setIsLoading(true);
      try {
        const response = await api.ongs.getAll(debouncedFilters);
        setOngs(response.data);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (error) {
        console.error('Erreur lors du chargement des ONG:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOngs();
  }, [debouncedFilters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Découvrez nos ONG partenaires
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez l'association qui correspond à vos valeurs et rejoignez une communauté engagée.
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
            placeholder="Rechercher une ONG..."
          />
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? (
              'Chargement...'
            ) : (
              `${total} ONG${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Chargement des ONG..." />
          </div>
        ) : ongs.length > 0 ? (
          <>
            {/* Grille des ONG */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {ongs.map((ong) => (
                <OngCard key={ong.id} ong={ong} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Précédent</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    const isCurrentPage = page === filters.page;
                    
                    return (
                      <Button
                        key={page}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={filters.page === totalPages}
                  className="flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            type="ongs"
            title="Aucune ONG trouvée"
            description="Essayez de modifier vos critères de recherche pour trouver des associations qui correspondent à vos attentes."
            action={{
              label: 'Réinitialiser les filtres',
              onClick: () => setFilters({ page: 1, limit: 12 }),
            }}
          />
        )}
      </div>
    </div>
  );
}