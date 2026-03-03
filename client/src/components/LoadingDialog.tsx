import React, { useState, useEffect } from 'react';

interface LoadingDialogProps {
  isOpen: boolean;
}

export default function LoadingDialog({ isOpen }: LoadingDialogProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 40); // 100 / 2 * 40ms = 2000ms (approx 2s + initial delay)
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20000,
      backdropFilter: 'blur(2px)'
    }}>
      <div className="window" style={{ 
        width: 320, 
        padding: 20, 
        textAlign: 'center',
        background: '#4c5844',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          fontSize: 14, 
          color: 'white', 
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>
          Loading
        </h2>
        <progress value={progress} max="100" style={{ width: '100%', height: 20 }}></progress>
        <div style={{ marginTop: 10, fontSize: 11, color: '#bcc4b5' }}>
          Please wait...
        </div>
      </div>
    </div>
  );
}
