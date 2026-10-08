export interface Skill {
  name: string
  category: string
  detail: string
}

export interface Qualification {
  name: string
  issuer?: string
  date?: string
  detail?: string
}

export const skills: Skill[] = [
  { name: 'C++', category: 'Languages', detail: 'Game engine architecture and native applications.' },
  { name: 'C', category: 'Languages', detail: 'Low level systems and graphics programming.' },
  { name: 'Swift', category: 'Languages', detail: 'Apple platform applications.' },
  { name: 'Objective C++', category: 'Languages', detail: 'Native macOS integrations and applications.' },
  { name: 'Kotlin', category: 'Languages', detail: 'Android applications.' },
  { name: 'Python', category: 'Languages', detail: 'Scripting and development utilities.' },
  { name: 'Vulkan', category: 'Graphics', detail: 'Low level graphics programming and engine development.' },
  { name: 'OpenGL', category: 'Graphics', detail: 'Realtime rendering and graphics experiments.' },
  { name: 'RHI design', category: 'Graphics', detail: 'Render Hardware Interface abstractions across graphics backends.' },
  { name: 'macOS / Linux / Android / tvOS', category: 'Platforms', detail: 'Native development across desktop, mobile, and Apple TV.' },
  { name: 'Arch Linux + Hyprland', category: 'Platforms', detail: 'Linux development environment and tiling compositor.' },
  { name: 'Android Studio', category: 'Tools', detail: 'Android application development.' },
  { name: 'Neovim / VS Code', category: 'Tools', detail: 'Code editing and development workflows.' },
  { name: 'Git / Fish shell', category: 'Tools', detail: 'Version control and commandline workflows.' },
]

export const qualifications: Qualification[] = [
  {
    name: 'BSc Honours in Computer Science',
    issuer: 'Faculty of Computing and Technology, University of Kelaniya',
    detail: '4 year degree program',
  },
  {
    name: 'G.C.E. Advanced Level 1st attempt',
    issuer: 'Combined Mathematics: C | Physics: C | ICT: A',
    detail: 'Results',
  },
  {
    name: 'G.C.E. Advanced Level 2nd attempt',
    issuer: 'Pending',
    detail: 'Results pending',
  },
]