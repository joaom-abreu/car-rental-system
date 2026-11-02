import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import RequestForm from "../components/RequestForm/RequestForm";
import { getAutomobiles } from "../services/automobileService";
import { createRentalRequest } from "../services/rentalRequestService";
import styles from "./NewRequestPage.module.css";

const CREATED_MESSAGE = "Pedido criado. Ele está em análise.";

function NewRequestPage() {
  const navigate = useNavigate();
  const [automobiles, setAutomobiles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAutomobiles()
      .then(setAutomobiles)
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function handleSubmit(rentalRequest) {
    await createRentalRequest(rentalRequest);
    navigate("/pedidos", { state: { successMessage: CREATED_MESSAGE } });
  }

  return (
    <section className={styles.page}>
      <Link to="/pedidos" className={styles.backLink}>
        Voltar para pedidos
      </Link>
      <h1>Novo pedido</h1>
      {error && <Alert type="error">{error}</Alert>}
      {!automobiles && !error && <p>Carregando...</p>}
      {automobiles && <RequestForm automobiles={automobiles} submitLabel="Criar pedido" onSubmit={handleSubmit} />}
    </section>
  );
}

export default NewRequestPage;
