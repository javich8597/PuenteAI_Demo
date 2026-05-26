import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { MessageCircle, Users, Search, ChevronRight, Check, CheckCheck, Edit, FileText, Home, Briefcase, Heart, ShieldCheck, GraduationCap, Globe } from 'lucide-react'
import useChatStore from '../../store/useChatStore'
import useAuthStore from '../../store/useAuthStore'
import { categories } from '../../data/categories'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const navigate = useNavigate()
  const { conversations, fetchMessages, subscribeToMessages } = useChatStore()
  const { prioritizedCategories } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    fetchMessages()
    const unsubscribe = subscribeToMessages()
    return () => unsubscribe()
  }, [fetchMessages, subscribeToMessages])

  const filteredConvs = conversations.filter(c => {
    if (c.name) return c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const participantNames = c.participants.map(p => p.name).join(' ')
    return participantNames.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Format time (e.g. 10:30, Ayer)
  const formatTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const iconMap = {
    FileText, Home, Briefcase, Heart, ShieldCheck, Users, GraduationCap, Globe
  }

  // Obtenemos los grupos temáticos a partir de los intereses del usuario
  // Si no hay intereses guardados, mostramos los 3 primeros por defecto
  const thematicCategories = prioritizedCategories.length > 0 
    ? categories.filter(c => prioritizedCategories.includes(c.id))
    : categories.slice(0, 3)

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>{t('chat.title')}</h1>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={t('chat.search')}
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2 className={styles.sectionTitle}>{t('chat.thematic_groups')}</h2>
      <div className={styles.groupsScroll}>
        {thematicCategories.map(cat => {
          const Icon = iconMap[cat.icon] || Users
          return (
            <motion.div 
              key={cat.id} 
              className={styles.thematicGroupCard}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/chat/group-${cat.id}`)}
            >
              <div className={styles.thematicGroupIcon} style={{ backgroundColor: cat.color }}>
                <Icon size={24} />
              </div>
              <span className={styles.thematicGroupName}>{t(`categories.${cat.id}.name`)}</span>
            </motion.div>
          )
        })}
      </div>

      <h2 className={styles.sectionTitle}>{t('chat.recent')}</h2>

      <div className={styles.list}>
        {filteredConvs.map(conv => {
          const isGroup = conv.type === 'group'
          const displayName = isGroup ? conv.name : conv.participants[0]?.name
          const displayAvatar = isGroup ? <Users size={20} /> : (conv.participants[0]?.avatar || displayName.charAt(0))
          
          return (
            <motion.div 
              key={conv.id} 
              className={styles.chatCard}
              onClick={() => navigate(`/chat/${conv.id}`)}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.avatarWrapper}>
                <div className={`${styles.avatar} ${isGroup ? styles.avatarGroup : ''}`}>
                  {displayAvatar}
                </div>
                {conv.unread > 0 && <span className={styles.unreadBadge}>{conv.unread}</span>}
              </div>
              
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <h3 className={styles.chatName}>{displayName}</h3>
                  <span className={styles.time}>{formatTime(conv.lastMessageTime)}</span>
                </div>
                
                <div className={styles.lastMessageRow}>
                  {/* Simulate read receipts for own messages */}
                  {conv.unread === 0 && !isGroup && <CheckCheck size={14} className={styles.readCheck} />}
                  <p className={`${styles.lastMessage} ${conv.unread > 0 ? styles.unreadText : ''}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

    </motion.div>
  )
}
