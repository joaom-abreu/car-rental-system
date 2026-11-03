# Modelos UML

Cada versão dos modelos fica numa pasta própria (`v1`, `v2`...), com o arquivo `.puml` (PlantUML) e a imagem `.png` gerada a partir dele. Uma versão publicada não é editada: mudanças viram uma versão nova, com a explicação do que mudou e por quê.

Para gerar as imagens de uma versão:

```bash
plantuml -tpng docs/uml/v1/*.puml
```

## Versões

| Versão | Data | O que contém |
| --- | --- | --- |
| [v1](v1/) | 2026-11-02 | Modelo inicial, feito antes do código: [casos de uso](v1/casos-de-uso.png), [classes](v1/classes.png) e [pacotes](v1/pacotes.png). |
| [v2](v2/) | 2026-11-02 | Modelo refeito a partir do código final: [casos de uso](v2/casos-de-uso.png), [classes](v2/classes.png) e [pacotes](v2/pacotes.png). |

## v1 → v2: o que mudou e por quê

- **Casos de uso:** novo caso **Consultar automóveis**, ligado ao Cliente. O cliente vê a lista de automóveis com o proprietário e escolhe um deles ao criar o pedido; na v1 só o agente aparecia ligado aos automóveis.
- **Classes:** `RentalRequest` ganhou o método privado `evaluate(agent, opinion, newStatus)`, que guarda a parte comum de `approve` e `reject` (só avalia em `PENDING`, muda o status e registra quem avaliou, o parecer e a data). Também entrou a nota "getters e setters omitidos", porque o diagrama mostra só os atributos e os métodos de regra. Nomes de classes, atributos, enums e associações não mudaram.
- **Pacotes, front-end:** apareceram as pastas `hooks` (o `useAuth`), `constants` (rótulos de status e de propriedade), `utils` (formatação de datas, CPF e moeda), `config` (URL da API) e `styles` (tokens de CSS). As páginas e os componentes não usam mais `contexts` direto: passam por `hooks`, e `hooks` usa `contexts`.
- **Pacotes, back-end:** os pacotes são os mesmos, mas o diagrama passou a mostrar dependências que o código tem e a v1 não previa: `service → security` (o `CurrentUserProvider` diz quem está logado), `dto → model` (os DTOs usam os enums), `model → exception` (as regras de status lançam `BusinessRuleException`), `controller → model` (filtro por `RequestStatus`), `security → model` e `config → model`.
- **Pacotes, nomes:** os dois `config` aparecem como `frontend.config` e `backend.config`, para não serem confundidos.

## Casos de uso → histórias de usuário

As histórias estão em [`docs/historias-de-usuario.md`](../historias-de-usuario.md).

| Caso de uso | Histórias |
| --- | --- |
| Cadastrar-se | HU01 |
| Fazer login | HU02 |
| Gerenciar perfil | HU03, HU04 |
| Criar pedido | HU05 |
| Consultar pedidos | HU06 |
| Modificar pedido | HU07, HU11 |
| Cancelar pedido | HU08 |
| Gerenciar clientes | HU09 |
| Gerenciar automóveis | HU10 |
| Consultar automóveis (v2) | HU05 |
| Avaliar pedido | HU12 |
| Executar contrato | HU13 |
| Conceder crédito | HU14 |
