import { Link, Navigate, useNavigate } from "react-router-dom";
import ClientForm from "../components/ClientForm/ClientForm";
import { useAuth } from "../hooks/useAuth";
import { createClient } from "../services/clientService";
import styles from "./SignUpPage.module.css";

const SUCCESS_MESSAGE = "Cadastro concluído. Faça login.";

function SignUpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/pedidos" replace />;
  }

  async function handleSubmit(client) {
    await createClient(client);
    navigate("/login", { state: { successMessage: SUCCESS_MESSAGE } });
  }

  return (
    <section className={styles.page}>
      <h1>Cadastro de cliente</h1>
      <ClientForm withCredentials submitLabel="Criar conta" onSubmit={handleSubmit} />
      <p className={styles.loginLink}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}

export default SignUpPage;
