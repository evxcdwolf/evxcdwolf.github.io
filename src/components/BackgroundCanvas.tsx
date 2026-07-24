import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

interface BackgroundCanvasProps {
  bgConfig: BackgroundConfig;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ bgConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for subtle floating ambient dust
    const particleCount = Math.min(30, Math.floor(width / 40));
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * -0.3 - 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.35 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Full cover background image from background pool */}
      {bgConfig.activeBgUrl && (
        <div className="absolute inset-0">
          <img
            src={bgConfig.activeBgUrl}
            alt="Background Wallpaper"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700 filter contrast-[1.08] saturate-[0.9]"
            style={{
              filter: `blur(${bgConfig.blurAmount || 0}px) contrast(1.08)`,
            }}
          />
          {/* Dark atmospheric overlay according to overlayOpacity setting */}
          <div
            className="absolute inset-0 bg-zinc-950 transition-opacity duration-500"
            style={{ opacity: bgConfig.overlayOpacity ?? 0.65 }}
          />
          {/* Vignette edge shadows */}
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>
      )}

      {/* Grid Overlay Line Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-overlay" />

      {/* Canvas Particle Dust Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
