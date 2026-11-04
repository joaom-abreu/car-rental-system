import { Check, Moon, Pencil, Plus, Trash2 } from "lucide-react";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Field from "../components/Field/Field";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { REQUEST_STATUSES } from "../constants/requestStatus";
import styles from "./DesignSystemPage.module.css";

const COLORS = [
  { token: "--color-background", use: "Fundo da página" },
  { token: "--color-surface", use: "Cards, formulários e tabelas" },
  { token: "--color-surface-muted", use: "Cabeçalho de tabela e hover" },
  { token: "--color-text", use: "Texto principal" },
  { token: "--color-text-secondary", use: "Rótulos e textos de apoio" },
  { token: "--color-border", use: "Bordas de cards e tabelas" },
  { token: "--color-border-strong", use: "Bordas de campos de formulário" },
  { token: "--color-primary", use: "Ações principais e links" },
  { token: "--color-on-primary", use: "Texto sobre botões e badges" },
  { token: "--color-accent", use: "Marca e item ativo do menu" },
  { token: "--color-on-accent", use: "Ícone sobre a cor da marca" },
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
    <Card as="section" className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </Card>
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
        <Button icon={Plus}>Novo pedido</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="danger" icon={Trash2}>
          Excluir conta
        </Button>
        <Button variant="success" icon={Check}>
          Aprovar
        </Button>
        <Button variant="ghost" icon={Pencil} aria-label="Editar" />
        <Button variant="secondary" icon={Moon} aria-label="Usar tema escuro" />
        <Button disabled>Salvando...</Button>
      </div>
    </Section>
  );
}

function FieldsSection() {
  return (
    <Section title="Campos">
      <div className={styles.fields}>
        <Field id="ds-name" label="Nome completo">
          <input id="ds-name" defaultValue="Maria Silva" />
        </Field>
        <Field id="ds-cpf" label="CPF" error="CPF inválido.">
          <input id="ds-cpf" defaultValue="111.111.111-11" aria-invalid="true" />
        </Field>
        <Field id="ds-automobile" label="Automóvel">
          <select id="ds-automobile">
            <option>Fiat Argo 2023 · SAV1A23</option>
            <option>Hyundai HB20 2022 · SAV2B34</option>
          </select>
        </Field>
        <Field id="ds-opinion" label="Parecer">
          <textarea id="ds-opinion" rows="3" defaultValue="Renda compatível com o valor do aluguel." />
        </Field>
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
      <Card noPadding className={styles.tableWrapper}>
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
      </Card>
    </Section>
  );
}

export default DesignSystemPage;
