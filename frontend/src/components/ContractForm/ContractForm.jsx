import { FileSignature } from "lucide-react";
import { useState } from "react";
import { BANK_OWNERSHIP, OWNERSHIP_TYPE_LABELS } from "../../constants/ownershipType";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import styles from "./ContractForm.module.css";

const EMPTY_CREDIT = { amount: "", monthlyInterestRate: "", installments: "" };

const CREDIT_FIELDS = [
  { name: "amount", label: "Valor do crédito (R$)", step: "0.01" },
  { name: "monthlyInterestRate", label: "Juros ao mês (%)", step: "0.01" },
  { name: "installments", label: "Parcelas", step: "1" },
];

function ContractForm({ isBank, onSign }) {
  const [ownershipType, setOwnershipType] = useState("");
  const [grantCredit, setGrantCredit] = useState(false);
  const [credit, setCredit] = useState(EMPTY_CREDIT);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const creditRequired = ownershipType === BANK_OWNERSHIP;
  const showCredit = isBank && (grantCredit || creditRequired);
  const ownershipOptions = Object.keys(OWNERSHIP_TYPE_LABELS).filter(
    (option) => isBank || option !== BANK_OWNERSHIP,
  );

  function handleCreditChange(event) {
    const { name, value } = event.target;
    setCredit((currentCredit) => ({ ...currentCredit, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await onSign({
        ownershipType: ownershipType === "" ? null : ownershipType,
        credit: showCredit ? toCreditPayload(credit) : null,
      });
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="contract-title">
      <h2 id="contract-title" className={styles.title}>
        Executar contrato
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      <div className={styles.field}>
        <label htmlFor="ownershipType">Propriedade do automóvel</label>
        <select
          id="ownershipType"
          value={ownershipType}
          onChange={(event) => setOwnershipType(event.target.value)}
          aria-invalid={Boolean(fieldErrors.ownershipType)}
        >
          <option value="">Escolha a propriedade</option>
          {ownershipOptions.map((option) => (
            <option key={option} value={option}>
              {OWNERSHIP_TYPE_LABELS[option]}
            </option>
          ))}
        </select>
        {fieldErrors.ownershipType && <p className={styles.fieldError}>{fieldErrors.ownershipType}</p>}
      </div>
      {isBank && (
        <div className={styles.checkbox}>
          <input
            id="grantCredit"
            type="checkbox"
            checked={grantCredit || creditRequired}
            disabled={creditRequired}
            onChange={(event) => setGrantCredit(event.target.checked)}
          />
          <label htmlFor="grantCredit">Conceder contrato de crédito</label>
        </div>
      )}
      {showCredit &&
        CREDIT_FIELDS.map((field) => {
          const fieldError = fieldErrors[`credit.${field.name}`];
          return (
            <div key={field.name} className={styles.field}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step={field.step}
                value={credit[field.name]}
                onChange={handleCreditChange}
                aria-invalid={Boolean(fieldError)}
              />
              {fieldError && <p className={styles.fieldError}>{fieldError}</p>}
            </div>
          );
        })}
      <Button type="submit" icon={FileSignature} disabled={submitting}>
        {submitting ? "Executando..." : "Executar contrato"}
      </Button>
    </form>
  );
}

function toCreditPayload(credit) {
  return {
    amount: toNumberOrNull(credit.amount),
    monthlyInterestRate: toNumberOrNull(credit.monthlyInterestRate),
    installments: toNumberOrNull(credit.installments),
  };
}

function toNumberOrNull(value) {
  return value === "" ? null : Number(value);
}

export default ContractForm;
