import * as THREE from 'three';
import { animals, type Animal } from '@/data/animals';

export type Quality = 'low' | 'med' | 'high';

const RESOLUTIONS: Record<Quality, { w: number; h: number }> = {
  low: { w: 512, h: 720 },
  med: { w: 1024, h: 1440 },
  high: { w: 1536, h: 2160 },
};

/* Total content pages: 0=cover,1=TOC,2..28=animals,29=backCover */
export const TOTAL_PAGES = 30;

// ─────────────── image preloader ───────────────

const imageCache = new Map<string, HTMLImageElement>();
let imagesReady = false;
let imageLoadCallbacks: (() => void)[] = [];

/** Start preloading all animal images. Returns a promise that resolves when all are loaded. */
export function preloadAnimalImages(): Promise<void> {
  if (imagesReady) return Promise.resolve();

  const imageAnimals = animals.filter((a) => a.image);
  if (imageAnimals.length === 0) {
    imagesReady = true;
    return Promise.resolve();
  }

  let loaded = 0;
  const total = imageAnimals.length;

  return new Promise<void>((resolve) => {
    for (const animal of imageAnimals) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.set(animal.image!, img);
        loaded++;
        if (loaded >= total) {
          imagesReady = true;
          // Clear caches so pages & backdrops redraw with actual images
          clearTextureCache();
          clearBackdropCache();
          // Notify listeners
          for (const cb of imageLoadCallbacks) cb();
          imageLoadCallbacks = [];
          resolve();
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) {
          imagesReady = true;
          clearTextureCache();
          clearBackdropCache();
          for (const cb of imageLoadCallbacks) cb();
          imageLoadCallbacks = [];
          resolve();
        }
      };
      img.src = `/images/${animal.image}`;
    }
  });
}

/** Register a callback for when images finish loading (for triggering re-render). */
export function onImagesLoaded(cb: () => void) {
  if (imagesReady) { cb(); return; }
  imageLoadCallbacks.push(cb);
}

/** Get a preloaded image (or null if not yet loaded / not available). */
function getAnimalImage(filename: string | undefined): HTMLImageElement | null {
  if (!filename) return null;
  return imageCache.get(filename) ?? null;
}

// ─────────────── helpers ───────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
): number {
  const lines = wrapText(ctx, text, maxW);
  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += lineH;
  }
  return y;
}

function addPaperTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  // Subtle paper-grain effect using semi-transparent patches
  ctx.save();
  for (let i = 0; i < 160; i++) {
    const r = 180 + Math.random() * 40;
    const g = 170 + Math.random() * 40;
    const b = 150 + Math.random() * 40;
    ctx.fillStyle = `rgba(${r},${g},${b},0.04)`;
    const px = Math.random() * w;
    const py = Math.random() * h;
    const sz = Math.random() * (w * 0.06) + 4;
    ctx.fillRect(px, py, sz, sz * (0.5 + Math.random()));
  }
  ctx.restore();
}

function sizeBadgeColor(size: Animal['size']): string {
  switch (size) {
    case 'small':
      return '#4a8c5c';
    case 'medium':
      return '#3a7cbd';
    case 'large':
      return '#c67b30';
    case 'giant':
      return '#b03a3a';
  }
}

// ─────────────── page drawers ───────────────

