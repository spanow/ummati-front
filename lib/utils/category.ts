import { EVENT_CATEGORIES, ONG_CATEGORIES } from '@/lib/constants';

/**
 * Category utility functions
 */

export const getEventCategoryColor = (category: string): string => {
  const colors = {
    mission: 'bg-blue-100 text-blue-800',
    collecte: 'bg-green-100 text-green-800',
    formation: 'bg-purple-100 text-purple-800',
    sensibilisation: 'bg-yellow-100 text-yellow-800',
    autre: 'bg-gray-100 text-gray-800',
  };
  return colors[category as keyof typeof colors] || colors.autre;
};

export const getEventCategoryLabel = (category: string): string => {
  const categoryItem = EVENT_CATEGORIES.find(cat => cat.value === category);
  return categoryItem?.label || 'Autre';
};

export const getOngCategoryColor = (category: string): string => {
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

export const getOngCategoryLabel = (category: string): string => {
  const categoryItem = ONG_CATEGORIES.find(cat => cat.value === category);
  return categoryItem?.label || 'Autre';
};

export const getEventStatusColor = (status: string): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || colors.draft;
};

export const getEventStatusLabel = (status: string): string => {
  const labels = {
    draft: 'Brouillon',
    published: 'Publié',
    ongoing: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  return labels[status as keyof typeof labels] || 'Brouillon';
};