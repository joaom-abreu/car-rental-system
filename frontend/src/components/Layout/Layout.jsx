import { LogOut, Moon, Sun } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import styles from "./Layout.module.css";

const GUEST_LINKS = [
  { to: "/login", label: "Entrar" },
  { to: "/cadastro", label: "Cadastre-se" },
];
const COMMON_LINKS = [
  { to: "/pedidos", label: "Pedidos" },
  { to: "/automoveis", label: "Automóveis" },
];
const AGENT_LINKS = [{ to: "/clientes", label: "Clientes" }];
const CLIENT_LINKS = [{ to: "/perfil", label: "Perfil" }];

function getNavLinks(user, isAgent) {
  if (!user) {
    return GUEST_LINKS;
  }
  return [...COMMON_LINKS, ...(isAgent ? AGENT_LINKS : CLIENT_LINKS)];
}

function navLinkClass({ isActive }) {
  return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
}

function Layout() {
  const { user, isAgent, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand}>
            <Logo />
          </Link>
          <nav aria-label="Navegação principal">
            <ul className={styles.navList}>
              {getNavLinks(user, isAgent).map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.userArea}>
            {user && <span className={styles.userName}>{user.name}</span>}
            <Button
              variant="secondary"
              icon={isDark ? Sun : Moon}
              aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
              onClick={toggleTheme}
            />
            {user && (
              <Button variant="secondary" icon={LogOut} onClick={handleLogout}>
                Sair
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
