import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  leftIcon = null,
  rightIcon = null,
  helperText,
  name,
  id,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses = [
    styles.inputWrapper,
    isFocused && styles['inputWrapper--focused'],
    error && styles['inputWrapper--error'],
    disabled && styles['inputWrapper--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={inputClasses}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={styles.input}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}

        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {helperText && !error && <p className={styles.helper}>{helperText}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  helperText: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Input;