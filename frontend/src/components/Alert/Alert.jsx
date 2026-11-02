import styles from "./Alert.module.css";

function Alert({ type = "info", children }) {
  const role = type === "error" ? "alert" : "status";
  return (
    <div className={`${styles.alert} ${styles[type]}`} role={role}>
      {children}
    </div>
  );
}

export default Alert;
