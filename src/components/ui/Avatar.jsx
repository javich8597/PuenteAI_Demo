/**
 * Avatar — Foto de perfil con fallback de iniciales y
 * indicador de nivel de confianza.
 * Tamaños: sm (32) | md (40) | lg (56) | xl (80)
 */
import { useMemo } from 'react'
import styles from './Avatar.module.css'

/**
 * Genera un color de fondo determinista a partir del nombre.
 * Usa una paleta cálida afín al diseño de PuenteAI.
 */
const PALETTE = [
  '#E07A5F', '#81B29A', '#F2CC8F', '#3D405B',
  '#C4603F', '#5E9478', '#D4A85A', '#7B61FF',
  '#FF6B6B', '#2196F3', '#4CAF50', '#FF9800',
]

function nameToColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

/** Extrae las iniciales (máx. 2 caracteres) */
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]
  return `${parts[0][0]}${parts[parts.length - 1][0]}`
}

/** Mapa de nivel de confianza → clase CSS */
const trustClasses = {
  verified: styles.trustVerified,
  active: styles.trustActive,
  new: styles.trustNew,
}

const dotSizeMap = {
  sm: styles.trustDotSm,
  md: styles.trustDotMd,
  lg: styles.trustDotLg,
  xl: styles.trustDotXl,
}

const fallbackSizeMap = {
  sm: styles.fallbackSm,
  md: styles.fallbackMd,
  lg: styles.fallbackLg,
  xl: styles.fallbackXl,
}

export default function Avatar({
  src,
  name = '',
  size = 'md',
  showTrust = false,
  trustLevel = 'new', // 'verified' | 'active' | 'new'
}) {
  const bgColor = useMemo(() => nameToColor(name), [name])
  const initials = useMemo(() => getInitials(name), [name])

  const trustLabel =
    trustLevel === 'verified'
      ? 'Verificada'
      : trustLevel === 'active'
        ? 'Activa'
        : 'Nueva'

  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      role="img"
      aria-label={name || 'Avatar'}
    >
      {src ? (
        <img
          className={styles.image}
          src={src}
          alt={name}
          loading="lazy"
        />
      ) : (
        <span
          className={`${styles.fallback} ${fallbackSizeMap[size]}`}
          style={{ backgroundColor: bgColor }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}

      {/* Indicador de confianza */}
      {showTrust && (
        <span
          className={`${styles.trustDot} ${dotSizeMap[size]} ${trustClasses[trustLevel] || trustClasses.new}`}
          aria-label={`Nivel: ${trustLabel}`}
          title={trustLabel}
        />
      )}
    </span>
  )
}
