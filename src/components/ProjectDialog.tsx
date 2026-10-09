import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { getProjectMedia } from '../lib/projectAssets'
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
  const media = getProjectMedia(project.slug).filter((item) => item.group !== 'appicon')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => setSelectedMediaIndex(0), [project.id])

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
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
          <ProjectArtwork project={project} media={media[selectedMediaIndex] ?? null} />
          {media.length > 1 && (
            <div className="dialog-thumbnails" aria-label="Project screenshots">
              {media.map((item, mediaIndex) => (
                <button
                  className="dialog-thumbnail"
                  type="button"
                  key={item.path}
                  aria-label={`Show project media ${mediaIndex + 1}`}
                  aria-pressed={mediaIndex === selectedMediaIndex}
                  onClick={() => setSelectedMediaIndex(mediaIndex)}
                >
                  {item.type === 'video' ? (
                    <video src={item.url} muted playsInline preload="metadata" />
                  ) : (
                    <img src={item.url} alt="" loading="lazy" />
                  )}
                </button>
              ))}
            </div>
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
    </dialog>
  )
}

export default ProjectDialog