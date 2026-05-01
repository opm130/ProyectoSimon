import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  header = null,
  footer = null,
  className = '',
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--padding-${padding}`],
    onClick && styles['card--clickable'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;