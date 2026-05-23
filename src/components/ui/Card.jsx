/**
 * Card — Contenedor reutilizable con variantes visuales
 * Variantes: elevated | flat | interactive | glass
 */
import { motion } from 'motion/react'
import styles from './Card.module.css'

const padMap = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
}

export default function Card({
  variant = 'elevated',
  children,
  onClick,
  className = '',
  padding = 'md',
  ariaLabel,
  ...rest
}) {
  const Component = variant === 'interactive' || onClick ? motion.button : motion.div
  const padClass = padMap[padding] || padMap.md

  const classes = [styles.card, styles[variant], padClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      whileHover={variant === 'interactive' ? { y: -3 } : undefined}
      whileTap={variant === 'interactive' ? { scale: 0.98 } : undefined}
      {...rest}
    >
      {children}
    </Component>
  )
}
