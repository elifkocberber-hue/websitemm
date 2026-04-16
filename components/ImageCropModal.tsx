'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface ImageCropModalProps {
  src: string;
  aspect: number;
  onConfirm: (blob: Blob) => void;
  onClose: () => void;
  uploading?: boolean;
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob başarısız'));
    }, 'image/jpeg', 0.92);
  });
}

export function ImageCropModal({ src, aspect, onConfirm, onClose, uploading = false }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(src, croppedAreaPixels);
      onConfirm(blob);
    } catch {
      // hata durumunda modal açık kalır
    } finally {
      setProcessing(false);
    }
  }, [src, croppedAreaPixels, onConfirm]);

  const busy = processing || uploading;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Cropper — absolute konumlandırma, react-easy-crop için zorunlu */}
      <div className="absolute inset-x-0 top-0 bottom-[152px]">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          showGrid={false}
        />
      </div>

      {/* Kontrol paneli — sabit alta yapışık */}
      <div className="absolute inset-x-0 bottom-0 h-[152px] bg-gray-900 px-6 py-5 space-y-4">
        {/* Zoom slider */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, parseFloat((z - 0.1).toFixed(2))))}
            className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20 text-lg font-bold"
          >
            −
          </button>
          <input
            type="range"
            min={1} max={3} step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#DD6B56]"
            aria-label="Yakınlaştırma"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, parseFloat((z + 0.1).toFixed(2))))}
            className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20 text-lg font-bold"
          >
            +
          </button>
          <span className="text-white/60 text-sm w-12 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        <p className="text-white/40 text-xs text-center">
          Görseli sürükleyerek konumlandırın · Kaydırarak veya slider ile yakınlaştırın
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="px-6 py-2.5 rounded-lg bg-[#DD6B56] hover:bg-[#C45540] disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2"
          >
            {busy ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Yükleniyor...
              </>
            ) : 'Uygula'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
