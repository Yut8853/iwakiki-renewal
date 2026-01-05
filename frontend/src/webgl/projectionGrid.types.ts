// src/webgl/projectionGrid.types.ts
import type * as THREE from 'three';

export type GridConfig = {
  id: string;
  mask: string;
  video: string;
};

export type ProjectileUserData = {
  originPos: THREE.Vector3;
  direction: THREE.Vector3;
  rotateSpeed: THREE.Vector3;
};

export type ProjectileMesh = THREE.Mesh & {
  userData: ProjectileUserData;
};
