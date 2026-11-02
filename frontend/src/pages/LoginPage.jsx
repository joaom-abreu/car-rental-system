import { useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import { useAuth } from "../hooks/useAuth";
import styles from "./LoginPage.module.css";

const INITIAL_FORM = { username: "", password: "" };

function LoginPage() {
  const { user, login } = useAuth();
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
      {error && <Alert type="error">{error}</Alert>}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.username)}
          />
          {fieldErrors.username && <p className={styles.fieldError}>{fieldErrors.username}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
        </div>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
