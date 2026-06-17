'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Photos ──
export const GALLERY_PHOTOS = [
  { id: 1, title: 'TIRANDO LAS TIRADAS ESPECIALES', image: '/img/1.jpg' },
  { id: 2, title: 'Ta Wena la foto', image: '/img/2.jpg' },
  { id: 3, title: 'Ta wena la foto x2', image: '/img/3.jpg' },
  { id: 4, title: 'Ni se nota q no traias Permiso xD', image: '/img/4.jpg' },
  { id: 5, title: 'Esta na mas porq te gusto', image: '/img/5.jpg' },
  { id: 6, title: 'Ya tu sabe xD', image: '/img/6.jpg' },
];

// ── Constants ──
const N = GALLERY_PHOTOS.length;
const ANGLE_STEP = (2 * Math.PI) / N;
const RADIUS = 3.5;
const AUTO_ROTATE_SPEED = 0.12;
const DRAG_FACTOR = 0.005;
const AUTO_WAIT = 3000;

// ── Rounded rect geometry ──
function roundedRectGeometry(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const r2 = Math.min(r, w / 2, h / 2);
  const W = w / 2;
  const H = h / 2;
  shape.moveTo(-W + r2, -H);
  shape.lineTo(W - r2, -H);
  shape.quadraticCurveTo(W, -H, W, -H + r2);
  shape.lineTo(W, H - r2);
  shape.quadraticCurveTo(W, H, W - r2, H);
  shape.lineTo(-W + r2, H);
  shape.quadraticCurveTo(-W, H, -W, H - r2);
  shape.lineTo(-W, -H + r2);
  shape.quadraticCurveTo(-W, -H, -W + r2, -H);
  return new THREE.ShapeGeometry(shape);
}

// Will be computed per-photo based on aspect ratio

