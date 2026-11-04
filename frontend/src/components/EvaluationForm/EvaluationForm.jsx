import { Check, X } from "lucide-react";
import { useState } from "react";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Field from "../Field/Field";
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
    <Card as="section" className={styles.card} aria-labelledby="evaluation-title">
      <h2 id="evaluation-title" className={styles.title}>
        Avaliar pedido
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      <Field id="opinion" label="Parecer" error={fieldErrors.opinion}>
        <textarea
          id="opinion"
          rows="4"
          maxLength={OPINION_MAX_LENGTH}
          value={opinion}
          onChange={(event) => setOpinion(event.target.value)}
          aria-invalid={Boolean(fieldErrors.opinion)}
        />
      </Field>
      <div className={styles.actions}>
        <Button variant="success" icon={Check} disabled={submitting} onClick={() => handleEvaluate(true)}>
          Aprovar
        </Button>
        <Button variant="danger" icon={X} disabled={submitting} onClick={() => handleEvaluate(false)}>
          Reprovar
        </Button>
      </div>
    </Card>
  );
}

export default EvaluationForm;
