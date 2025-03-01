// Import and set up the toast component from shadcn/ui
// https://ui.shadcn.com/docs/components/toast 

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    sonnerToast[variant === "destructive" ? "error" : "success"](title, {
      description,
    })
  }

  return { toast }
} 