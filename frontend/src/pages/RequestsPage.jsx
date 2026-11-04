import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { REQUEST_STATUS_LABELS, REQUEST_STATUSES } from "../constants/requestStatus";
import { useAuth } from "../hooks/useAuth";
import { getRentalRequests } from "../services/rentalRequestService";
import { formatLocalDate } from "../utils/formatters";
import styles from "./RequestsPage.module.css";

const AGENT_INITIAL_STATUS = "PENDING";
const ALL_STATUSES = "";

function RequestsPage() {
  const { isAgent, isClient } = useAuth();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const [status, setStatus] = useState(isAgent ? AGENT_INITIAL_STATUS : ALL_STATUSES);
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getRentalRequests(status)
      .then(setRequests)
      .catch((requestError) => setError(requestError.message));
  }, [status]);

  function handleStatusChange(event) {
    setRequests(null);
    setError("");
    setStatus(event.target.value);
  }

  return (
    <section>
      <div className={styles.header}>
        <h1>Pedidos</h1>
        {isClient && (
          <Button to="/pedidos/novo" icon={Plus}>
            Novo pedido
          </Button>
        )}
      </div>
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className={styles.filter}>
        <label htmlFor="status">Status</label>
        <select id="status" value={status} onChange={handleStatusChange}>
          <option value={ALL_STATUSES}>Todos</option>
          {REQUEST_STATUSES.map((option) => (
            <option key={option} value={option}>
              {REQUEST_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
      {!requests && !error && <p>Carregando...</p>}
      {requests && requests.length === 0 && <p className={styles.empty}>Nenhum pedido encontrado.</p>}
      {requests && requests.length > 0 && <RequestsTable requests={requests} showClient={isAgent} />}
    </section>
  );
}

function RequestsTable({ requests, showClient }) {
  return (
    <Card noPadding className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th scope="col">Nº</th>
            <th scope="col">Automóvel</th>
            <th scope="col">Período</th>
            <th scope="col">Status</th>
            {showClient && <th scope="col">Cliente</th>}
            <th scope="col">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((rentalRequest) => (
            <tr key={rentalRequest.id}>
              <td>{rentalRequest.id}</td>
              <td>
                {rentalRequest.automobile.brand} {rentalRequest.automobile.model} · {rentalRequest.automobile.plate}
              </td>
              <td>
                {formatLocalDate(rentalRequest.startDate)} a {formatLocalDate(rentalRequest.endDate)}
              </td>
              <td>
                <StatusBadge status={rentalRequest.status} />
              </td>
              {showClient && <td>{rentalRequest.client.name}</td>}
              <td>
                <Link to={`/pedidos/${rentalRequest.id}`} aria-label={`Ver pedido ${rentalRequest.id}`}>
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default RequestsPage;
