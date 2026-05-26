'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export interface Photo {
  src: string
  caption: string
}

interface Props {
  photos?: Photo[]
}

export default function ImageGallery({ photos }: Props) {
  const [fetched, setFetched] = useState<Photo[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (photos) return
    fetch('/api/images')
      .then(r => r.json())
      .then(data => setFetched((data.images ?? []).map((f: string) => ({ src: f, caption: f }))))
      .catch(() => setFetched([]))
  }, [photos])

  const items = photos ?? fetched

  const prev = useCallback(() => {
    setSelectedIndex(i => (i === null ? null : (i - 1 + items.length) % items.length))
  }, [items.length])

  const next = useCallback(() => {
    setSelectedIndex(i => (i === null ? null : (i + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    if (selectedIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex, prev, next])

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/20 p-8 text-center text-white/40">
        <p className="text-sm">Drop your lab photos into <code className="text-blue-400">public/images/</code> to display them here.</p>
      </div>
    )
  }

  const current = selectedIndex !== null ? items[selectedIndex] : null

  return (
    <>
      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="flex flex-col gap-1.5"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedIndex(i)}
              className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
            >
              <Image
                src={`/images/${photo.src}`}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-2">
                  <ZoomIn className="text-white" size={18} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <span className="text-[10px] text-white/80 font-medium leading-tight line-clamp-2">{photo.caption}</span>
              </div>
            </motion.button>
            <p className="text-[11px] text-white/50 leading-tight text-center px-1">{photo.caption}</p>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2.5 text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono z-10">
              {selectedIndex + 1} / {items.length}
            </div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-4xl mx-16 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ maxHeight: '75vh' }}>
                <Image
                  src={`/images/${current.src}`}
                  alt={current.caption}
                  width={1200}
                  height={900}
                  className="object-contain w-full rounded-xl"
                  style={{ maxHeight: '75vh' }}
                  priority
                />
              </div>
              <p className="text-white/80 text-sm text-center max-w-xl leading-relaxed px-4">
                {current.caption}
              </p>
            </motion.div>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
