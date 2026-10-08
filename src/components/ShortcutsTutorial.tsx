import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CornerDownLeft } from 'lucide-react'
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../lib/fontSize'

interface ShortcutsTutorialProps {
  open: boolean
  onClose: () => void
  onOpenTerminal: () => void
}

function ShortcutsTutorial({ open, onClose, onOpenTerminal }: ShortcutsTutorialProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dismissButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      dismissButtonRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const closeDialog = () => dialogRef.current?.close()
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDialog()
    }
  }
  const openTerminal = () => {
    closeDialog()
    onOpenTerminal()
  }

  return (
    <dialog className="shortcuts-dialog" ref={dialogRef} aria-labelledby="shortcuts-title" onClose={onClose} onKeyDown={handleKeyDown}>
      <div className="shortcuts-dialog__heading">
        <span>FIRST SESSION / SHORTCUTS</span>
        <span aria-hidden="true">01—05</span>
      </div>
      <div className="shortcuts-dialog__content">
        <p className="eyebrow">A few useful keys</p>
        <h2 id="shortcuts-title">Quick reference</h2>
        <dl className="shortcut-list">
          <div><dt><kbd>Space</kbd></dt><dd>Open the quick command terminal</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>Close the current popup</dd></div>
          <div><dt><kbd><ArrowLeft size={13} /><ArrowRight size={13} /></kbd></dt><dd>Move between project details</dd></div>
          <div><dt><kbd><ArrowUp size={13} /><ArrowDown size={13} /></kbd></dt><dd>Recall terminal commands</dd></div>
          <div><dt><kbd>Enter <CornerDownLeft size={13} /></kbd></dt><dd>Run a terminal command</dd></div>
        </dl>
        <p className="shortcuts-dialog__hint">Use <kbd>Tab</kbd> to complete a suggestion, or type <code>exit</code> to hide the terminal.</p>
        <p className="shortcuts-dialog__hint">Try <code>help</code> or set a safe text size with <code>font size {MIN_FONT_SIZE}-{MAX_FONT_SIZE}</code>.</p>
        <div className="shortcuts-dialog__actions">
          <button className="tutorial-dismiss" type="button" ref={dismissButtonRef} onClick={closeDialog}>Got it</button>
          <button className="tutorial-open-terminal" type="button" onClick={openTerminal}>Open quick terminal <CornerDownLeft size={14} /></button>
        </div>
      </div>
    </dialog>
  )
}

export default ShortcutsTutorial