import React from 'react';

export default function GlassCard({ children, className = '', hoverEffect = false, ...props }) {
  return (
    <div 
      className={`glass-panel rounded-2xl p-6 ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
