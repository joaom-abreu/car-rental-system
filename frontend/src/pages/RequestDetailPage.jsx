import { Ban, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import ContractForm from "../components/ContractForm/ContractForm";
import EvaluationForm from "../components/EvaluationForm/EvaluationForm";
import RequestForm from "../components/RequestForm/RequestForm";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { OWNERSHIP_TYPE_LABELS } from "../constants/ownershipType";
import { useAuth } from "../hooks/useAuth";
import { getAutomobiles } from "../services/automobileService";
import {
  cancelRentalRequest,
  evaluateRentalRequest,
  getRentalRequest,
  signContract,
  updateRentalRequest,
} from "../services/rentalRequestService";
import { formatCpf, formatCurrency, formatDate, formatLocalDate, formatPercent } from "../utils/formatters";
import styles from "./RequestDetailPage.module.css";

const PENDING_STATUS = "PENDING";
const APPROVED_STATUS = "APPROVED";
const CANCELLABLE_STATUSES = ["PENDING", "APPROVED"];
const CANCEL_CONFIRMATION = "Cancelar este pedido? Essa ação não pode ser desfeita.";
const UPDATED_MESSAGE = "Pedido atualizado.";
const CANCELLED_MESSAGE = "Pedido cancelado.";
const APPROVED_MESSAGE = "Pedido aprovado.";
const REJECTED_MESSAGE = "Pedido reprovado.";
const CONTRACT_SIGNED_MESSAGE = "Contrato executado.";

function canEdit(rentalRequest) {
  return rentalRequest.status === PENDING_STATUS;
}

function canCancel(rentalRequest, isClient) {
  return isClient && CANCELLABLE_STATUSES.includes(rentalRequest.status);
}

function canEvaluate(rentalRequest, isAgent) {
  return isAgent && rentalRequest.status === PENDING_STATUS;
}

function canSignContract(rentalRequest, isAgent) {
  return isAgent && rentalRequest.status === APPROVED_STATUS;
}

function RequestDetailPage() {
  const { id } = useParams();
  const { isClient, isAgent, isBank } = useAuth();
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

  async function handleEvaluate(evaluation) {
    setMessage("");
    setError("");
    setRentalRequest(await evaluateRentalRequest(id, evaluation));
    setMessage(evaluation.approved ? APPROVED_MESSAGE : REJECTED_MESSAGE);
  }

  async function handleSign(contract) {
    setMessage("");
    setError("");
    await signContract(id, contract);
    setRentalRequest(await getRentalRequest(id));
    setMessage(CONTRACT_SIGNED_MESSAGE);
  }

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
              <Button icon={Pencil} onClick={startEditing}>
                Editar
              </Button>
            )}
            {canCancel(rentalRequest, isClient) && (
              <Button variant="danger" icon={Ban} onClick={handleCancelRequest}>
                Cancelar pedido
              </Button>
            )}
          </div>
          {canEvaluate(rentalRequest, isAgent) && <EvaluationForm onEvaluate={handleEvaluate} />}
          {canSignContract(rentalRequest, isAgent) && <ContractForm isBank={isBank} onSign={handleSign} />}
        </>
      )}
    </section>
  );
}

function RequestDetails({ rentalRequest }) {
  const { client, automobile, evaluation, contract } = rentalRequest;
  const showContract = contract || rentalRequest.status === APPROVED_STATUS;
  return (
    <Card>
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
      <h2 className={styles.subtitle}>Avaliação</h2>
      {evaluation ? (
        <dl className={styles.details}>
          <dt>Avaliado por</dt>
          <dd>{evaluation.agentName}</dd>
          <dt>Data</dt>
          <dd>{formatDate(evaluation.evaluatedAt)}</dd>
          <dt>Parecer</dt>
          <dd className={styles.opinion}>{evaluation.opinion}</dd>
        </dl>
      ) : (
        <p className={styles.empty}>Este pedido ainda não foi avaliado.</p>
      )}
      {showContract && <h2 className={styles.subtitle}>Contrato</h2>}
      {contract && <ContractDetails contract={contract} />}
      {showContract && !contract && <p className={styles.empty}>O contrato ainda não foi executado.</p>}
    </Card>
  );
}

function ContractDetails({ contract }) {
  const { credit } = contract;
  return (
    <dl className={styles.details}>
      <dt>Propriedade</dt>
      <dd>{OWNERSHIP_TYPE_LABELS[contract.ownershipType]}</dd>
      <dt>Assinado por</dt>
      <dd>{contract.signedByName}</dd>
      <dt>Data</dt>
      <dd>{formatDate(contract.signedAt)}</dd>
      {credit && (
        <>
          <dt>Banco</dt>
          <dd>{credit.bankName}</dd>
          <dt>Crédito</dt>
          <dd>{formatCurrency(credit.amount)}</dd>
          <dt>Juros ao mês</dt>
          <dd>{formatPercent(credit.monthlyInterestRate)}</dd>
          <dt>Parcelas</dt>
          <dd>{credit.installments}</dd>
        </>
      )}
    </dl>
  );
}

export default RequestDetailPage;
