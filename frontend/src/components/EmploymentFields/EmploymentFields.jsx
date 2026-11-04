import { Plus, Trash2 } from "lucide-react";
import Button from "../Button/Button";
import Field from "../Field/Field";
import styles from "./EmploymentFields.module.css";

const MAX_EMPLOYMENTS = 3;
const EMPTY_EMPLOYMENT = { employer: "", income: "" };

function EmploymentFields({ employments, onChange, fieldErrors }) {
  function updateEmployment(index, field, value) {
    onChange(employments.map((employment, current) =>
      current === index ? { ...employment, [field]: value } : employment));
  }

  function addEmployment() {
    onChange([...employments, EMPTY_EMPLOYMENT]);
  }

  function removeEmployment(index) {
    onChange(employments.filter((_, current) => current !== index));
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>Empregos (até {MAX_EMPLOYMENTS})</legend>
      {employments.length === 0 && <p className={styles.empty}>Nenhum emprego informado.</p>}
      {employments.map((employment, index) => {
        const employerError = fieldErrors[`employments[${index}].employer`];
        const incomeError = fieldErrors[`employments[${index}].income`];
        return (
          <div key={index} className={styles.employment}>
            <Field id={`employer-${index}`} label={`Empregador ${index + 1}`} error={employerError}>
              <input
                id={`employer-${index}`}
                value={employment.employer}
                onChange={(event) => updateEmployment(index, "employer", event.target.value)}
                aria-invalid={Boolean(employerError)}
              />
            </Field>
            <Field id={`income-${index}`} label="Rendimento mensal (R$)" error={incomeError}>
              <input
                id={`income-${index}`}
                type="number"
                min="0.01"
                step="0.01"
                value={employment.income}
                onChange={(event) => updateEmployment(index, "income", event.target.value)}
                aria-invalid={Boolean(incomeError)}
              />
            </Field>
            <Button
              variant="danger"
              icon={Trash2}
              className={styles.action}
              onClick={() => removeEmployment(index)}
            >
              Remover emprego {index + 1}
            </Button>
          </div>
        );
      })}
      {fieldErrors.employments && <p className={styles.error}>{fieldErrors.employments}</p>}
      {employments.length < MAX_EMPLOYMENTS && (
        <Button variant="secondary" icon={Plus} className={styles.action} onClick={addEmployment}>
          Adicionar emprego
        </Button>
      )}
    </fieldset>
  );
}

export default EmploymentFields;
