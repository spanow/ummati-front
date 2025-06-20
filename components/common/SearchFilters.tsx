'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Filters } from '@/types';

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  categories: { value: string; label: string }[];
  placeholder?: string;
  showCityFilter?: boolean;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  categories,
  placeholder = 'Rechercher...',
  showCityFilter = true,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value, 
      page: 1 
    });
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({ ...filters, city: value, page: 1 });
  };

  const resetFilters = () => {
    onFiltersChange({ page: 1 });
  };

  const hasActiveFilters = filters.category || filters.city;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
              {[filters.category, filters.city].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Filtres étendus */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtre catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre ville */}
            {showCityFilter && (
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Toutes les villes"
                  value={filters.city || ''}
                  onChange={(e) => handleCityChange(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Réinitialiser</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              Fermer les filtres
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}