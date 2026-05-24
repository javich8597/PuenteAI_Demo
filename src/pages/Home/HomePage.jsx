import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { 
  Check, 
  MapPin, 
  Home, 
  BookOpen, 
  CreditCard, 
  Briefcase, 
  Award,
  Grid,
  Network,
  HelpCircle,
  Users
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuthStore()

  const name = isGuest ? 'Invitada' : (user?.name || 'Mamá')

  const milestones = [
    { id: 1, title: 'Llegada a Barcelona', desc: '¡Bienvenida a tu nueva ciudad!', icon: MapPin, status: 'completed' },
    { id: 2, title: 'Empadronamiento', desc: 'Tu registro oficial en la ciudad', icon: Home, status: 'completed' },
    { id: 3, title: 'Tarjeta Sanitaria', desc: 'Acceso a la salud pública', icon: CreditCard, status: 'completed' },
    { id: 4, title: 'Escolarización', desc: 'Inscripción escolar para tus hijos', icon: BookOpen, status: 'current' },
    { id: 5, title: 'NIE / TIE', desc: 'Identidad de extranjería', icon: CreditCard, status: 'locked' },
    { id: 6, title: 'Homologación', desc: 'Convalidación de títulos', icon: BookOpen, status: 'locked' },
    { id: 7, title: 'Primer Empleo', desc: 'Inserción laboral', icon: Briefcase, status: 'locked' },
    { id: 8, title: 'Ciudadanía', desc: 'Nacionalidad española', icon: Award, status: 'locked' },
  ]

  const quickActions = [
    { id: 'info', label: 'Información', icon: Grid, to: '/categories', bg: '#E07A5F' },
    { id: 'red', label: 'Mi Red', icon: Network, to: '/recommendations', bg: '#81B29A' },
    { id: 'qa', label: 'Preguntas', icon: HelpCircle, to: '/qanda', bg: '#F2CC8F' },
    { id: 'grupos', label: 'Grupos', icon: Users, to: '/groups', bg: '#3D405B' }
  ]

  const activities = [
    { id: 1, text: 'María respondió tu pregunta sobre el padrón', time: 'Hace 2 horas', avatar: 'M' },
    { id: 2, text: 'Nuevo evento: Taller de Empleo - Sábado 14:00', time: 'Ayer', avatar: '📅' },
  ]

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.greeting}>
        <h1 className={styles.greetingName}>¡Hola, {name}! 👋</h1>
        <p className={styles.greetingSubtitle}>Tu camino de integración</p>
        <div className={styles.progressText}>
          3 de 8 pasos completados
        </div>
      </div>

      {/* ── Sugerencias Inteligentes GNN ── */}
      {!isGuest && (
        <div className={styles.gnnSection}>
          <h2 className={styles.sectionTitle}>✨ Sugerencias para Ti</h2>
          <div className={styles.gnnCard}>
            <div className={styles.gnnHeader}>
              <div className={styles.gnnAvatar}>M</div>
              <div className={styles.gnnInfo}>
                <h4>Conecta con Marta</h4>
                <p>Madre Mentora recomendada</p>
              </div>
            </div>
            <p className={styles.gnnReason}>
              Marta también vive en <strong>{user?.neighborhood || 'tu barrio'}</strong> y habla <strong>{user?.language || 'tu idioma'}</strong>. ¡Escríbele para empezar tu red de apoyo!
            </p>
            <button className={styles.gnnAction} onClick={() => navigate('/chat')}>
              Saludar a Marta 👋
            </button>
          </div>
          
          <div className={styles.gnnCardSecondary}>
            <div className={styles.gnnIcon}>📍</div>
            <div className={styles.gnnInfoSec}>
              <h4>Taller de Bienvenida</h4>
              <p>Basado en tu situación, te sugerimos esta actividad comunitaria el Sábado.</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.journeySection}>
        <h2 className={styles.sectionTitle}>El Mapa del Viaje</h2>
        <div className={styles.journeyMap}>
          <div className={styles.pathLine} style={{ background: 'linear-gradient(to bottom, var(--color-success) 35%, var(--color-border-light) 45%)' }}></div>
          
          {milestones.map((m, index) => {
            const isCompleted = m.status === 'completed'
            const isCurrent = m.status === 'current'
            const isLocked = m.status === 'locked'
            
            return (
              <motion.div 
                key={m.id} 
                className={styles.milestone}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => isCurrent && navigate('/categories')}
              >
                <div className={
                  isCompleted ? styles.nodeCompleted : 
                  isCurrent ? styles.nodeCurrent : styles.nodeLocked
                }>
                  {isCurrent && <div className={styles.pulseRing}></div>}
                  {isCompleted ? <Check size={28} /> : <m.icon size={28} />}
                </div>
                
                <div className={styles.milestoneContent}>
                  <h3 className={isLocked ? styles.milestoneTitleLocked : styles.milestoneTitle}>
                    {m.title}
                  </h3>
                  <p className={isLocked ? styles.milestoneDescLocked : styles.milestoneDesc}>
                    {m.desc}
                  </p>
                  {isCurrent && <span className={styles.currentBadge}>Paso sugerido</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Accesos rápidos</h2>
        <div className={styles.actionsScroll}>
          {quickActions.map(action => (
            <div 
              key={action.id} 
              className={styles.actionCard} 
              onClick={() => navigate(action.to)}
            >
              <div className={styles.actionIcon} style={{ backgroundColor: action.bg }}>
                <action.icon size={24} />
              </div>
              <span className={styles.actionLabel}>{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.activityFeed}>
        <h2 className={styles.sectionTitle}>Actividad reciente</h2>
        {activities.map(act => (
          <div key={act.id} className={styles.activityCard}>
            <div className={styles.activityAvatar}>{act.avatar}</div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>{act.text}</p>
              <span className={styles.activityTime}>{act.time}</span>
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  )
}
