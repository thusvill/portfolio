import type { Project } from '../data/projects'
import ProjectCard from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
  onOpenProject: (projectId: string) => void
}

function ProjectGrid({ projects, onOpenProject }: ProjectGridProps) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} onOpen={onOpenProject} />
      ))}
    </div>
  )
}

export default ProjectGrid