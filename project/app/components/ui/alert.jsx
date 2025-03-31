import React from 'react'

export function Alert({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}) {
  const variants = {
    default: 'bg-white text-slate-950 border-slate-200',
    destructive: 'border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-500 bg-red-50'
  }

  return (
    <div
      role="alert"
      className={`
        relative w-full rounded-lg border p-4 
        [&>svg~div]:translate-y-[-3px] [&>svg+div]:pl-4 
        [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 
        [&>svg]:text-foreground 
        ${variants[variant]} 
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ className, children, ...props }) {
  return (
    <h5
      className={`
        mb-1 font-medium leading-none tracking-tight 
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </h5>
  )
}

export function AlertDescription({ className, children, ...props }) {
  return (
    <div
      className={`
        text-sm [&_p]:leading-relaxed 
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}