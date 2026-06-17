'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { GalleryCarousel } from '@/components/GalleryCarousel';
import { CakeViewer } from '@/components/CakeViewer';
import { CandleInteraction } from '@/components/CandleInteraction';

type Scene = 'landing' | 'gallery' | 'cake' | 'candle' | 'wish';

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>('landing');
  const [wishMessage, setWishMessage] = useState('');

  const handleStart = () => setCurrentScene('gallery');
  const handleGalleryNext = () => setCurrentScene('cake');
  const handleCakeNext = () => setCurrentScene('candle');
  const handleCandle = (message: string) => {
    setWishMessage(message);
    setCurrentScene('wish');
  };
  const handleRestart = () => {
    setCurrentScene('landing');
    setWishMessage('');
  };

  return (
    <main className="w-full h-screen bg-[#faf8f3] overflow-hidden">
      {currentScene === 'landing' && <LandingPage onStart={handleStart} />}
      {currentScene === 'gallery' && <GalleryCarousel onNext={handleGalleryNext} />}
      {currentScene === 'cake' && <CakeViewer onNext={handleCakeNext} />}
      {currentScene === 'candle' && <CandleInteraction onBlow={handleCandle} />}
      {currentScene === 'wish' && (
        <WishScreen message={wishMessage} onRestart={handleRestart} />
      )}
    </main>
  );
}

function WishScreen({ message, onRestart }: { message: string; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col items-center justify-center px-4 py-8 bg-[#faf8f3] relative overflow-hidden"
    >
      {/* Decorative background circles */}
      <motion.div
        className="absolute top-10 left-8 w-24 h-24 border border-[#e8d4b8] rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-10 right-8 w-28 h-28 border border-[#e8d4b8] rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div className="text-center space-y-6 z-10 animate-slide-up">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          ✨
        </motion.div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2a2a2a] tracking-wide">
          Tu Deseo ha Volado
        </h2>

        <div className="w-12 h-px bg-[#d4a574] mx-auto" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg text-[#8b8680] font-light max-w-md"
        >
          {message}
        </motion.p>

        <div className="mt-8 pt-8">
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#d4a574] text-[#faf8f3] font-light text-sm sm:text-base tracking-widest uppercase transition-all duration-500 hover:bg-[#2a2a2a]"
          >
            Volver al Inicio
            </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
