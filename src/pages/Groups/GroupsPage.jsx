import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search, Users, Calendar, MapPin, ChevronRight, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './GroupsPage.module.css'

const mockGroups = [
  {
    id: 'g1',
    name: 'Red de Madres de Nou Barris',
    category: 'Apoyo Vecinal',
    members: 142,
    nextEvent: 'Encuentro y café de bienvenida para nuevas familias',
    eventDate: 'Sábado 28, 10:00h - Casal de Barri',
    color: 'var(--color-primary)'
  },
  {
    id: 'g2',
    name: 'Intercambio Sostenible Infantil',
    category: 'Sostenibilidad',
    members: 89,
    nextEvent: 'Mercadillo de Primavera: Ropa y Juguetes',
    eventDate: 'Domingo 15, 11:30h - Plaça Mayor',
    color: 'var(--color-secondary)'
  },
  {
    id: 'g3',
    name: 'Apoyo Escolar y Crianza',
    category: 'Educación',
    members: 234,
    nextEvent: 'Taller: Cómo ayudar con los deberes de primaria',
    eventDate: 'Jueves 12, 17:30h - Online',
    color: 'var(--color-success)'
  },
  {
    id: 'g4',
    name: 'Asesoría Legal y Extranjería',
    category: 'Legal',
    members: 315,
    nextEvent: 'Charla: Renovación de permisos de residencia',
    eventDate: 'Miércoles 18, 18:00h - Centro Cívico',
    color: 'var(--color-accent)'
  }
]

export default function GroupsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [joinedGroups, setJoinedGroups] = useState({})

  const handleJoin = (e, group) => {
    e.stopPropagation() // Prevent navigation to group details
    setJoinedGroups(prev => ({ ...prev, [group.id]: true }))
    toast.success(`Te has unido a ${group.name}`, {
      icon: '👥'
    })
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <Users size={32} color="var(--color-primary)" />
          <h1 className={styles.title}>{t('groups.title')}</h1>
        </div>
        <p className={styles.subtitle}>{t('groups.subtitle')}</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={t('groups.search_placeholder')}
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filtersRow}>
        <button className={`${styles.filterBtn} ${styles.activeFilter}`}>{t('groups.filter_all')}</button>
        <button className={styles.filterBtn}>{t('groups.filter_my_groups')}</button>
        <button className={styles.filterBtn}>{t('groups.filter_upcoming')}</button>
      </div>

      <div className={styles.groupsList}>
        {mockGroups.map(group => {
          const isJoined = joinedGroups[group.id];
          return (
          <motion.div 
            key={group.id} 
            className={styles.groupCard}
            onClick={() => navigate(`/groups/${group.id}`)}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.groupIcon} style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                <Users size={24} />
              </div>
              <div className={styles.groupInfo}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <span className={styles.groupCategory}>{group.category} • {isJoined ? group.members + 1 : group.members} {t('groups.members')}</span>
              </div>
              <button 
                className={`${styles.joinBtn} ${isJoined ? styles.joinedBtn : ''}`}
                onClick={(e) => handleJoin(e, group)}
              >
                {isJoined ? t('groups.joined') : t('groups.join')}
              </button>
            </div>

            {group.nextEvent ? (
              <div className={styles.eventBanner} style={{ backgroundColor: `${group.color}10`, borderColor: `${group.color}30` }}>
                <Calendar size={16} color={group.color} />
                <div className={styles.eventDetails}>
                  <span className={styles.eventName}>{t('groups.next_event')} {group.nextEvent}</span>
                  <span className={styles.eventTime}>{group.eventDate}</span>
                </div>
                <ChevronRight size={16} color={group.color} />
              </div>
            ) : (
              <div className={styles.noEventBanner}>
                {t('groups.no_events')}
              </div>
            )}
          </motion.div>
        )})}
      </div>

      <button className={styles.createGroupBtn} onClick={() => alert('Crear nuevo grupo')}>
        <UserPlus size={20} />
        {t('groups.create_group')}
      </button>

    </motion.div>
  )
}
