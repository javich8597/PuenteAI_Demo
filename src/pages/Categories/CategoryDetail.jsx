import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { PlayCircle, CheckCircle, ChevronLeft, Video, Lightbulb, Users } from 'lucide-react'
import categories from '../../data/categories'
import styles from './CategoryDetail.module.css'

export default function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const category = categories.find(c => c.id === id) || categories[0]

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className={styles.header} style={{ backgroundColor: `${category.color}15` }}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color={category.color} />
        </button>
        <h1 className={styles.title} style={{ color: category.color }}>{category.name}</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.videoSection}>
          <div className={styles.videoMock}>
            <div className={styles.videoThumbnail} style={{ backgroundColor: category.color }}>
              <PlayCircle size={64} color="white" className={styles.playIcon} />
            </div>
            <div className={styles.videoInfo}>
              <h2>Microtutorial: ¿Cómo empezar?</h2>
              <p>Por María C. (Madre Tutora MUSA)</p>
            </div>
          </div>
        </section>

        <section className={styles.actionSection}>
          <button className={styles.primaryBtn} style={{ backgroundColor: category.color }}>
            <Video size={24} />
            Ver Tutorial Completo (2 min)
          </button>
          
          <div className={styles.tipsBox} style={{ borderColor: `${category.color}50`, backgroundColor: `${category.color}10` }}>
            <div className={styles.tipsHeader}>
              <Lightbulb size={20} color={category.color} />
              <h3>Lo más importante</h3>
            </div>
            <ul className={styles.tipsList}>
              <li><CheckCircle size={16} color="var(--color-success)" /> Lleva siempre tu pasaporte.</li>
              <li><CheckCircle size={16} color="var(--color-success)" /> No pagues por citas previas.</li>
              <li><CheckCircle size={16} color="var(--color-success)" /> Pide cita por internet o llama al 060.</li>
            </ul>
          </div>
        </section>

        <section className={styles.tutorsSection}>
          <h3 className={styles.sectionTitle}>Madres Tutoras disponibles para acompañarte:</h3>
          <div className={styles.tutorCard}>
            <div className={styles.tutorAvatar}>M</div>
            <div className={styles.tutorInfo}>
              <h4>María C.</h4>
              <p>Experta en trámites del padrón.</p>
            </div>
            <button className={styles.connectBtn} onClick={() => navigate('/chat/new')}>Hablar</button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
