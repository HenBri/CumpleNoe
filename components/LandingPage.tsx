'use client';

import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const decorVariants = {
    animate: {
      y: [0, -12, 0],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 py-8 bg-[#faf8f3] overflow-hidden">
      {/* Subtle decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-20" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-20" />

      {/* Ornamental circles - top left */}
      <motion.div
        className="absolute top-10 left-8 w-24 h-24 border border-[#e8d4b8] rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-16 left-12 w-16 h-16 border border-[#d4a574] rounded-full opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Ornamental circles - bottom right */}
      <motion.div
        className="absolute bottom-10 right-8 w-28 h-28 border border-[#e8d4b8] rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-16 right-12 w-20 h-20 border border-[#d4a574] rounded-full opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating accent lines */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-px bg-gradient-to-r from-[#d4a574] to-transparent opacity-30"
        variants={decorVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-40 h-px bg-gradient-to-r from-transparent to-[#d4a574] opacity-30"
        variants={decorVariants}
        animate="animate"
        style={{ animationDelay: '0.5s' }}
      />

      {/* Main Content */}
      <motion.div
        className="text-center space-y-6 z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative top accent */}
        <motion.div className="flex justify-center gap-2" variants={itemVariants}>
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
          <div className="w-2 h-2 bg-[#d4a574] rounded-full" />
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-light text-[#2a2a2a] tracking-wide"
          variants={itemVariants}
        >
          Feliz <span className="font-semibold text-[#d4a574]">Cumpleaños</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-[#8b8680] font-light max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Recordando cuando la Grulla te dejo por ahi
        </motion.p>

        {/* Separator line */}
        <motion.div
          className="w-12 h-px bg-[#d4a574] mx-auto"
          variants={itemVariants}
        />

        <motion.button
          onClick={onStart}
          className="mt-8 px-8 sm:px-12 py-3 sm:py-4 bg-[#2a2a2a] text-[#faf8f3] font-light rounded-sm text-sm sm:text-base tracking-widest uppercase border border-[#2a2a2a] transition-all duration-500 hover:bg-[#faf8f3] hover:text-[#2a2a2a]"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Comenzar
        </motion.button>

        {/* Decorative bottom accent */}
        <motion.div className="flex justify-center gap-2 pt-4" variants={itemVariants}>
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
          <div className="w-2 h-2 bg-[#d4a574] rounded-full" />
          <div className="w-1 h-1 bg-[#d4a574] rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