function drawCover(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Rich dark background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#3a1f0d');
  grad.addColorStop(0.5, '#5c3317');
  grad.addColorStop(1, '#3a1f0d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative border
  const bm = w * 0.06;
  ctx.strokeStyle = '#c9a44a';
  ctx.lineWidth = w * 0.005;
  ctx.strokeRect(bm, bm, w - bm * 2, h - bm * 2);
  ctx.strokeRect(bm * 1.4, bm * 1.4, w - bm * 2.8, h - bm * 2.8);

  // Title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `bold ${w * 0.09}px Georgia, "Times New Roman", serif`;
  ctx.fillStyle = '#e8d5a3';
  ctx.fillText('BOOK OF', w / 2, h * 0.35);

  ctx.font = `bold ${w * 0.12}px Georgia, "Times New Roman", serif`;
  ctx.fillStyle = '#f0e0b0';
  ctx.fillText('ANIMALS', w / 2, h * 0.48);

  // Separator line
  ctx.strokeStyle = '#c9a44a';
  ctx.lineWidth = w * 0.003;
  ctx.beginPath();
  ctx.moveTo(w * 0.25, h * 0.56);
  ctx.lineTo(w * 0.75, h * 0.56);
  ctx.stroke();

  // Subtitle
  ctx.font = `italic ${w * 0.035}px Georgia, "Times New Roman", serif`;
  ctx.fillStyle = '#c9a44a';
  ctx.fillText('An Interactive Encyclopedia', w / 2, h * 0.63);
  ctx.fillText('27 species from small to giant', w / 2, h * 0.68);

  // Small decoration
  ctx.font = `${w * 0.05}px serif`;
  ctx.fillText('🐾', w / 2, h * 0.78);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawToc(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const m = w * 0.07;

  // Title
  ctx.font = `bold ${w * 0.08}px Georgia, serif`;
  ctx.fillStyle = '#2c1810';
  ctx.textAlign = 'center';
  ctx.fillText('TABLE OF CONTENTS', w / 2, m + w * 0.075);
  ctx.textAlign = 'left';

  // Separator
  ctx.strokeStyle = '#c0a882';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m, m + w * 0.105);
  ctx.lineTo(w - m, m + w * 0.105);
  ctx.stroke();

  // Two columns of animals
  const startY = m + w * 0.145;
  const lineH = w * 0.05;
  const col2X = w / 2 + m * 0.3;
  const fontSize = w * 0.038;

  ctx.font = `${fontSize}px Georgia, serif`;
  ctx.fillStyle = '#3a2a1a';

  for (let i = 0; i < animals.length; i++) {
    const col = i < 14 ? 0 : 1;
    const row = i < 14 ? i : i - 14;
    const x = col === 0 ? m : col2X;
    const y = startY + row * lineH;

    const num = String(i + 1).padStart(2, ' ');
    const name = animals[i].nameEn;
    const pStr = String(i + 1);

    ctx.fillStyle = '#3a2a1a';
    ctx.fillText(`${num}. ${name}`, x, y);

    // Dotted line to page number
    const textW = ctx.measureText(`${num}. ${name}`).width;
    const endX = col === 0 ? col2X - m * 0.6 : w - m;
    ctx.fillStyle = '#a09080';
    const dotStart = x + textW + 6;
    for (let dx = dotStart; dx < endX - fontSize * 1.5; dx += 7) {
      ctx.fillRect(dx, y - 3, 2, 2);
    }
    ctx.fillStyle = '#5c4033';
    ctx.textAlign = 'right';
    ctx.fillText(pStr, endX, y);
    ctx.textAlign = 'left';
  }
}

/** Draw text that wraps, respecting an image zone on the right.
 *  While y < imgBottom, text wraps to narrowW; after that, to fullW. */
function drawWrappedAroundImage(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  narrowW: number,
  fullW: number,
  lineH: number,
  imgBottom: number,
): number {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const maxW = y < imgBottom ? narrowW : fullW;
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      y += lineH;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineH;
  }
  return y;
}

