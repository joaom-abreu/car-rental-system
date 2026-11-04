import { Fragment, useState } from "react";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Card from "../Card/Card";
import CepField from "../CepField/CepField";
import Field from "../Field/Field";
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

const ADDRESS_FIELD = "address";

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

  function handleAddressFound(address) {
    setForm((currentForm) => ({ ...currentForm, address }));
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
    <Card as="form" className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error">{error}</Alert>}
      {fields.map((field) => (
        <Fragment key={field.name}>
          {field.name === ADDRESS_FIELD && <CepField onAddressFound={handleAddressFound} />}
          <Field id={field.name} label={field.label} error={fieldErrors[field.name]}>
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
          </Field>
        </Fragment>
      ))}
      <EmploymentFields
        employments={form.employments}
        onChange={handleEmploymentsChange}
        fieldErrors={fieldErrors}
      />
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
