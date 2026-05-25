import useAppStore from '../store/useAppStore'
import { translations } from '../i18n/translations'

export function useTranslation() {
  const { language } = useAppStore()

  const t = (key, params = {}) => {
    // Default to 'es' if language dictionary not found
    const dict = translations[language] || translations['es']
    let text = dict[key]
    
    // Fallback to 'es' if key not found in current language
    if (!text && translations['es'][key]) {
      text = translations['es'][key]
    }

    // If still not found, return the key itself
    if (!text) return key

    // Replace dynamic params like {name}
    Object.keys(params).forEach(paramKey => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey])
    })

    return text
  }

  return { t, language }
}
