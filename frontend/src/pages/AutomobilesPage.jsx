import { useEffect, useState } from "react";
import Alert from "../components/Alert/Alert";
import AutomobileForm from "../components/AutomobileForm/AutomobileForm";
import { useAuth } from "../hooks/useAuth";
import {
  createAutomobile,
  deleteAutomobile,
  getAutomobiles,
  updateAutomobile,
} from "../services/automobileService";
import styles from "./AutomobilesPage.module.css";

const NEW_AUTOMOBILE = { registration: "", year: "", brand: "", model: "", plate: "" };
const SAVED_MESSAGE = "Automóvel salvo.";
const DELETED_MESSAGE = "Automóvel excluído.";

function AutomobilesPage() {
  const { isAgent } = useAuth();
  const [automobiles, setAutomobiles] = useState(null);
  const [formAutomobile, setFormAutomobile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAutomobiles();
  }, []);

  function loadAutomobiles() {
    getAutomobiles()
      .then(setAutomobiles)
      .catch((requestError) => setError(requestError.message));
  }

  function openForm(automobile) {
    setMessage("");
    setError("");
    setFormAutomobile(automobile);
  }

  async function handleSave(values) {
    if (formAutomobile.id) {
      await updateAutomobile(formAutomobile.id, values);
    } else {
      await createAutomobile(values);
    }
    setFormAutomobile(null);
    setMessage(SAVED_MESSAGE);
    loadAutomobiles();
  }

  async function handleDelete(automobile) {
    if (!window.confirm(`Excluir o ${automobile.brand} ${automobile.model} (${automobile.plate})?`)) {
      return;
    }
    setMessage("");
    setError("");
    try {
      await deleteAutomobile(automobile.id);
      setMessage(DELETED_MESSAGE);
      loadAutomobiles();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section>
      <div className={styles.header}>
        <h1>Automóveis</h1>
        {isAgent && !formAutomobile && (
          <button type="button" className={styles.newButton} onClick={() => openForm(NEW_AUTOMOBILE)}>
            Novo automóvel
          </button>
        )}
      </div>
      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      {formAutomobile && (
        <div className={styles.formArea}>
          <h2 className={styles.formTitle}>{formAutomobile.id ? "Editar automóvel" : "Novo automóvel"}</h2>
          <AutomobileForm
            key={formAutomobile.id ?? "new"}
            automobile={formAutomobile}
            onSubmit={handleSave}
            onCancel={() => setFormAutomobile(null)}
          />
        </div>
      )}
      {!automobiles && !error && <p>Carregando...</p>}
      {automobiles && automobiles.length === 0 && <p className={styles.empty}>Nenhum automóvel cadastrado.</p>}
      {automobiles && automobiles.length > 0 && (
        <AutomobilesTable
          automobiles={automobiles}
          showActions={isAgent}
          onEdit={openForm}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}

function AutomobilesTable({ automobiles, showActions, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th scope="col">Automóvel</th>
            <th scope="col">Ano</th>
            <th scope="col">Placa</th>
            <th scope="col">Matrícula</th>
            <th scope="col">Proprietário</th>
            {showActions && <th scope="col">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {automobiles.map((automobile) => (
            <tr key={automobile.id}>
              <td>
                {automobile.brand} {automobile.model}
              </td>
              <td>{automobile.year}</td>
              <td>{automobile.plate}</td>
              <td>{automobile.registration}</td>
              <td>{automobile.ownerName}</td>
              {showActions && (
                <td>
                  <div className={styles.actions}>
                    <button type="button" className={styles.linkButton} onClick={() => onEdit(automobile)}>
                      Editar
                    </button>
                    <button type="button" className={styles.dangerLinkButton} onClick={() => onDelete(automobile)}>
                      Excluir
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AutomobilesPage;
