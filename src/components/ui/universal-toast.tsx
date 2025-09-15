import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastItem {
  id: string
  variant: 'success' | 'error' | 'warning' | 'info' | 'default'
  title?: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useUniversalToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useUniversalToast must be used within a UniversalToastProvider')
  }
  return context
}

const toastVariants = {
  success: {
    bg: 'bg-[hsl(var(--toast-success-bg))] border-[hsl(var(--toast-success-border))]',
    text: 'text-[hsl(var(--toast-success-foreground))]',
    icon: CheckCircle,
    iconColor: 'text-[hsl(var(--toast-success-icon))]'
  },
  error: {
    bg: 'bg-[hsl(var(--toast-error-bg))] border-[hsl(var(--toast-error-border))]',
    text: 'text-[hsl(var(--toast-error-foreground))]',
    icon: AlertCircle,
    iconColor: 'text-[hsl(var(--toast-error-icon))]'
  },
  warning: {
    bg: 'bg-[hsl(var(--toast-warning-bg))] border-[hsl(var(--toast-warning-border))]',
    text: 'text-[hsl(var(--toast-warning-foreground))]',
    icon: AlertTriangle,
    iconColor: 'text-[hsl(var(--toast-warning-icon))]'
  },
  info: {
    bg: 'bg-[hsl(var(--toast-info-bg))] border-[hsl(var(--toast-info-border))]',
    text: 'text-[hsl(var(--toast-info-foreground))]',
    icon: Info,
    iconColor: 'text-[hsl(var(--toast-info-icon))]'
  },
  default: {
    bg: 'bg-card border-border',
    text: 'text-foreground',
    icon: Info,
    iconColor: 'text-muted-foreground'
  }
}

export const UniversalToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration ?? 3000
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      hideToast(id)
    }, newToast.duration)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const variant = toastVariants[toast.variant]
          const Icon = variant.icon
          
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-fade-in",
                variant.bg,
                variant.text,
                "min-w-[320px] max-w-[420px]"
              )}
            >
              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", variant.iconColor)} />
              
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <div className="font-semibold text-sm mb-1">
                    {toast.title}
                  </div>
                )}
                {toast.description && (
                  <div className="text-sm opacity-95">
                    {toast.description}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => hideToast(toast.id)}
                className={cn(
                  "flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                )}
              >
                <X className="h-4 w-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}