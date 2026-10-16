import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  intro?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, intro, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-cover"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <section className="modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
        {children}
      </section>
    </div>
  );
};
