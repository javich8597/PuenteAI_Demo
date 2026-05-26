import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { ChevronLeft, Send, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, Mic, Users } from 'lucide-react'
import useChatStore from '../../store/useChatStore'
import { categories } from '../../data/categories'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './ChatConversation.module.css'

export default function ChatConversation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { conversations, messages, sendMessage, setActiveConversation, fetchMessages, subscribeToMessages } = useChatStore()
  const { t } = useTranslation()

  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)

  let conversation = conversations.find(c => c.id === id)
  
  if (!conversation) {
    if (id.startsWith('group-')) {
      const catId = id.replace('group-', '')
      const cat = categories.find(c => c.id === catId)
      conversation = {
        id,
        name: cat ? t(`categories.${cat.id}.name`) : 'Grupo Temático',
        avatar: <Users size={20} />,
        isGroup: true
      }
    } else {
      conversation = { name: 'Chat', id: id }
    }
  }
  const currentMessages = messages[id] || []

  useEffect(() => {
    fetchMessages()
    const unsubscribe = subscribeToMessages()
    setActiveConversation(id)
    return () => unsubscribe()
  }, [id, setActiveConversation, fetchMessages, subscribeToMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendMessage(id, inputText)
    setInputText('')
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <div className={styles.avatar}>
            {conversation.avatar || conversation.name.charAt(0)}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{conversation.name}</h2>
            <span className={styles.userStatus}>
              {conversation.isGroup ? t('groups.members') + ': 142' : t('chat.online')}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><Phone size={20} /></button>
          <button className={styles.iconBtn}><MoreVertical size={20} /></button>
        </div>
      </header>

      <div className={styles.messagesContainer}>
        {currentMessages.length === 0 ? (
          <div className={styles.emptyState}>
            {t('chat.start_conversation', { name: conversation.name })}
          </div>
        ) : (
          currentMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageBubble} ${msg.isOwn ? styles.ownMessage : styles.otherMessage}`}
            >
              {conversation.isGroup && !msg.isOwn && (
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '4px' }}>
                  {msg.senderName}
                </div>
              )}
              <div className={styles.messageText}>{msg.text}</div>
              <div className={styles.messageTime}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder={t('chat.type_message')}
          className={styles.textInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button 
          type="submit" 
          className={styles.sendBtn}
          disabled={!inputText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </motion.div>
  )
}
