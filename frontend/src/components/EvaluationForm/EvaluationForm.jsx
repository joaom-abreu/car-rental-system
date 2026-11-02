import { useState } from "react";
import Alert from "../Alert/Alert";
import styles from "./EvaluationForm.module.css";

const OPINION_MAX_LENGTH = 500;

function EvaluationForm({ onEvaluate }) {
  const [opinion, setOpinion] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleEvaluate(approved) {
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await onEvaluate({ approved, opinion });
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="evaluation-title">
      <h2 id="evaluation-title" className={styles.title}>
        Avaliar pedido
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      <div className={styles.field}>
        <label htmlFor="opinion">Parecer</label>
        <textarea
          id="opinion"
          rows="4"
          maxLength={OPINION_MAX_LENGTH}
          value={opinion}
          onChange={(event) => setOpinion(event.target.value)}
          aria-invalid={Boolean(fieldErrors.opinion)}
        />
        {fieldErrors.opinion && <p className={styles.fieldError}>{fieldErrors.opinion}</p>}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.approveButton}
          disabled={submitting}
          onClick={() => handleEvaluate(true)}
        >
          Aprovar
        </button>
        <button
          type="button"
          className={styles.rejectButton}
          disabled={submitting}
          onClick={() => handleEvaluate(false)}
        >
          Reprovar
        </button>
      </div>
    </section>
  );
}

export default EvaluationForm;
