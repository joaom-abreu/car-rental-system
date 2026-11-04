import {
  Ban,
  Car,
  Check,
  FileDown,
  FileSignature,
  LogIn,
  LogOut,
  Moon,
  Pencil,
  Plus,
  Search,
  Sun,
  Trash2,
  X,
} from "lucide-react";

export const SECTIONS = [
  { id: "marca", title: "Marca" },
  { id: "temas", title: "Temas" },
  { id: "cores", title: "Cores" },
  { id: "tipografia", title: "Tipografia" },
  { id: "medidas", title: "Espaçamentos e arredondamentos" },
  { id: "botoes", title: "Ícones e botões" },
  { id: "componentes", title: "Componentes" },
  { id: "acessibilidade", title: "Acessibilidade" },
];

export const WHEEL_HUES = [
  { label: "Marca (vermelho)", hue: 355, token: "--red-600" },
  { label: "Aviso (âmbar)", hue: 38, token: "--amber-800" },
  { label: "Sucesso (verde)", hue: 140, token: "--green-800" },
  { label: "Informação (azul)", hue: 218, token: "--blue-700" },
];

export const SCALES = [
  {
    name: "Neutro",
    description: "Cinza quase puro (matiz 240°, saturação 5%). Base de fundos, textos e bordas.",
    steps: ["neutral-0", "neutral-50", "neutral-100", "neutral-200", "neutral-300", "neutral-400", "neutral-500", "neutral-600", "neutral-700", "neutral-800", "neutral-900", "neutral-950"],
  },
  {
    name: "Vermelho",
    description: "Cor da marca (matiz 355°, saturação 78%). Destaques e ações de perigo.",
    steps: ["red-50", "red-100", "red-200", "red-300", "red-400", "red-500", "red-600", "red-700", "red-800", "red-900"],
  },
  {
    name: "Status",
    description: "Só os tons usados: o mais escuro no tema claro e o mais claro no tema escuro.",
    steps: ["green-800", "green-400", "amber-800", "amber-400", "blue-700", "blue-300"],
  },
];

export const SEMANTIC_TOKENS = [
  { token: "--color-background", use: "Fundo da página" },
  { token: "--color-surface", use: "Cards, formulários e header" },
  { token: "--color-surface-muted", use: "Cabeçalho de tabela e hover" },
  { token: "--color-text", use: "Texto principal" },
  { token: "--color-text-secondary", use: "Rótulos e textos de apoio" },
  { token: "--color-border", use: "Bordas de cards e tabelas" },
  { token: "--color-border-strong", use: "Bordas de campos de formulário" },
  { token: "--color-primary", use: "Botão principal, links e foco" },
  { token: "--color-on-primary", use: "Texto sobre botões e badges" },
  { token: "--color-accent", use: "Textos de destaque e item ativo do menu" },
  { token: "--color-brand", use: "Símbolo da logo, igual nos dois temas" },
  { token: "--color-on-brand", use: "Ícone sobre a cor da marca" },
  { token: "--color-success", use: "Sucesso e aprovado" },
  { token: "--color-warning", use: "Aviso e em análise" },
  { token: "--color-danger", use: "Erros, reprovado e ações destrutivas" },
  { token: "--color-info", use: "Informação e contratado" },
];

export const FONT_FAMILIES = [
  {
    name: "Chakra Petch",
    className: "displayFont",
    detail: "Itálico, peso 700",
    use: "Logo e títulos de página. Cantos cortados lembram painel de carro esportivo.",
  },
  {
    name: "Inter",
    className: "textFont",
    detail: "Pesos 400, 600 e 700",
    use: "Todo o resto: menus, formulários, tabelas e botões. Feita para leitura em tela.",
  },
];

export const FONT_SIZES = [
  { token: "--font-size-xl", px: 32, use: "Título da página (h1)", sample: "Novo pedido" },
  { token: "--font-size-lg", px: 20, use: "Título de seção e de card", sample: "Executar contrato" },
  { token: "--font-size-md", px: 16, use: "Texto padrão, campos e botões", sample: "Escolha um automóvel" },
  { token: "--font-size-sm", px: 14, use: "Erros de campo, badges e cabeçalho de tabela", sample: "CPF inválido." },
];

