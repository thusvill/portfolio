import type { Project } from '../data/projects'
import { getProjectMedia, type ProjectMedia } from '../lib/projectAssets'

interface ProjectArtworkProps {
  project: Project
  media?: ProjectMedia | null
}

const monograms: Record<string, string> = {
  'livewallpaper-macos': 'LW',
  'advance-wallpaper-manager': 'AW',
  'glow-player': 'GP',
  'yt-music-downloader': 'YT',
  'vector-vertex': 'VV',
}

function ProjectArtwork({ project, media }: ProjectArtworkProps) {
  const projectMedia = getProjectMedia(project.slug)
  const artwork = media === undefined
    ? projectMedia.find((item) => item.group === 'appicon' && item.type === 'image')
      ?? projectMedia.find((item) => item.type === 'image')
    : media ?? undefined

  return (
    <div className={`project-artwork${media === undefined && artwork?.group === 'appicon' ? ' project-artwork--icon' : ''}`}>
      {artwork?.type === 'video' ? (
        <video
          src={artwork.url}
          aria-label={`${project.name} project preview`}
          controls
          autoPlay
          muted
          loop
          playsInline
        />
      ) : artwork ? (
        <img src={artwork.url} alt={`${project.name} project preview`} loading={media === undefined ? 'lazy' : 'eager'} />
      ) : (
        <div className="project-artwork__fallback">
          <span className="project-artwork__serial">PROJECT / {project.id.slice(0, 2).toUpperCase()}</span>
          <span className="project-artwork__glyph">{monograms[project.id] ?? 'PR'}</span>
          <span className="project-artwork__lines">{project.category}<br />{project.technology[0]}</span>
          <span className="project-artwork__corner" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export default ProjectArtwork