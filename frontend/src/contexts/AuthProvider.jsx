import { useState } from "react";
import * as authService from "../services/authService";
import { clearSession, loadSession, saveSession } from "../services/authStorage";
import { AuthContext } from "./AuthContext";

const ROLE_AGENT = "AGENT";
const ROLE_CLIENT = "CLIENT";
const AGENT_TYPE_BANK = "BANK";

function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  async function login(username, password) {
    const newSession = await authService.login(username, password);
    saveSession(newSession);
    setSession(newSession);
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  const user = session?.user ?? null;
  const value = {
    user,
    token: session?.token ?? null,
    isAgent: user?.role === ROLE_AGENT,
    isClient: user?.role === ROLE_CLIENT,
    isBank: user?.agentType === AGENT_TYPE_BANK,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
