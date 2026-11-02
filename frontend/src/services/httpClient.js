import API_CONFIG from "../config/apiConfig";
import { clearSession, loadSession } from "./authStorage";

const NO_CONTENT_STATUS = 204;
const UNAUTHORIZED_STATUS = 401;
const LOGIN_PATH = "/login";
const CONNECTION_ERROR_MESSAGE = "Não foi possível conectar ao servidor. Tente novamente em instantes.";

export async function request(path, { method = "GET", body } = {}) {
  const session = loadSession();
  const options = { method, headers: buildHeaders(session, body) };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_CONFIG.BASE_URL}${path}`, options);
  } catch {
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }

  if (response.status === UNAUTHORIZED_STATUS && session) {
    clearSession();
    window.location.assign(LOGIN_PATH);
  }

  if (response.status === NO_CONTENT_STATUS) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw createApiError(response.status, data);
  }
  return data;
}

function buildHeaders(session, body) {
  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (session) {
    headers.Authorization = `Bearer ${session.token}`;
  }
  return headers;
}

function createApiError(status, data) {
  const error = new Error(data?.message || `O servidor respondeu com erro ${status}.`);
  error.status = status;
  error.fieldErrors = data?.fieldErrors || {};
  return error;
}
