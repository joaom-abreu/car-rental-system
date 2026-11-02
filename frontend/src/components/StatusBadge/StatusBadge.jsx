import { REQUEST_STATUS_LABELS } from "../../constants/requestStatus";
import styles from "./StatusBadge.module.css";

function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{REQUEST_STATUS_LABELS[status]}</span>;
}

export default StatusBadge;
