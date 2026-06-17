'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CardDetailImgProps {
  open: boolean;
  image: string;
  message: string;
  onClose: () => void;
}

export function CardDetailImg({ open, image, message, onClose }: CardDetailImgProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full"
          >
            <img
              src={image}
              alt="Recuerdos"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl mx-auto"
            />
            <div className="mt-5 text-center">
              <p className="text-white text-lg sm:text-xl font-light tracking-wide">
                {message}
              </p>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 px-6 py-2 bg-[#d4a574] text-white font-light text-xs tracking-widest uppercase transition-all duration-500 hover:bg-white hover:text-[#2a2a2a]"
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
