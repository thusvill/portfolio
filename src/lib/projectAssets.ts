const imageFiles = Object.entries(
  import.meta.glob('../img/**/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
) as [string, string][]

export interface ProjectMedia {
  path: string
  url: string
  group: 'thumbnail' | 'appicon' | 'screenshots' | 'other'
}

export function getProjectMedia(slug: string): ProjectMedia[] {
  const projectFolder = `/img/${slug}/`
  const order: Record<ProjectMedia['group'], number> = { thumbnail: 0, appicon: 1, screenshots: 2, other: 3 }

  return imageFiles
    .filter(([path]) => path.toLowerCase().includes(projectFolder))
    .map(([path, url]) => {
      const lowerPath = path.toLowerCase()
      const group: ProjectMedia['group'] = lowerPath.includes('/thumbnail/')
        ? 'thumbnail'
        : lowerPath.includes('/appicon/')
          ? 'appicon'
          : lowerPath.includes('/screenshots/')
            ? 'screenshots'
            : 'other'

      return { path, url, group }
    })
    .sort((first, second) => {
      return order[first.group] - order[second.group] || first.path.localeCompare(second.path)
    })
}