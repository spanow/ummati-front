import { useUI } from '@/hooks/useUI';

export function useToast() {
  const { addNotification } = useUI();

  const toast = {
    success: (message: string, title?: string) => {
      addNotification({
        userId: 'current',
        title: title || 'Succès',
        message,
        type: 'success',
        read: false,
      });
    },
    error: (message: string, title?: string) => {
      addNotification({
        userId: 'current',
        title: title || 'Erreur',
        message,
        type: 'error',
        read: false,
      });
    },
    info: (message: string, title?: string) => {
      addNotification({
        userId: 'current',
        title: title || 'Information',
        message,
        type: 'info',
        read: false,
      });
    },
    warning: (message: string, title?: string) => {
      addNotification({
        userId: 'current',
        title: title || 'Attention',
        message,
        type: 'warning',
        read: false,
      });
    },
  };

  return { toast };
}