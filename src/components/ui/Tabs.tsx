import React from 'react';

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onChange } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className = '', 
  value, 
  onChange 
}) => {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            currentValue: value, 
            onSelect: onChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  currentValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children, 
  currentValue, 
  onSelect, 
  className = '' 
}) => {
  const isActive = currentValue === value;
  
  return (
    <button
      onClick={() => onSelect?.(value)}
      className={`
        px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
        ${isActive 
          ? 'bg-white text-blue-700 shadow-sm' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  currentValue?: string;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children, 
  currentValue, 
  className = '' 
}) => {
  if (currentValue !== value) return null;
  
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};