import { motion } from 'motion/react'
import { Users, AlertCircle, CheckCircle, Activity, BarChart3, TrendingUp } from 'lucide-react'
import styles from './Dashboard.module.css'

const stats = [
  { label: 'Usuarias Activas', value: '1,248', trend: '+12%', icon: Users, color: '#3D405B' },
  { label: 'Pendientes de Moderación', value: '24', trend: '-5%', icon: AlertCircle, color: '#E07A5F' },
  { label: 'Respuestas Validadas', value: '89', trend: '+22%', icon: CheckCircle, color: '#81B29A' },
  { label: 'Grupos Activos', value: '15', trend: '0%', icon: Activity, color: '#F2CC8F' },
]

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel General</h1>
        <p className={styles.subtitle}>Resumen de la comunidad y salud de la plataforma</p>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{stat.label}</span>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={`${styles.statTrend} ${stat.trend.startsWith('+') ? styles.positive : styles.negative}`}>
                {stat.trend} este mes
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.panelsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Salud de la GNN</h2>
            <Activity size={18} color="var(--color-text-secondary)" />
          </div>
          <div className={styles.panelContent}>
            <div className={styles.chartPlaceholder}>
              <BarChart3 size={48} color="var(--color-border)" />
              <p>Simulación: Conexiones generadas por Ego-Network</p>
            </div>
            <div className={styles.gnnStats}>
              <div className={styles.gnnStat}>
                <span>Recomendaciones enviadas</span>
                <strong>4,502</strong>
              </div>
              <div className={styles.gnnStat}>
                <span>Tasa de aceptación</span>
                <strong>68%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Categorías más consultadas</h2>
            <TrendingUp size={18} color="var(--color-text-secondary)" />
          </div>
          <div className={styles.panelContent}>
            <ul className={styles.rankingList}>
              <li>
                <span className={styles.rankBadge}>1</span>
                <span>Trámites Legales</span>
                <strong>45%</strong>
              </li>
              <li>
                <span className={styles.rankBadge}>2</span>
                <span>Salud</span>
                <strong>25%</strong>
              </li>
              <li>
                <span className={styles.rankBadge}>3</span>
                <span>Vivienda</span>
                <strong>15%</strong>
              </li>
              <li>
                <span className={styles.rankBadge}>4</span>
                <span>Empleo</span>
                <strong>10%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