function drawAnimalPage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  animal: Animal,
  pageNum: number,
) {
  const m = w * 0.06;
  const cw = w - m * 2;
  const gap = w * 0.02; // gap between text and image

  // ── Image (top right) — define first so we know the zone ──
  const imgW = cw * 0.42;
  const imgH = imgW * 1.0;
  const imgX = w - m - imgW;
  const imgY = m;
  const imgBottom = imgY + imgH + gap;
  const narrowTextW = imgX - m - gap; // text width when beside the image
  const fullTextW = cw;

  // Draw image
  const loadedImg = getAnimalImage(animal.image);
  if (loadedImg) {
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, imgX, imgY, imgW, imgH, 8);
    ctx.clip();
    const srcAR = loadedImg.naturalWidth / loadedImg.naturalHeight;
    const dstAR = imgW / imgH;
    let sx = 0, sy = 0, sw = loadedImg.naturalWidth, sh = loadedImg.naturalHeight;
    if (srcAR > dstAR) {
      sw = loadedImg.naturalHeight * dstAR;
      sx = (loadedImg.naturalWidth - sw) / 2;
    } else {
      sh = loadedImg.naturalWidth / dstAR;
      sy = (loadedImg.naturalHeight - sh) / 2;
    }
    ctx.drawImage(loadedImg, sx, sy, sw, sh, imgX, imgY, imgW, imgH);
    ctx.restore();
    ctx.strokeStyle = '#8b7b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    roundRect(ctx, imgX, imgY, imgW, imgH, 8);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#e8e0d4';
    roundRect(ctx, imgX, imgY, imgW, imgH, 8);
    ctx.fill();
    ctx.strokeStyle = '#c0b0a0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    roundRect(ctx, imgX, imgY, imgW, imgH, 8);
    ctx.stroke();
    ctx.font = `bold ${w * 0.04}px Georgia, serif`;
    ctx.fillStyle = '#b0a090';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(animal.nameEn, imgX + imgW / 2, imgY + imgH * 0.45);
    ctx.font = `${w * 0.028}px Arial, sans-serif`;
    ctx.fillStyle = '#c0b0a0';
    ctx.fillText('[image]', imgX + imgW / 2, imgY + imgH * 0.65);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  // ── Title (left of image, auto-shrink to fit) ──
  let y = m;
  const titleText = animal.nameEn.toUpperCase();
  let titleFontSz = w * 0.09;
  ctx.font = `bold ${titleFontSz}px Georgia, serif`;
  // Shrink title if it would overlap the image
  while (ctx.measureText(titleText).width > narrowTextW && titleFontSz > w * 0.04) {
    titleFontSz -= w * 0.004;
    ctx.font = `bold ${titleFontSz}px Georgia, serif`;
  }
  ctx.fillStyle = '#2c1810';
  ctx.fillText(titleText, m, y + titleFontSz * 0.88);
  y += titleFontSz * 1.2;

  // ── Size badge ──
  const badgeW = w * 0.18;
  const badgeH = w * 0.05;
  const badgeY = y;
  ctx.fillStyle = sizeBadgeColor(animal.size);
  roundRect(ctx, m, badgeY, badgeW, badgeH, 6);
  ctx.fill();
  ctx.font = `bold ${w * 0.032}px Arial, sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.fillText(animal.size.toUpperCase(), m + 10, badgeY + badgeH * 0.72);

  y += badgeH + w * 0.015;

  // Weight / length
  ctx.font = `${w * 0.036}px Arial, sans-serif`;
  ctx.fillStyle = '#5c4033';
  ctx.fillText(`Weight: ${animal.weight}`, m, y + w * 0.033);
  y += w * 0.05;
  ctx.fillText(`Length: ${animal.length}`, m, y + w * 0.033);
  y += w * 0.065;

  // ── Sections — text wraps around image ──
  const secFontSz = w * 0.038;
  const secHeadSz = w * 0.034;
  const secLineH = secFontSz * 1.45;

  const sections: [string, string][] = [
    ['ORIGIN', animal.origin],
    ['DESCRIPTION', animal.description],
    ['DIET', animal.diet],
    ['FUN FACT', `★ ${animal.funFact}`],
    ['STATUS', animal.status],
  ];

  for (const [title, body] of sections) {
    if (y > h - m * 2.5) break; // prevent overflow

    // Section header
    ctx.font = `bold ${secHeadSz}px Arial, sans-serif`;
    ctx.fillStyle = '#8b6b50';
    ctx.fillText(title, m, y);
    y += secHeadSz * 1.3;

    // Section body — wraps around image if text is still beside it
    ctx.font = `${secFontSz}px Georgia, serif`;
    ctx.fillStyle = '#3a2a1a';
    y = drawWrappedAroundImage(ctx, body, m, y, narrowTextW, fullTextW, secLineH, imgBottom);
    y += secFontSz * 0.6;
  }

  // ── Page number ──
  ctx.font = `${w * 0.035}px Arial, sans-serif`;
  ctx.fillStyle = '#a09080';
  ctx.textAlign = 'center';
  ctx.fillText(String(pageNum), w / 2, h - m * 0.6);
  ctx.textAlign = 'left';
}

function drawBackCover(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#3a1f0d');
  grad.addColorStop(0.5, '#5c3317');
  grad.addColorStop(1, '#3a1f0d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Border
  const bm = w * 0.06;
  ctx.strokeStyle = '#c9a44a';
  ctx.lineWidth = w * 0.005;
  ctx.strokeRect(bm, bm, w - bm * 2, h - bm * 2);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `italic ${w * 0.045}px Georgia, serif`;
  ctx.fillStyle = '#c9a44a';
  ctx.fillText('The End', w / 2, h * 0.45);

  ctx.font = `${w * 0.025}px Georgia, serif`;
  ctx.fillStyle = '#a08860';
  ctx.fillText('Book of Animals — Interactive 3D Edition', w / 2, h * 0.55);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─────────────── main API ───────────────

/** Create a CanvasTexture for a given content page.
 *  `mirrored = true` flips horizontally (needed for BackSide material). */
export function createPageTexture(
  pageIndex: number,
  quality: Quality,
  mirrored = false,
): THREE.CanvasTexture {
  const { w, h } = RESOLUTIONS[quality];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Paper background (always drawn un-mirrored for natural grain)
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, w, h);
  if (quality !== 'low') addPaperTexture(ctx, w, h);

  // Apply mirror transform for BackSide textures
  if (mirrored) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  // Draw content
  if (pageIndex === 0) {
    drawCover(ctx, w, h);
  } else if (pageIndex === 1) {
    drawToc(ctx, w, h);
  } else if (pageIndex === TOTAL_PAGES - 1) {
    drawBackCover(ctx, w, h);
  } else {
    const animalIdx = pageIndex - 2;
    if (animalIdx >= 0 && animalIdx < animals.length) {
      drawAnimalPage(ctx, w, h, animals[animalIdx], animalIdx + 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// ─────────────── texture cache ───────────────

const cache = new Map<string, THREE.CanvasTexture>();

export function getCachedTexture(
  pageIndex: number,
  quality: Quality,
  mirrored = false,
): THREE.CanvasTexture {
  const key = `${pageIndex}_${quality}_${mirrored ? 'm' : 'n'}`;
  let tex = cache.get(key);
  if (!tex) {
    tex = createPageTexture(pageIndex, quality, mirrored);
    cache.set(key, tex);
  }
  return tex;
}

export function clearTextureCache() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}

// ─────────────── endpaper textures (inside of covers) ───────────────

const endpaperCache = new Map<string, THREE.CanvasTexture>();

function createEndpaperTexture(quality: Quality): THREE.CanvasTexture {
  const { w, h } = RESOLUTIONS[quality];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Rich dark burgundy/maroon gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#3a1520');
  grad.addColorStop(0.35, '#2e1018');
  grad.addColorStop(0.65, '#351520');
  grad.addColorStop(1, '#2a0e15');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle marbled swirl pattern
  ctx.globalAlpha = 1;
  for (let i = 0; i < 80; i++) {
    const x1 = Math.random() * w;
    const y1 = Math.random() * h;
    const cpx = x1 + (Math.random() - 0.5) * w * 0.5;
    const cpy = y1 + (Math.random() - 0.5) * h * 0.3;
    const x2 = Math.random() * w;
    const y2 = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpx, cpy, x2, y2);
    ctx.strokeStyle = `rgba(200, 160, 120, ${0.015 + Math.random() * 0.025})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.stroke();
  }

  const m = w * 0.06;

  // Outer border (double frame, classic bookbinding style)
  ctx.strokeStyle = 'rgba(200, 170, 120, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(m, m, w - m * 2, h - m * 2);
  ctx.strokeStyle = 'rgba(200, 170, 120, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2);

  // Corner ornaments (small L-brackets)
  const oSize = w * 0.04;
  const oInset = m + 18;
  ctx.strokeStyle = 'rgba(200, 170, 120, 0.2)';
  ctx.lineWidth = 1.5;
  const corners = [
    [oInset, oInset, 1, 1],
    [w - oInset, oInset, -1, 1],
    [oInset, h - oInset, 1, -1],
    [w - oInset, h - oInset, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * oSize);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * oSize, cy);
    ctx.stroke();
  }

  // Central bookplate
  const plateW = w * 0.52;
  const plateH = h * 0.22;
  const plateX = (w - plateW) / 2;
  const plateY = (h - plateH) / 2;

  // Plate background with subtle gradient
  const plateGrad = ctx.createLinearGradient(plateX, plateY, plateX, plateY + plateH);
  plateGrad.addColorStop(0, 'rgba(25, 12, 8, 0.55)');
  plateGrad.addColorStop(1, 'rgba(18, 8, 6, 0.65)');
  ctx.fillStyle = plateGrad;
  ctx.fillRect(plateX, plateY, plateW, plateH);

  // Plate border
  ctx.strokeStyle = 'rgba(200, 170, 120, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(plateX, plateY, plateW, plateH);
  ctx.strokeRect(plateX + 4, plateY + 4, plateW - 8, plateH - 8);

  // Bookplate text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `italic ${w * 0.028}px Georgia, serif`;
  ctx.fillStyle = 'rgba(200, 170, 120, 0.45)';
  ctx.fillText('Ex Libris', w / 2, plateY + plateH * 0.22);

  // Thin separator line
  ctx.strokeStyle = 'rgba(200, 170, 120, 0.15)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - w * 0.1, plateY + plateH * 0.35);
  ctx.lineTo(w / 2 + w * 0.1, plateY + plateH * 0.35);
  ctx.stroke();

  ctx.font = `bold ${w * 0.04}px Georgia, serif`;
  ctx.fillStyle = 'rgba(220, 190, 140, 0.55)';
  ctx.fillText('BOOK OF ANIMALS', w / 2, plateY + plateH * 0.53);

  ctx.font = `${w * 0.022}px Georgia, serif`;
  ctx.fillStyle = 'rgba(200, 170, 120, 0.35)';
  ctx.fillText('An Interactive Encyclopedia', w / 2, plateY + plateH * 0.72);

  // Small paw prints below the plate
  const pawY = plateY + plateH + h * 0.06;
  ctx.font = `${w * 0.03}px serif`;
  ctx.fillStyle = 'rgba(200, 160, 120, 0.15)';
  ctx.fillText('\u{1F43E}', w / 2, pawY);

  ctx.textAlign = 'left';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/** Get a cached endpaper texture (for inside of book covers). */
