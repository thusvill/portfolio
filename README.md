# Bios Thusvill Portfolio

A small, static React + TypeScript portfolio with a command terminal, project records, and a persistent light/dark theme.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The generated site is in `dist/`.

## Edit the content

- Update `src/data/profile.ts` for the bio and contact links.
- Update `src/data/projects.ts` to add or edit project objects. `timeDuration`, `isOngoing`, and `ageWhenMade` are optional; only add details you want displayed.
- Update `src/data/skills.ts` for skills and qualifications.
- Replace `src/img/profile.png` with a portrait image of the same name.

Project image folders use each project's `slug` from `projects.ts`:
Image folders are pre-created using the `slug` from `src/data/projects.ts`:

- `src/img/livewallpaper-macos/`
- `src/img/advance-wallpaper-manager/`
- `src/img/glow-player/`
- `src/img/yt-music-downloader/`
- `src/img/vector-vertex/`
- `src/img/tvisualiser/`

Each project folder contains `thumbnail/`, `appicon/`, and `screenshots/` subfolders. Add `.png`, `.jpg`, `.jpeg`, `.webp`, or `.avif` images, and `.mp4`, `.webm`, `.ogv`, or `.mov` videos with lowercase extensions. No exact filename is required. For predictable selection, use names such as `01-cover.webp`, `02-detail.png`, and `03-settings.jpg`; project cards use the first alphabetical app icon, filling the preview, or fall back to the first available image. The project dialog opens on the first item in `thumbnail/` (image or video), then displays available thumbnails and screenshots without app icons. Projects without images use the built-in terminal-style fallback.

Link icons are selected from the URL: GitHub repositories use a branch icon, release/download URLs use a download icon, and other destinations use an external-link icon.

## Terminal commands

- `help`
- `list projects`
- `view project <name>`
- `list skills`
- `about`
- `theme`
- `font size <14-20>`
- `font size <16-20>`
- `clear`
- `clear`
- `exit`

The terminal suggests matching commands and project names as you type; press Tab to complete the highlighted suggestion. Up/Down arrows recall recent commands. `exit` hides the active terminal, and the inline Quick Access panel can be restored. Press Space on the page to open the quick terminal. A shortcut guide appears once per page load. Project details can be closed with Escape and navigated with Left/Right arrows. Font size is clamped to the listed safe range and saved for the next visit.

## Deploy to Vercel

Import the repository into Vercel and use the detected Vite settings. The build command is `npm run build` and the output directory is `dist`. No API, server function, environment variable, or external service is required.
