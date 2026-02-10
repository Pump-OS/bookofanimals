'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PageMesh — a single turning page with real-time vertex deformation.
 *
 * Geometry: a PlaneGeometry with N width-segments, rotated to XZ plane,
 * pivot at x=0 (the spine). Vertices are deformed each frame based on
 * `turnProgressRef` to produce a smooth curving page-turn from right to left.
 *
 * Two overlapping meshes share the same geometry:
 *  - FrontSide mesh with front texture
 *  - BackSide mesh with mirrored back texture
 */

interface PageMeshProps {
  pageWidth: number;
  pageHeight: number;
  segments: number;
  /** 0 = flat on right, 1 = flat on left (continuously animated by parent) */
  turnProgressRef: React.MutableRefObject<number>;
  frontTexRef: React.MutableRefObject<THREE.Texture | null>;
  backTexRef: React.MutableRefObject<THREE.Texture | null>;
  visibleRef: React.MutableRefObject<boolean>;
  yOffsetRef: React.MutableRefObject<number>;
}

export default function PageMesh({
  pageWidth,
  pageHeight,
  segments,
  turnProgressRef,
  frontTexRef,
  backTexRef,
  visibleRef,
  yOffsetRef,
}: PageMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null!);

  // ── Geometry (created once per segments change) ──
  const { geometry, origPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(pageWidth, pageHeight, segments, 1);
    // Rotate to lie flat in XZ plane (Y = up)
    geo.rotateX(-Math.PI / 2);
    // Shift so spine edge is at x=0 and page extends to +X
    geo.translate(pageWidth / 2, 0, 0);
    const orig = new Float32Array(geo.attributes.position.array);
    return { geometry: geo, origPositions: orig };
  }, [pageWidth, pageHeight, segments]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Track previous texture objects to minimize needsUpdate calls
  const prevFrontTex = useRef<THREE.Texture | null>(null);
  const prevBackTex = useRef<THREE.Texture | null>(null);

  // ── Per-frame update ──
  useFrame(() => {
    const vis = visibleRef.current;
    if (groupRef.current.visible !== vis) groupRef.current.visible = vis;
    if (!vis) return;

    // Swap textures only when they change
    if (frontMatRef.current && frontTexRef.current !== prevFrontTex.current) {
      frontMatRef.current.map = frontTexRef.current;
      frontMatRef.current.needsUpdate = true;
      prevFrontTex.current = frontTexRef.current;
    }
    if (backMatRef.current && backTexRef.current !== prevBackTex.current) {
      backMatRef.current.map = backTexRef.current;
      backMatRef.current.needsUpdate = true;
      prevBackTex.current = backTexRef.current;
    }

    // ── Vertex deformation ──
    const t = turnProgressRef.current;
    const positions = geometry.attributes.position.array as Float32Array;
    const baseAngle = t * Math.PI;
    // Curvature peaks mid-turn, creates natural paper bend
    const curvature = Math.sin(t * Math.PI) * 0.3;
    // Vertical lift so the page clears the stacks during mid-turn
    const lift = Math.sin(t * Math.PI) * 0.25;
    const yOff = yOffsetRef.current;

    for (let i = 0, l = origPositions.length; i < l; i += 3) {
      const ox = origPositions[i]; // distance from spine
      const oz = origPositions[i + 2]; // along page height
      const nx = ox / pageWidth; // 0 = spine, 1 = outer edge

      // Progressive bend: outer edge leads the spine slightly
      const angle = baseAngle + nx * curvature;
      const r = ox;

      positions[i] = Math.cos(angle) * r;
      positions[i + 1] = Math.sin(angle) * r + lift + yOff;
      positions[i + 2] = oz;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Front face (visible when page is on right / turning) */}
      <mesh geometry={geometry} renderOrder={2}>
        <meshStandardMaterial
          ref={frontMatRef}
          side={THREE.FrontSide}
          color="#ffffff"
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* Back face (visible after page turns to left) */}
      <mesh geometry={geometry} renderOrder={2}>
        <meshStandardMaterial
          ref={backMatRef}
          side={THREE.BackSide}
          color="#ffffff"
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
