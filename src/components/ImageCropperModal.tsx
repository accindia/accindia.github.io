import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  RefreshCw,
  Circle,
  Square,
  Sparkles,
} from 'lucide-react';

export type CropShape = 'circle' | 'square';

interface ImageCropperModalProps {
  imageSrc: string; // raw base64 or object URL of picked file
  initialShape?: CropShape;
  title?: string;
  subtitle?: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  initialShape = 'circle',
  title = 'फोटो क्रॉप व एडजस्ट करें',
  subtitle = 'WhatsApp की तरह फोटो को ज़ूम, रोटेट और ड्रैग करके सही फ्रेम में सेट करें',
  onCropComplete,
  onCancel,
}) => {
  const [shape, setShape] = useState<CropShape>(initialShape);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [pinchDistance, setPinchDistance] = useState<number | null>(null);
  const [pinchStartZoom, setPinchStartZoom] = useState<number>(1);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Crop dimensions in UI (pixels)
  const CROP_SIZE = 260; // 260x260 crop box
  const OUTPUT_SIZE = 400; // 400x400 output canvas size

  // Reset transforms when image or shape changes
  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    handleReset();
  }, [imageSrc, handleReset]);

  // Handle Rotation (90 deg increments)
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Drag handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDistance(dist);
      setPinchStartZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && pinchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / pinchDistance;
      const nextZoom = Math.min(4, Math.max(0.6, Number((pinchStartZoom * scaleFactor).toFixed(2))));
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPinchDistance(null);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((z) => Math.min(4, Math.max(0.6, Number((z + delta).toFixed(2)))));
  };

  // Base dimension calculation
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const currentImgWidth = isRotated90or270 ? naturalDimensions.height : naturalDimensions.width;
  const currentImgHeight = isRotated90or270 ? naturalDimensions.width : naturalDimensions.height;

  // Scale factor so image fits crop window initially
  const baseFitScale = naturalDimensions.width && naturalDimensions.height
    ? Math.max(CROP_SIZE / currentImgWidth, CROP_SIZE / currentImgHeight)
    : 1;

  const basePreviewWidth = naturalDimensions.width * baseFitScale;
  const basePreviewHeight = naturalDimensions.height * baseFitScale;

  // Generate cropped output canvas
  const handleCropAndSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If circular, clip to circle
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    // Clean white or transparent background
    ctx.fillStyle = shape === 'circle' ? 'transparent' : '#ffffff';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Calculate scaling ratio from UI crop box (CROP_SIZE) to OUTPUT_SIZE
    const outputScaleFactor = OUTPUT_SIZE / CROP_SIZE;

    ctx.save();
    // Move to canvas center
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    // Apply user pan offset (scaled to output canvas)
    ctx.translate(offset.x * outputScaleFactor, offset.y * outputScaleFactor);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    const totalScale = baseFitScale * zoom * outputScaleFactor;

    // Draw image centered
    const drawWidth = naturalDimensions.width * totalScale;
    const drawHeight = naturalDimensions.height * totalScale;

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Export optimized JPEG / PNG data URL
    const quality = 0.85;
    const dataUrl = canvas.toDataURL(shape === 'circle' ? 'image/png' : 'image/jpeg', quality);
    onCropComplete(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#0b141a] text-slate-100 rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* WhatsApp-Style Dark Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111b21]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center border border-[#00a884]/40 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            title="बंद करें (Cancel)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CROP VIEWPORT CONTAINER */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="relative w-full h-[320px] sm:h-[350px] bg-black flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Hidden Image for natural dimensions */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Source"
            onLoad={(e) => {
              setImgLoaded(true);
              setNaturalDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }}
            className="hidden"
          />

          {/* Render transformed image */}
          {imgLoaded && naturalDimensions.width > 0 && (
            <div
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                transformOrigin: 'center center',
              }}
              className="pointer-events-none select-none"
            >
              <img
                src={imageSrc}
                alt="Crop preview"
                style={{
                  width: `${basePreviewWidth}px`,
                  height: `${basePreviewHeight}px`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: 'fill',
                }}
                className="select-none pointer-events-none drop-shadow-md"
                draggable={false}
              />
            </div>
          )}

          {/* DARK MASK OVERLAY WITH HOLE (WhatsApp DP / QR style) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {shape === 'circle' ? (
              // Circular Mask for DP
              <div
                style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
                className="relative rounded-full border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
              >
                {/* 3x3 Grid Overlay like WhatsApp DP editor */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-white/40" />
                  <div className="border-r border-white/40" />
                  <div />
                </div>
              </div>
            ) : (
              // Square Mask for QR / ID Cards
              <div
                style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
                className="relative rounded-xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
              >
                {/* 4 Corner brackets like camera focus */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-[#00a884]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-[#00a884]" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-[#00a884]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-[#00a884]" />

                {/* 3x3 Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-white/40" />
                  <div className="border-r border-white/40" />
                  <div />
                </div>
              </div>
            )}
          </div>

          {/* Quick Helper Floating Badge */}
          <div className="absolute bottom-2.5 bg-black/70 text-slate-300 px-3 py-1 rounded-full text-[10px] font-medium backdrop-blur-xs pointer-events-none border border-white/10">
            👆 फोटो को खींचकर (Drag) और नीचे दिए गए स्लाइडर से ज़ूम करें
          </div>
        </div>

        {/* CONTROLS TOOLBAR */}
        <div className="p-4 sm:p-5 bg-[#111b21] space-y-4 border-t border-slate-800">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3.5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#00a884] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono text-xs text-slate-300 w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Shape Selector & Rotate / Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Shape Switcher */}
            <div className="flex items-center gap-1.5 bg-[#202c33] p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setShape('circle')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  shape === 'circle'
                    ? 'bg-[#00a884] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="गोल DP फ्रेम (WhatsApp Circle Profile)"
              >
                <Circle className="w-3.5 h-3.5" />
                <span>गोल (Circle DP)</span>
              </button>
              <button
                type="button"
                onClick={() => setShape('square')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  shape === 'square'
                    ? 'bg-[#00a884] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="चौकोर फ्रेम (QR Code / Card)"
              >
                <Square className="w-3.5 h-3.5" />
                <span>चौकोर (Square QR)</span>
              </button>
            </div>

            {/* Rotate & Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202c33] hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
                title="90° घुमाएं (Rotate 90°)"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#00a884]" />
                <span>घुमाएं (Rotate)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#202c33] hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg border border-slate-700 transition"
                title="रीसेट करें (Reset Position)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS: CANCEL & DONE */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-[#202c33] hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition"
            >
              रद्द करें (Cancel)
            </button>

            <button
              type="button"
              onClick={handleCropAndSave}
              className="px-6 py-2.5 bg-[#00a884] hover:bg-[#029676] text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>✓ फोटो सेट करें (Crop & Done)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
