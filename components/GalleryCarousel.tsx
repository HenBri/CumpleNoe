'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Gallery3DCarousel, GALLERY_PHOTOS } from './3D/Gallery3DCarousel';
import { CardDetailImg } from './CardDetailImg';

interface GalleryCarouselProps {
  onNext: () => void;
}

export function GalleryCarousel({ onNext }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [detailPhoto, setDetailPhoto] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  // Preload images into browser cache so Three.js loads them instantly
  useEffect(() => {
    let loaded = 0;
    GALLERY_PHOTOS.forEach((p) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === GALLERY_PHOTOS.length) setReady(true);
      };
      img.src = p.image;
    });
  }, []);

  const goToPrev = () => setActiveIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  const goToNext = () => setActiveIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#faf8f3] to-[#f5f0e8]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-8 pb-1 px-4 z-10"
      >
        <div className="flex justify-center gap-2 mb-3">
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
          <div className="w-2 h-2 bg-[#d4a574] rounded-full" />
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2a2a2a] tracking-wide mb-1">
          Galería de <span className="font-semibold text-[#d4a574]">Momentos</span>
        </h2>
        <p className="text-[#8b8680] text-xs sm:text-sm font-light tracking-wide">
          Desliza o arrastra para explorar &bull; Toca para seleccionar &bull; Toca dos veces para ver detalle
        </p>
        <p className="text-[#8b8680] text-xs sm:text-sm font-light tracking-wide">
          Dale chance les falla a las fotos  XD
        </p>
      </motion.div>

      {/* 3D Carousel */}
      <div className="flex-1 relative">
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#faf8f3] to-[#f5f0e8] z-10 gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl"
            >
              🖼️
            </motion.div>
            <p className="text-[#8b8680] text-xs font-light tracking-wide">Cargando galería... Dale chance nmms </p>
          </div>
        )}
        <Canvas
          camera={{ position: [0, 0.4, 6.2], fov: 47 }}
          style={{ width: '100%', height: '100%' }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} color="#f5f0e8" />
          <pointLight position={[3, 4, 5]} intensity={1.2} color="#fff5e6" />
          <pointLight position={[-4, 2, 3]} intensity={0.4} color="#d4a574" />
          <pointLight position={[0, 3, -6]} intensity={0.3} color="#e8d4b8" />
          <pointLight position={[0, 6, 0]} intensity={0.2} color="#fff5e6" />
          <Gallery3DCarousel
            targetIndex={activeIndex}
            onPhotoChange={setActiveIndex}
            onPhotoDoubleTap={(i) => setDetailPhoto(GALLERY_PHOTOS[i])}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col items-center pb-5 pt-2 px-4"
      >
        <motion.p
          key={activeIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#2a2a2a] text-base sm:text-lg font-light mb-2 tracking-wide"
        >
          {GALLERY_PHOTOS[activeIndex].title}
        </motion.p>

        <div className="flex items-center gap-2 mb-2">
          {GALLERY_PHOTOS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="rounded-full border-0 p-0 cursor-pointer"
              style={{
                width: i === activeIndex ? 10 : 6,
                height: i === activeIndex ? 10 : 6,
                backgroundColor: i === activeIndex ? '#d4a574' : '#e8d4b8',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>

        <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#d4a574]/40 to-transparent mb-3" />

        <div className="flex gap-4 sm:gap-6">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={goToPrev}
            className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#2a2a2a] text-[#faf8f3] font-light text-xs sm:text-sm tracking-widest uppercase transition-all duration-500 hover:bg-[#3a3a3a]"
          >
            Anterior
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#d4a574] text-[#faf8f3] font-light text-xs sm:text-sm tracking-widest uppercase transition-all duration-500 hover:bg-[#c49564]"
          >
            Siguiente
          </motion.button>
        </div>
      </motion.div>

      <CardDetailImg
        open={detailPhoto !== null}
        image={detailPhoto?.image ?? ''}
        message={detailPhoto?.title ?? ''}
        onClose={() => setDetailPhoto(null)}
      />
    </div>
  );
}