export const SPACES = [
  { token: "--space-xs", px: 4 },
  { token: "--space-sm", px: 8 },
  { token: "--space-md", px: 16 },
  { token: "--space-lg", px: 24 },
  { token: "--space-xl", px: 32 },
];

export const RADII = [
  { token: "--radius-sm", value: "6px", use: "Botões, campos e alertas" },
  { token: "--radius-md", value: "12px", use: "Cards e tabelas" },
  { token: "--radius-full", value: "999px", use: "Badges e menu" },
];

export const BUTTON_VARIANTS = [
  { variant: "primary", label: "Salvar", icon: null, use: "Ação principal da tela. No máximo um por bloco." },
  { variant: "secondary", label: "Cancelar", icon: null, use: "Ações neutras: cancelar, sair, trocar o tema." },
  { variant: "danger", label: "Excluir", icon: Trash2, use: "Ações destrutivas. Sempre com ícone e confirmação." },
  { variant: "success", label: "Aprovar", icon: Check, use: "Confirmação positiva, como aprovar um pedido." },
  { variant: "ghost", label: "Editar", icon: Pencil, use: "Ações discretas dentro de tabelas." },
];

export const ICONS = [
  { icon: Car, name: "Car", use: "Logo" },
  { icon: Plus, name: "Plus", use: "Criar e adicionar" },
  { icon: Pencil, name: "Pencil", use: "Editar" },
  { icon: Trash2, name: "Trash2", use: "Excluir e remover" },
  { icon: Check, name: "Check", use: "Aprovar" },
  { icon: X, name: "X", use: "Reprovar" },
  { icon: Ban, name: "Ban", use: "Cancelar pedido" },
  { icon: FileSignature, name: "FileSignature", use: "Executar contrato" },
  { icon: Search, name: "Search", use: "Buscar" },
  { icon: LogIn, name: "LogIn", use: "Entrar" },
  { icon: LogOut, name: "LogOut", use: "Sair" },
  { icon: Moon, name: "Moon", use: "Usar tema escuro" },
  { icon: Sun, name: "Sun", use: "Usar tema claro" },
  { icon: FileDown, name: "FileDown", use: "Exportar PDF" },
];

export const CONTRAST_CHECKS = [
  { label: "Texto principal", minimum: 4.5, light: 15.3, dark: 11.4 },
  { label: "Texto secundário", minimum: 4.5, light: 4.6, dark: 6.7 },
  { label: "Links e botão principal", minimum: 4.5, light: 11.4, dark: 10.3 },
  { label: "Destaque (accent)", minimum: 4.5, light: 5.0, dark: 5.4 },
  { label: "Erro e perigo", minimum: 4.5, light: 5.0, dark: 5.4 },
  { label: "Sucesso", minimum: 4.5, light: 5.0, dark: 7.1 },
  { label: "Aviso (em análise)", minimum: 4.5, light: 5.1, dark: 7.1 },
  { label: "Informação", minimum: 4.5, light: 7.3, dark: 5.8 },
  { label: "Texto do botão principal", minimum: 4.5, light: 12.2, dark: 13.9 },
  { label: "Texto dos badges (pior caso)", minimum: 4.5, light: 5.0, dark: 7.3 },
  { label: "Borda dos campos", minimum: 3, light: 3.3, dark: 3.4 },
  { label: "Ícone da logo", minimum: 3, light: 5.4, dark: 5.4 },
];

export const ACCESSIBILITY_RULES = [
  "Texto com contraste mínimo de 4.5:1 e bordas de campos e ícones com 3:1 (WCAG 2.1, nível AA), nos dois temas.",
  "Cor nunca é a única pista: badges têm texto, botões de perigo têm ícone e erros têm mensagem escrita.",
  "Foco visível em tudo que é clicável: contorno de 2px na cor principal ao navegar pelo teclado.",
  "Botões só com ícone sempre têm aria-label (ex.: \"Excluir SAV1A23\"). Ícones decorativos ficam com aria-hidden.",
  "Campos com erro recebem aria-invalid e a mensagem aparece logo abaixo, perto do campo.",
  "Só elementos nativos (button, a, input, select): funcionam com teclado e leitor de tela sem código extra.",
  "Página em pt-BR (lang no html), texto mínimo de 14px e ações destrutivas pedem confirmação.",
];
