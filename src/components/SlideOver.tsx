import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

export type SlideOverProps = {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  width?: number | string // default 520
  children: React.ReactNode
}

const portalRootId = 'app-portal-root'

const ensurePortalRoot = () => {
  if (typeof document === 'undefined') return null
  let el = document.getElementById(portalRootId)
  if (!el) {
    el = document.createElement('div')
    el.id = portalRootId
    document.body.appendChild(el)
  }
  return el
}

const SlideOver: React.FC<SlideOverProps> = ({ open, onClose, title, description, width = 520, children }) => {
  const portalEl = ensurePortalRoot()

  useEffect(() => {
    if (!open) return
    // lock scroll while open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!portalEl || !open) return null

  return ReactDOM.createPortal(
    <div aria-modal="true" role="dialog" className="slideover-root" onClick={onClose}>
      <div
        className="slideover-panel anim-fade-in"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="slideover-header">
          <div>
            {title && <div className="slideover-title">{title}</div>}
            {description && <div className="slideover-desc">{description}</div>}
          </div>
          <button className="slideover-close" onClick={onClose} aria-label="Cerrar panel">×</button>
        </div>
        <div className="slideover-body">{children}</div>
      </div>
    </div>,
    portalEl
  )
}

export default SlideOver
