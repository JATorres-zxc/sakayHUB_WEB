// Helper functions to make toast usage easier throughout the app
// Import this where you want to show toasts instead of using the context directly

import { useUniversalToast } from '@/components/ui/universal-toast'

export const useToast = () => {
  const { showToast } = useUniversalToast()

  const success = (title: string, description?: string) => {
    showToast({
      variant: 'success',
      title,
      description,
      duration: 3000
    })
  }

  const error = (title: string, description?: string) => {
    showToast({
      variant: 'error',
      title,
      description,
      duration: 3000
    })
  }

  const warning = (title: string, description?: string) => {
    showToast({
      variant: 'warning',
      title,
      description,
      duration: 3000
    })
  }

  const info = (title: string, description?: string) => {
    showToast({
      variant: 'info',
      title,
      description,
      duration: 3000
    })
  }

  const show = (variant: 'success' | 'error' | 'warning' | 'info' | 'default', title: string, description?: string, duration?: number) => {
    showToast({
      variant,
      title,
      description,
      duration
    })
  }

  return {
    success,
    error,
    warning,
    info,
    show
  }
}