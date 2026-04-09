// webgl/ProjectionGridApp.ts
import * as THREE from 'three';
import { gsap } from 'gsap';

import { GRIDS_CONFIG } from './projectionGrid.config';

/* =========================
   型定義
========================= */
type ProjectileUserData = {
  originPos: THREE.Vector3;
  direction: THREE.Vector3;
  rotateSpeed: THREE.Vector3;
};

export class ProjectionGridApp {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mainGroup!: THREE.Group;

  private grids: THREE.Group[] = [];
  private videos: HTMLVideoElement[] = [];

  private currentIndex = 0;
  private isTransitioning = false;
  private scrollProgress = 0;

  private rafId = 0;

  constructor(private canvas: HTMLCanvasElement) {}

  /* ---------- init ---------- */
  async init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 3.5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    this.handleScroll();

    await Promise.all(
      GRIDS_CONFIG.map((cfg, i) => this.createSingleGrid(cfg, i))
    );

    this.animate();
  }

  /* ---------- events ---------- */
  private handleScroll = () => {
    const h = document.documentElement;
    const b = document.body;

    this.scrollProgress =
      (h.scrollTop || b.scrollTop) /
      ((h.scrollHeight || b.scrollHeight) - h.clientHeight);
  };

  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /* ---------- grid transition ---------- */
  private rotateGrids() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const nextIndex = (this.currentIndex + 1) % GRIDS_CONFIG.length;
    const currentGrid = this.grids[this.currentIndex];
    const nextGrid = this.grids[nextIndex];
    const nextVideo = this.videos[nextIndex];

    nextVideo.currentTime = 0;
    nextVideo.play().catch(() => {});

    gsap
      .timeline({
        onComplete: () => {
          this.currentIndex = nextIndex;
          this.isTransitioning = false;
        },
      })
      .to(
        currentGrid.children.map(c => c.scale),
        {
          x: 0,
          y: 0,
          z: 0,
          stagger: { each: 0.0001, from: 'random' },
          duration: 0.6,
          ease: 'power2.inOut',
        }
      )
      .to(
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
  }

  /* ---------- grid生成 ---------- */
  private async createSingleGrid(config: any, index: number) {
    const group = new THREE.Group();

    const video = document.createElement('video');
    video.src = config.video;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const texture = new THREE.VideoTexture(video);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    const img = new Image();
    img.src = config.mask;
    await img.decode();

    const size = 50;
    const spacing = 0.15;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = ((size - 1 - y) * size + x) * 4;

        if (data[i] < 128) {
          const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);

          const uvAttr = geo.attributes.uv;
          for (let k = 0; k < uvAttr.array.length; k += 2) {
            uvAttr.array[k] = (x + uvAttr.array[k]) / size;
            uvAttr.array[k + 1] = (y + uvAttr.array[k + 1]) / size;
          }
          uvAttr.needsUpdate = true;

          // 👇 型キャストしない
          const mesh = new THREE.Mesh(geo, material);

          const px = (x - size / 2) * spacing;
          const py = (y - size / 2) * spacing;

          mesh.position.set(px, py, 0);

          // 👇 userDataだけ型付け
          (mesh.userData as ProjectileUserData) = {
            originPos: new THREE.Vector3(px, py, 0),
            direction: new THREE.Vector3(
              px + (Math.random() - 0.5) * 10,
              py + (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 20
            ).normalize(),
            rotateSpeed: new THREE.Vector3(
              Math.random() * 0.1,
              Math.random() * 0.1,
              Math.random() * 0.1
            ),
          };

          mesh.scale.setScalar(index === 0 ? 1 : 0);

          group.add(mesh);
        }
      }
    }

    this.mainGroup.add(group);
    this.grids[index] = group;
    this.videos[index] = video;

    if (index === 0) video.play();
  }

  /* ---------- loop ---------- */
  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    const activeVideo = this.videos[this.currentIndex];

    if (activeVideo && !this.isTransitioning) {
      const timeLeft = activeVideo.duration - activeVideo.currentTime;

      if (timeLeft < 0.5 && activeVideo.duration > 0) {
        this.rotateGrids();
      }
    }

    const explosionStrength = 200;
    // Amplify scroll progress so explosion starts earlier and cubes shrink faster
    const p = Math.min(this.scrollProgress * 2.5, 1);

    this.grids.forEach(group => {
      group.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;

        // 👇 ここで型安全に取り出す
        const data = mesh.userData as ProjectileUserData;
        const { originPos, direction, rotateSpeed } = data;

        if (p > 0) {
          mesh.position.copy(
            originPos
              .clone()
              .add(direction.clone().multiplyScalar(p * explosionStrength))
          );

          mesh.rotation.x += rotateSpeed.x;
          mesh.rotation.y += rotateSpeed.y;
        } else {
          mesh.position.set(
            originPos.x,
            originPos.y,
            Math.sin(Date.now() * 0.002 + i * 0.1) * 0.15
          );

          mesh.rotation.set(0, 0, 0);
        }
      });
    });

    this.renderer.render(this.scene, this.camera);
  };

  /* ---------- dispose ---------- */
  dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    this.renderer.dispose();
    this.videos.forEach(v => v.pause());
  }
}
