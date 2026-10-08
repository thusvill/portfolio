import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { CornerDownLeft, X } from 'lucide-react'
import { profile } from '../data/profile'
import type { Project } from '../data/projects'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { clampFontSize, MAX_FONT_SIZE, MIN_FONT_SIZE } from '../lib/fontSize'

interface TerminalProps {
  onOpenProject: (projectId: string) => void
  onExit: () => void
  onToggleTheme: () => void
  onSetFontSize: (size: number) => void
  fontSize: number
  theme: 'light' | 'dark'
  isPopup?: boolean
  onClosePopup?: () => void
}

interface TerminalEntry {
  command: string
  lines: string[]
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function getSuggestions(value: string, fontSize: number): string[] {
  const normalizedValue = normalizeName(value)
  if (!normalizedValue) return []

  if (normalizedValue === 'view project') {
    return projects.map((project) => `view project ${project.name}`)
  }

  if (normalizedValue.startsWith('view project ')) {
    const projectPrefix = normalizedValue.slice('view project '.length)
    return projects
      .filter((project) => normalizeName(project.name).startsWith(projectPrefix))
      .map((project) => `view project ${project.name}`)
  }

  const fontSizes = [...new Set([MIN_FONT_SIZE, fontSize, MAX_FONT_SIZE])]
    .map((size) => `font size ${size}`)
  if (normalizedValue === 'font size' || normalizedValue.startsWith('font size ')) {
    return fontSizes.filter((suggestion) => normalizeName(suggestion).startsWith(normalizedValue))
  }

  const commands = ['help', 'list projects', 'view project', 'list skills', 'about', 'theme', 'font size', 'clear', 'exit']
  return commands.filter((suggestion) => suggestion.startsWith(normalizedValue) && suggestion !== normalizedValue)
}

function findProject(query: string): Project | undefined {
  const normalizedQuery = normalizeName(query)
  return projects.find((project) =>
    normalizeName(project.name) === normalizedQuery || normalizeName(project.slug) === normalizedQuery,
  )
}

function Terminal({ onOpenProject, onExit, onToggleTheme, onSetFontSize, fontSize, theme, isPopup = false, onClosePopup }: TerminalProps) {
  const terminalId = useId()
  const [command, setCommand] = useState('')
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { command: '', lines: ['Portfolio terminal ready.', 'Type "help" to browse commands.'] },
  ])
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(0)
  const suggestions = getSuggestions(command, fontSize)

  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])

  useEffect(() => {
    if (isPopup) inputRef.current?.focus()
  }, [isPopup])

  const runCommand = (rawCommand: string) => {
    const trimmedCommand = rawCommand.trim()
    const normalizedCommand = normalizeName(trimmedCommand)
    if (!trimmedCommand) return

    historyRef.current.push(trimmedCommand)
    historyIndexRef.current = historyRef.current.length

    if (normalizedCommand === 'clear') {
      setEntries([])
      return
    }

    if (normalizedCommand === 'exit') {
      onExit()
      return
    }

    let lines: string[]
    const fontCommand = normalizedCommand.match(/^font(?: size)?(?:\s+(.+))?$/)
    if (fontCommand) {
      const requestedSize = fontCommand[1] === undefined ? Number.NaN : Number(fontCommand[1])
      if (!Number.isFinite(requestedSize)) {
        lines = [`Current font size: ${fontSize}px.`, `Usage: font size <${MIN_FONT_SIZE}-${MAX_FONT_SIZE}>.`]
      } else {
        const nextSize = clampFontSize(requestedSize)
        onSetFontSize(nextSize)
        const limitNote = nextSize === requestedSize ? '' : ' (adjusted to the safe range)'
        lines = [`Font size set to ${nextSize}px${limitNote}. Safe range: ${MIN_FONT_SIZE}-${MAX_FONT_SIZE}px.`]
      }
    } else if (normalizedCommand === 'help') {
      lines = [
        'list projects    show the project index',
        'view project <name>    open a project record',
        'list skills      show tools and languages',
        'about            profile and contact details',
        'theme            switch light / dark mode',
        `font size <${MIN_FONT_SIZE}-${MAX_FONT_SIZE}>    set text size safely`,
        'clear            clear terminal output',
        'exit             hide this terminal',
      ]
    } else if (normalizedCommand === 'list projects') {
      lines = projects.map((project, index) => {
        const state = project.isOngoing === undefined ? '' : project.isOngoing ? ' [ongoing]' : ' [complete]'
        return `${String(index + 1).padStart(2, '0')}  ${project.name}${state}`
      })
    } else if (normalizedCommand.startsWith('view project ')) {
      const project = findProject(trimmedCommand.slice('view project '.length))
      if (project) {
        onOpenProject(project.id)
        lines = [`Opening ${project.name}...`]
      } else {
        lines = ['No matching project. Try "list projects".']
      }
    } else if (normalizedCommand === 'list skills') {
      lines = skills.map((skill) => `${skill.name} — ${skill.category}`)
    } else if (normalizedCommand === 'about') {
      lines = [
        profile.fullName,
        `Preferred name: ${profile.preferredName}`,
        profile.role,
        profile.location,
        `Education: ${profile.education}`,
        profile.email,
        profile.github,
      ]
    } else if (normalizedCommand === 'theme') {
      onToggleTheme()
      lines = [`Theme switched from ${theme} to ${theme === 'light' ? 'dark' : 'light'}.`]
    } else {
      lines = [`Command not found: ${trimmedCommand}`, 'Type "help" to see available commands.']
    }

    setEntries((currentEntries) => [...currentEntries, { command: trimmedCommand, lines }].slice(-40))
  }

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runCommand(command)
    setCommand('')
  }

  const acceptSuggestion = (suggestion: string) => {
    setCommand(suggestion)
    inputRef.current?.focus()
  }

  const handleHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && suggestions.length > 0) {
      event.preventDefault()
      acceptSuggestion(suggestions[selectedSuggestionIndex] ?? suggestions[0])
    } else if (suggestions.length > 0 && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setSelectedSuggestionIndex((currentIndex) =>
        (currentIndex + direction + suggestions.length) % suggestions.length,
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      historyIndexRef.current = Math.max(0, historyIndexRef.current - 1)
      setCommand(historyRef.current[historyIndexRef.current] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      historyIndexRef.current = Math.min(historyRef.current.length, historyIndexRef.current + 1)
      setCommand(historyRef.current[historyIndexRef.current] ?? '')
    }
  }

  return (
      <div className={`terminal-window${isPopup ? ' terminal-window--popup' : ''}`}>
      <div className="terminal-topbar">
        <span className="terminal-topbar__label">
          <span className="terminal-lights" aria-hidden="true"><span /><span /><span /></span>
          bios@portfolio:~
        </span>
          <span className="terminal-topbar__mode">{theme.toUpperCase()} / INTERACTIVE</span>
          {isPopup && <button className="terminal-popup-close icon-button" type="button" onClick={onClosePopup} aria-label="Close quick terminal" title="Close quick terminal"><X size={15} /></button>}
      </div>
      <div className="terminal-output" ref={outputRef} aria-live="polite" aria-relevant="additions text">
        {entries.map((entry, index) => (
          <div className="terminal-entry" key={`${index}-${entry.command}`}>
            {entry.command && <p className="terminal-entry__command"><span className="terminal-prompt-mark">$</span>{entry.command}</p>}
            {entry.lines.map((line, lineIndex) => (
              <p className="terminal-entry__line" key={`${lineIndex}-${line}`}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={submitCommand}>
        <label className="terminal-form__prompt" htmlFor={`terminal-command-${terminalId}`}>$</label>
        <input
          id={`terminal-command-${terminalId}`}
          ref={inputRef}
          autoComplete="off"
          spellCheck={false}
          value={command}
          onChange={(event) => {
            setCommand(event.target.value)
            setSelectedSuggestionIndex(0)
          }}
          onKeyDown={handleHistory}
          placeholder="type a command"
          aria-label="Portfolio terminal command"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls={`terminal-suggestions-${terminalId}`}
          aria-activedescendant={suggestions.length > 0 ? `terminal-suggestion-${terminalId}-${selectedSuggestionIndex}` : undefined}
        />
        <button type="submit" aria-label="Run command" title="Run command"><CornerDownLeft size={15} /></button>
      </form>
      {suggestions.length > 0 && (
        <div className="terminal-suggestions" id={`terminal-suggestions-${terminalId}`} role="listbox" aria-label="Command suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              className="terminal-suggestion"
              id={`terminal-suggestion-${terminalId}-${index}`}
              type="button"
              role="option"
              aria-selected={index === selectedSuggestionIndex}
              key={suggestion}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onClick={() => acceptSuggestion(suggestion)}
            >
              <span>{suggestion}</span>
              {index === selectedSuggestionIndex && <span className="terminal-suggestion__hint">TAB</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Terminal