import { useEffect, useRef, type KeyboardEvent } from 'react'
import Terminal from './Terminal'

interface TerminalPopupProps {
  open: boolean
  fontSize: number
  onClose: () => void
  onOpenProject: (projectId: string) => void
  onSetFontSize: (size: number) => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
}

function TerminalPopup({ open, fontSize, onClose, onOpenProject, onSetFontSize, onToggleTheme, theme }: TerminalPopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLInputElement>('input')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      dialogRef.current?.close()
    }
  }

  return (
    <dialog className="quick-terminal-dialog" ref={dialogRef} aria-label="Quick command terminal" onClose={onClose} onKeyDown={handleKeyDown}>
      <Terminal
        fontSize={fontSize}
        isPopup={open}
        onClosePopup={() => dialogRef.current?.close()}
          onExit={() => dialogRef.current?.close()}
        onOpenProject={onOpenProject}
        onSetFontSize={onSetFontSize}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
    </dialog>
  )
}

export default TerminalPopup