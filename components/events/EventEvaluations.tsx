'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Filter,
  TrendingUp
} from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { getInitials } from '@/lib/utils/format';

interface Evaluation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike';
  isVerified: boolean;
}

interface EventEvaluationsProps {
  eventId: string;
  className?: string;
}

export function EventEvaluations({ eventId, className }: EventEvaluationsProps) {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  useEffect(() => {
    loadEvaluations();
  }, [eventId]);

  const loadEvaluations = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockEvaluations: Evaluation[] = [
        {
          id: '1',
          participantId: '2',
          participantName: 'Marie Dupont',
          participantAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          rating: 5,
          comment: 'Formation excellente ! Les formateurs étaient très pédagogues et les exercices pratiques vraiment utiles. J\'ai appris énormément de choses et je me sens maintenant capable d\'agir en cas d\'urgence. L\'organisation était parfaite et l\'ambiance très bienveillante.',
          createdAt: new Date('2024-02-16'),
          likes: 12,
          dislikes: 0,
          userReaction: 'like',
          isVerified: true,
        },
        {
          id: '2',
          participantId: '4',
          participantName: 'Pierre Durand',
          rating: 4,
          comment: 'Très bonne formation dans l\'ensemble. Le contenu était riche et bien structuré. Seul petit bémol : la salle était un peu petite pour le nombre de participants, ce qui rendait les exercices pratiques parfois difficiles. Mais je recommande !',
          createdAt: new Date('2024-02-17'),
          likes: 8,
          dislikes: 1,
          isVerified: true,
        },
        {
          id: '3',
          participantId: '5',
          participantName: 'Sophie Martin',
          rating: 5,
          comment: 'Une formation indispensable ! Très bien organisée, avec des formateurs compétents et passionnés. Les cas pratiques étaient réalistes et nous ont vraiment préparés aux situations d\'urgence. Merci aux organisateurs pour cette excellente initiative !',
          createdAt: new Date('2024-02-18'),
          likes: 15,
          dislikes: 0,
          isVerified: true,
        },
        {
          id: '4',
          participantId: '6',
          participantName: 'Thomas Leroy',
          rating: 3,
          comment: 'Formation correcte mais j\'attendais un peu plus de pratique. La théorie était bien expliquée mais nous aurions aimé plus d\'exercices concrets. Cependant, les bases sont bien posées.',
          createdAt: new Date('2024-02-19'),
          likes: 3,
          dislikes: 2,
          isVerified: false,
        },
      ];
      setEvaluations(mockEvaluations);
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = (evaluationId: string, reaction: 'like' | 'dislike') => {
    setEvaluations(prev => prev.map(evaluation => {
      if (evaluation.id === evaluationId) {
        const currentReaction = evaluation.userReaction;
        let newLikes = evaluation.likes;
        let newDislikes = evaluation.dislikes;
        let newReaction: 'like' | 'dislike' | undefined = reaction;

        // Remove previous reaction
        if (currentReaction === 'like') newLikes--;
        if (currentReaction === 'dislike') newDislikes--;

        // Add new reaction or remove if same
        if (currentReaction === reaction) {
          newReaction = undefined;
        } else {
          if (reaction === 'like') newLikes++;
          if (reaction === 'dislike') newDislikes++;
        }

        return {
          ...evaluation,
          likes: newLikes,
          dislikes: newDislikes,
          userReaction: newReaction,
        };
      }
      return evaluation;
    }));
  };

  const sortedEvaluations = [...evaluations].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const averageRating = evaluations.length > 0 
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0) / evaluations.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: evaluations.filter(evaluation => evaluation.rating === rating).length,
    percentage: evaluations.length > 0 
      ? (evaluations.filter(evaluation => evaluation.rating === rating).length / evaluations.length) * 100 
      : 0,
  }));

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Évaluations ({evaluations.length})</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Récentes
            </Button>
            <Button
              variant={sortBy === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('helpful')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Utiles
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              <Star className="h-4 w-4 mr-1" />
              Note
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rating Summary */}
        {evaluations.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {evaluations.length} évaluation{evaluations.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex-1 ml-8 space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evaluations List */}
        {sortedEvaluations.length > 0 ? (
          <div className="space-y-6">
            {sortedEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={evaluation.participantAvatar} alt={evaluation.participantName} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {getInitials(evaluation.participantName.split(' ')[0], evaluation.participantName.split(' ')[1] || '')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{evaluation.participantName}</h4>
                        {evaluation.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < evaluation.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(evaluation.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">{evaluation.comment}</p>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(evaluation.id, 'like')}
                        className={`${
                          evaluation.userReaction === 'like'
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-500'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {evaluation.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(evaluation.id, 'dislike')}
                        className={`${
                          evaluation.userReaction === 'dislike'
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-500'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {evaluation.dislikes}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune évaluation pour le moment</p>
            <p className="text-sm mt-2">Soyez le premier à partager votre expérience !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}