import { useState } from "react";
import { formatLocalDate, maskLocalDate, parseLocalDate } from "../../utils/formatters";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Field from "../Field/Field";
import styles from "./RequestForm.module.css";

const EMPTY_REQUEST = { automobileId: "", startDate: "", endDate: "" };
const INVALID_DATE_MESSAGE = "Data inválida. Use o formato dd/mm/aaaa.";
const DATE_PLACEHOLDER = "dd/mm/aaaa";
const DATE_LENGTH = 10;

const DATE_FIELDS = [
  { name: "startDate", label: "Início" },
  { name: "endDate", label: "Fim" },
];

function RequestForm({ automobiles, rentalRequest, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => (rentalRequest ? toFormValues(rentalRequest) : EMPTY_REQUEST));
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: maskLocalDate(value) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const dateErrors = validateDates(form);
    setError("");
    setFieldErrors(dateErrors);
    if (Object.keys(dateErrors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(toPayload(form));
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <Card as="form" className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error">{error}</Alert>}
      <Field id="automobileId" label="Automóvel" error={fieldErrors.automobileId}>
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
      </Field>
      {DATE_FIELDS.map((field) => (
        <Field key={field.name} id={field.name} label={field.label} error={fieldErrors[field.name]}>
          <input
            id={field.name}
            name={field.name}
            inputMode="numeric"
            placeholder={DATE_PLACEHOLDER}
            maxLength={DATE_LENGTH}
            value={form[field.name]}
            onChange={handleDateChange}
            aria-invalid={Boolean(fieldErrors[field.name])}
          />
        </Field>
      ))}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Salvando..." : submitLabel}
      </Button>
      {onCancel && (
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </Card>
  );
}

function toFormValues(rentalRequest) {
  return {
    automobileId: String(rentalRequest.automobile.id),
    startDate: formatLocalDate(rentalRequest.startDate),
    endDate: formatLocalDate(rentalRequest.endDate),
  };
}

function validateDates(form) {
  const errors = {};
  for (const field of DATE_FIELDS) {
    const value = form[field.name];
    if (value !== "" && parseLocalDate(value) === null) {
      errors[field.name] = INVALID_DATE_MESSAGE;
    }
  }
  return errors;
}

function toPayload(form) {
  return {
    automobileId: form.automobileId === "" ? null : Number(form.automobileId),
    startDate: parseLocalDate(form.startDate),
    endDate: parseLocalDate(form.endDate),
  };
}

export default RequestForm;
