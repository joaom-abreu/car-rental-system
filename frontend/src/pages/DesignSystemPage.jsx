import Alert from "../components/Alert/Alert";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { REQUEST_STATUSES } from "../constants/requestStatus";
import styles from "./DesignSystemPage.module.css";

const COLORS = [
  { token: "--color-background", use: "Fundo da página" },
  { token: "--color-surface", use: "Cards, formulários e tabelas" },
  { token: "--color-surface-muted", use: "Cabeçalho de tabela e hover" },
  { token: "--color-text", use: "Texto principal" },
  { token: "--color-text-secondary", use: "Rótulos e textos de apoio" },
  { token: "--color-border", use: "Bordas" },
  { token: "--color-primary", use: "Ações principais e links" },
  { token: "--color-on-primary", use: "Texto sobre botões coloridos" },
  { token: "--color-success", use: "Sucesso e aprovado" },
  { token: "--color-warning", use: "Em análise" },
  { token: "--color-danger", use: "Erros e ações destrutivas" },
  { token: "--color-info", use: "Informação e contratado" },
];

const FONT_SIZES = [
  { token: "--font-size-xl", use: "Título da página" },
  { token: "--font-size-lg", use: "Título de seção" },
  { token: "--font-size-md", use: "Texto padrão" },
  { token: "--font-size-sm", use: "Mensagens de erro e cabeçalho de tabela" },
];

const SPACES = ["--space-xs", "--space-sm", "--space-md", "--space-lg", "--space-xl"];

const RADII = ["--radius-sm", "--radius-md", "--radius-full"];

const ALERT_TYPES = [
  { type: "success", text: "Pedido criado. Ele está em análise." },
  { type: "error", text: "Este automóvel já está reservado nesse período." },
  { type: "warning", text: "A API pode levar cerca de 1 minuto para acordar." },
  { type: "info", text: "Faça login para continuar." },
];

const SAMPLE_ROWS = [
  { id: 1, automobile: "Fiat Argo · SAV1A23", status: "PENDING" },
  { id: 2, automobile: "Hyundai HB20 · SAV2B34", status: "CONTRACTED" },
];

function DesignSystemPage() {
  return (
    <section>
      <h1>Design system</h1>
      <p className={styles.intro}>
        Tokens e componentes usados no Sistema de Aluguel de Carros. Os valores ficam em{" "}
        <code>styles/tokens.css</code>. Use o botão de tema no topo para ver tudo no modo claro e no escuro.
      </p>
      <ColorsSection />
      <TypographySection />
      <SpacingSection />
      <ShapesSection />
      <ButtonsSection />
      <FieldsSection />
      <FeedbackSection />
      <TableSection />
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function ColorsSection() {
  return (
    <Section title="Cores">
      <div className={styles.colorGrid}>
        {COLORS.map((color) => (
          <div key={color.token} className={styles.color}>
            <div className={styles.swatch} style={{ background: `var(${color.token})` }} />
            <code>{color.token}</code>
            <span className={styles.secondary}>{color.use}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section title="Tipografia">
      {FONT_SIZES.map((size) => (
        <div key={size.token} className={styles.tokenRow}>
          <code className={styles.tokenName}>{size.token}</code>
          <span style={{ fontSize: `var(${size.token})` }}>{size.use}</span>
        </div>
      ))}
    </Section>
  );
}

function SpacingSection() {
  return (
    <Section title="Espaçamentos">
      {SPACES.map((space) => (
        <div key={space} className={styles.tokenRow}>
          <code className={styles.tokenName}>{space}</code>
          <div className={styles.spaceBar} style={{ width: `var(${space})` }} />
        </div>
      ))}
    </Section>
  );
}

function ShapesSection() {
  return (
    <Section title="Bordas e sombra">
      <div className={styles.row}>
        {RADII.map((radius) => (
          <div key={radius} className={styles.shape} style={{ borderRadius: `var(${radius})` }}>
            <code>{radius}</code>
          </div>
        ))}
        <div className={`${styles.shape} ${styles.shadow}`}>
          <code>--shadow-sm</code>
        </div>
      </div>
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section title="Botões">
      <div className={styles.row}>
        <button type="button" className={styles.primaryButton}>
          Salvar
        </button>
        <button type="button" className={styles.secondaryButton}>
          Cancelar
        </button>
        <button type="button" className={styles.dangerOutlineButton}>
          Excluir conta
        </button>
        <button type="button" className={styles.successButton}>
          Aprovar
        </button>
        <button type="button" className={styles.dangerButton}>
          Reprovar
        </button>
        <button type="button" className={styles.linkButton}>
          Editar
        </button>
        <button type="button" className={styles.primaryButton} disabled>
          Salvando...
        </button>
      </div>
    </Section>
  );
}

function FieldsSection() {
  return (
    <Section title="Campos">
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="ds-name">Nome completo</label>
          <input id="ds-name" defaultValue="Maria Silva" />
        </div>
        <div className={styles.field}>
          <label htmlFor="ds-cpf">CPF</label>
          <input id="ds-cpf" defaultValue="111.111.111-11" aria-invalid="true" />
          <p className={styles.fieldError}>CPF inválido.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor="ds-automobile">Automóvel</label>
          <select id="ds-automobile">
            <option>Fiat Argo 2023 · SAV1A23</option>
            <option>Hyundai HB20 2022 · SAV2B34</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="ds-opinion">Parecer</label>
          <textarea id="ds-opinion" rows="3" defaultValue="Renda compatível com o valor do aluguel." />
        </div>
        <div className={styles.checkbox}>
          <input id="ds-credit" type="checkbox" defaultChecked />
          <label htmlFor="ds-credit">Conceder contrato de crédito</label>
        </div>
      </div>
    </Section>
  );
}

function FeedbackSection() {
  return (
    <Section title="Alertas e status">
      {ALERT_TYPES.map((alert) => (
        <Alert key={alert.type} type={alert.type}>
          {alert.text}
        </Alert>
      ))}
      <div className={styles.row}>
        {REQUEST_STATUSES.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </div>
    </Section>
  );
}

function TableSection() {
  return (
    <Section title="Tabela">
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Automóvel</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROWS.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.automobile}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export default DesignSystemPage;
