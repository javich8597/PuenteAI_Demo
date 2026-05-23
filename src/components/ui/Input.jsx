/**
 * Input — Campo de entrada reutilizable con etiqueta flotante
 * Tipos: text | email | tel | search | textarea
 */
import { useState, useId } from 'react'
import { X, Search } from 'lucide-react'
import styles from './Input.module.css'

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  helperText,
  className = '',
  ...rest
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const filled = value && value.length > 0

  const isTextarea = type === 'textarea'
  const isSearch = type === 'search'
  const Tag = isTextarea ? 'textarea' : 'input'

  // Icono por defecto para búsqueda
  const FieldIcon = isSearch ? (Icon || Search) : Icon

  const inputClasses = [
    styles.input,
    isTextarea && styles.textarea,
    FieldIcon && styles.hasIcon,
    isSearch && filled && styles.hasClear,
    error && styles.error,
    filled && styles.filled,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const labelClasses = [
    styles.label,
    FieldIcon && styles.labelWithIcon,
    isTextarea && styles.labelTextarea,
  ]
    .filter(Boolean)
    .join(' ')

  /** Limpiar campo de búsqueda */
  const handleClear = () => {
    onChange?.({ target: { value: '' } })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.fieldWrapper}>
        <Tag
          id={id}
          type={isTextarea ? undefined : type}
          className={inputClasses}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ' '}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...rest}
        />

        {/* Etiqueta flotante */}
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Icono izquierdo */}
        {FieldIcon && (
          <span className={styles.iconWrapper} aria-hidden="true">
            <FieldIcon size={18} />
          </span>
        )}

        {/* Botón limpiar (búsqueda) */}
        {isSearch && filled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}

      {/* Texto de ayuda */}
      {!error && helperText && (
        <span id={`${id}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  )
}
