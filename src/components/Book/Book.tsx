'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PageMesh from './PageMesh';
import { useBookStore, TOTAL_LEAVES, TOTAL_SPREADS } from '@/store/useBookStore';
import { getCachedTexture, clearTextureCache, onImagesLoaded, TOTAL_PAGES } from '@/lib/pageTexture';

/* ── Constants ── */
const PAGE_W = 2.5;
const PAGE_H = 3.5;
const COVER_T = 0.015;
const PAGE_T = 0.003;
const SPINE_W = 0.08;
const FULL_STACK_H = TOTAL_LEAVES * PAGE_T;
// Extra 0.003 clearance so the page-stack edge doesn't peek out under the cover
const CLOSED_COVER_Y = COVER_T + FULL_STACK_H + COVER_T / 2 + 0.003;

export default function Book() {
  const currentSpread = useBookStore((s) => s.currentSpread);
  const quality = useBookStore((s) => s.quality);
  const setAnimating = useBookStore((s) => s.setAnimating);
  const nextSpread = useBookStore((s) => s.nextSpread);
  const prevSpread = useBookStore((s) => s.prevSpread);

  const { gl } = useThree();
  const [, forceRender] = useState(0);

  const segs = quality === 'low' ? 10 : quality === 'med' ? 18 : 26;

  /* ── Animation state ── */
  const animRef = useRef({
    isTurning: false,
    direction: 'forward' as 'forward' | 'backward',
    velocity: 0,
    target: 0,
  });
  const dragRef = useRef({
    active: false,
    startX: 0,
    direction: 'forward' as 'forward' | 'backward',
  });
  const turnProgressRef = useRef(0);
  const frontTexRef = useRef<THREE.Texture | null>(null);
  const backTexRef = useRef<THREE.Texture | null>(null);
  const pageMeshVisibleRef = useRef(false);
  const yOffsetRef = useRef(0);
  const lastWheelRef = useRef(0);
  const completionFrameRef = useRef(0);

  /* ── Cover animation ── */
  const frontCoverGroupRef = useRef<THREE.Group>(null!);
  const coverSpring = useRef({ angle: 0, velocity: 0 });

  /* ── Imperative static-page refs ── */
  const leftStaticRef = useRef<THREE.Mesh>(null!);
  const rightStaticRef = useRef<THREE.Mesh>(null!);
  const leftStaticMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const rightStaticMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const prevLeftTex = useRef<THREE.Texture | null>(null);
  const prevRightTex = useRef<THREE.Texture | null>(null);

  /* ── Refs for page stacks (hidden when book is closed) ── */
  const leftStackRef = useRef<THREE.Mesh>(null!);
  const rightStackRef = useRef<THREE.Mesh>(null!);

  /* ── Inside-cover texture ref (TOC on underside) ── */
  const insideCoverMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const prevInsideTex = useRef<THREE.Texture | null>(null);

  /* Stable turn context */
  const turnInfoRef = useRef({
    fromSpread: 0,
    toSpread: 0,
    staticLeftIdx: -1,
    staticRightIdx: -1,
    isCoverTurn: false,
  });

  /* ── Texture helper ── */
  const getTex = useCallback(
    (idx: number, mirrored = false): THREE.Texture | null => {
      if (idx < 0 || idx >= TOTAL_PAGES) return null;
      return getCachedTexture(idx, quality, mirrored);
    },
    [quality],
  );

  const prevQuality = useRef(quality);
  useEffect(() => {
    if (prevQuality.current !== quality) {
      clearTextureCache();
      prevQuality.current = quality;
    }
  }, [quality]);

  useEffect(() => {
    onImagesLoaded(() => forceRender((n) => n + 1));
  }, []);

  /* ── Setup a page turn ── */
  const setupTurn = useCallback(
    (dir: 'forward' | 'backward'): boolean => {
      const cs = useBookStore.getState().currentSpread;
      if (dir === 'forward' && cs >= TOTAL_SPREADS - 1) return false;
      if (dir === 'backward' && cs <= 0) return false;
      if (animRef.current.isTurning) return false;

      const a = animRef.current;
      a.isTurning = true;
      a.direction = dir;
      a.velocity = 0;
      completionFrameRef.current = 0;

      const dst = dir === 'forward' ? cs + 1 : cs - 1;
      const ti = turnInfoRef.current;
      ti.fromSpread = cs;
      ti.toSpread = dst;

      const isCoverTurn =
        (dir === 'forward' && cs === 0) || (dir === 'backward' && dst === 0);
      ti.isCoverTurn = isCoverTurn;

      if (dir === 'forward') {
        turnProgressRef.current = 0;
        a.target = 1;
      } else {
        turnProgressRef.current = 1;
        a.target = 0;
      }

      if (isCoverTurn) {
        pageMeshVisibleRef.current = false;
        if (dir === 'forward') {
          // Opening: destination pages appear beneath the lifting cover
          // Page 1 (TOC) is on the cover inside — skip it
          ti.staticLeftIdx = -1;
          ti.staticRightIdx = dst < TOTAL_SPREADS - 1 ? dst * 2 : -1;
        } else {
          // Closing: source pages visible while cover closes over them
          // Page 1 (TOC) is on the cover inside — skip it
          ti.staticLeftIdx = -1;
          ti.staticRightIdx = cs < TOTAL_SPREADS - 1 ? cs * 2 : -1;
        }
      } else {
        pageMeshVisibleRef.current = true;
        if (dir === 'forward') {
          frontTexRef.current = getTex(cs * 2);
          backTexRef.current = getTex(cs * 2 + 1, true);
          ti.staticLeftIdx = cs > 0 ? cs * 2 - 1 : -1;
          ti.staticRightIdx = dst < TOTAL_SPREADS - 1 ? dst * 2 : -1;
        } else {
          frontTexRef.current = getTex((cs - 1) * 2);
          backTexRef.current = getTex((cs - 1) * 2 + 1, true);
          ti.staticLeftIdx = dst > 0 ? dst * 2 - 1 : -1;
          ti.staticRightIdx = cs < TOTAL_SPREADS - 1 ? cs * 2 : -1;
        }
      }

      // Page 1 (TOC) is ALWAYS on the cover inside — never as a static page
      if (ti.staticLeftIdx === 1) ti.staticLeftIdx = -1;

      if (ti.staticLeftIdx >= 0) getTex(ti.staticLeftIdx);
      if (ti.staticRightIdx >= 0) getTex(ti.staticRightIdx);

      const leftH = cs * PAGE_T;
      const rightH = (TOTAL_LEAVES - cs) * PAGE_T;
      yOffsetRef.current = COVER_T + Math.max(leftH, rightH) + 0.015;

      setAnimating(true);
      return true;
    },
    [getTex, setAnimating],
  );

  const startTurn = useCallback(
    (dir: 'forward' | 'backward') => { setupTurn(dir); },
    [setupTurn],
  );

  const beginDrag = useCallback(
    (dir: 'forward' | 'backward', clientX: number) => {
      if (!setupTurn(dir)) return;
      dragRef.current = { active: true, startX: clientX, direction: dir };

      const onMove = (e: PointerEvent) => {
        if (!dragRef.current.active) return;
        const delta = dragRef.current.startX - e.clientX;
        const range = Math.max(window.innerWidth * 0.3, 180);
        if (dir === 'forward') {
          turnProgressRef.current = Math.max(0, Math.min(1, delta / range));
        } else {
          turnProgressRef.current = Math.max(0, Math.min(1, 1 + delta / range));
        }
      };

      const onUp = () => {
        dragRef.current.active = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        const p = turnProgressRef.current;
        animRef.current.target =
          dir === 'forward' ? (p > 0.25 ? 1 : 0) : p < 0.75 ? 0 : 1;
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [setupTurn],
  );

  /* ── Combined render-loop ── */
  useFrame((_, delta) => {
    const a = animRef.current;
    const ti = turnInfoRef.current;

    // ── Page turn spring ──
    if (a.isTurning && !dragRef.current.active) {
      const dt = Math.min(delta, 0.05);
      const stiffness = 12;
      const damping = 2 * Math.sqrt(stiffness);
      const target = a.target;

      const dx = turnProgressRef.current - target;
      a.velocity += (-stiffness * dx - damping * a.velocity) * dt;
      turnProgressRef.current += a.velocity * dt;
      turnProgressRef.current = Math.max(0, Math.min(1, turnProgressRef.current));

      if (Math.abs(dx) < 0.002 && Math.abs(a.velocity) < 0.01) {
        turnProgressRef.current = target;
        a.velocity = 0;

        if (completionFrameRef.current === 0) {
          completionFrameRef.current = 1;
          const completed =
            (a.direction === 'forward' && target === 1) ||
            (a.direction === 'backward' && target === 0);
          if (completed) {
            if (a.direction === 'forward') nextSpread();
            else prevSpread();
          }
        } else {
          completionFrameRef.current = 0;
          a.isTurning = false;
          pageMeshVisibleRef.current = false;
          setAnimating(false);
          forceRender((n) => n + 1);
        }
      }
    }

    // ── Front cover spring ──
    const cvs = coverSpring.current;

    if (a.isTurning && ti.isCoverTurn) {
      cvs.angle = turnProgressRef.current * Math.PI;
      cvs.velocity = 0;
    } else {
      const coverTarget =
        useBookStore.getState().currentSpread > 0 ? Math.PI : 0;
      const dt = Math.min(delta, 0.05);
      const kStiff = 10;
      const kDamp = 2 * Math.sqrt(kStiff);
      const cdx = cvs.angle - coverTarget;
      if (Math.abs(cdx) > 0.001 || Math.abs(cvs.velocity) > 0.001) {
        cvs.velocity += (-kStiff * cdx - kDamp * cvs.velocity) * dt;
        cvs.angle += cvs.velocity * dt;
        cvs.angle = Math.max(0, Math.min(Math.PI, cvs.angle));
      } else {
        cvs.angle = coverTarget;
        cvs.velocity = 0;
      }
    }

    // Apply cover transform
    if (frontCoverGroupRef.current) {
      const t = cvs.angle / Math.PI;
      frontCoverGroupRef.current.rotation.z = cvs.angle;
      frontCoverGroupRef.current.position.y =
        COVER_T / 2 + (1 - t) * (CLOSED_COVER_Y - COVER_T / 2);
    }

    // ── Hide page stacks when cover is closed (prevent white edge peeking) ──
    const coverOpen = cvs.angle > 0.25;
    if (leftStackRef.current) leftStackRef.current.visible = coverOpen;
    if (rightStackRef.current) rightStackRef.current.visible = coverOpen;

    // ── Inside-cover texture (TOC = page 1, mirrored) ──
    if (insideCoverMatRef.current) {
      const tocTex = getCachedTexture(1, quality, true);
      if (tocTex && tocTex !== prevInsideTex.current) {
        insideCoverMatRef.current.map = tocTex;
        insideCoverMatRef.current.needsUpdate = true;
        prevInsideTex.current = tocTex;
      }
    }

    // ── Imperative static pages ──
    const cs = useBookStore.getState().currentSpread;
    let lIdx: number;
    let rIdx: number;

    if (a.isTurning) {
      lIdx = ti.staticLeftIdx;
      rIdx = ti.staticRightIdx;
      // During cover close, hide pages as cover settles
      if (ti.isCoverTurn && a.direction === 'backward' && turnProgressRef.current < 0.25) {
        lIdx = -1;
        rIdx = -1;
      }
    } else {
      lIdx = cs > 0 ? cs * 2 - 1 : -1;
      rIdx = cs > 0 && cs < TOTAL_SPREADS - 1 ? cs * 2 : -1;
    }

    // Page 1 (TOC) is on the cover inside — never show as a separate static page
    if (lIdx === 1) lIdx = -1;

    // Also hide static pages when cover is nearly closed
    if (!coverOpen) {
      lIdx = -1;
      rIdx = -1;
    }

    const lTex = lIdx >= 0 ? getCachedTexture(lIdx, quality) : null;
    const rTex = rIdx >= 0 ? getCachedTexture(rIdx, quality) : null;

    if (leftStaticRef.current) {
      leftStaticRef.current.visible = !!lTex;
      if (lTex) {
        const lsH = cs * PAGE_T;
        leftStaticRef.current.position.set(-PAGE_W / 2, COVER_T + lsH + 0.005, 0);
        if (lTex !== prevLeftTex.current) {
          leftStaticMatRef.current.map = lTex;
          leftStaticMatRef.current.needsUpdate = true;
          prevLeftTex.current = lTex;
        }
      }
    }

    if (rightStaticRef.current) {
      rightStaticRef.current.visible = !!rTex;
      if (rTex) {
        const rsH = (TOTAL_LEAVES - cs) * PAGE_T;
        rightStaticRef.current.position.set(PAGE_W / 2, COVER_T + rsH + 0.005, 0);
        if (rTex !== prevRightTex.current) {
          rightStaticMatRef.current.map = rTex;
          rightStaticMatRef.current.needsUpdate = true;
          prevRightTex.current = rTex;
        }
      }
    }
  });

  /* ── Input ── */
  useEffect(() => {
    const canvas = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); startTurn('forward'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); startTurn('backward'); }
    };

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      beginDrag(nx > 0.5 ? 'forward' : 'backward', e.clientX);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelRef.current < 400) return;
      lastWheelRef.current = now;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      startTurn(d > 0 ? 'forward' : 'backward');
    };

    const onNav = (e: Event) => startTurn((e as CustomEvent).detail);

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('book-nav', onNav);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('book-nav', onNav);
    };
  }, [gl, startTurn, beginDrag]);

  /* ── Stack heights for JSX (React-controlled geometry) ── */
  const leftStackH = currentSpread * PAGE_T;
  const rightStackH = (TOTAL_LEAVES - currentSpread) * PAGE_T;
  const coverTex = getTex(0);

  return (
    <group>
      {/* ══════════════════ ENVIRONMENT ══════════════════ */}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0c0c14" roughness={0.95} metalness={0.1} transparent opacity={0.85} />
      </mesh>

      <mesh position={[0, -0.21, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.04, 3.6]} />
        <meshStandardMaterial color="#18181e" roughness={0.25} metalness={0.55} />
      </mesh>
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[4.5, 0.08, 3.4]} />
        <meshStandardMaterial color="#222230" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.075, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 0.04, 3.2]} />
        <meshStandardMaterial color="#2a2a38" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[4.1, 0.01, 3.0]} />
        <meshStandardMaterial color="#33333f" roughness={0.12} metalness={0.65} />
      </mesh>

      {/* ══════════════════ BOOK ══════════════════ */}
      {/* Brown underlay (back cover + spine) removed — only pages visible */}

      {/* ── Page stacks (visibility controlled in useFrame) ── */}
      {leftStackH > 0.001 && (
        <mesh ref={leftStackRef} position={[-PAGE_W / 2, COVER_T + leftStackH / 2, 0]} visible={false}>
          <boxGeometry args={[PAGE_W - 0.01, leftStackH, PAGE_H - 0.01]} />
          <meshStandardMaterial color="#f0ebe0" roughness={0.88} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
        </mesh>
      )}
      {rightStackH > 0.001 && (
        <mesh ref={rightStackRef} position={[PAGE_W / 2, COVER_T + rightStackH / 2, 0]} visible={false}>
          <boxGeometry args={[PAGE_W - 0.01, rightStackH, PAGE_H - 0.01]} />
          <meshStandardMaterial color="#f0ebe0" roughness={0.88} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
        </mesh>
      )}

      {/* ── Static left page (always present, imperative visibility) ── */}
      <mesh ref={leftStaticRef} position={[-PAGE_W / 2, COVER_T + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} visible={false}>
        <planeGeometry args={[PAGE_W, PAGE_H]} />
        <meshStandardMaterial ref={leftStaticMatRef} roughness={0.85} side={THREE.FrontSide} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>

      {/* ── Static right page (always present, imperative visibility) ── */}
      <mesh ref={rightStaticRef} position={[PAGE_W / 2, COVER_T + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} visible={false}>
        <planeGeometry args={[PAGE_W, PAGE_H]} />
        <meshStandardMaterial ref={rightStaticMatRef} roughness={0.85} side={THREE.FrontSide} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>

      {/* ── Turning page ── */}
      <PageMesh
        pageWidth={PAGE_W}
        pageHeight={PAGE_H}
        segments={segs}
        turnProgressRef={turnProgressRef}
        frontTexRef={frontTexRef}
        backTexRef={backTexRef}
        visibleRef={pageMeshVisibleRef}
        yOffsetRef={yOffsetRef}
      />

      {/* ── Front Cover (animated) ── */}
      <group ref={frontCoverGroupRef} position={[0, CLOSED_COVER_Y, 0]}>
        {/* Leather cover box */}
        <mesh position={[(PAGE_W + 0.06) / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[PAGE_W + 0.06, COVER_T, PAGE_H + 0.08]} />
          <meshStandardMaterial color="#5c3317" roughness={0.6} metalness={0.05} />
        </mesh>

        {/* Cover art — OUTSIDE / top face (visible when closed) */}
        {coverTex && (
          <mesh position={[(PAGE_W + 0.06) / 2, COVER_T / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[PAGE_W + 0.02, PAGE_H + 0.04]} />
            <meshStandardMaterial map={coverTex} roughness={0.7} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
          </mesh>
        )}

        {/* TOC page — INSIDE face (visible when open, lying on the left) */}
        <mesh position={[(PAGE_W + 0.06) / 2, -COVER_T / 2 - 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          <meshStandardMaterial
            ref={insideCoverMatRef}
            side={THREE.BackSide}
            roughness={0.85}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      </group>
    </group>
  );
}
