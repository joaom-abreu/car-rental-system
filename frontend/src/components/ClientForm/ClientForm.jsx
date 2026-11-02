import { useState } from "react";
import Alert from "../Alert/Alert";
import EmploymentFields from "../EmploymentFields/EmploymentFields";
import styles from "./ClientForm.module.css";

const EMPTY_CLIENT = {
  username: "",
  password: "",
  name: "",
  rg: "",
  cpf: "",
  address: "",
  profession: "",
  employments: [],
};

const CREDENTIAL_FIELDS = [
  { name: "username", label: "Usuário", autoComplete: "username" },
  { name: "password", label: "Senha (mínimo 8 caracteres)", type: "password", autoComplete: "new-password" },
];

const PERSONAL_FIELDS = [
  { name: "name", label: "Nome completo", autoComplete: "name" },
  { name: "rg", label: "RG" },
  { name: "cpf", label: "CPF", inputMode: "numeric" },
  { name: "address", label: "Endereço", autoComplete: "street-address" },
  { name: "profession", label: "Profissão" },
];

function ClientForm({ client = EMPTY_CLIENT, withCredentials = false, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(client));
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fields = withCredentials ? [...CREDENTIAL_FIELDS, ...PERSONAL_FIELDS] : PERSONAL_FIELDS;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleEmploymentsChange(employments) {
    setForm((currentForm) => ({ ...currentForm, employments }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await onSubmit(toPayload(form, withCredentials));
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error">{error}</Alert>}
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            value={form[field.name]}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors[field.name])}
          />
          {fieldErrors[field.name] && <p className={styles.fieldError}>{fieldErrors[field.name]}</p>}
        </div>
      ))}
      <EmploymentFields
        employments={form.employments}
        onChange={handleEmploymentsChange}
        fieldErrors={fieldErrors}
      />
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Salvando..." : submitLabel}
      </button>
      {onCancel && (
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}

function toFormValues(client) {
  return {
    ...EMPTY_CLIENT,
    name: client.name,
    rg: client.rg,
    cpf: client.cpf,
    address: client.address,
    profession: client.profession,
    employments: client.employments.map((employment) => ({
      employer: employment.employer,
      income: String(employment.income),
    })),
  };
}

function toPayload(form, withCredentials) {
  const { username, password, ...personalData } = form;
  const employments = form.employments.map((employment) => ({
    employer: employment.employer,
    income: employment.income === "" ? null : Number(employment.income),
  }));
  const payload = { ...personalData, employments };
  return withCredentials ? { username, password, ...payload } : payload;
}

export default ClientForm;
