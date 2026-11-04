import API_CONFIG from "../config/apiConfig";

const HOLIDAYS_ERROR_MESSAGE = "Não foi possível consultar os feriados.";

export async function getNationalHolidays(year) {
  const response = await fetch(`${API_CONFIG.BRASIL_API_URL}/feriados/v1/${year}`);
  if (!response.ok) {
    throw new Error(HOLIDAYS_ERROR_MESSAGE);
  }
  return response.json();
}
