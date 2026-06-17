'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CandleInteractionProps {
  onBlow: (message: string) => void;
}

const WISHES = [
  'Que no te falle (tampooco se hacen milagros)',
  'Que te falle mas',
  'Que te falle poquito',
  'Que te falle poquito menos',
  'Un gato volador!!!',
];

export function CandleInteraction({ onBlow }: CandleInteractionProps) {
  const [hasBlown, setHasBlown] = useState(false);
  const [selectedWish, setSelectedWish] = useState('');
  const [showWishes, setShowWishes] = useState(false);

  const handleBlow = () => {
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    setSelectedWish(randomWish);
    setHasBlown(true);
    setTimeout(() => {
      onBlow(randomWish);
    }, 2000);
  };

  const handleWishSelect = (wish: string) => {
    setSelectedWish(wish);
    setHasBlown(true);
    setTimeout(() => {
      onBlow(wish);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-8 bg-[#faf8f3] relative overflow-hidden">
      {/* Decorative elements */}
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

      <AnimatePresence mode="wait">
        {!hasBlown ? (
          <motion.div
            key="candle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center z-10"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
                <div className="w-2 h-2 bg-[#d4a574] rounded-full" />
                <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2a2a2a] tracking-wide">
                Es Hora de Hacer un <span className="font-semibold text-[#d4a574]">Deseo</span>
              </h2>
            </motion.div>

            {/* Candle Visualization */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="flex flex-col items-center mb-10 md:mb-16"
            >
              {/* Flame - Realistic flicker */}
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  scaleY: [0.95, 1.05, 0.98],
                }}
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-7xl sm:text-8xl mb-4 filter drop-shadow-lg"
              >
                🔥
              </motion.div>

              {/* Candle Stick */}
              <motion.div
                animate={{ y: [0, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-7xl sm:text-8xl"
              >
                🕯️
              </motion.div>
            </motion.div>

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg text-[#8b8680] text-center mb-10 max-w-md font-light"
            >
              Sopla la vela o elige un deseo para que tus esperanzas cobren vuelo
            </motion.p>

            {/* Button Group */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col gap-4 items-center mb-8"
            >
              <motion.button
                onClick={handleBlow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-light text-[#faf8f3] bg-[#d4a574] tracking-widest uppercase transition-all duration-500 hover:bg-[#2a2a2a] hover:text-[#faf8f3] border border-[#d4a574] hover:border-[#2a2a2a]"
              >
                Sopla la Vela
              </motion.button>

              {/* Toggle Wishes */}
              <motion.button
                onClick={() => setShowWishes(!showWishes)}
                whileHover={{ scale: 1.02 }}
                className="text-[#8b8680] hover:text-[#d4a574] transition-colors text-sm font-light tracking-wide"
              >
                {showWishes ? '▼ Ocultar deseos' : '▶ Ver deseos sugeridos'}
              </motion.button>
            </motion.div>

            {/* Wishes Selection Grid */}
            <AnimatePresence>
              {showWishes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full"
                >
                  {WISHES.map((wish, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleWishSelect(wish)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 sm:p-5 bg-[#f5f2ed] hover:bg-[#e8d4b8] text-[#2a2a2a] text-xs sm:text-sm rounded-lg border border-[#e8d4b8] transition-all font-light"
                    >
                      {wish}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-[#d4a574]/30 rounded-full"
                  animate={{
                    y: [Math.random() * 300, -300],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 0.8,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '50%',
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="blown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 z-10"
          >
            {/* Celebration sparkles */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ rotate: { duration: 3, repeat: Infinity }, scale: { duration: 1.5, repeat: Infinity } }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2a2a2a] tracking-wide">
              Tu Deseo ha Volado
            </h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg text-[#8b8680] font-light"
            >
              Se ha puesto en el universo...
            </motion.p>

            {/* Elegant floating confetti */}
            <div className="mt-8 relative h-40">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#d4a574', '#e8d4b8', '#b5aaa0'][i % 3],
                    left: `${50 + (Math.random() - 0.5) * 150}%`,
                    top: '0%',
                  }}
                  animate={{
                    y: [0, -250],
                    x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 80],
                    opacity: [1, 0],
                    rotate: [0, Math.random() * 360],
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 0.8,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
