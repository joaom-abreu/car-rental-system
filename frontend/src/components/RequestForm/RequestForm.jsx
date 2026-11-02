import { useState } from "react";
import Alert from "../Alert/Alert";
import styles from "./RequestForm.module.css";

const EMPTY_REQUEST = { automobileId: "", startDate: "", endDate: "" };

function RequestForm({ automobiles, submitLabel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_REQUEST);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await onSubmit(toPayload(form));
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error">{error}</Alert>}
      <div className={styles.field}>
        <label htmlFor="automobileId">Automóvel</label>
        <select
          id="automobileId"
          name="automobileId"
          value={form.automobileId}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.automobileId)}
        >
          <option value="">Escolha um automóvel</option>
          {automobiles.map((automobile) => (
            <option key={automobile.id} value={automobile.id}>
              {automobile.brand} {automobile.model} {automobile.year} · {automobile.plate}
            </option>
          ))}
        </select>
        {fieldErrors.automobileId && <p className={styles.fieldError}>{fieldErrors.automobileId}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="startDate">Início</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.startDate)}
        />
        {fieldErrors.startDate && <p className={styles.fieldError}>{fieldErrors.startDate}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="endDate">Fim</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.endDate)}
        />
        {fieldErrors.endDate && <p className={styles.fieldError}>{fieldErrors.endDate}</p>}
      </div>
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

function toPayload(form) {
  return {
    automobileId: form.automobileId === "" ? null : Number(form.automobileId),
    startDate: form.startDate === "" ? null : form.startDate,
    endDate: form.endDate === "" ? null : form.endDate,
  };
}

export default RequestForm;
