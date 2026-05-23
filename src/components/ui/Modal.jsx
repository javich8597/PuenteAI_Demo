/**
 * Modal — Diálogo modal accesible con animaciones
 * Cierra con Escape, clic en backdrop, o botón X.
 * Atrapa el foco dentro del modal.
 */
import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

/** Selectores de elementos enfocables */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)

  /** Atrapar foco dentro del modal */
  const trapFocus = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return

    const focusable = panelRef.current.querySelectorAll(FOCUSABLE)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  /** Cerrar con Escape */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.()
      trapFocus(e)
    },
    [onClose, trapFocus]
  )

  /** Gestionar foco al abrir/cerrar */
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      // Enfocar el primer elemento dentro del panel tras la animación
      const timer = setTimeout(() => {
        const focusable = panelRef.current?.querySelectorAll(FOCUSABLE)
        if (focusable?.length) focusable[0].focus()
      }, 100)

      document.addEventListener('keydown', handleKeyDown)
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'

      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            // Cerrar solo si se hizo clic en el backdrop
            if (e.target === e.currentTarget) onClose?.()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            ref={panelRef}
            className={`${styles.panel} ${styles[size]}`}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            {title && (
              <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <button
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Contenido */}
            <div className={styles.content}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
