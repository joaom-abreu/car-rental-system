import { useState } from "react";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import styles from "./AutomobileForm.module.css";

const EMPTY_AUTOMOBILE = { registration: "", year: "", brand: "", model: "", plate: "" };

const FIELDS = [
  { name: "brand", label: "Marca" },
  { name: "model", label: "Modelo" },
  { name: "year", label: "Ano", type: "number" },
  { name: "plate", label: "Placa (ABC1234 ou ABC1D23)" },
  { name: "registration", label: "Matrícula" },
];

function AutomobileForm({ automobile = EMPTY_AUTOMOBILE, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(automobile));
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
      {FIELDS.map((field) => (
        <div key={field.name} className={styles.field}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? "text"}
            value={form[field.name]}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors[field.name])}
          />
          {fieldErrors[field.name] && <p className={styles.fieldError}>{fieldErrors[field.name]}</p>}
        </div>
      ))}
      <div className={styles.actions}>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function toFormValues(automobile) {
  return {
    registration: automobile.registration,
    year: String(automobile.year),
    brand: automobile.brand,
    model: automobile.model,
    plate: automobile.plate,
  };
}

function toPayload(form) {
  return { ...form, year: form.year === "" ? null : Number(form.year) };
}

export default AutomobileForm;
