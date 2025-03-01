import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin ${className || ''}`}>
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        <div className="w-12 h-12 border-4 border-[#00ff9d]/20 border-t-[#00ff9d] rounded-full animate-spin" />
      </div>
    </div>
  )
}
  
  