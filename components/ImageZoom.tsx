'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
  const [zoom, setZoom] = useState(100);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 100));
    if (zoom <= 125) {
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current && isZoomed) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Zoom Controls */}
      <div className="flex gap-2 justify-center items-center bg-gray-100 p-3 rounded-lg">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 100}
          className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 border border-gray-300 rounded font-medium transition-colors"
        >
          −
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 w-12 text-center">{zoom}%</span>
        </div>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 300}
          className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 border border-gray-300 rounded font-medium transition-colors"
        >
          +
        </button>
        <button
          onClick={() => {
            setZoom(100);
            setIsZoomed(false);
          }}
          className="ml-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors text-sm"
        >
          Sıfırla
        </button>
      </div>

      {/* Image Container */}
      <div
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        className="relative w-full overflow-hidden rounded-lg border-2 border-gray-200 cursor-zoom-in bg-gray-50"
        style={{ height: '500px' }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transition: zoom === 100 ? 'transform 0.3s ease' : 'none',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Info Text */}
      <div className="text-xs text-gray-600 text-center">
        <p>Dokusunu görmek için zooma yapabilirsiniz. Fare tekerleği ile zoom kontrol edin veya +/- butonlarını kullanın.</p>
      </div>
    </div>
  );
};
