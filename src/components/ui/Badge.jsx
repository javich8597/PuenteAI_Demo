/**
 * Badge — Insignias para confianza, validación y puntos
 * Variantes: default | validated | trust | points | status
 * Incluye iconos semánticos automáticos para validated y trust
 */
import { ShieldCheck, Award } from 'lucide-react'
import styles from './Badge.module.css'

/** Mapeo de variantes → icono predeterminado */
const defaultIcons = {
  validated: ShieldCheck,
  trust: Award,
}

/** Mapeo de variantes → texto predeterminado */
const defaultLabels = {
  validated: 'Respuesta Validada',
  trust: 'Madre Guía',
}

export default function Badge({
  variant = 'default',
  children,
  icon: IconProp,
}) {
  // Usa el icono proporcionado, o el predeterminado de la variante
  const Icon = IconProp || defaultIcons[variant]
  const label = children || defaultLabels[variant]

  const classes = [styles.badge, styles[variant]].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {Icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon size={14} />
        </span>
      )}
      {label}
    </span>
  )
}
