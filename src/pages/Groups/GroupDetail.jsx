import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { ChevronLeft, Users, Calendar, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import styles from './GroupDetail.module.css'

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className={styles.heroSection}>
        <div className={styles.heroIconWrapper}>
          <Users size={48} color="var(--color-primary)" />
        </div>
        <h1 className={styles.groupName}>Madres de Nou Barris</h1>
        <p className={styles.groupCategory}>Apoyo Vecinal • 142 Miembros</p>
        
        <div className={styles.heroActions}>
          <button className={styles.joinBtn}>Unirme al Grupo</button>
          <button className={styles.chatBtn} onClick={() => navigate('/chat/new')}>
            <MessageCircle size={20} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.eventSection}>
          <h2 className={styles.sectionTitle}>Próximo Encuentro Físico</h2>
          <div className={styles.eventCard}>
            <div className={styles.eventCalendar}>
              <span className={styles.eventMonth}>MAY</span>
              <span className={styles.eventDay}>15</span>
            </div>
            <div className={styles.eventInfo}>
              <h3>Café de bienvenida</h3>
              <p><Calendar size={14} /> Domingo 15, 11:30h</p>
              <p><MapPin size={14} /> Parque de la Pegaso</p>
            </div>
          </div>
          <button className={styles.attendBtn}>¡Voy a ir!</button>
        </section>

        <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>Sobre este grupo</h2>
          <p>
            Un espacio seguro para madres que viven en Nou Barris. Nos reunimos una vez al mes en un parque para que los niños jueguen mientras nosotras compartimos consejos, ropa que ya no les vale, y resolvemos dudas sobre trámites o colegios.
          </p>
        </section>

        <section className={styles.tutorsSection}>
          <h2 className={styles.sectionTitle}>Madres Tutoras en el grupo</h2>
          <div className={styles.tutorList}>
            <div className={styles.tutorCard}>
              <div className={styles.tutorAvatar}>M</div>
              <div className={styles.tutorInfo}>
                <span className={styles.tutorName}>María C.</span>
                <span className={styles.tutorRole}>Administradora</span>
              </div>
              <ShieldCheck size={20} color="var(--color-primary)" />
            </div>
          </div>
        </section>
      </div>

    </motion.div>
  )
}