// ── Fallback placeholder texture ──
function createPlaceholder() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, '#f5f0e8');
  grad.addColorStop(1, '#e8d4b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Custom texture loader (no Suspense, with fallback) ──
function useTextureLoader(urls: string[]): THREE.Texture[] {
  const texturesRef = useRef<THREE.Texture[]>([]);
  const [, bump] = useState(0);

  useEffect(() => {
    let dead = false;
    const loader = new THREE.TextureLoader();

    texturesRef.current = urls.map(() => {
      const t = createPlaceholder();
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    bump(n => n + 1);

    urls.forEach((url, i) => {
      loader.load(
        url,
        (tex) => {
          if (dead) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          texturesRef.current[i] = tex;
          bump(n => n + 1);
        },
        undefined,
        () => {
          if (dead) return;
          texturesRef.current[i].needsUpdate = true;
          bump(n => n + 1);
        },
      );
    });

    return () => { dead = true; };
  }, [urls.join(',')]);

  return texturesRef.current;
}

// ── Particles ──
const PARTICLE_COUNT = 100;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const theta = Math.random() * 2 * Math.PI;
  const radius = 1.5 + Math.random() * 4.5;
  particlePositions[i * 3] = Math.cos(theta) * radius;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
  particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[particlePositions, 3]} attach="attributes-position" count={PARTICLE_COUNT} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#d4a574" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ── Component ──
interface Gallery3DCarouselProps {
  targetIndex: number;
  onPhotoChange: (index: number) => void;
  onPhotoDoubleTap?: (index: number) => void;
}

export function Gallery3DCarousel({ targetIndex, onPhotoChange, onPhotoDoubleTap }: Gallery3DCarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const photoGroups = useRef<(THREE.Group | null)[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const rot = useRef(0);
  const targetRot = useRef(0);
  const vel = useRef(0);
  const dragging = useRef(false);
  const ptrStart = useRef(0);
  const ptrTotal = useRef(0);
  const ptrMoved = useRef(false);
  const lastInteraction = useRef(Infinity);
  const lastTap = useRef({ time: 0, idx: -1 });
  const [activeIdx, setActiveIdx] = useState(0);
  const prevTarget = useRef(targetIndex);
  const { gl, camera } = useThree();

  const textures = useTextureLoader(GALLERY_PHOTOS.map(p => p.image));

  const aspectRatios = useMemo(() => {
    return textures.map(t => {
      const img = t.image as HTMLImageElement | HTMLCanvasElement | null;
      if (img && img.width && img.height) return img.width / img.height;
      return 1;
    });
  }, [textures]);

  const photoDims = useMemo(() => {
    const baseSize = 1.35;
    return aspectRatios.map(ar => {
      if (ar >= 1) return { w: baseSize, h: baseSize / ar };
      return { w: baseSize * ar, h: baseSize };
    });
  }, [aspectRatios]);

  const photoGeos = useMemo(() =>
    photoDims.map(d => roundedRectGeometry(d.w, d.h, 0.10)),
  [photoDims]);

  const backingGeos = useMemo(() =>
    photoDims.map(d => roundedRectGeometry(d.w + 0.2, d.h + 0.2, 0.14)),
  [photoDims]);

  const frameGeos = useMemo(() =>
    photoDims.map(d => roundedRectGeometry(d.w + 0.25, d.h + 0.25, 0.16)),
  [photoDims]);

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  const snapTo = useCallback((idx: number) => {
    const target = -idx * ANGLE_STEP;
    let diff = target - rot.current;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    targetRot.current = rot.current + diff;
    vel.current = 0;
    setActiveIdx(idx);
    onPhotoChange(idx);
  }, [onPhotoChange]);

  const snapNearest = useCallback(() => {
    const norm = (((rot.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    snapTo(Math.round(norm / ANGLE_STEP) % N);
  }, [snapTo]);

  useEffect(() => {
    if (prevTarget.current !== targetIndex) {
      prevTarget.current = targetIndex;
      snapTo(targetIndex);
    }
  }, [targetIndex, snapTo]);

  // Pointer events
  useEffect(() => {
    const canvas = gl.domElement;

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      ptrStart.current = e.clientX;
      ptrTotal.current = 0;
      ptrMoved.current = false;
      lastInteraction.current = Date.now();
      vel.current = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - ptrStart.current;
      ptrStart.current = e.clientX;
      ptrTotal.current += Math.abs(dx);
      if (ptrTotal.current > 5) ptrMoved.current = true;
      rot.current += dx * DRAG_FACTOR;
      targetRot.current = rot.current;
      lastInteraction.current = Date.now();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;

      if (!ptrMoved.current) {
        const rect = canvas.getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        groupRef.current?.updateMatrixWorld(true);
        raycaster.current.setFromCamera(pointer.current, camera);

        const valid = meshes.current.filter((m): m is THREE.Mesh => m !== null);
        const hits = raycaster.current.intersectObjects(valid, false);
        if (hits.length > 0) {
          const idx = hits[0].object.userData.index as number;
          if (idx !== undefined) {
            const now = Date.now();
            if (idx === lastTap.current.idx && now - lastTap.current.time < 350) {
              lastTap.current = { time: 0, idx: -1 };
              onPhotoDoubleTap?.(idx);
              return;
            }
            lastTap.current = { time: now, idx };
            if (idx !== activeIdx) snapTo(idx);
            return;
          }
        }
      }
      snapNearest();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [gl, camera, snapTo, snapNearest, activeIdx, onPhotoDoubleTap]);

  useEffect(() => {
    gl.domElement.addEventListener('contextmenu', (e: Event) => e.preventDefault());
  }, [gl]);

  // Main loop
  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 1 / 30);

    if (!dragging.current && Date.now() - lastInteraction.current > AUTO_WAIT) {
      rot.current += AUTO_ROTATE_SPEED * dt;
      targetRot.current = rot.current;
    }

    const diff = targetRot.current - rot.current;
    vel.current += (diff * 7 + vel.current * -3.2) * dt;
    rot.current += vel.current * dt;

    if (Math.abs(diff) < 0.0003 && Math.abs(vel.current) < 0.0003) {
      rot.current = targetRot.current;
      vel.current = 0;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = rot.current;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.04;
    }

    photoGroups.current.forEach((g, i) => {
      if (g) {
        g.position.y = 0.15 + Math.sin(clock.getElapsedTime() * 0.5 + i * 0.9) * 0.06;
        const targetScale = i === activeIdx ? 1.08 : 1;
        const s = g.scale.x;
        g.scale.setScalar(s + (targetScale - s) * Math.min(1, 4 * dt));
      }
    });
  });

  return (
    <>
      <FloatingParticles />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <ringGeometry args={[1.2, 4.2, 48]} />
        <meshBasicMaterial color="#d4a574" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <group ref={groupRef}>
        {textures.map((texture, i) => {
          const angle = i * ANGLE_STEP;
          const x = RADIUS * Math.sin(angle);
          const z = RADIUS * Math.cos(angle);
          const isActive = i === activeIdx;
          const depth = Math.cos(angle - rot.current);

          return (
            <group
              key={i}
              ref={(el) => { photoGroups.current[i] = el; }}
              position={[x, 0.15, z]}
              rotation={[0, angle, 0]}
            >
              {/* White mat backing */}
              <mesh geometry={backingGeos[i]} position={[0, 0, -0.025]}>
                <meshStandardMaterial color="#f5f2ed" roughness={0.9} metalness={0} />
              </mesh>

              {isActive && (
                <mesh geometry={frameGeos[i]} position={[0, 0, -0.015]}>
                  <meshBasicMaterial color="#d4a574" transparent opacity={0.5} />
                </mesh>
              )}

              <mesh
                geometry={photoGeos[i]}
                ref={(el) => { meshes.current[i] = el; }}
                userData={{ index: i }}
              >
                <meshStandardMaterial map={texture} roughness={0.25} metalness={0} />
              </mesh>

              {isActive && (
                <mesh geometry={photoGeos[i]} position={[0, 0, 0.005]}>
                  <meshBasicMaterial color="#d4a574" transparent opacity={0.06} />
                </mesh>
              )}



              {/* Shadow under photo */}
              <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[photoDims[i].w * 0.55, photoDims[i].h * 0.55]} />
                <meshBasicMaterial
                  color="#2a2a2a"
                  transparent
                  opacity={0.03 * (1 - Math.abs(depth) / Math.PI)}
                  depthWrite={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}
