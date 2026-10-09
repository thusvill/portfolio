import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, GitBranch, Keyboard, Moon, Sun } from 'lucide-react'
import ProjectDialog from './components/ProjectDialog'
import MatrixBackground from './components/MatrixBackground'
import ProjectGrid from './components/ProjectGrid'
import ShortcutsTutorial from './components/ShortcutsTutorial'
import SkillsSection from './components/SkillsSection'
import Terminal from './components/Terminal'
import TerminalPopup from './components/TerminalPopup'
import { profile } from './data/profile'
import { projects } from './data/projects'
import { clampFontSize, DEFAULT_FONT_SIZE, FONT_SCALE_BASE_SIZE } from './lib/fontSize'
import './portfolio.css'

function PortfolioApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = window.localStorage.getItem('portfolio-theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null)
  const [fontSize, setFontSize] = useState(() => {
    const storedSize = Number(window.localStorage.getItem('portfolio-font-size'))
    return Number.isFinite(storedSize) && storedSize > 0 ? clampFontSize(storedSize) : DEFAULT_FONT_SIZE
  })
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [inlineTerminalVisible, setInlineTerminalVisible] = useState(true)
  const [tutorialOpen, setTutorialOpen] = useState(() => {
    // Keyboard shortcuts are meaningless on touch-first / small screens, so don't
    // pop the quick-reference dialog there in the first place.
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse), (hover: none), (max-width: 720px)').matches) return false
    return true
  })
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontSize / FONT_SCALE_BASE_SIZE))
    window.localStorage.setItem('portfolio-font-size', String(fontSize))
  }, [fontSize])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return

    const moveCursor = (event: PointerEvent) => {
      // Touch taps fire a single pointermove and then go silent, which left the
      // custom cursor frozen at the tap point. Only track mouse/pen movement.
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      cursor.classList.remove('is-hidden')
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }

    const pressCursor = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        cursor.classList.add('is-hidden')
        return
      }
      cursor.classList.add('is-pressed')
    }

    const HOVER_SELECTOR = 'a, button, input, select, textarea, [role="button"]'

    const updateHover = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        cursor.classList.remove('is-hovering')
        return
      }
      const target = event.target
      if (target instanceof HTMLElement && target.closest(HOVER_SELECTOR)) {
        cursor.classList.add('is-hovering')
      } else {
        cursor.classList.remove('is-hovering')
      }
    }

    const clearHover = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        cursor.classList.remove('is-hovering')
        return
      }
      const related = event.relatedTarget
      if (!(related instanceof HTMLElement) || !related.closest(HOVER_SELECTOR)) {
        cursor.classList.remove('is-hovering')
      }
    }

    const releaseCursor = () => {
      cursor.classList.remove('is-pressed')
      cursor.classList.remove('is-hovering')
    }
    const hideCursor = () => cursor.classList.add('is-hidden')
    const handleWindowBlur = () => {
      releaseCursor()
      hideCursor()
    }
    const handleFocusIn = (event: FocusEvent) => {
      // Touch taps move focus to the tapped button but never fire another
      // pointermove, so don't hide/reposition the cursor for touch focus.
      const target = event.target
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) {
        hideCursor()
      }
    }

    window.addEventListener('pointermove', moveCursor, { passive: true })
    window.addEventListener('pointermove', updateHover, { passive: true })
    window.addEventListener('pointerdown', pressCursor, { passive: true })
    window.addEventListener('pointerup', releaseCursor, { passive: true })
    window.addEventListener('pointercancel', releaseCursor, { passive: true })
    window.addEventListener('blur', handleWindowBlur)
    document.documentElement.addEventListener('mouseleave', hideCursor)
    document.documentElement.addEventListener('pointerleave', clearHover)
    document.addEventListener('focusin', handleFocusIn)
    // Touch leaves sticky :hover behind on the tapped element, which used to
    // keep the crosshair collapsed. Clear it on the next touch interaction.
    document.addEventListener('touchend', releaseCursor, { passive: true })
    document.addEventListener('touchcancel', releaseCursor, { passive: true })
    return () => {
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('pointermove', updateHover)
      window.removeEventListener('pointerdown', pressCursor)
      window.removeEventListener('pointerup', releaseCursor)
      window.removeEventListener('pointercancel', releaseCursor)
      window.removeEventListener('blur', handleWindowBlur)
      document.documentElement.removeEventListener('mouseleave', hideCursor)
      document.documentElement.removeEventListener('pointerleave', clearHover)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('touchend', releaseCursor)
      document.removeEventListener('touchcancel', releaseCursor)
    }
  }, [])

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || tutorialOpen || terminalOpen || activeProjectIndex !== null) return
      const target = event.target
      if (!(target instanceof HTMLElement) || target.isContentEditable || target.closest('input, textarea, select, button, a, [role="button"], [contenteditable="true"]')) return
      event.preventDefault()
      setTerminalOpen(true)
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [activeProjectIndex, terminalOpen, tutorialOpen])

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  const openProject = (projectId: string) => {
    const index = projects.findIndex((project) => project.id === projectId)
    if (index >= 0) setActiveProjectIndex(index)
  }
  const navigateProject = (direction: -1 | 1) => {
    setActiveProjectIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex + direction + projects.length) % projects.length
    })
  }

  return (
    <div className="site-shell">
      <div className="ambient-pattern" aria-hidden="true" />
      <MatrixBackground />
      <div className="custom-crosshair" ref={cursorRef} aria-hidden="true">
        <span className="crosshair-arm crosshair-arm--top" />
        <span className="crosshair-arm crosshair-arm--right" />
        <span className="crosshair-arm crosshair-arm--bottom" />
        <span className="crosshair-arm crosshair-arm--left" />
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Bios Thusvill, home">
          <span className="wordmark__symbol">BT</span>
          <span>thusvill<span className="wordmark__slash">/</span></span>
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#projects"><span>01</span> work</a>
          <a href="#skills"><span>02</span> skills</a>
          <a href="#contact"><span>03</span> contact</a>
        </nav>
        <button className="theme-toggle icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </header>

      <main id="top">
        <section className="intro-section page-section" id="about" aria-labelledby="intro-title">
          <div className="intro-copy">
            <p className="eyebrow"><span className="status-dot" /> systems / graphics / applications</p>
            <h1 id="intro-title">Bios<br />Thusvill<span className="cursor-mark">_</span></h1>
            <p className="intro-role">Computer science student <span>//</span> Engine and graphics developer</p>
            <p className="intro-full-name">{profile.fullName}</p>
            <p className="intro-summary">{profile.bio}</p>
            <div className="intro-actions">
              <a className="text-action" href="#projects">Explore selected work <ArrowDown size={15} /></a>
              <span className="intro-location">{profile.location}</span>
            </div>
          </div>

          <aside className="intro-aside" aria-label="Profile details">
            <div className="intro-aside__item">
              <span>STUDY</span>
              <p>{profile.education}</p>
            </div>
            <div className="intro-aside__item">
              <span>GRAPHICS</span>
              <p>Vulkan / RHI</p>
            </div>
            <div className="intro-aside__item">
              <span>PLATFORMS</span>
              <p>macOS / Linux / Android / tvOS</p>
            </div>
          </aside>

          <div className="intro-bottomline">
            <span>INDEPENDENT DEVELOPER</span>
            <span>BUILDING FOR DESKTOP + MOBILE</span>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile">GITHUB <ArrowUpRight size={13} /></a>
          </div>
        </section>

        <section className="terminal-section page-section" aria-labelledby="terminal-title">
          <div className="section-heading terminal-heading">
            <div><p className="eyebrow">A small interface for a larger body of work</p><h2 id="terminal-title">Quick access</h2></div>
            <button className="quick-terminal-trigger icon-button" type="button" onClick={() => setTerminalOpen(true)} aria-label="Open quick terminal with Spacebar" title="Open quick terminal (Spacebar)"><Keyboard size={17} /></button>
          </div>
          {inlineTerminalVisible ? (
            <Terminal
              fontSize={fontSize}
              onExit={() => setInlineTerminalVisible(false)}
              onOpenProject={openProject}
              onSetFontSize={setFontSize}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          ) : (
            <button className="terminal-reopen" type="button" onClick={() => setInlineTerminalVisible(true)}>
              Show Quick Access terminal
            </button>
          )}
        </section>

        <section className="projects-section page-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <div><p className="eyebrow">A few things I have made</p><h2 id="projects-title">Selected work<span className="heading-count">[{String(projects.length).padStart(2, '0')}]</span></h2></div>
            <span className="section-index">INDEX / 01</span>
          </div>
          <ProjectGrid projects={projects} onOpenProject={openProject} />
        </section>

        <section className="skills-section page-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <div><p className="eyebrow">Tools, languages, and practice</p><h2 id="skills-title">What I work with</h2></div>
            <span className="section-index">STACK / 02</span>
          </div>
          <SkillsSection />
        </section>

        <section className="contact-section page-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-copy">
            <p className="eyebrow">Have a good problem?</p>
            <h2 id="contact-title">Let&apos;s make<br />something useful<span className="cursor-mark">_</span></h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={17} /></a>
          </div>
          <div className="contact-links" aria-label="Social links">
            <a href={profile.github} target="_blank" rel="noreferrer"><GitBranch size={17} /> GitHub <ArrowUpRight size={13} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={17} /> LinkedIn <ArrowUpRight size={13} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span>© {new Date().getFullYear()} BIOS THUSVILL</span><a href="#top">BACK TO TOP ↑</a><span>BUILT WITH CURIOSITY</span></footer>

      {activeProjectIndex !== null && (
        <ProjectDialog
          project={projects[activeProjectIndex]}
          index={activeProjectIndex}
          total={projects.length}
          onClose={() => setActiveProjectIndex(null)}
          onNavigate={navigateProject}
        />
      )}
      <TerminalPopup
        open={terminalOpen}
        fontSize={fontSize}
        onClose={() => setTerminalOpen(false)}
        onOpenProject={openProject}
        onSetFontSize={setFontSize}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      <ShortcutsTutorial
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
    </div>
  )
}

export default PortfolioApp