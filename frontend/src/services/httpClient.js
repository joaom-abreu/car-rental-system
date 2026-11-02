import API_CONFIG from "../config/apiConfig";

const NO_CONTENT_STATUS = 204;
const CONNECTION_ERROR_MESSAGE = "Não foi possível conectar ao servidor. Tente novamente em instantes.";

export async function request(path, { method = "GET", body } = {}) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_CONFIG.BASE_URL}${path}`, options);
  } catch {
    throw new Error(CONNECTION_ERROR_MESSAGE);
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

function createApiError(status, data) {
  const error = new Error(data?.message || `O servidor respondeu com erro ${status}.`);
  error.status = status;
  error.fieldErrors = data?.fieldErrors || {};
  return error;
}
