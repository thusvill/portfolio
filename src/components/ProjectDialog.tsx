import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { getProjectMedia } from '../lib/projectAssets'
import MediaLightbox from './MediaLightbox'
import ProjectArtwork from './ProjectArtwork'
import ProjectLinks from './ProjectLinks'

interface ProjectDialogProps {
  project: Project
  index: number
  total: number
  onClose: () => void
  onNavigate: (direction: -1 | 1) => void
}

function ProjectDialog({ project, index, total, onClose, onNavigate }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const media = getProjectMedia(project.slug).filter((item) => item.group !== 'appicon')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => setSelectedMediaIndex(0), [project.id])
  useEffect(() => setLightboxOpen(false), [project.id])

  const selectedMedia = media[selectedMediaIndex] ?? null
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchMoved = useRef(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (lightboxOpen) {
      // Let the fullscreen viewer own keyboard input while it is open.
      if (event.key === 'Escape') event.preventDefault()
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onNavigate(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      onNavigate(1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      dialogRef.current?.close()
    }
  }

  const closeDialog = () => dialogRef.current?.close()

  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby="dialog-project-title"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog()
      }}
    >
      <div className="dialog-topbar">
        <span>PROJECT RECORD / {String(index + 1).padStart(2, '0')}</span>
        <div className="dialog-controls">
          <button className="dialog-control" type="button" onClick={() => onNavigate(-1)} aria-label="Previous project" title="Previous project"><ChevronLeft size={17} /></button>
          <button className="dialog-control" type="button" onClick={() => onNavigate(1)} aria-label="Next project" title="Next project"><ChevronRight size={17} /></button>
          <button className="dialog-control" type="button" ref={closeButtonRef} onClick={closeDialog} aria-label="Close project details" title="Close"><X size={16} /></button>
        </div>
      </div>

      <div className="dialog-content">
        <div className="dialog-gallery">
          <button
            className="dialog-main-media"
            type="button"
            onClick={() => {
              if (touchMoved.current) {
                touchMoved.current = false
                return
              }
              if (selectedMedia) setLightboxOpen(true)
            }}
            onTouchStart={(event) => {
              const touch = event.touches[0]
              touchStartX.current = touch.clientX
              touchStartY.current = touch.clientY
              touchMoved.current = false
            }}
            onTouchMove={(event) => {
              if (touchStartX.current === null || touchStartY.current === null) return
              const touch = event.touches[0]
              const deltaX = touch.clientX - touchStartX.current
              const deltaY = touch.clientY - touchStartY.current
              if (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12) touchMoved.current = true
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null || touchStartY.current === null || media.length < 2) return
              const touch = event.changedTouches[0]
              const deltaX = touch.clientX - touchStartX.current
              const deltaY = touch.clientY - touchStartY.current
              touchStartX.current = null
              touchStartY.current = null
              if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
                event.preventDefault()
                setSelectedMediaIndex((current) => (current + (deltaX < 0 ? 1 : -1) + media.length) % media.length)
              }
            }}
            aria-label={selectedMedia ? `Open fullscreen viewer for ${project.name}, image ${selectedMediaIndex + 1} of ${media.length}` : `${project.name} preview`}
            title={selectedMedia ? 'Open fullscreen viewer' : undefined}
            disabled={!selectedMedia}
          >
            <ProjectArtwork project={project} media={selectedMedia} />
            {selectedMedia && (
              <span className="dialog-main-media__expand" aria-hidden="true">
                <Expand size={14} /> TAP TO EXPAND
              </span>
            )}
          </button>
          {media.length > 1 && (
            <>
              <p className="dialog-media-count" aria-live="polite">
                {selectedMediaIndex + 1} / {media.length} · SWIPE OR TAP THUMBNAILS
              </p>
              <div className="dialog-thumbnails" aria-label="Project screenshots">
                {media.map((item, mediaIndex) => (
                  <button
                    className="dialog-thumbnail"
                    type="button"
                    key={item.path}
                    aria-label={`Show project media ${mediaIndex + 1}`}
                    aria-pressed={mediaIndex === selectedMediaIndex}
                    onClick={() => setSelectedMediaIndex(mediaIndex)}
                    onDoubleClick={() => {
                      setSelectedMediaIndex(mediaIndex)
                      setLightboxOpen(true)
                    }}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} muted playsInline preload="metadata" />
                    ) : (
                      <img src={item.url} alt="" loading="lazy" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dialog-details">
          <p className="dialog-count">{project.category} / {String(index + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}</p>
          <h2 id="dialog-project-title">{project.name}</h2>
          <p className="dialog-description">{project.description}</p>

          {(project.isOngoing !== undefined || project.timeDuration || project.ageWhenMade !== undefined) && (
            <dl className="dialog-meta">
              {project.isOngoing !== undefined && (
                <div>
                  <dt className="dialog-meta-label">Status</dt>
                  <dd className="dialog-meta-value">{project.isOngoing ? 'Ongoing' : 'Completed'}</dd>
                </div>
              )}
              {project.timeDuration && (
                <div>
                  <dt className="dialog-meta-label">Duration</dt>
                  <dd className="dialog-meta-value">{project.timeDuration}</dd>
                </div>
              )}
              {project.ageWhenMade !== undefined && (
                <div>
                  <dt className="dialog-meta-label">Age at the time</dt>
                  <dd className="dialog-meta-value">{project.ageWhenMade}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="dialog-tags" aria-label="Technologies">
            {project.technology.map((technology) => <span className="dialog-tag" key={technology}>{technology}</span>)}
          </div>

          <ProjectLinks links={project.links} />

          <div className="dialog-navigation">
            <button type="button" onClick={() => onNavigate(-1)}><ArrowLeft size={13} /> Previous</button>
            <button type="button" onClick={() => onNavigate(1)}>Next <ArrowRight size={13} /></button>
          </div>
        </div>
      </div>
      {lightboxOpen && selectedMedia && (
        <MediaLightbox
          media={media}
          index={selectedMediaIndex}
          projectName={project.name}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setSelectedMediaIndex}
        />
      )}
    </dialog>
  )
}

export default ProjectDialog