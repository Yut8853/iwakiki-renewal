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

// メッシュにカスタムプロパティを保持させるための型拡張
interface ProjectileMesh extends THREE.Mesh {
  userData: {
    originPos: THREE.Vector3;
    direction: THREE.Vector3;
    rotateSpeed: THREE.Vector3;
  };
}

export default function ProjectionGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grids = useRef<THREE.Group[]>([]);
  const videos = useRef<HTMLVideoElement[]>([]);
  const currentIndex = useRef(0);
  const isTransitioning = useRef(false);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6; // 少し引き気味に設定（拡散が見えやすくするため）

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // スクロールイベントの監視
    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      // スクロール率 0.0 ~ 1.0
      scrollProgress.current =
        (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
    };
    window.addEventListener('scroll', handleScroll);

    const rotateGrids = () => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const nextIndex = (currentIndex.current + 1) % GRIDS_CONFIG.length;
      const currentGrid = grids.current[currentIndex.current];
      const nextGrid = grids.current[nextIndex];
      const nextVideo = videos.current[nextIndex];

      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex.current = nextIndex;
          isTransitioning.current = false;
        },
      });

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
        video.loop = true;

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

        const gridSize = 50;
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

              // UVマッピングの調整
              const uvAttr = geometry.attributes.uv;
              for (let i = 0; i < uvAttr.array.length; i += 2) {
                uvAttr.array[i] = (x + uvAttr.array[i]) / gridSize;
                uvAttr.array[i + 1] = (y + uvAttr.array[i + 1]) / gridSize;
              }

              const mesh = new THREE.Mesh(geometry, material) as ProjectileMesh;

              // 初期位置の設定
              const posX = (x - gridSize / 2) * spacing;
              const posY = (y - gridSize / 2) * spacing;
              const posZ = 0;
              mesh.position.set(posX, posY, posZ);

              // 放射状の動きのためのデータをuserDataに保存
              mesh.userData = {
                originPos: new THREE.Vector3(posX, posY, posZ),
                // 中心から外側に向かうベクトルにランダムなバラつきを加える
                direction: new THREE.Vector3(
                  posX + (Math.random() - 0.5) * 10,
                  posY + (Math.random() - 0.5) * 10,
                  (Math.random() - 0.5) * 20 // 奥・手前への広がり
                ).normalize(),
                rotateSpeed: new THREE.Vector3(
                  Math.random() * 0.1,
                  Math.random() * 0.1,
                  Math.random() * 0.1
                ),
              };

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

      // ビデオ切り替えロジック
      const activeVideo = videos.current[currentIndex.current];
      if (activeVideo && !isTransitioning.current) {
        const timeLeft = activeVideo.duration - activeVideo.currentTime;
        if (timeLeft < 0.5 && activeVideo.duration > 0) {
          rotateGrids();
        }
      }

      // 放射状拡散アニメーションの更新
      const explosionStrength = 60; // 飛び散る距離の強さ
      const progress = scrollProgress.current;

      grids.current.forEach(group => {
        if (!group) return;
        group.children.forEach((child, i) => {
          const mesh = child as ProjectileMesh;
          const { originPos, direction, rotateSpeed } = mesh.userData;

          if (progress > 0) {
            // スクロールしている時：放射状に移動
            mesh.position.x =
              originPos.x + direction.x * progress * explosionStrength;
            mesh.position.y =
              originPos.y + direction.y * progress * explosionStrength;
            mesh.position.z =
              originPos.z + direction.z * progress * explosionStrength;

            // 回転も加える
            mesh.rotation.x += rotateSpeed.x;
            mesh.rotation.y += rotateSpeed.y;
          } else {
            // スクロールがトップの時：元の波打つアニメーション
            mesh.position.x = originPos.x;
            mesh.position.y = originPos.y;
            mesh.position.z = Math.sin(Date.now() * 0.002 + i * 0.1) * 0.15;
            mesh.rotation.set(0, 0, 0);
          }
        });
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', // スクロール中も画面に固定するために fixed に戻す
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
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
