import type { Project } from '../data/projects'
import { getProjectMedia } from '../lib/projectAssets'

interface ProjectArtworkProps {
  project: Project
  imageUrl?: string
}

const monograms: Record<string, string> = {
  'livewallpaper-macos': 'LW',
  'advance-wallpaper-manager': 'AW',
  'glow-player': 'GP',
  'yt-music-downloader': 'YT',
  'vector-vertex': 'VV',
}

function ProjectArtwork({ project, imageUrl }: ProjectArtworkProps) {
  const firstMedia = getProjectMedia(project.slug)[0]
  const artworkUrl = imageUrl ?? firstMedia?.url

  return (
    <div className="project-artwork">
      {artworkUrl ? (
        <img src={artworkUrl} alt={`${project.name} project preview`} loading="lazy" />
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