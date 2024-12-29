'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const DeleteModal = memo(({ isOpen, onClose, onConfirm, isDeleting }: DeleteModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
            />

            {/* Modal */}
            <motion.div 
              className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 text-left shadow-xl w-full max-w-md"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="flex flex-col items-center">
                {/* Icon */}
                <motion.div 
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200
                  }}
                >
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-100">
                    Blog Yazısını Sil
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Bu blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                  </p>
                </motion.div>

                {/* Buttons */}
                <motion.div 
                  className="mt-6 flex space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 border border-red-500 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                        Siliniyor...
                      </>
                    ) : (
                      'Sil'
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

DeleteModal.displayName = 'DeleteModal';

export default DeleteModal; 