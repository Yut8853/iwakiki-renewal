// components/WebGL/ProjectionGridCanvas.tsx
import { useEffect, useRef } from 'react';
import { ProjectionGridApp } from '@/webgl/ProjectionGridApp';

export function ProjectionGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new ProjectionGridApp(canvasRef.current);
    app.init();

    return () => {
      app.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}
