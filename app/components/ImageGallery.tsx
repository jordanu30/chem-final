'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import Image from 'next/image'

export default function ImageGallery() {
  const [images, setImages] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => setImages(data.images ?? []))
      .catch(() => setImages([]))
  }, [])

  if (images.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/20 p-8 text-center text-white/40">
        <p className="text-sm">Drop your lab photos into <code className="text-blue-400">public/images/</code> to display them here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map(img => (
          <motion.button
            key={img}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(img)}
            className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
          >
            <Image
              src={`/images/${img}`}
              alt={img}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={`/images/${selected}`}
                alt={selected}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
