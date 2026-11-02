const SESSION_KEY = "car-rental-session";

export function loadSession() {
  const storedSession = localStorage.getItem(SESSION_KEY);
  return storedSession ? JSON.parse(storedSession) : null;
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
