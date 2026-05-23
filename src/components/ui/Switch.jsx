/**
 * Switch — Interruptor de alternancia accesible
 * Track 52×28px, thumb 24px con animación suave
 */
import { useId } from 'react'
import { motion } from 'motion/react'
import styles from './Switch.module.css'

export default function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
}) {
  const id = useId()

  const handleToggle = () => {
    if (!disabled) onChange?.(!checked)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div
      className={styles.wrapper}
      onClick={handleToggle}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {/* Track + Thumb */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-disabled={disabled}
        className={`${styles.track} ${checked ? styles.trackActive : ''}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <motion.span
          className={styles.thumb}
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          aria-hidden="true"
        />
      </button>

      {/* Texto */}
      {(label || description) && (
        <div className={styles.textWrapper}>
          {label && (
            <span className={styles.label}>{label}</span>
          )}
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
