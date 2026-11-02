import { useEffect, useState } from "react";
import Alert from "../components/Alert/Alert";
import ClientDetails from "../components/ClientDetails/ClientDetails";
import ClientForm from "../components/ClientForm/ClientForm";
import { useAuth } from "../hooks/useAuth";
import { deleteClient, getClient, updateClient } from "../services/clientService";
import styles from "./ProfilePage.module.css";

const DELETE_CONFIRMATION = "Excluir sua conta? Essa ação não pode ser desfeita.";
const UPDATED_MESSAGE = "Dados atualizados.";

function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getClient(user.id)
      .then(setClient)
      .catch((requestError) => setError(requestError.message));
  }, [user.id]);

  async function handleSave(values) {
    const updatedClient = await updateClient(user.id, values);
    setClient(updatedClient);
    updateUser({ name: updatedClient.name });
    setEditing(false);
    setMessage(UPDATED_MESSAGE);
  }

  async function handleDelete() {
    if (!window.confirm(DELETE_CONFIRMATION)) {
      return;
    }
    try {
      await deleteClient(user.id);
      logout();
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
      <h1>Meu perfil</h1>
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
        <ClientDetails client={client} onEdit={startEditing} onDelete={handleDelete} deleteLabel="Excluir conta" />
      )}
    </section>
  );
}

export default ProfilePage;
