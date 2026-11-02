import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import ClientDetails from "../components/ClientDetails/ClientDetails";
import ClientForm from "../components/ClientForm/ClientForm";
import { deleteClient, getClient, updateClient } from "../services/clientService";
import styles from "./ClientDetailPage.module.css";

const DELETE_CONFIRMATION = "Excluir este cliente? Essa ação não pode ser desfeita.";
const UPDATED_MESSAGE = "Dados do cliente atualizados.";
const DELETED_MESSAGE = "Cliente excluído.";

function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getClient(id)
      .then(setClient)
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  async function handleSave(values) {
    setClient(await updateClient(id, values));
    setEditing(false);
    setMessage(UPDATED_MESSAGE);
  }

  async function handleDelete() {
    if (!window.confirm(DELETE_CONFIRMATION)) {
      return;
    }
    try {
      await deleteClient(id);
      navigate("/clientes", { state: { successMessage: DELETED_MESSAGE } });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function startEditing() {
    setMessage("");
    setError("");
    setEditing(true);
  }

  return (
    <section className={styles.page}>
      <Link to="/clientes" className={styles.backLink}>
        Voltar para clientes
      </Link>
      <h1>{client ? client.name : "Cliente"}</h1>
      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      {!client && !error && <p>Carregando...</p>}
      {client && editing && (
        <ClientForm
          client={client}
          submitLabel="Salvar alterações"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
      {client && !editing && (
        <ClientDetails client={client} onEdit={startEditing} onDelete={handleDelete} deleteLabel="Excluir cliente" />
      )}
    </section>
  );
}

export default ClientDetailPage;
