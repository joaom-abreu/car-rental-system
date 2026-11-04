import API_CONFIG from "../config/apiConfig";

const HOLIDAYS_ERROR_MESSAGE = "Não foi possível consultar os feriados.";
const CEP_NOT_FOUND_STATUS = 404;
const CEP_NOT_FOUND_MESSAGE = "CEP não encontrado. Preencha o endereço à mão.";
const CEP_ERROR_MESSAGE = "Não foi possível consultar o CEP. Preencha o endereço à mão.";

export async function getNationalHolidays(year) {
  const response = await fetch(`${API_CONFIG.BRASIL_API_URL}/feriados/v1/${year}`);
  if (!response.ok) {
    throw new Error(HOLIDAYS_ERROR_MESSAGE);
  }
  return response.json();
}

export async function getAddressByCep(cep) {
  let response;
  try {
    response = await fetch(`${API_CONFIG.BRASIL_API_URL}/cep/v2/${cep}`);
  } catch {
    throw new Error(CEP_ERROR_MESSAGE);
  }
  if (response.status === CEP_NOT_FOUND_STATUS) {
    throw new Error(CEP_NOT_FOUND_MESSAGE);
  }
  if (!response.ok) {
    throw new Error(CEP_ERROR_MESSAGE);
  }
  return response.json();
}
