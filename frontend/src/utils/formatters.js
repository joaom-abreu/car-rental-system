const CPF_PATTERN = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
const LOCAL_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const DATE_DIGITS = 8;
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" });

export function formatCpf(cpf) {
  return cpf.replace(CPF_PATTERN, "$1.$2.$3-$4");
}

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatDate(instant) {
  return dateFormatter.format(new Date(instant));
}

export function formatLocalDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function maskLocalDate(value) {
  const digits = value.replace(/\D/g, "").slice(0, DATE_DIGITS);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

export function parseLocalDate(text) {
  const match = text.match(LOCAL_DATE_PATTERN);
  if (!match) {
    return null;
  }
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const exists = date.getUTCDate() === Number(day) && date.getUTCMonth() === Number(month) - 1;
  return exists ? `${year}-${month}-${day}` : null;
}

const percentFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}
