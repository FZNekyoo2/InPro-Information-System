
import React from 'react';

import ReactDOM from 'react-dom';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, confirmText = 'Ya', cancelText = 'Tidak', type = 'warning' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'danger': return '⚠️';
      case 'warning': return '❓';
      default: return 'ℹ️';
    }
  };

  const getConfirmColor = () => {
    switch(type) {
      case 'danger': return '#ef4444'; // Red
      case 'warning': return '#3b82f6'; // Blue for info/question
      default: return '#3b82f6';
    }
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999, // Extremely high z-index
      backdropFilter: 'blur(3px)'
    }} onClick={onCancel}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          {getIcon()}
        </div>
        <h3 style={{
          margin: '0 0 1.5rem 0',
          color: '#1f2937',
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          {message}
        </h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={onCancel}
              style={{
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => e.target.style.opacity = '0.9'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              style={{
                backgroundColor: getConfirmColor(),
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => e.target.style.opacity = '0.9'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >
              {confirmText}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
