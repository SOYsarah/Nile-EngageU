"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: {
    url: string
    alt: string
    caption?: string
  }[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 text-white z-10 hover:bg-white/10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="relative aspect-video">
              <Image
                src={images[currentIndex].url || "/placeholder.svg"}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={prevImage}>
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous</span>
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={nextImage}>
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next</span>
              </Button>
            </div>

            {images[currentIndex].caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-4 text-center">
                {images[currentIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

