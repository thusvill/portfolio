import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ProjectMedia } from '../lib/projectAssets'

interface MediaLightboxProps {
  media: ProjectMedia[]
  index: number
  projectName: string
  onClose: () => void
  onNavigate: (index: number) => void
}

function MediaLightbox({ media, index, projectName, onClose, onNavigate }: MediaLightboxProps) {
  const item = media[index] ?? null
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [portrait, setPortrait] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      if (media.length === 0) return
      const wrapped = (next + media.length) % media.length
      onNavigate(wrapped)
    },
    [media.length, onNavigate],
  )

  useEffect(() => {
    setPortrait(false)
  }, [index, item?.url])

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(index - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goTo(index + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goTo, index, onClose])

  if (!item) return null

  return (
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} image viewer, item ${index + 1} of ${media.length}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0]
        touchStartX.current = touch.clientX
        touchStartY.current = touch.clientY
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || touchStartY.current === null) return
        const touch = event.changedTouches[0]
        const deltaX = touch.clientX - touchStartX.current
        const deltaY = touch.clientY - touchStartY.current
        touchStartX.current = null
        touchStartY.current = null
        if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
          goTo(index + (deltaX < 0 ? 1 : -1))
        }
      }}
    >
      <div className="media-lightbox__backdrop" aria-hidden="true" onClick={onClose} />
      <div className="media-lightbox__topbar">
        <span className="media-lightbox__count">
          {projectName} / {String(index + 1).padStart(2, '0')} OF {String(media.length).padStart(2, '0')}
        </span>
        <button
          className="dialog-control media-lightbox__close"
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close fullscreen viewer"
          title="Close (Esc)"
        >
          <X size={17} />
        </button>
      </div>

      {media.length > 1 && (
        <>
          <button
            className="media-lightbox__nav media-lightbox__nav--prev"
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
            title="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="media-lightbox__nav media-lightbox__nav--next"
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
            title="Next"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className={`media-lightbox__stage${portrait ? ' media-lightbox__stage--portrait' : ''}`}>
        {item.type === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            muted
            loop
            playsInline
            aria-label={`${projectName} preview ${index + 1}`}
          />
        ) : (
          <img
            key={item.url}
            src={item.url}
            alt={`${projectName} screenshot ${index + 1} of ${media.length}`}
            draggable={false}
            onLoad={(event) => {
              const target = event.currentTarget
              setPortrait(target.naturalHeight > target.naturalWidth * 1.05)
            }}
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="media-lightbox__thumbnails" aria-label="Choose image">
          {media.map((entry, entryIndex) => (
            <button
              key={entry.path}
              type="button"
              className="media-lightbox__thumbnail"
              aria-label={`View image ${entryIndex + 1}`}
              aria-pressed={entryIndex === index}
              onClick={() => onNavigate(entryIndex)}
            >
              {entry.type === 'video' ? (
                <video src={entry.url} muted playsInline preload="metadata" />
              ) : (
                <img src={entry.url} alt="" loading="lazy" draggable={false} />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="media-lightbox__hint">TAP BACKDROP OR PRESS ESC TO CLOSE · SWIPE OR USE ARROWS TO BROWSE</p>
    </div>
  )
}

export default MediaLightbox
