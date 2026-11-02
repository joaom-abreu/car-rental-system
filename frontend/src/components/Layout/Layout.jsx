import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const NAV_LINKS = [
  { to: "/pedidos", label: "Pedidos" },
  { to: "/automoveis", label: "Automóveis" },
  { to: "/clientes", label: "Clientes" },
  { to: "/perfil", label: "Perfil" },
  { to: "/login", label: "Entrar" },
  { to: "/cadastro", label: "Cadastre-se" },
];

function navLinkClass({ isActive }) {
  return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
}

function Layout() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand}>
            Sistema de Aluguel de Carros
          </Link>
          <nav aria-label="Navegação principal">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
