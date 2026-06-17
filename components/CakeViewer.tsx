'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Cake } from './3D/Cake';
import { Suspense } from 'react';

interface CakeViewerProps {
  onNext: () => void;
}

export function CakeViewer({ onNext }: CakeViewerProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#faf8f3] p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 md:mb-8 z-10"
      >
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
          <div className="w-2 h-2 bg-[#d4a574] rounded-full" />
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2a2a2a] tracking-wide mb-2">
          Tu Pastel <span className="font-semibold text-[#d4a574]">Especial</span>
        </h2>
        <p className="text-[#8b8680] text-sm sm:text-base font-light">
          Gira el pastel para admirarlo desde todos los ángulos
        </p>
        <p className="text-[#8b8680] text-sm sm:text-base font-light">
          Perdon pero se me quemo esta madre, lo deje mucho en el horno
        </p>
      </motion.div>

      {/* 3D Viewer */}
      <div className="w-full flex-1 max-h-96 md:max-h-none bg-[#f5f2ed] rounded-lg overflow-hidden shadow-lg mb-6 md:mb-8 border border-[#e8d4b8]">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, 5, -10]} intensity={0.4} color="#d4a574" />
            <OrbitControls
              autoRotate
              autoRotateSpeed={3}
              enableZoom={true}
              enablePan={true}
              rotateSpeed={0.7}
              zoomSpeed={0.8}
            />
            <Cake />
          </Canvas>
        </Suspense>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center text-[#8b8680] text-xs sm:text-sm mb-6 md:mb-8 font-light"
      >
        <p className="flex items-center justify-center gap-3 flex-wrap">
          <span>Arrastra para girar</span>
          <span className="text-lg text-[#d4a574]">•</span>
          <span>Rueda para zoom</span>
        </p>
      </motion.div>

      {/* Controls */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-light text-[#faf8f3] bg-[#d4a574] tracking-widest uppercase transition-all duration-500 hover:bg-[#2a2a2a]"
      >
        Siguiente
      </motion.button>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#f5f2ed]">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl"
      >
        🎂
      </motion.div>
    </div>
  );
}
