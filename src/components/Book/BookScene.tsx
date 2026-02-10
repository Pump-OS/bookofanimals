'use client';

import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Book from './Book';
import Overlay from '../UI/Overlay';
import BackgroundLayer from './BackgroundLayer';
import { preloadAnimalImages, onImagesLoaded } from '@/lib/pageTexture';

/** Subtle camera parallax that follows the mouse cursor */
function CameraRig() {
  useFrame(({ mouse, camera }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.35, 0.04);
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      3.5 + mouse.y * 0.25,
      0.04,
    );
    camera.lookAt(0, 0, -0.2);
  });
  return null;
}

export default function BookScene() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    preloadAnimalImages();
    onImagesLoaded(() => forceRender((n) => n + 1));
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* Blurred animal images behind the 3D canvas */}
      <BackgroundLayer />

      <Canvas
        shadows
        camera={{ position: [0, 6, 3.5], fov: 40, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ touchAction: 'none', position: 'absolute', inset: 0 }}
        onCreated={(state) => {
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
          state.gl.setClearColor(0x000000, 0);
        }}
      >
        {/* ── Lighting ── */}
        <ambientLight intensity={0.35} />

        {/* Key light (upper-right) */}
        <directionalLight
          position={[4, 8, 3]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-bias={-0.0005}
        />

        {/* Fill light (upper-left, softer) */}
        <directionalLight position={[-3, 6, -1]} intensity={0.45} />

        {/* Rim light (back, for page edge highlight) */}
        <pointLight position={[0, 3, -4]} intensity={0.3} distance={14} />

        <CameraRig />
        <Book />
      </Canvas>

      {/* HTML overlay (above the WebGL view) */}
      <Overlay />
    </div>
  );
}
