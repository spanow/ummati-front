'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Star, Send, Loader2 } from 'lucide-react';

interface EventEvaluationFormProps {
  eventId: string;
  eventTitle: string;
  onSubmit?: (evaluation: any) => void;
  className?: string;
}

export function EventEvaluationForm({ 
  eventId, 
  eventTitle, 
  onSubmit, 
  className 
}: EventEvaluationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const evaluation = {
        eventId,
        eventTitle,
        participantId: user?.id,
        participantName: `${user?.firstName} ${user?.lastName}`,
        rating,
        comment: comment.trim(),
        isPublic,
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(evaluation);
      }

      toast.success('Évaluation envoyée avec succès !');
      
      // Reset form
      setRating(0);
      setComment('');
      setIsPublic(true);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'évaluation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Évaluer cet événement</span>
        </CardTitle>
        <CardDescription>
          Partagez votre expérience pour aider les futurs participants
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Note générale *</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating}/5 - {
                    rating === 1 ? 'Très décevant' :
                    rating === 2 ? 'Décevant' :
                    rating === 3 ? 'Correct' :
                    rating === 4 ? 'Bien' : 'Excellent'
                  }
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Votre commentaire *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez votre expérience : organisation, ambiance, utilité, points positifs et axes d'amélioration..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {comment.length}/500 caractères (minimum 10)
            </p>
          </div>

          {/* Public/Private toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="public-toggle" className="text-base">
                Rendre cette évaluation publique
              </Label>
              <p className="text-sm text-gray-600">
                Les autres utilisateurs pourront voir votre commentaire et votre note
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || rating === 0 || comment.trim().length < 10}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publier mon évaluation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}