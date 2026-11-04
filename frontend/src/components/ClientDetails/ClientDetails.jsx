import { Pencil, Trash2 } from "lucide-react";
import { formatCpf, formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../Button/Button";
import styles from "./ClientDetails.module.css";

function ClientDetails({ client, onEdit, onDelete, deleteLabel }) {
  return (
    <>
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
      <div className={styles.actions}>
        <Button icon={Pencil} onClick={onEdit}>
          Editar
        </Button>
        <Button variant="danger" icon={Trash2} onClick={onDelete}>
          {deleteLabel}
        </Button>
      </div>
    </>
  );
}

export default ClientDetails;
