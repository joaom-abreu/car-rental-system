import { useEffect, useState } from "react";
import Alert from "../components/Alert/Alert";
import ClientForm from "../components/ClientForm/ClientForm";
import { useAuth } from "../hooks/useAuth";
import { deleteClient, getClient, updateClient } from "../services/clientService";
import { formatCpf, formatCurrency, formatDate } from "../utils/formatters";
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
        <>
          <ClientForm initialValues={toFormValues(client)} submitLabel="Salvar alterações" onSubmit={handleSave} />
          <button type="button" className={styles.secondaryButton} onClick={() => setEditing(false)}>
            Cancelar
          </button>
        </>
      )}
      {client && !editing && (
        <>
          <ClientDetails client={client} />
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={startEditing}>
              Editar
            </button>
            <button type="button" className={styles.dangerButton} onClick={handleDelete}>
              Excluir conta
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function ClientDetails({ client }) {
  return (
    <div className={styles.card}>
      <dl className={styles.details}>
        <dt>Usuário</dt>
        <dd>{client.username}</dd>
        <dt>Nome</dt>
        <dd>{client.name}</dd>
        <dt>RG</dt>
        <dd>{client.rg}</dd>
        <dt>CPF</dt>
        <dd>{formatCpf(client.cpf)}</dd>
        <dt>Endereço</dt>
        <dd>{client.address}</dd>
        <dt>Profissão</dt>
        <dd>{client.profession}</dd>
        <dt>Cliente desde</dt>
        <dd>{formatDate(client.createdAt)}</dd>
      </dl>
      <h2 className={styles.subtitle}>Empregos</h2>
      {client.employments.length === 0 ? (
        <p className={styles.empty}>Nenhum emprego informado.</p>
      ) : (
        <ul className={styles.employments}>
          {client.employments.map((employment, index) => (
            <li key={index}>
              {employment.employer}: {formatCurrency(employment.income)} por mês
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function toFormValues(client) {
  return {
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

export default ProfilePage;
