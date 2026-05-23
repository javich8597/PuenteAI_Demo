import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { ChevronLeft, ShieldCheck, Heart, Share2, MoreHorizontal } from 'lucide-react'
import styles from './QuestionDetail.module.css'

export default function QuestionDetail() {
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
        <h1 className={styles.title}>Duda de la Comunidad</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.questionCard}>
          <div className={styles.qHeader}>
            <div className={styles.authorAvatar}>R</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Rosa M.</span>
              <span className={styles.postTime}>Hace 2 horas</span>
            </div>
          </div>
          <h2 className={styles.questionTitle}>
            ¿Alguien sabe qué papeles piden para inscribir al niño en el colegio?
          </h2>
          <p className={styles.questionBody}>
            He llegado hace un mes con mi hijo de 6 años y me han dicho que debo empadronarme primero, pero no estoy segura si con el pasaporte es suficiente o necesito algo más del país de origen.
          </p>
        </div>

        <div className={styles.answersSection}>
          <h3 className={styles.answersCount}>3 Respuestas</h3>

          {/* Validated Answer */}
          <div className={styles.validatedAnswerCard}>
            <div className={styles.validatedHeader}>
              <ShieldCheck size={20} color="var(--color-success)" />
              <span>Respuesta Validada por Madre Tutora</span>
            </div>
            <div className={styles.aHeader}>
              <div className={styles.authorAvatar} style={{ backgroundColor: 'var(--color-primary-light)'}}>
                M
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>María C. <ShieldCheck size={14} color="var(--color-primary)"/></span>
                <span className={styles.postTime}>Hace 1 hora</span>
              </div>
            </div>
            <p className={styles.answerBody}>
              Hola Rosa. Tranquila. Solo necesitas:
              <br/><br/>
              1. Tu pasaporte original.<br/>
              2. El pasaporte original del niño.<br/>
              3. Un recibo de luz o agua a tu nombre (o contrato de alquiler) para el padrón.<br/>
              <br/>
              No necesitas ningún documento escolar del país de origen para matricularlo, el derecho a la educación está garantizado. Te puedo acompañar a la oficina si quieres.
            </p>
            <div className={styles.answerActions}>
              <button className={styles.actionBtn}><Heart size={18} /> Útil (12)</button>
              <button className={styles.actionBtn}><Share2 size={18} /></button>
            </div>
          </div>

          {/* Normal Answer */}
          <div className={styles.answerCard}>
            <div className={styles.aHeader}>
              <div className={styles.authorAvatar}>C</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Carmen T.</span>
                <span className={styles.postTime}>Hace 30 minutos</span>
              </div>
            </div>
            <p className={styles.answerBody}>
              Bienvenida Rosa! Hazle caso a María, ella me ayudó con lo mismo el año pasado. El trámite es muy rápido.
            </p>
            <div className={styles.answerActions}>
              <button className={styles.actionBtn}><Heart size={18} /> Útil (2)</button>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.replyBar}>
        <input type="text" placeholder="Escribe una respuesta..." className={styles.replyInput} />
        <button className={styles.sendBtn}>Enviar</button>
      </div>

    </motion.div>
  )
}
