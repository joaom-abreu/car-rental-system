import styles from "./Field.module.css";

function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Field;
