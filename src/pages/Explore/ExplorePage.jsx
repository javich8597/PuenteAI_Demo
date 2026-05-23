import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search, MapPin, Users, ChevronRight, FileText, Heart, GraduationCap, Briefcase, Home, ShieldCheck, HelpCircle } from 'lucide-react'
import categories from '../../data/categories'
import styles from './ExplorePage.module.css'

const categoryIconMap = {
  FileText,
  Heart,
  GraduationCap,
  Briefcase,
  Users,
  Home,
}

const mockPeople = [
  { id: 1, name: 'María C.', neighborhood: 'Nou Barris', time: '1 año', role: 'Madre Tutora', isTutor: true },
  { id: 2, name: 'Diana R.', neighborhood: 'Sants', time: '4 meses', role: 'Recién llegada', isTutor: false },
  { id: 3, name: 'Laura P.', neighborhood: 'Gràcia', time: '3 años', role: 'Madre Tutora', isTutor: true },
]

export default function ExplorePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Explorar</h1>
        <p className={styles.subtitle}>Encuentra recursos y personas cerca de ti</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Buscar servicios, grupos o dudas..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Foro de Dudas</h2>
        </div>
        <motion.button 
          className={styles.forumBanner}
          onClick={() => navigate('/qanda')}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.forumBannerIcon}>
            <HelpCircle size={28} color="var(--color-primary)" />
          </div>
          <div className={styles.forumBannerText}>
            <h3>¿Tienes preguntas?</h3>
            <p>Pregunta a la comunidad y busca respuestas validadas por MUSA.</p>
          </div>
          <ChevronRight size={24} color="var(--color-text-tertiary)" />
        </motion.button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Categorías de Ayuda</h2>
        <div className={styles.grid}>
          {categories.map(cat => {
            const Icon = categoryIconMap[cat.icon] || Users
            return (
              <motion.button 
                key={cat.id} 
                className={styles.categoryCard}
                onClick={() => navigate(`/categories/${cat.id}`)}
                whileTap={{ scale: 0.95 }}
                style={{ '--cat-color': cat.color }}
              >
                <div className={styles.iconWrapper} style={{ backgroundColor: `${cat.color}15` }}>
                  <Icon color={cat.color} size={24} />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Madres cerca de ti</h2>
          <button className={styles.seeAllBtn} onClick={() => navigate('/groups')}>Ver todas</button>
        </div>
        
        <div className={styles.list}>
          {mockPeople.map(person => (
            <div key={person.id} className={styles.personCard}>
              <div className={styles.avatar}>
                {person.name.charAt(0)}
              </div>
              <div className={styles.personInfo}>
                <h3 className={styles.personName}>{person.name}</h3>
                <div className={styles.personMeta}>
                  <span className={styles.metaItem}>
                    <MapPin size={12} /> {person.neighborhood}
                  </span>
                  <span className={styles.dot}>•</span>
                  <span className={`${styles.metaItem} ${person.isTutor ? styles.tutorRole : ''}`}>
                    {person.isTutor && <ShieldCheck size={12} color="var(--color-primary)" />}
                    {person.role}
                  </span>
                </div>
              </div>
              <button className={styles.connectBtn} onClick={() => navigate('/chat/new')}>
                Conectar
              </button>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  )
}
