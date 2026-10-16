'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  SOVEREIGN_SURFACES,
  STANDARD_SURFACE_TENORS,
  SurfaceColorPalette,
  getSurfaceColor,
} from '../../data/yield-curve-3d-data';
import { YieldCurveSurfaceDataset, YieldCurveSurfaceSlice } from '../../lib/types';
import { useThemeMode } from '../../context/AppContext';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Layers,
  Palette,
  Calendar,
  Maximize2,
  Info,
} from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
  valid: boolean;
}

interface QuadFace {
  indices: [number, number]; // [timeIndex, tenorIndex]
  pts: [ProjectedPoint, ProjectedPoint, ProjectedPoint, ProjectedPoint];
  avgDepth: number;
  avgYield: number;
  normalZ: number;
}

interface YieldCurve3DSurfaceProps {
  selectedSovereign?: 'USA' | 'DEU' | 'JPN' | 'GBR';
}

type CameraPreset = 'isometric' | 'tenor-profile' | 'time-profile' | 'contour-top';
type RenderStyle = 'shaded-wire' | 'shaded' | 'wireframe';

export function YieldCurve3DSurface({
  selectedSovereign = 'USA',
}: YieldCurve3DSurfaceProps) {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  // State controls for datasets and views
  const sovereign = selectedSovereign;
  const [resolutionMode, setResolutionMode] = useState<'longterm' | 'modern'>('longterm');
  const [palette, setPalette] = useState<SurfaceColorPalette>('thermal');
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('shaded-wire');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');

  // Animation and scrubbing state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [activeSliceIndex, setActiveSliceIndex] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<{ timeIdx: number; tenorIdx: number } | null>(null);

  // Resolve current active dataset based on sovereign and resolution
  const dataset: YieldCurveSurfaceDataset = useMemo(() => {
    const sovereignData = SOVEREIGN_SURFACES[sovereign];
    if (resolutionMode === 'modern' && sovereignData.modern) {
      return sovereignData.modern;
    }
    return sovereignData.longterm;
  }, [sovereign, resolutionMode]);

  // Precompute dynamic yield bounds once per dataset so high-frequency drag/hover frames avoid redundant full-grid scans
  const { minYield, yieldSpan } = useMemo(() => {
    let min = dataset.minYield;
    let max = dataset.maxYield;
    dataset.slices.forEach((s) => {
      s.curve.forEach((pt) => {
        if (pt.yieldPercent < min) min = pt.yieldPercent;
        if (pt.yieldPercent > max) max = pt.yieldPercent;
      });
    });
    return {
      minYield: min,
      yieldSpan: Math.max(0.1, max - min),
    };
  }, [dataset]);

  // Keep active slice index bounded when switching datasets
  useEffect(() => {
    if (activeSliceIndex >= dataset.slices.length) {
      setActiveSliceIndex(dataset.slices.length - 1);
    }
  }, [dataset, activeSliceIndex]);

  // Canvas and interaction references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderSceneRef = useRef<(() => void) | null>(null);

  // 3D camera angles in radians (azimuth theta and pitch phi)
  const cameraRef = useRef<{
    theta: number; // Azimuth: rotation around Z axis in the horizontal plane
    phi: number; // Pitch: vertical elevation angle
    zoom: number; // Perspective distance scaler
  }>({
    theta: -Math.PI / 4,
    phi: Math.PI / 6,
    zoom: 1.05,
  });

  const mouseStateRef = useRef<{
    isDragging: boolean;
    lastX: number;
    lastY: number;
  }>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  // Apply predefined camera angles optimized for financial term structure inspection
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    switch (preset) {
      case 'isometric':
        cameraRef.current = { theta: -Math.PI / 4, phi: Math.PI / 6, zoom: 1.05 };
        break;
      case 'tenor-profile':
        // Front-facing view looking along the time axis to emphasize yield curve curvature
        cameraRef.current = { theta: 0, phi: 0.15, zoom: 1.15 };
        break;
      case 'time-profile':
        // Side view looking along the maturity axis to track historical yield trajectories
        cameraRef.current = { theta: -Math.PI / 2, phi: 0.15, zoom: 1.15 };
        break;
      case 'contour-top':
        // Bird's-eye view looking directly downward like a topographic heat map
        cameraRef.current = { theta: 0, phi: Math.PI / 2.05, zoom: 1.1 };
        break;
    }
    renderSceneRef.current?.();
  };

  // Playback timer to sweep time across historical yield curves
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSliceIndex((prev) => {
        if (prev >= dataset.slices.length - 1) {
          return 0; // Loop back to start to maintain continuous cycle review
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isPlaying, dataset.slices.length]);

  // 3D coordinate transformation and projection pipeline
  const project3D = useCallback(
    (
      p: Point3D,
      width: number,
      height: number,
      theta: number,
      phi: number,
      zoom: number
    ): ProjectedPoint => {
      // Rotate around vertical Z-axis (azimuth)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const x1 = p.x * cosT - p.y * sinT;
      const y1 = p.x * sinT + p.y * cosT;
      const z1 = p.z;

      // Rotate around X-axis (elevation / pitch angle)
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const x2 = x1;
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;

      // Camera distance and perspective division
      const cameraDist = 3.6 / zoom;
      const depth = cameraDist + y2;

      // Guard against division by zero if geometry passes behind the camera near plane
      if (depth <= 0.1) {
        return { x: 0, y: 0, depth, valid: false };
      }

      const fov = 0.95;
      const scale = Math.min(width, height) * fov;
      const projX = width / 2 + (x2 / depth) * scale;
      const projY = height / 2 - (z2 / depth) * scale * 0.95;

      return { x: projX, y: projY, depth, valid: true };
    },
    []
  );

  // Main rendering loop for HTML5 Canvas
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width) || 640;
      const displayHeight = Math.floor(rect.height) || 420;
      const targetWidth = Math.floor(displayWidth * dpr);
      const targetHeight = Math.floor(displayHeight * dpr);

      // Prevent canvas blurriness on Retina/High-DPI displays without reallocating on fractional DPR
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const width = displayWidth;
      const height = displayHeight;
      const { theta, phi, zoom } = cameraRef.current;

      const slices = dataset.slices;
      const numSlices = slices.length;
      const numTenors = dataset.tenors.length;

      // Map grid indices into normalized 3D world bounding box [-1, 1]
      const grid3D: Point3D[][] = [];
      const projectedGrid: ProjectedPoint[][] = [];

      for (let i = 0; i < numSlices; i++) {
        grid3D[i] = [];
        projectedGrid[i] = [];
        // X-axis: Tenor progression from 1M to 30Y
        // Y-axis: Time progression from past to present
        // Z-axis: Normalized yield level
        const yNorm = -0.9 + (i / Math.max(1, numSlices - 1)) * 1.8;

        for (let j = 0; j < numTenors; j++) {
          const xNorm = -0.9 + (j / Math.max(1, numTenors - 1)) * 1.8;
          const yld = slices[i].curve[j]?.yieldPercent ?? 0;
          const zNorm = -0.55 + ((yld - minYield) / yieldSpan) * 1.25;

          const p3: Point3D = { x: xNorm, y: yNorm, z: zNorm };
          grid3D[i][j] = p3;
          projectedGrid[i][j] = project3D(p3, width, height, theta, phi, zoom);
        }
      }

      // Render 3D Wireframe Bounding Box and Axis Planes
      // Floor plane: Z = -0.55
      const floorCorners: Point3D[] = [
        { x: -0.9, y: -0.9, z: -0.55 },
        { x: 0.9, y: -0.9, z: -0.55 },
        { x: 0.9, y: 0.9, z: -0.55 },
        { x: -0.9, y: 0.9, z: -0.55 },
      ];
      const projFloor = floorCorners.map((pt) => project3D(pt, width, height, theta, phi, zoom));

      ctx.beginPath();
      ctx.moveTo(projFloor[0].x, projFloor[0].y);
      for (let k = 1; k < projFloor.length; k++) {
        ctx.lineTo(projFloor[k].x, projFloor[k].y);
      }
      ctx.closePath();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.15)';
      ctx.lineWidth = 1;
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.02)';
      ctx.fill();
      ctx.stroke();

      // Draw subtle floor grid lines along tenors and time slices
      for (let j = 0; j < numTenors; j += 2) {
        const xNorm = -0.9 + (j / Math.max(1, numTenors - 1)) * 1.8;
        const pStart = project3D({ x: xNorm, y: -0.9, z: -0.55 }, width, height, theta, phi, zoom);
        const pEnd = project3D({ x: xNorm, y: 0.9, z: -0.55 }, width, height, theta, phi, zoom);
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)';
        ctx.stroke();

        // Tenor labels on floor boundary
        if (pEnd.valid) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b';
          ctx.textAlign = 'center';
          ctx.fillText(dataset.tenors[j], pEnd.x, pEnd.y + 14);
        }
      }

      // Draw Time Labels along the floor edge
      for (let i = 0; i < numSlices; i += Math.max(1, Math.floor(numSlices / 6))) {
        const yNorm = -0.9 + (i / Math.max(1, numSlices - 1)) * 1.8;
        const pLabel = project3D({ x: -0.92, y: yNorm, z: -0.55 }, width, height, theta, phi, zoom);
        if (pLabel.valid) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b';
          ctx.textAlign = 'right';
          ctx.fillText(slices[i].dateLabel, pLabel.x - 6, pLabel.y + 3);
        }
      }

      // Draw Vertical Yield Scale Pillars and Grid Ticks
      const cornerPillar = project3D({ x: -0.9, y: 0.9, z: -0.55 }, width, height, theta, phi, zoom);
      const topPillar = project3D({ x: -0.9, y: 0.9, z: 0.7 }, width, height, theta, phi, zoom);
      ctx.beginPath();
      ctx.moveTo(cornerPillar.x, cornerPillar.y);
      ctx.lineTo(topPillar.x, topPillar.y);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.25)';
      ctx.stroke();

      const numTicks = 5;
      for (let t = 0; t <= numTicks; t++) {
        const tickYield = minYield + (yieldSpan * t) / numTicks;
        const zNorm = -0.55 + (t / numTicks) * 1.25;
        const tickPt = project3D({ x: -0.9, y: 0.9, z: zNorm }, width, height, theta, phi, zoom);
        if (tickPt.valid) {
          ctx.beginPath();
          ctx.moveTo(tickPt.x, tickPt.y);
          ctx.lineTo(tickPt.x - 5, tickPt.y);
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 23, 42, 0.3)';
          ctx.stroke();

          ctx.font = '9px monospace';
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : '#475569';
          ctx.textAlign = 'right';
          ctx.fillText(`${tickYield.toFixed(1)}%`, tickPt.x - 8, tickPt.y + 3);
        }
      }

      // Collect all polygon quads for Painter's Algorithm depth sorting
      const quads: QuadFace[] = [];

      for (let i = 0; i < numSlices - 1; i++) {
        for (let j = 0; j < numTenors - 1; j++) {
          const p0 = projectedGrid[i][j];
          const p1 = projectedGrid[i + 1][j];
          const p2 = projectedGrid[i + 1][j + 1];
          const p3 = projectedGrid[i][j + 1];

          if (p0.valid && p1.valid && p2.valid && p3.valid) {
            const avgDepth = (p0.depth + p1.depth + p2.depth + p3.depth) / 4;
            const y0 = slices[i].curve[j].yieldPercent;
            const y1 = slices[i + 1].curve[j].yieldPercent;
            const y2 = slices[i + 1].curve[j + 1].yieldPercent;
            const y3 = slices[i].curve[j + 1].yieldPercent;
            const avgYield = (y0 + y1 + y2 + y3) / 4;

            // Compute surface face normal via diagonal cross product to generate directional 3D illumination
            const v1x = grid3D[i + 1][j + 1].x - grid3D[i][j].x;
            const v1y = grid3D[i + 1][j + 1].y - grid3D[i][j].y;
            const v1z = grid3D[i + 1][j + 1].z - grid3D[i][j].z;

            const v2x = grid3D[i][j + 1].x - grid3D[i + 1][j].x;
            const v2y = grid3D[i][j + 1].y - grid3D[i + 1][j].y;
            const v2z = grid3D[i][j + 1].z - grid3D[i + 1][j].z;

            // Cross product: N = V1 x V2
            const nx = v1y * v2z - v1z * v2y;
            const ny = v1z * v2x - v1x * v2z;
            const nz = v1x * v2y - v1y * v2x;
            const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            const normalZ = nz / nLen;

            quads.push({
              indices: [i, j],
              pts: [p0, p1, p2, p3],
              avgDepth,
              avgYield,
              normalZ,
            });
          }
        }
      }

      // Sort quads descending by depth (farthest first) to guarantee accurate 3D polygon occlusion
      quads.sort((a, b) => b.avgDepth - a.avgDepth);

      // Render Mesh Quads
      quads.forEach((quad) => {
        const normYield = (quad.avgYield - minYield) / yieldSpan;
        const [r, g, b] = getSurfaceColor(normYield, palette);

        // Apply directional lighting: ambient light + diffuse reflection
        const diffuse = Math.max(0, quad.normalZ * 0.45 + 0.55);
        const lr = Math.min(255, Math.floor(r * diffuse));
        const lg = Math.min(255, Math.floor(g * diffuse));
        const lb = Math.min(255, Math.floor(b * diffuse));

        ctx.beginPath();
        ctx.moveTo(quad.pts[0].x, quad.pts[0].y);
        ctx.lineTo(quad.pts[1].x, quad.pts[1].y);
        ctx.lineTo(quad.pts[2].x, quad.pts[2].y);
        ctx.lineTo(quad.pts[3].x, quad.pts[3].y);
        ctx.closePath();

        if (renderStyle !== 'wireframe') {
          ctx.fillStyle = `rgba(${lr}, ${lg}, ${lb}, 0.88)`;
          ctx.fill();
        }

        if (renderStyle !== 'shaded') {
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.16)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // Highlight the active historical time slice with an illuminated cross-section ribbon
      if (activeSliceIndex >= 0 && activeSliceIndex < numSlices) {
        ctx.beginPath();
        let first = true;
        for (let j = 0; j < numTenors; j++) {
          const pt = projectedGrid[activeSliceIndex][j];
          if (pt.valid) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 3.2;
        ctx.shadowColor = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.4)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur to avoid performance degradation on subsequent draws

        // Draw glowing vertex nodules along the active time slice
        for (let j = 0; j < numTenors; j++) {
          const pt = projectedGrid[activeSliceIndex][j];
          if (pt.valid) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#ffffff' : '#0284c7';
            ctx.fill();
            ctx.strokeStyle = isDark ? '#0284c7' : '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw hover marker and crosshairs if user is hovering over a surface node
      if (hoveredNode) {
        const { timeIdx, tenorIdx } = hoveredNode;
        if (projectedGrid[timeIdx]?.[tenorIdx]?.valid) {
          const hPt = projectedGrid[timeIdx][tenorIdx];

          // Draw vertical drop-line to floor for 3D spatial alignment
          const floorPt = project3D(
            { x: grid3D[timeIdx][tenorIdx].x, y: grid3D[timeIdx][tenorIdx].y, z: -0.55 },
            width,
            height,
            theta,
            phi,
            zoom
          );

          if (floorPt.valid) {
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.moveTo(hPt.x, hPt.y);
            ctx.lineTo(floorPt.x, floorPt.y);
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Target node beacon ring
          ctx.beginPath();
          ctx.arc(hPt.x, hPt.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2.5;
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    renderSceneRef.current = drawFrame;

    const renderLoop = () => {
      // Gentle auto-rotation to facilitate multi-angle visual comprehension without manual dragging
      if (isAutoRotating) {
        cameraRef.current.theta += 0.005;
      }

      drawFrame();

      if (isAutoRotating) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const handleOrbitChange = () => {
      drawFrame();
    };

    canvas.addEventListener('orbit-change', handleOrbitChange);
    renderLoop();

    // Clean up animation frame and custom event listener when rotation state alters or component unmounts
    return () => {
      canvas.removeEventListener('orbit-change', handleOrbitChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    dataset,
    minYield,
    yieldSpan,
    palette,
    renderStyle,
    isDark,
    isAutoRotating,
    activeSliceIndex,
    hoveredNode,
    cameraPreset,
    project3D,
  ]);

  const applyOrbitDelta = useCallback((clientX: number, clientY: number) => {
    const deltaX = clientX - mouseStateRef.current.lastX;
    const deltaY = clientY - mouseStateRef.current.lastY;
    if (deltaX === 0 && deltaY === 0) return;

    mouseStateRef.current.lastX = clientX;
    mouseStateRef.current.lastY = clientY;

    cameraRef.current.theta += deltaX * 0.008;
    // Clamp elevation angle to prevent inverted gimbal-lock perspective
    cameraRef.current.phi = Math.max(
      0.05,
      Math.min(Math.PI / 2.05, cameraRef.current.phi + deltaY * 0.008)
    );

    renderSceneRef.current?.();
  }, []);

  // Keep orbital drag active even if the user's pointer momentarily leaves the canvas boundary
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!mouseStateRef.current.isDragging) return;
      applyOrbitDelta(e.clientX, e.clientY);
    };

    const handleWindowMouseUp = () => {
      mouseStateRef.current.isDragging = false;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [applyOrbitDelta]);

  // Mouse and touch interaction handlers for 3D camera orbital movement
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseStateRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    if (hoveredNode) {
      setHoveredNode(null);
    }
    if (isAutoRotating) {
      setIsAutoRotating(false); // Cease auto-rotation when user takes manual control
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle 3D camera orbital drag
    if (mouseStateRef.current.isDragging) {
      applyOrbitDelta(e.clientX, e.clientY);
      return;
    }

    // Proximity search to identify nearest 3D surface node for hover HUD
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const { theta, phi, zoom } = cameraRef.current;
    const slices = dataset.slices;
    const numSlices = slices.length;
    const numTenors = dataset.tenors.length;

    let closestDist = 24; // Proximity threshold in pixels
    let foundNode: { timeIdx: number; tenorIdx: number } | null = null;

    for (let i = 0; i < numSlices; i++) {
      const yNorm = -0.9 + (i / Math.max(1, numSlices - 1)) * 1.8;
      for (let j = 0; j < numTenors; j++) {
        const xNorm = -0.9 + (j / Math.max(1, numTenors - 1)) * 1.8;
        const yld = slices[i].curve[j]?.yieldPercent ?? 0;
        const zNorm = -0.55 + ((yld - minYield) / yieldSpan) * 1.25;

        const proj = project3D({ x: xNorm, y: yNorm, z: zNorm }, width, height, theta, phi, zoom);
        if (proj.valid) {
          const dist = Math.hypot(proj.x - mouseX, proj.y - mouseY);
          if (dist < closestDist) {
            closestDist = dist;
            foundNode = { timeIdx: i, tenorIdx: j };
          }
        }
      }
    }

    setHoveredNode((prev) => {
      if (!prev && !foundNode) return prev;
      if (
        prev &&
        foundNode &&
        prev.timeIdx === foundNode.timeIdx &&
        prev.tenorIdx === foundNode.tenorIdx
      ) {
        return prev;
      }
      return foundNode;
    });
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDragging = false;
  };

  const handleMouseLeave = () => {
    if (!mouseStateRef.current.isDragging && hoveredNode) {
      setHoveredNode(null);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Zoom in or out within safe bounding limits
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    cameraRef.current.zoom = Math.max(0.5, Math.min(2.5, cameraRef.current.zoom * zoomFactor));

    if (hoveredNode) {
      setHoveredNode(null);
    }
    renderSceneRef.current?.();
  };

  // Touch gesture support for mobile devices
  const touchStateRef = useRef<{ lastX: number; lastY: number }>({ lastX: 0, lastY: 0 });

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      touchStateRef.current = {
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
      };
      if (isAutoRotating) setIsAutoRotating(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStateRef.current.lastX;
      const deltaY = e.touches[0].clientY - touchStateRef.current.lastY;
      touchStateRef.current = {
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
      };

      cameraRef.current.theta += deltaX * 0.01;
      cameraRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2.05, cameraRef.current.phi + deltaY * 0.01)
      );
      renderSceneRef.current?.();
    }
  };

  const currentSlice = dataset.slices[activeSliceIndex] || dataset.slices[0];
  const hoveredPoint = hoveredNode
    ? dataset.slices[hoveredNode.timeIdx]?.curve[hoveredNode.tenorIdx]
    : null;
  const hoveredSlice = hoveredNode ? dataset.slices[hoveredNode.timeIdx] : null;

  return (
    <div className="space-y-4">
      {/* Top Controls Bar: Time Horizon, Camera Angles, Palettes, Mesh Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
        {/* Left cluster: Time Horizon Selector or Historical Span Indicator */}
        <div className="flex items-center gap-2">
          {sovereign === 'USA' ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Time Horizon:
              </span>
              <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-0.5 text-xs">
                <button
                  onClick={() => setResolutionMode('longterm')}
                  className={`rounded-full px-2.5 py-1 font-medium transition-all cursor-pointer ${
                    resolutionMode === 'longterm'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  1990–2026 Cycle
                </button>
                <button
                  onClick={() => setResolutionMode('modern')}
                  className={`rounded-full px-2.5 py-1 font-medium transition-all cursor-pointer ${
                    resolutionMode === 'modern'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  2020–2026 Modern
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-sky-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Multi-Decade Sovereign Term Evolution
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                ({dataset.slices[0]?.dateLabel}–{dataset.slices[dataset.slices.length - 1]?.dateLabel})
              </span>
            </div>
          )}
        </div>

        {/* Right cluster: Camera Presets, Color Palette, Render Style */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Camera Presets */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Compass className="h-3 w-3" /> View:
            </span>
            <button
              onClick={() => applyCameraPreset('isometric')}
              title="3D Isometric View"
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                cameraPreset === 'isometric'
                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              3D Iso
            </button>
            <button
              onClick={() => applyCameraPreset('tenor-profile')}
              title="Term Structure Side Profile"
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                cameraPreset === 'tenor-profile'
                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              Tenors
            </button>
            <button
              onClick={() => applyCameraPreset('time-profile')}
              title="Time Evolution Side Profile"
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                cameraPreset === 'time-profile'
                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => applyCameraPreset('contour-top')}
              title="Top-Down Contour Heatmap"
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                cameraPreset === 'contour-top'
                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              Contour
            </button>
          </div>

          {/* Palette selector */}
          <div className="flex items-center gap-1 text-xs">
            <Palette className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <select
              value={palette}
              aria-label="Color Palette"
              onChange={(e) => setPalette(e.target.value as SurfaceColorPalette)}
              className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="thermal">Thermal Heatmap</option>
              <option value="viridis">Viridis Uniform</option>
              <option value="spectral">Spectral Bloomberg</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>

          {/* Mesh Render Style */}
          <div className="flex items-center gap-1 text-xs">
            <Layers className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <select
              value={renderStyle}
              aria-label="Surface Render Style"
              onChange={(e) => setRenderStyle(e.target.value as RenderStyle)}
              className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="shaded-wire">Surface + Mesh</option>
              <option value="shaded">Smooth Surface</option>
              <option value="wireframe">Wireframe Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[400px] sm:h-[480px] rounded-2xl bg-gradient-to-b from-slate-900/[0.04] to-slate-900/[0.08] dark:from-white/[0.02] dark:to-white/[0.05] border border-slate-200 dark:border-white/[0.08] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="w-full h-full block touch-none"
        />

        {/* Viewport Floating HUD Overlays */}
        {/* Top-Left: Orientation & Interaction Hint */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-sm">
            <span>{dataset.flag}</span>
            <span>{dataset.name}</span>
            <span className="text-slate-400 font-normal">({dataset.currency})</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1">
            Drag to orbit · Scroll to zoom · Hover node to inspect
          </span>
        </div>

        {/* Top-Right: Orbit & Reset Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all shadow-sm ${
              isAutoRotating
                ? 'bg-sky-500 text-white border-sky-600'
                : 'bg-white/80 dark:bg-black/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title={isAutoRotating ? 'Pause Auto-Rotation' : 'Enable 3D Auto-Rotation'}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => applyCameraPreset('isometric')}
            className="p-1.5 rounded-lg border text-xs font-medium cursor-pointer bg-white/80 dark:bg-black/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
            title="Reset Camera Angle"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bottom Floating Hover Card (Node Inspection Tooltip) */}
        {hoveredPoint && hoveredSlice && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-500/30 dark:border-sky-400/30 shadow-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.08] pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {hoveredSlice.dateLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                    [{hoveredPoint.tenor} Maturity]
                  </span>
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {hoveredPoint.yieldPercent.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>10Y–2Y Spread:</span>
                <span
                  className={`font-semibold ${
                    hoveredSlice.spread10Y2Y < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {hoveredSlice.spread10Y2Y > 0 ? '+' : ''}
                  {hoveredSlice.spread10Y2Y.toFixed(2)}% ({(hoveredSlice.spread10Y2Y * 100).toFixed(0)} bps)
                </span>
              </div>

              {hoveredSlice.macroEvent && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight italic pt-0.5 border-t border-slate-100 dark:border-white/[0.05]">
                  &ldquo;{hoveredSlice.macroEvent}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Scrubber & Historical Playback Sweep */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer shadow-sm"
              title={isPlaying ? 'Pause Timeline Sweep' : 'Play Historical Curve Sweep'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                  Active Curve Slice:
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentSlice.dateLabel}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    currentSlice.isInverted
                      ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                  }`}
                >
                  {currentSlice.isInverted ? 'Inverted' : 'Normal Upward Slope'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics for Active Slice */}
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 mr-1">10Y–2Y:</span>
              <span
                className={`font-semibold ${
                  currentSlice.spread10Y2Y < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {currentSlice.spread10Y2Y > 0 ? '+' : ''}
                {currentSlice.spread10Y2Y.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 mr-1">10Y–3M:</span>
              <span
                className={`font-semibold ${
                  currentSlice.spread10Y3M < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {currentSlice.spread10Y3M > 0 ? '+' : ''}
                {currentSlice.spread10Y3M.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Slider with Year Markers */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={dataset.slices.length - 1}
            value={activeSliceIndex}
            onChange={(e) => setActiveSliceIndex(Number(e.target.value))}
            className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-white/10"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 font-mono">
            <span>{dataset.slices[0]?.dateLabel}</span>
            <span>
              {dataset.slices[Math.floor(dataset.slices.length / 2)]?.dateLabel}
            </span>
            <span>{dataset.slices[dataset.slices.length - 1]?.dateLabel}</span>
          </div>
        </div>

        {/* Historical Macro Event Context for Current Slice */}
        {currentSlice.macroEvent && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-xs text-slate-700 dark:text-slate-300">
            <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-white">
                Historical Catalyst ({currentSlice.dateLabel}):
              </span>{' '}
              {currentSlice.macroEvent}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
