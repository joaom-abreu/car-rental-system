import { useState } from "react";
import { getAddressByCep } from "../../services/brasilApiService";
import { formatAddress, maskCep } from "../../utils/formatters";
import Field from "../Field/Field";

const CEP_DIGITS = 8;
const CEP_LENGTH = 9;
const EMPTY_HINT = "Digite o CEP para preencher o endereço.";
const FILLED_HINT = "Endereço preenchido pelo CEP. Confira e acrescente o número.";

function CepField({ onAddressFound }) {
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState(false);

  function handleChange(event) {
    const input = event.target;
    const maskedCep = maskCep(input.value);
    setCep(maskedCep);
    setError("");
    setFound(false);
    const digits = onlyDigits(maskedCep);
    if (digits.length !== CEP_DIGITS) {
      return;
    }
    getAddressByCep(digits)
      .then((address) => {
        if (onlyDigits(input.value) === digits) {
          onAddressFound(formatAddress(address));
          setFound(true);
        }
      })
      .catch((lookupError) => {
        if (onlyDigits(input.value) === digits) {
          setError(lookupError.message);
        }
      });
  }

  return (
    <Field id="cep" label="CEP (opcional)" error={error} hint={found ? FILLED_HINT : EMPTY_HINT}>
      <input
        id="cep"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="00000-000"
        maxLength={CEP_LENGTH}
        value={cep}
        onChange={handleChange}
        aria-invalid={Boolean(error)}
      />
    </Field>
  );
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

export default CepField;
