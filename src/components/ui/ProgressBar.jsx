/**
 * ProgressBar — Barra de progreso con gradiente y variante milestone
 * Props: value (0-100), label, showPercentage, variant
 */
import { motion } from 'motion/react'
import styles from './ProgressBar.module.css'

const MILESTONE_STEPS = [0, 25, 50, 75, 100]

export default function ProgressBar({
  value = 0,
  label,
  showPercentage = true,
  variant = 'default', // 'default' | 'milestone'
}) {
  // Aseguramos rango 0-100
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={styles.wrapper} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progreso'}>
      {/* Encabezado */}
      {(label || showPercentage) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercentage && (
            <span className={styles.percentage}>{Math.round(clamped)}%</span>
          )}
        </div>
      )}

      {/* Track */}
      <div className={styles.track}>
        {/* Fill animado */}
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Puntos de milestone */}
        {variant === 'milestone' && (
          <div className={styles.milestones} aria-hidden="true">
            {MILESTONE_STEPS.map((step) => (
              <span
                key={step}
                className={`${styles.milestoneDot} ${
                  clamped >= step
                    ? styles.milestoneDotReached
                    : styles.milestoneDotUnreached
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
