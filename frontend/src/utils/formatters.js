const CPF_PATTERN = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
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
