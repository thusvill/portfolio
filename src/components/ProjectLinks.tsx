import { ArrowUpRight } from 'lucide-react'
import type { ProjectLink as ProjectLinkData } from '../data/projects'
import { getProjectLinkIcon } from '../lib/projectLinks'

interface ProjectLinksProps {
  links: ProjectLinkData[]
}

function ProjectLinks({ links }: ProjectLinksProps) {
  return (
    <div className="project-links">
      {links.map((link) => {
        const Icon = getProjectLinkIcon(link.url)
        return (
          <a className="project-link" href={link.url} key={link.url} target="_blank" rel="noreferrer">
            <span className="project-link__label"><Icon size={15} aria-hidden="true" />{link.label}</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

export default ProjectLinks