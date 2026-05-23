import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search, Users, Calendar, MapPin, ChevronRight, UserPlus } from 'lucide-react'
import styles from './GroupsPage.module.css'

const mockGroups = [
  {
    id: 'g1',
    name: 'Madres de Nou Barris',
    category: 'Apoyo Vecinal',
    members: 142,
    nextEvent: 'Café de bienvenida',
    eventDate: 'Este Sábado, 10:00h',
    color: 'var(--color-primary)'
  },
  {
    id: 'g2',
    name: 'Intercambio Ropa Infantil',
    category: 'Sostenibilidad',
    members: 89,
    nextEvent: 'Mercadillo de Primavera',
    eventDate: 'Domingo 15, 11:30h',
    color: 'var(--color-secondary)'
  },
  {
    id: 'g3',
    name: 'Apoyo Escolar - Primaria',
    category: 'Educación',
    members: 234,
    nextEvent: null,
    eventDate: null,
    color: 'var(--color-success)'
  }
]

export default function GroupsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <Users size={32} color="var(--color-primary)" />
          <h1 className={styles.title}>Grupos y Redes</h1>
        </div>
        <p className={styles.subtitle}>Encuentra apoyo cerca de ti y únete a nuestros encuentros presenciales.</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Busca por barrio o interés..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filtersRow}>
        <button className={`${styles.filterBtn} ${styles.activeFilter}`}>Todos</button>
        <button className={styles.filterBtn}>Mis Grupos</button>
        <button className={styles.filterBtn}>Eventos Próximos</button>
      </div>

      <div className={styles.groupsList}>
        {mockGroups.map(group => (
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
                <span className={styles.groupCategory}>{group.category} • {group.members} miembros</span>
              </div>
            </div>

            {group.nextEvent ? (
              <div className={styles.eventBanner} style={{ backgroundColor: `${group.color}10`, borderColor: `${group.color}30` }}>
                <Calendar size={16} color={group.color} />
                <div className={styles.eventDetails}>
                  <span className={styles.eventName}>Próximo encuentro: {group.nextEvent}</span>
                  <span className={styles.eventTime}>{group.eventDate}</span>
                </div>
                <ChevronRight size={16} color={group.color} />
              </div>
            ) : (
              <div className={styles.noEventBanner}>
                No hay eventos programados
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button className={styles.createGroupBtn} onClick={() => alert('Crear nuevo grupo')}>
        <UserPlus size={20} />
        Crear Red de Apoyo
      </button>

    </motion.div>
  )
}
