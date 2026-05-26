import { useState, useEffect } from 'react'
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
  Users,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/useAuthStore'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuthStore()
  const [gnnFeedback, setGnnFeedback] = useState(null)
  const { t } = useTranslation()
  const prioritizedCategories = useAuthStore(s => s.prioritizedCategories) || []
  
  const topCategory = prioritizedCategories.length > 0 ? prioritizedCategories[0] : null

  const name = isGuest ? 'Invitada' : (user?.name || 'Mamá')

  const milestones = [
    { id: 1, title: t('home.milestone1_title'), desc: t('home.milestone1_desc'), icon: MapPin, status: 'completed' },
    { id: 2, title: t('home.milestone2_title'), desc: t('home.milestone2_desc'), icon: Home, status: 'completed' },
    { id: 3, title: t('home.milestone3_title'), desc: t('home.milestone3_desc'), icon: CreditCard, status: 'completed' },
    { id: 4, title: t('home.milestone4_title'), desc: t('home.milestone4_desc'), icon: BookOpen, status: 'current' },
    { id: 5, title: t('home.milestone5_title'), desc: t('home.milestone5_desc'), icon: CreditCard, status: 'locked' },
    { id: 6, title: t('home.milestone6_title'), desc: t('home.milestone6_desc'), icon: BookOpen, status: 'locked' },
    { id: 7, title: t('home.milestone7_title'), desc: t('home.milestone7_desc'), icon: Briefcase, status: 'locked' },
    { id: 8, title: t('home.milestone8_title'), desc: t('home.milestone8_desc'), icon: Award, status: 'locked' },
  ]

  const quickActions = [
    { id: 'info', label: t('home.action_info'), icon: Grid, to: '/categories', bg: '#E07A5F' },
    { id: 'red', label: t('home.action_network'), icon: Network, to: '/recommendations', bg: '#81B29A' },
    { id: 'qa', label: t('home.action_qa'), icon: HelpCircle, to: '/qanda', bg: '#F2CC8F' },
    { id: 'grupos', label: t('home.action_groups'), icon: Users, to: '/groups', bg: '#3D405B' }
  ]

  const activities = [
    { id: 1, text: t('home.act1'), time: t('home.act1_time'), avatar: 'M' },
    { id: 2, text: t('home.act2'), time: t('home.act2_time'), avatar: '📅' },
  ]

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.greeting}>
        <h1 className={styles.greetingName}>{isGuest ? t('home.greeting', { name: 'Invitada' }) : t('home.greeting', { name })}</h1>
        <p className={styles.greetingSubtitle}>{t('home.subtitle')}</p>
        <div className={styles.progressText}>
          {t('home.progress')}
        </div>
      </div>

      {/* ── Sugerencias Inteligentes GNN ── */}
      {!isGuest && (
        <div className={styles.gnnSection}>
          <h2 className={styles.sectionTitle}>{t('home.gnn_title')}</h2>
          <div className={styles.gnnCard}>
            <div className={styles.gnnHeader}>
              <div className={styles.gnnAvatar}>M</div>
              <div className={styles.gnnInfo}>
                <h4>{t('home.gnn_card_title')}</h4>
                <p>{t('home.gnn_card_role')}</p>
              </div>
            </div>
            <p className={styles.gnnReason}>
              {t('home.gnn_reason', { neighborhood: user?.neighborhood || 'tu barrio', language: user?.language || 'tu idioma' })}
            </p>
            <button className={styles.gnnAction} onClick={() => navigate('/chat/admin-001')}>
              {t('home.gnn_button')}
            </button>
            
            {gnnFeedback ? (
              <div className={styles.feedbackSuccess}>
                <Check size={16} /> {t('home.feedback_success')}
              </div>
            ) : (
              <div className={styles.gnnFeedbackRow}>
                <span>{t('home.feedback_useful')}</span>
                <div className={styles.feedbackBtns}>
                  <button onClick={() => setGnnFeedback('up')} aria-label="Útil"><ThumbsUp size={16}/></button>
                  <button onClick={() => setGnnFeedback('down')} aria-label="No útil"><ThumbsDown size={16}/></button>
                </div>
              </div>
            )}
          </div>
          
          {topCategory ? (
            <div className={styles.gnnCardSecondary} onClick={() => navigate(`/categories/${topCategory}`)} style={{cursor: 'pointer'}}>
              <div className={styles.gnnIcon}>🎯</div>
              <div className={styles.gnnInfoSec}>
                <h4>{t(`categories.${topCategory}.name`)}</h4>
                <p>Basado en tu situación, este es tu siguiente paso prioritario.</p>
              </div>
            </div>
          ) : (
            <div className={styles.gnnCardSecondary}>
              <div className={styles.gnnIcon}>📍</div>
              <div className={styles.gnnInfoSec}>
                <h4>Taller de Bienvenida</h4>
                <p>Basado en tu situación, te sugerimos esta actividad comunitaria el Sábado.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.journeySection}>
        <h2 className={styles.sectionTitle}>{t('home.journey_title')}</h2>
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
                  {isCurrent && <span className={styles.currentBadge}>{t('home.badge_current')}</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>{t('home.quick_actions')}</h2>
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
        <h2 className={styles.sectionTitle}>{t('home.activity_title')}</h2>
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
