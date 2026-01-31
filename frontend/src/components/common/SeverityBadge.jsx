/**
 * Severity badge component - centralized severity display
 * Used for findings and vulnerability severity levels
 */
import PropTypes from 'prop-types';

const SeverityBadge = ({ severity, className = '' }) => {
  const getSeverityStyles = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
        return 'badge-low';
      case 'INFO':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  if (!severity) return null;

  return (
    <span className={`badge ${getSeverityStyles(severity)} ${className}`}>
      {severity.toUpperCase()}
    </span>
  );
};

SeverityBadge.propTypes = {
  severity: PropTypes.oneOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO', 'critical', 'high', 'medium', 'low', 'info']),
  className: PropTypes.string,
};

export default SeverityBadge;
