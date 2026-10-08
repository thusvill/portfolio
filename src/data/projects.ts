export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  slug: string
  name: string
  description: string
  category: string
  technology: string[]
  links: ProjectLink[]
  timeDuration?: string
  isOngoing?: boolean
  ageWhenMade?: number
}

export const projects: Project[] = [
  {
    id: 'livewallpaper-macos',
    slug: 'livewallpaper-macos',
    name: 'LiveWallpaperMacOS',
    description: 'An open-source live wallpaper app for macOS 14+. Play video wallpapers on the desktop, manage multiple displays, and install with Homebrew.',
    category: 'macOS application',
    technology: ['Objective C++', 'SwiftUI', 'CMake'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/LiveWallpaperMacOS' },
      { label: 'Releases', url: 'https://github.com/thusvill/LiveWallpaperMacOS/releases' },
      { label: 'Project page', url: 'https://thusvill.github.io/LiveWallpaperMacOS/' },
    ],
    isOngoing: true,
  },
  {
    id: 'advance-wallpaper-manager',
    slug: 'advance-wallpaper-manager',
    name: 'Advance Wallpaper Manager',
    description: 'An Android depth wallpaper tool that places a clock behind a segmented foreground, using on device models and a native C++ rendering pipeline.',
    category: 'Android application',
    technology: ['Kotlin', 'Jetpack Compose', 'C++', 'TensorFlow Lite'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/AdvanceWallpaperManager' },
      { label: 'Releases', url: 'https://github.com/thusvill/AdvanceWallpaperManager/releases' },
      { label: 'Project page', url: 'https://thusvill.github.io/AdvanceWallpaperManager/' },
    ],
    isOngoing: true,
  },
  {
    id: 'glow-player',
    slug: 'glow-player',
    name: 'GlowPlayer',
    description: 'A desktop music player and visualiser built with Flutter, with support for desktop platforms.',
    category: 'Desktop application',
    technology: ['Dart', 'Flutter', 'C++'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/GlowPlayer' },
    ],
  },
  {
    id: 'yt-music-downloader',
    slug: 'yt-music-downloader',
    name: 'YTMusicDownloader',
    description: 'A desktop utility for downloading YouTube Music as MP3 files with metadata, including playlist support.',
    category: 'Desktop utility',
    technology: ['C++', 'Qt', 'yt-dlp'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/YTMusicDownloader' },
      { label: 'Releases', url: 'https://github.com/thusvill/YTMusicDownloader/releases' },
    ],
  },
  {
    id: 'vector-vertex',
    slug: 'vector-vertex',
    name: 'Vector Vertex',
    description: 'A custom C++ game engine focused on low level graphics architecture, with Vulkan backend behind a Render Hardware Interface.',
    category: 'Game engine',
    technology: ['C++', 'Vulkan', 'RHI'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/VectorVertexOld' },
    ],
  },
  {
    id: 'tvisualiser',
    slug: 'tvisualiser',
    name: 'TVisualiser',
    description: 'An Apple tvOS audio visualiser application built with Swift.',
    category: 'tvOS application',
    technology: ['Swift', 'tvOS'],
    links: [
      { label: 'GitHub repository', url: 'https://github.com/thusvill/TVisualiser' },
    ],
  },
]