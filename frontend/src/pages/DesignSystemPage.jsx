import { FileDown, Pencil, Trash2 } from "lucide-react";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Field from "../components/Field/Field";
import Logo from "../components/Logo/Logo";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import {
  ACCESSIBILITY_RULES,
  BUTTON_VARIANTS,
  CONTRAST_CHECKS,
  FONT_FAMILIES,
  FONT_SIZES,
  ICONS,
  RADII,
  SCALES,
  SECTIONS,
  SEMANTIC_TOKENS,
  SPACES,
  WHEEL_HUES,
} from "../constants/designSystem";
import { REQUEST_STATUSES } from "../constants/requestStatus";
import { readToken } from "../utils/cssTokens";
import styles from "./DesignSystemPage.module.css";

const THEMES = [
  { theme: "light", label: "Tema claro" },
  { theme: "dark", label: "Tema escuro" },
];

const ALERT_EXAMPLES = [
  { type: "success", text: "Pedido criado. Ele está em análise." },
  { type: "error", text: "Este automóvel já está reservado nesse período." },
  { type: "warning", text: "A API pode levar cerca de 1 minuto para acordar." },
  { type: "info", text: "Faça login para continuar." },
];

function DesignSystemPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Documentação do design system</p>
        <h1>Aluguel de Carros</h1>
        <p className={styles.lead}>
          Decisões visuais do front-end: marca, temas, cores, tipografia, medidas, componentes e acessibilidade. Os
          valores vêm de <code>styles/tokens.css</code>, e os exemplos usam os componentes reais do sistema.
        </p>
        <Button icon={FileDown} className={styles.noPrint} onClick={() => window.print()}>
          Exportar PDF
        </Button>
      </header>
      <nav aria-label="Seções do design system" className={styles.toc}>
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>
      <BrandSection />
      <ThemesSection />
      <ColorsSection />
      <TypographySection />
      <MeasuresSection />
      <ButtonsSection />
      <ComponentsSection />
      <AccessibilitySection />
    </div>
  );
}

function Section({ id, children }) {
  const { title } = SECTIONS.find((section) => section.id === id);
  return (
    <Card as="section" id={id} aria-labelledby={`${id}-title`} className={styles.section}>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </Card>
  );
}

function ThemeBox({ theme, label, children }) {
  return (
    <figure className={styles.themeFigure}>
      <div data-theme={theme} className={styles.themeBox}>
        {children}
      </div>
      <figcaption className={styles.secondary}>{label}</figcaption>
    </figure>
  );
}

function BrandSection() {
  return (
    <Section id="marca">
      <div className={styles.twoColumns}>
        {THEMES.map(({ theme, label }) => (
          <ThemeBox key={theme} theme={theme} label={label}>
            <div className={styles.logoStage}>
              <Logo />
            </div>
          </ThemeBox>
        ))}
      </div>
      <ul className={styles.rules}>
        <li>
          A logo é o componente <code>Logo</code>, não uma imagem: fica nítida em qualquer tamanho.
        </li>
        <li>
          O símbolo usa <code>--color-brand</code>, um vermelho fixo nos dois temas, com o carro em branco.
        </li>
        <li>
          O nome usa a Chakra Petch itálica. &quot;Carros&quot; usa <code>--color-accent</code>, que clareia no tema
          escuro para manter o contraste do texto.
        </li>
      </ul>
    </Section>
  );
}

function ThemesSection() {
  return (
    <Section id="temas">
      <p className={styles.text}>
        Os dois temas usam os mesmos nomes de tokens. O tema escuro só redefine os valores em{" "}
        <code>[data-theme=&quot;dark&quot;]</code>, então nenhum componente muda. A escolha fica salva no navegador e,
        na primeira visita, segue o tema do sistema operacional.
      </p>
      <div className={styles.twoColumns}>
        {THEMES.map(({ theme, label }) => (
          <ThemeBox key={theme} theme={theme} label={label}>
            <ThemePreview theme={theme} />
          </ThemeBox>
        ))}
      </div>
    </Section>
  );
}

function ThemePreview({ theme }) {
  return (
    <Card className={styles.preview}>
      <div className={styles.previewTitle}>
        <strong>Pedido nº 12</strong>
        <StatusBadge status="APPROVED" />
      </div>
      <Field id={`preview-${theme}`} label="Parecer">
        <input id={`preview-${theme}`} defaultValue="Renda compatível." />
      </Field>
      <div className={styles.row}>
        <Button>Salvar</Button>
        <Button variant="secondary">Cancelar</Button>
      </div>
    </Card>
  );
}

