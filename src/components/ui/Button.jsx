/**
 * Button — Botón reutilizable para PuenteAI
 * Variantes: primary | secondary | ghost | danger | emergency
 * Tamaños: sm | md | lg
 */
import { motion } from 'motion/react'
import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ariaLabel,
  className = '',
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      whileTap={!disabled && !loading ? { scale: 0.96 } : undefined}
      {...rest}
    >
      {/* Spinner de carga o icono */}
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : Icon ? (
        <span className={styles.icon} aria-hidden="true">
          <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
        </span>
      ) : null}

      {children && <span>{children}</span>}
    </motion.button>
  )
}
