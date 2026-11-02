import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import RequestForm from "../components/RequestForm/RequestForm";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { getAutomobiles } from "../services/automobileService";
import { cancelRentalRequest, getRentalRequest, updateRentalRequest } from "../services/rentalRequestService";
import { formatCpf, formatDate, formatLocalDate } from "../utils/formatters";
import styles from "./RequestDetailPage.module.css";

const EDITABLE_STATUS = "PENDING";
const CANCELLABLE_STATUSES = ["PENDING", "APPROVED"];
const CANCEL_CONFIRMATION = "Cancelar este pedido? Essa ação não pode ser desfeita.";
const UPDATED_MESSAGE = "Pedido atualizado.";
const CANCELLED_MESSAGE = "Pedido cancelado.";

function canEdit(rentalRequest) {
  return rentalRequest.status === EDITABLE_STATUS;
}

function canCancel(rentalRequest, isClient) {
  return isClient && CANCELLABLE_STATUSES.includes(rentalRequest.status);
}

function RequestDetailPage() {
  const { id } = useParams();
  const { isClient } = useAuth();
  const [rentalRequest, setRentalRequest] = useState(null);
  const [automobiles, setAutomobiles] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRentalRequest(id)
      .then(setRentalRequest)
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  function startEditing() {
    setMessage("");
    setError("");
    getAutomobiles()
      .then((list) => {
        setAutomobiles(list);
        setEditing(true);
      })
      .catch((requestError) => setError(requestError.message));
  }

  async function handleSave(values) {
    setRentalRequest(await updateRentalRequest(id, values));
    setEditing(false);
    setMessage(UPDATED_MESSAGE);
  }

  async function handleCancelRequest() {
    if (!window.confirm(CANCEL_CONFIRMATION)) {
      return;
    }
    setMessage("");
    setError("");
    try {
      setRentalRequest(await cancelRentalRequest(id));
      setMessage(CANCELLED_MESSAGE);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className={styles.page}>
      <Link to="/pedidos" className={styles.backLink}>
        Voltar para pedidos
      </Link>
      <div className={styles.title}>
        <h1>Pedido nº {id}</h1>
        {rentalRequest && <StatusBadge status={rentalRequest.status} />}
      </div>
      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      {!rentalRequest && !error && <p>Carregando...</p>}
      {rentalRequest && editing && (
        <RequestForm
          automobiles={automobiles}
          rentalRequest={rentalRequest}
          submitLabel="Salvar alterações"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
      {rentalRequest && !editing && (
        <>
          <RequestDetails rentalRequest={rentalRequest} />
          <div className={styles.actions}>
            {canEdit(rentalRequest) && (
              <button type="button" className={styles.editButton} onClick={startEditing}>
                Editar
              </button>
            )}
            {canCancel(rentalRequest, isClient) && (
              <button type="button" className={styles.cancelButton} onClick={handleCancelRequest}>
                Cancelar pedido
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function RequestDetails({ rentalRequest }) {
  const { client, automobile } = rentalRequest;
  return (
    <div className={styles.card}>
      <h2 className={styles.subtitle}>Pedido</h2>
      <dl className={styles.details}>
        <dt>Período</dt>
        <dd>
          {formatLocalDate(rentalRequest.startDate)} a {formatLocalDate(rentalRequest.endDate)}
        </dd>
        <dt>Criado em</dt>
        <dd>{formatDate(rentalRequest.createdAt)}</dd>
        <dt>Atualizado em</dt>
        <dd>{formatDate(rentalRequest.updatedAt)}</dd>
      </dl>
      <h2 className={styles.subtitle}>Cliente</h2>
      <dl className={styles.details}>
        <dt>Nome</dt>
        <dd>{client.name}</dd>
        <dt>CPF</dt>
        <dd>{formatCpf(client.cpf)}</dd>
      </dl>
      <h2 className={styles.subtitle}>Automóvel</h2>
      <dl className={styles.details}>
        <dt>Modelo</dt>
        <dd>
          {automobile.brand} {automobile.model} {automobile.year}
        </dd>
        <dt>Placa</dt>
        <dd>{automobile.plate}</dd>
      </dl>
    </div>
  );
}

export default RequestDetailPage;
