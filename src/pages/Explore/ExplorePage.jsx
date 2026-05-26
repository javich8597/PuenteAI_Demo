import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search, MapPin, Users, ChevronRight, FileText, Heart, GraduationCap, Briefcase, Home, ShieldCheck, HelpCircle, Globe, Sparkles } from 'lucide-react'
import categories from '../../data/categories'
import { useTranslation } from '../../hooks/useTranslation'
import useAuthStore from '../../store/useAuthStore'
import styles from './ExplorePage.module.css'

const categoryIconMap = {
  FileText,
  Heart,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  ShieldCheck,
  Globe
}

const mockPeople = [
  { id: 1, name: 'Carmen G.', neighborhood: 'Nou Barris', time: '1 año', role: 'Madre Tutora', isTutor: true },
  { id: 2, name: 'Aisha F.', neighborhood: 'El Raval', time: '2 meses', role: 'Recién llegada', isTutor: false },
  { id: 3, name: 'Elena R.', neighborhood: 'Gràcia', time: '3 años', role: 'Madre Tutora', isTutor: true },
  { id: 4, name: 'Valentina P.', neighborhood: 'Sants', time: '6 meses', role: 'Recién llegada', isTutor: false },
]

export default function ExplorePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslation()
  const prioritizedCategories = useAuthStore(s => s.prioritizedCategories) || []

  // Filtrar y ordenar categorías
  const filteredCategories = useMemo(() => {
    let cats = categories.filter(c => 
      t(`categories.${c.id}.name`).toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Si hay prioridades (del Onboarding), ordenarlas primero
    if (prioritizedCategories.length > 0) {
      cats.sort((a, b) => {
        const indexA = prioritizedCategories.indexOf(a.id)
        const indexB = prioritizedCategories.indexOf(b.id)
        
        // Si ambos están en la lista de prioridad, el menor índice va primero
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        // Si solo A está, va primero
        if (indexA !== -1) return -1
        // Si solo B está, va primero
        if (indexB !== -1) return 1
        // Si ninguno está, mantener orden original (o por id)
        return 0
      })
    }

    return cats
  }, [searchQuery, prioritizedCategories, t])

  const filteredPeople = mockPeople.filter(p => {
    const translatedRole = p.isTutor ? t('role.tutor') : t('role.newcomer')
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translatedRole.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>{t('explore.title')}</h1>
        <p className={styles.subtitle}>{t('explore.subtitle')}</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={t('explore.search_placeholder')}
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('explore.forum_title')}</h2>
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
            <h3>{t('explore.forum_ask')}</h3>
            <p>{t('explore.forum_desc')}</p>
          </div>
          <ChevronRight size={24} color="var(--color-text-tertiary)" />
        </motion.button>
      </section>

      {filteredCategories.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('explore.categories_title')}</h2>
          <div className={styles.grid}>
            {filteredCategories.map(cat => {
              const Icon = categoryIconMap[cat.icon] || Users
              const isPrioritized = prioritizedCategories.length > 0 && 
                                    (prioritizedCategories[0] === cat.id || prioritizedCategories[1] === cat.id)
              
              return (
                <motion.button 
                  key={cat.id} 
                  className={`${styles.categoryCard} ${isPrioritized ? styles.categoryCardPrioritized : ''}`}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  whileTap={{ scale: 0.95 }}
                  style={{ '--cat-color': cat.color }}
                >
                  {isPrioritized && (
                    <div className={styles.priorityBadge}>
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div className={styles.iconWrapper} style={{ backgroundColor: `${cat.color}15` }}>
                    <Icon color={cat.color} size={24} />
                  </div>
                  <span className={styles.categoryName}>{t(`categories.${cat.id}.name`)}</span>
                </motion.button>
              )
            })}
          </div>
        </section>
      )}

      {filteredPeople.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('explore.mothers_near')}</h2>
            <button className={styles.seeAllBtn} onClick={() => navigate('/groups')}>{t('explore.see_all')}</button>
          </div>
          
          <div className={styles.list}>
            {filteredPeople.map(person => (
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
                    {person.isTutor ? t('role.tutor') : t('role.newcomer')}
                  </span>
                </div>
              </div>
              <button className={styles.connectBtn} onClick={() => navigate('/chat/new')}>
                {t('explore.connect')}
              </button>
            </div>
          ))}
        </div>
      </section>
      )}

    </motion.div>
  )
}
