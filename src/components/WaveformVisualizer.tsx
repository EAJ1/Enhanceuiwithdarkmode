import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  color?: string;
}

export function WaveformVisualizer({ isActive, color = '#f97316' }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 40;
    let heights = Array(bars).fill(0);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        if (isActive) {
          // Random wave animation when active
          heights[i] = Math.sin(Date.now() / 200 + i * 0.5) * 40 + 50 + Math.random() * 30;
        } else {
          // Decay to baseline when inactive
          heights[i] = heights[i] * 0.9;
        }

        const height = heights[i];
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={120}
      className="w-full h-full rounded-lg"
    />
  );
}