export function getEndpaperTexture(quality: Quality): THREE.CanvasTexture {
  const key = `ep_${quality}`;
  let tex = endpaperCache.get(key);
  if (!tex) {
    tex = createEndpaperTexture(quality);
    endpaperCache.set(key, tex);
  }
  return tex;
}

// ─────────────── backdrop textures (blurred animal photo backgrounds) ───────────────

const bdCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates a heavily blurred, darkened version of the animal's photo
 * for use as an atmospheric background panel behind the book.
 * Blur is achieved by drawing at tiny resolution then scaling up.
 */
function createBackdropTexture(animal: Animal | null): THREE.CanvasTexture {
  const w = 512, h = 720;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Dark base
  ctx.fillStyle = '#080810';
  ctx.fillRect(0, 0, w, h);

  const img = animal ? getAnimalImage(animal.image) : null;

  if (img) {
    // ── Draw blurred image ──
    // Step 1: draw image at very small size (creates blur when scaled up)
    const blurSize = 16; // smaller = more blur
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = blurSize;
    tmpCanvas.height = blurSize;
    const tmpCtx = tmpCanvas.getContext('2d')!;

    // Cover-fit into the tiny canvas
    const srcAR = img.naturalWidth / img.naturalHeight;
    const dstAR = 1;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcAR > dstAR) {
      sw = img.naturalHeight * dstAR;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / dstAR;
      sy = (img.naturalHeight - sh) / 2;
    }
    tmpCtx.drawImage(img, sx, sy, sw, sh, 0, 0, blurSize, blurSize);

    // Step 2: draw tiny image scaled up to full size (creates natural blur)
    ctx.drawImage(tmpCanvas, 0, 0, blurSize, blurSize, 0, 0, w, h);

    // Step 3: darken with overlay (keep it moody, not distracting)
    ctx.fillStyle = 'rgba(5, 5, 12, 0.55)';
    ctx.fillRect(0, 0, w, h);

    // Step 4: vignette (darker edges)
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Animal name at the bottom
    ctx.font = `bold ${w * 0.09}px Georgia, serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(animal!.nameEn.toUpperCase(), w / 2, h * 0.88);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  } else {
    // No image available — subtle generic backdrop
    const hue = animal ? ((animal.id - 1) / 27) * 360 : 230;
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    grad.addColorStop(0, `hsla(${hue}, 25%, 12%, 1)`);
    grad.addColorStop(1, `hsla(${hue}, 20%, 4%, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (animal) {
      ctx.font = `bold ${w * 0.1}px Georgia, serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(animal.nameEn.toUpperCase(), w / 2, h * 0.5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/** Get a cached blurred backdrop texture for the given animal (null = generic). */
export function getBackdropTexture(animal: Animal | null): THREE.CanvasTexture {
  const key = animal ? `bd_${animal.id}` : 'bd_null';
  let tex = bdCache.get(key);
  if (!tex) {
    tex = createBackdropTexture(animal);
    bdCache.set(key, tex);
  }
  return tex;
}

/** Clear backdrop cache (called when images finish loading so backdrops regenerate with photos). */
export function clearBackdropCache() {
  bdCache.forEach((t) => t.dispose());
  bdCache.clear();
}
