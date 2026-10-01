import React, { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';

export default function SplashLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`splash-loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-pulse-ring" />
          <div className="splash-pulse-ring-outer" />
          <div className="splash-icon-box">
            <Gamepad2 size={40} color="#ffffff" className="splash-gamepad-icon" />
          </div>
        </div>

        <h1 className="splash-brand-title">GAMEVERSE</h1>
        <div className="splash-brand-subtitle">GAMING CAFÉ MANAGEMENT SYSTEM</div>

        <div className="splash-progress-wrapper">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="splash-meta-text">
            <span>Loading System</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
