import React, { useEffect, useRef } from 'react';

export function SparkParticles() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleSparkEvent = (e) => {
      const { x, y, color = '#f59e0b', count = 24 } = e.detail || {};
      const newParticles = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        newParticles.push({
          x: x || window.innerWidth / 2,
          y: y || window.innerHeight / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (1 + Math.random() * 3),
          size: 2 + Math.random() * 4,
          color,
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
          gravity: 0.15,
          spin: (Math.random() - 0.5) * 0.2,
          rotation: Math.random() * Math.PI
        });
      }

      particlesRef.current.push(...newParticles);
    };

    window.addEventListener('trigger-spark-burst', handleSparkEvent);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;
        p.rotation += p.spin;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw diamond spark shape
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s * 1.5);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s * 1.5);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('trigger-spark-burst', handleSparkEvent);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}

/**
 * Utility helper to fire spark bursts from anywhere in the app
 */
export function fireSparkBurst(x, y, color = '#f59e0b', count = 24) {
  window.dispatchEvent(new CustomEvent('trigger-spark-burst', {
    detail: { x, y, color, count }
  }));
}
