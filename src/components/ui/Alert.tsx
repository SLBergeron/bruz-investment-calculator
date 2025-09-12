import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    info: {
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info
    },
    success: {
      classes: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle
    },
    warning: {
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle
    },
    error: {
      classes: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle
    }
  };

  const { classes, icon: Icon } = variants[variant];

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${classes} ${className}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm font-medium">
        {children}
      </div>
    </div>
  );
};