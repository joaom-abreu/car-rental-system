import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import { searchClients } from "../services/clientService";
import { formatCpf, formatDate } from "../utils/formatters";
import styles from "./ClientsPage.module.css";

function ClientsPage() {
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients("");
  }, []);

  function loadClients(term) {
    setError("");
    searchClients(term)
      .then(setClients)
      .catch((requestError) => setError(requestError.message));
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadClients(search);
  }

  return (
    <section>
      <h1>Clientes</h1>
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <form className={styles.search} onSubmit={handleSubmit} role="search">
        <label htmlFor="search">Buscar por nome ou CPF</label>
        <div className={styles.searchRow}>
          <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit">Buscar</button>
        </div>
      </form>
      {!clients && !error && <p>Carregando...</p>}
      {clients && clients.length === 0 && <p className={styles.empty}>Nenhum cliente encontrado.</p>}
      {clients && clients.length > 0 && <ClientsTable clients={clients} />}
    </section>
  );
}

function ClientsTable({ clients }) {
  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">Profissão</th>
            <th scope="col">Cliente desde</th>
            <th scope="col">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{formatCpf(client.cpf)}</td>
              <td>{client.profession}</td>
              <td>{formatDate(client.createdAt)}</td>
              <td>
                <Link to={`/clientes/${client.id}`} aria-label={`Ver ${client.name}`}>
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsPage;
