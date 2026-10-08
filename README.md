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

```text
src/img/<project-slug>/thumbnail/
src/img/<project-slug>/appicon/
src/img/<project-slug>/screenshots/
```

Add PNG, JPG, JPEG, WebP, or AVIF files. The thumbnail is preferred for cards, then the app icon, then screenshots. The project dialog provides a small gallery when more than one image is available. Projects without images use the built-in terminal-style fallback.

Link icons are selected from the URL: GitHub repositories use a branch icon, release/download URLs use a download icon, and other destinations use an external-link icon.

## Terminal commands

- `help`
- `list projects`
- `view project <name>`
- `list skills`
- `about`
- `theme`
- `font size <14-20>`
- `clear`
- `clear`
- `exit`

The terminal suggests matching commands and project names as you type; press Tab to complete the highlighted suggestion. Up/Down arrows recall recent commands. `exit` hides the active terminal, and the inline Quick Access panel can be restored. Press Space on the page to open the quick terminal. A shortcut guide appears once per page load. Project details can be closed with Escape and navigated with Left/Right arrows. Font size is clamped to the listed safe range and saved for the next visit.

## Deploy to Vercel

Import the repository into Vercel and use the detected Vite settings. The build command is `npm run build` and the output directory is `dist`. No API, server function, environment variable, or external service is required.