function ColorsSection() {
  return (
    <Section id="cores">
      <h3 className={styles.subtitle}>Círculo cromático</h3>
      <ColorWheel />
      <h3 className={styles.subtitle}>Escala cromática</h3>
      <p className={styles.text}>
        Cada escala mantém o mesmo matiz e só muda a luminosidade: do 50 (mais claro) ao 900 ou 950 (mais escuro).
      </p>
      {SCALES.map((scale) => (
        <ColorScale key={scale.name} scale={scale} />
      ))}
      <h3 className={styles.subtitle}>Tokens semânticos</h3>
      <p className={styles.text}>
        Os componentes nunca usam a escala direto: usam estes nomes, que apontam para um tom diferente em cada tema.
      </p>
      <SemanticTokensTable />
    </Section>
  );
}

function ColorWheel() {
  return (
    <div className={styles.wheelArea}>
      <div className={styles.wheel} aria-hidden="true">
        {WHEEL_HUES.map((item) => (
          <span
            key={item.hue}
            className={styles.wheelMarker}
            style={{ background: `var(${item.token})`, transform: `rotate(${item.hue}deg) translateY(-82px)` }}
          />
        ))}
        <span className={styles.wheelCenter}>Neutro</span>
      </div>
      <div>
        <p className={styles.text}>
          Esquema <strong>acromático com um acento</strong>: a interface é cinza, praticamente sem matiz, e o vermelho
          entra só como destaque da marca. As cores de status ficam em outras regiões do círculo, para não serem
          confundidas com o vermelho.
        </p>
        <ul className={styles.legend}>
          {WHEEL_HUES.map((item) => (
            <li key={item.hue}>
              <span className={styles.dot} style={{ background: `var(${item.token})` }} />
              {item.label}: {item.hue}°
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ColorScale({ scale }) {
  return (
    <div className={styles.scale}>
      <p className={styles.text}>
        <strong>{scale.name}</strong> <span className={styles.secondary}>{scale.description}</span>
      </p>
      <div className={styles.swatches}>
        {scale.steps.map((step) => (
          <div key={step} className={styles.swatch}>
            <span className={styles.swatchColor} style={{ background: `var(--${step})` }} />
            <code>{step}</code>
            <span className={styles.secondary}>{readToken(`--${step}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticTokensTable() {
  return (
    <Card noPadding className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Uso</th>
            <th scope="col">Claro</th>
            <th scope="col">Escuro</th>
          </tr>
        </thead>
        <tbody>
          {SEMANTIC_TOKENS.map((item) => (
            <tr key={item.token}>
              <td>
                <code>{item.token}</code>
              </td>
              <td>{item.use}</td>
              {THEMES.map(({ theme }) => (
                <td key={theme}>
                  <span
                    data-theme={theme}
                    className={styles.tokenSwatch}
                    style={{ background: `var(${item.token})` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function TypographySection() {
  return (
    <Section id="tipografia">
      <div className={styles.twoColumns}>
        {FONT_FAMILIES.map((family) => (
          <div key={family.name}>
            <p className={`${styles.familySample} ${styles[family.className]}`}>{family.name}</p>
            <p className={styles.secondary}>{family.detail}</p>
            <p className={styles.text}>{family.use}</p>
          </div>
        ))}
      </div>
      <Card noPadding className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Tamanho</th>
              <th scope="col">Uso</th>
              <th scope="col">Exemplo</th>
            </tr>
          </thead>
          <tbody>
            {FONT_SIZES.map((size) => (
              <tr key={size.token}>
                <td>
                  <code>{size.token}</code>
                </td>
                <td>{size.px}px</td>
                <td>{size.use}</td>
                <td style={{ fontSize: `var(${size.token})` }}>{size.sample}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Section>
  );
}

function MeasuresSection() {
  return (
    <Section id="medidas">
      <h3 className={styles.subtitle}>Espaçamentos</h3>
      {SPACES.map((space) => (
        <div key={space.token} className={styles.tokenRow}>
          <code className={styles.tokenName}>{space.token}</code>
          <span className={styles.tokenValue}>{space.px}px</span>
          <span className={styles.spaceBar} style={{ width: `var(${space.token})` }} />
        </div>
      ))}
      <h3 className={styles.subtitle}>Arredondamentos e sombra</h3>
      <div className={styles.shapes}>
        {RADII.map((radius) => (
          <div key={radius.token} className={styles.shape} style={{ borderRadius: `var(${radius.token})` }}>
            <code>{radius.token}</code>
            <span className={styles.secondary}>{radius.value}</span>
            <span className={styles.secondary}>{radius.use}</span>
          </div>
        ))}
        <Card className={styles.shape}>
          <code>--shadow-sm</code>
          <span className={styles.secondary}>Cards e header</span>
        </Card>
      </div>
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section id="botoes">
      <p className={styles.text}>
        Todos os botões usam o componente <code>Button</code>:{" "}
        <code>{'<Button variant="danger" icon={Trash2}>Excluir</Button>'}</code>. Com a prop <code>to</code>, ele vira
        um link com o mesmo visual.
      </p>
      <Card noPadding className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th scope="col">Variante</th>
              <th scope="col">Exemplo</th>
              <th scope="col">Quando usar</th>
            </tr>
          </thead>
          <tbody>
            {BUTTON_VARIANTS.map((item) => (
              <tr key={item.variant}>
                <td>
                  <code>{item.variant}</code>
                </td>
                <td>
                  <Button variant={item.variant} icon={item.icon}>
                    {item.label}
                  </Button>
                </td>
                <td>{item.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <h3 className={styles.subtitle}>Estados</h3>
      <div className={styles.row}>
        <Button disabled>Salvando...</Button>
        <Button variant="ghost" icon={Pencil} aria-label="Editar" />
        <Button variant="danger" icon={Trash2} aria-label="Excluir" />
      </div>
      <p className={styles.secondary}>Desabilitado durante o envio e só com ícone (sempre com aria-label).</p>
      <h3 className={styles.subtitle}>Ícones</h3>
      <p className={styles.text}>
        Biblioteca lucide-react, em 18px nos botões, herdando a cor do texto. Estes são os ícones usados no sistema.
      </p>
      <ul className={styles.icons}>
        {ICONS.map(({ icon: Icon, name, use }) => (
          <li key={name} className={styles.icon}>
            <Icon size={24} />
            <code>{name}</code>
            <span className={styles.secondary}>{use}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ComponentsSection() {
  return (
    <Section id="componentes">
      <h3 className={styles.subtitle}>Field</h3>
      <div className={styles.twoColumns}>
        <Field id="ds-name" label="Nome completo">
          <input id="ds-name" defaultValue="Maria Silva" />
        </Field>
        <Field id="ds-cpf" label="CPF" error="CPF inválido.">
          <input id="ds-cpf" defaultValue="111.111.111-11" aria-invalid="true" />
        </Field>
      </div>
      <h3 className={styles.subtitle}>Alert</h3>
      <div>
        {ALERT_EXAMPLES.map((alert) => (
          <Alert key={alert.type} type={alert.type}>
            {alert.text}
          </Alert>
        ))}
      </div>
      <h3 className={styles.subtitle}>StatusBadge</h3>
      <div className={styles.row}>
        {REQUEST_STATUSES.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </div>
      <h3 className={styles.subtitle}>Card</h3>
      <p className={styles.text}>
        Caixa com fundo, borda, cantos e sombra, usada por formulários, detalhes, tabelas e por cada seção desta
        página. A prop <code>as</code> escolhe a tag (<code>form</code>, <code>section</code>) e{" "}
        <code>noPadding</code> serve para tabelas.
      </p>
    </Section>
  );
}

function AccessibilitySection() {
  return (
    <Section id="acessibilidade">
      <ul className={styles.rules}>
        {ACCESSIBILITY_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <h3 className={styles.subtitle}>Contraste medido</h3>
      <p className={styles.text}>
        Calculado com a fórmula de contraste do WCAG 2.1, contra o fundo da página e contra o card (vale o menor).
      </p>
      <Card noPadding className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th scope="col">Combinação</th>
              <th scope="col">Mínimo</th>
              <th scope="col">Claro</th>
              <th scope="col">Escuro</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_CHECKS.map((check) => (
              <tr key={check.label}>
                <td>{check.label}</td>
                <td>{check.minimum}:1</td>
                <td>{formatContrast(check.light, check.minimum)}</td>
                <td>{formatContrast(check.dark, check.minimum)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Section>
  );
}

function formatContrast(ratio, minimum) {
  return `${ratio.toFixed(1)}:1 ${ratio >= minimum ? "✓" : "✗"}`;
}

export default DesignSystemPage;
