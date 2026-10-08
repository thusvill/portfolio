import { Download, ExternalLink, GitBranch } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function getProjectLinkIcon(url: string): LucideIcon {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return ExternalLink
  }

  if (parsedUrl.hostname === 'github.com' || parsedUrl.hostname.endsWith('.github.com')) {
    if (/\/releases?(\/|$)|\/download(\/|$)/i.test(parsedUrl.pathname)) return Download
    return GitBranch
  }

  if (/\.(apk|dmg|exe|msi|pkg|tar\.gz|zip)$/i.test(parsedUrl.pathname)) return Download
  return ExternalLink
}