import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const GRIDS_CONFIG = [
  {
    id: 'video1',
    mask: '/model/iwaki_model.jpg',
    video: '/videos/AdobeStock_561715243.mp4',
  },
  {
    id: 'video2',
    mask: '/model/iwaki_model.jpg',
    video: '/videos/AdobeStock_564226576.mp4',
  },
  {
    id: 'video3',
    mask: '/model/iwaki_model.jpg',
    video: '/videos/AdobeStock_564226647.mp4',
  },
];

export default function ProjectionGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grids = useRef<THREE.Group[]>([]);
  const videos = useRef<HTMLVideoElement[]>([]);
  const currentIndex = useRef(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 同期切り替えアニメーション ---
    const rotateGrids = () => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const nextIndex = (currentIndex.current + 1) % GRIDS_CONFIG.length;
      const currentGrid = grids.current[currentIndex.current];
      const nextGrid = grids.current[nextIndex];
      const nextVideo = videos.current[nextIndex];

      // 次の動画を0秒から再生準備
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex.current = nextIndex;
          isTransitioning.current = false;
        },
      });

      // 現在のグリッドを消す (Stagger時間を短くしてキレを良くする)
      tl.to(
        currentGrid.children.map(c => c.scale),
        {
          x: 0,
          y: 0,
          z: 0,
          stagger: { each: 0.0001, from: 'random' },
          duration: 0.6,
          ease: 'power2.inOut',
        }
      );

      // 次のグリッドを出す (0.2秒かぶせる)
      tl.to(
        nextGrid.children.map(c => c.scale),
        {
          x: 1,
          y: 1,
          z: 1,
          stagger: { each: 0.0001, from: 'random' },
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '-=0.2'
      );
    };

    const createSingleGrid = async (
      config: (typeof GRIDS_CONFIG)[0],
      index: number
    ) => {
      try {
        const gridGroup = new THREE.Group();
        const video = document.createElement('video');
        video.src = config.video;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;
        video.loop = true; // ループさせてラグを排除

        const videoTexture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          side: THREE.DoubleSide,
        });

        const img = new Image();
        img.src = config.mask;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });

        const gridSize = 40;
        const spacing = 0.25;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = gridSize;
        canvas.height = gridSize;
        ctx.drawImage(img, 0, 0, gridSize, gridSize);
        const imageData = ctx.getImageData(0, 0, gridSize, gridSize).data;

        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            const pixelIndex = ((gridSize - 1 - y) * gridSize + x) * 4;
            if (imageData[pixelIndex] < 128) {
              const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
              const uvAttr = geometry.attributes.uv;
              for (let i = 0; i < uvAttr.array.length; i += 2) {
                uvAttr.array[i] = (x + uvAttr.array[i]) / gridSize;
                uvAttr.array[i + 1] = (y + uvAttr.array[i + 1]) / gridSize;
              }
              const mesh = new THREE.Mesh(geometry, material);
              mesh.position.set(
                (x - gridSize / 2) * spacing,
                (y - gridSize / 2) * spacing,
                0
              );
              mesh.scale.setScalar(index === 0 ? 1 : 0);
              gridGroup.add(mesh);
            }
          }
        }
        mainGroup.add(gridGroup);
        grids.current[index] = gridGroup;
        videos.current[index] = video;

        if (index === 0) video.play();
      } catch (e) {
        console.error(e);
      }
    };

    const init = async () => {
      await Promise.all(GRIDS_CONFIG.map((cfg, i) => createSingleGrid(cfg, i)));
    };
    init();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      // --- ビデオの再生時間を監視 ---
      const activeVideo = videos.current[currentIndex.current];
      if (activeVideo && !isTransitioning.current) {
        // ビデオが終わる 0.5秒前になったら切り替え開始
        const timeLeft = activeVideo.duration - activeVideo.currentTime;
        if (timeLeft < 0.5 && activeVideo.duration > 0) {
          rotateGrids();
        }
      }

      grids.current.forEach(group => {
        if (!group) return;
        group.children.forEach((child, i) => {
          child.position.z = Math.sin(Date.now() * 0.002 + i * 0.1) * 0.15;
        });
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // ProjectionGrid.tsx の return 部分を修正
  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', // fixed から absolute に変更
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3, // 背面に送る場合は 1、手前なら 10
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
