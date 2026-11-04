import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Field from "../components/Field/Field";
import { useAuth } from "../hooks/useAuth";
import styles from "./LoginPage.module.css";

const INITIAL_FORM = { username: "", password: "" };

function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/pedidos" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await login(form.username, form.password);
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.fieldErrors ?? {});
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <h1>Entrar</h1>
      {successMessage && !error && <Alert type="success">{successMessage}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <Card as="form" className={styles.form} onSubmit={handleSubmit} noValidate>
        <Field id="username" label="Usuário" error={fieldErrors.username}>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.username)}
          />
        </Field>
        <Field id="password" label="Senha" error={fieldErrors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.password)}
          />
        </Field>
        <Button type="submit" icon={LogIn} disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </Card>
      <p className={styles.signUpLink}>
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </section>
  );
}

export default LoginPage;
