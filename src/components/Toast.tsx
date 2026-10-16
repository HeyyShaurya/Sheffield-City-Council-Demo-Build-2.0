import React from 'react';

interface ToastProps {
  message: string | null;
  isError?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isError }) => {
  return (
    <div
      className={`toast ${message ? 'show' : ''} ${isError ? 'bad' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};
