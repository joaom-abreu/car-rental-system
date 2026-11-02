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
            <div className={styles.field}>
              <label htmlFor={`employer-${index}`}>Empregador {index + 1}</label>
              <input
                id={`employer-${index}`}
                value={employment.employer}
                onChange={(event) => updateEmployment(index, "employer", event.target.value)}
                aria-invalid={Boolean(employerError)}
              />
              {employerError && <p className={styles.fieldError}>{employerError}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor={`income-${index}`}>Rendimento mensal (R$)</label>
              <input
                id={`income-${index}`}
                type="number"
                min="0.01"
                step="0.01"
                value={employment.income}
                onChange={(event) => updateEmployment(index, "income", event.target.value)}
                aria-invalid={Boolean(incomeError)}
              />
              {incomeError && <p className={styles.fieldError}>{incomeError}</p>}
            </div>
            <button type="button" className={styles.remove} onClick={() => removeEmployment(index)}>
              Remover emprego {index + 1}
            </button>
          </div>
        );
      })}
      {fieldErrors.employments && <p className={styles.fieldError}>{fieldErrors.employments}</p>}
      {employments.length < MAX_EMPLOYMENTS && (
        <button type="button" className={styles.add} onClick={addEmployment}>
          Adicionar emprego
        </button>
      )}
    </fieldset>
  );
}

export default EmploymentFields;
