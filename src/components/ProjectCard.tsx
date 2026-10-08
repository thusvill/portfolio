import { ArrowUpRight, Link2 } from 'lucide-react'
import type { Project } from '../data/projects'
import ProjectArtwork from './ProjectArtwork'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (projectId: string) => void
}

function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const status = project.isOngoing === undefined
    ? undefined
    : project.isOngoing ? 'ONGOING' : 'COMPLETED'

  return (
    <article className="project-card">
      <button className="project-card__open" type="button" onClick={() => onOpen(project.id)}>
        <ProjectArtwork project={project} />
        <div className="project-card__body">
          <div className="project-card__meta">
            <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
            {status && <span className={`project-status${project.isOngoing ? ' project-status--active' : ''}`}>{status}</span>}
          </div>
          <div className="project-card__title-row">
            <h3>{project.name}</h3>
            <ArrowUpRight className="project-card__arrow" size={15} aria-hidden="true" />
          </div>
          <p className="project-card__description">{project.description}</p>
          <div className="project-card__footer">
            <span className="project-card__tech">{project.technology.join(' / ')}</span>
            <span className="project-card__link-count"><Link2 size={11} /> {project.links.length}</span>
          </div>
          <div className="project-card__reveal">
            <span>{project.links.map((link) => link.label).join(' / ')}</span>
            <span>OPEN RECORD <ArrowUpRight size={11} /></span>
          </div>
        </div>
      </button>
    </article>
  )
}

export default ProjectCard