# Histórias de usuário

Atores: **Cliente** (pessoa que aluga) e **Agente** (empresa ou banco já cadastrado no sistema). O **Banco** é um tipo de agente.

As regras de negócio (RN01 a RN16) estão no fim deste documento.

| HU | Título | Ator |
| --- | --- | --- |
| HU01 | Cadastro de cliente | Cliente |
| HU02 | Login e logout | Cliente e Agente |
| HU03 | Consultar e editar perfil | Cliente |
| HU04 | Excluir conta | Cliente |
| HU05 | Criar pedido | Cliente |
| HU06 | Consultar pedidos e status | Cliente e Agente |
| HU07 | Modificar pedido | Cliente |
| HU08 | Cancelar pedido | Cliente |
| HU09 | Gerenciar clientes | Agente |
| HU10 | Gerenciar automóveis | Agente |
| HU11 | Modificar pedido como agente | Agente |
| HU12 | Avaliar pedido | Agente |
| HU13 | Executar contrato | Agente |
| HU14 | Conceder crédito | Banco |

---

## HU01 — Cadastro de cliente

**Como** visitante, **quero** me cadastrar como cliente, **para** poder usar o sistema e pedir o aluguel de um carro.

**Critérios de aceitação**
1. O formulário pede usuário, senha, nome, RG, CPF, endereço, profissão e de 0 a 3 empregadores, cada um com seu rendimento.
2. Com dados válidos, a conta é criada e eu sou levado para o login.
3. Se o usuário, o CPF ou o RG já estiverem em uso, vejo uma mensagem dizendo qual dado já existe.
4. Campos inválidos (CPF inválido, senha curta, rendimento zero) mostram a mensagem de erro perto do campo.

**Regras:** RN01, RN02, RN03, RN04

## HU02 — Login e logout

**Como** cliente ou agente cadastrado, **quero** entrar com usuário e senha e sair quando terminar, **para** usar o sistema com segurança.

**Critérios de aceitação**
1. Com usuário e senha corretos, entro no sistema e vejo os menus do meu perfil (cliente ou agente).
2. Com usuário ou senha errados, vejo "Usuário ou senha inválidos." e continuo na tela de login.
3. Sem login, qualquer página que não seja login ou cadastro me leva para o login.
4. Ao clicar em "Sair", a sessão é apagada e volto para o login.

**Regras:** RN01

## HU03 — Consultar e editar perfil

**Como** cliente, **quero** ver e alterar meus dados, **para** mantê-los atualizados para a análise dos pedidos.

**Critérios de aceitação**
1. Vejo meus dados: nome, RG, CPF, endereço, profissão e empregos.
2. Posso alterar esses dados, mas não o usuário nem a senha.
3. As mesmas validações do cadastro valem na edição, incluindo CPF e RG únicos e no máximo 3 empregos.
4. Não consigo ver nem alterar os dados de outro cliente.

**Regras:** RN02, RN03, RN05

## HU04 — Excluir conta

**Como** cliente, **quero** excluir minha conta, **para** remover meus dados do sistema quando não quiser mais usá-lo.

**Critérios de aceitação**
1. O sistema pede confirmação antes de excluir.
2. Depois de excluir, minha sessão é encerrada e não consigo mais entrar com esse usuário.
3. Se eu já tiver pedidos, a exclusão é recusada com uma mensagem explicando o motivo.

**Regras:** RN05, RN15

## HU05 — Criar pedido

**Como** cliente, **quero** criar um pedido de aluguel escolhendo um automóvel e as datas, **para** alugar o carro de que preciso.

**Critérios de aceitação**
1. Escolho um automóvel da lista e informo as datas de início e de fim.
2. O pedido é criado com status "Em análise" e aparece na minha lista de pedidos.
3. A data de início antes de hoje ou a de fim igual ou anterior à de início mostram erro perto do campo.
4. Se o automóvel já estiver aprovado ou contratado para um período que se sobrepõe, o pedido é recusado com uma mensagem.

**Regras:** RN05, RN06, RN10

## HU06 — Consultar pedidos e status

**Como** cliente ou agente, **quero** ver a lista de pedidos e o detalhe de cada um, **para** acompanhar o status.

**Critérios de aceitação**
1. O cliente vê só os seus pedidos. O agente vê todos, começando pelo filtro "Em análise".
2. Cada pedido mostra automóvel, datas e status ("Em análise", "Aprovado", "Reprovado", "Cancelado" ou "Contratado").
3. Posso filtrar a lista pelo status.
4. No detalhe, vejo o parecer da avaliação e o contrato, quando existirem.

**Regras:** RN05

## HU07 — Modificar pedido

**Como** cliente, **quero** trocar o automóvel ou as datas de um pedido meu, **para** corrigi-lo antes da avaliação.

**Critérios de aceitação**
1. Só consigo modificar um pedido meu com status "Em análise".
2. As novas datas seguem as mesmas regras da criação.
3. Num pedido com outro status, a modificação é recusada com uma mensagem.

**Regras:** RN05, RN06, RN07

## HU08 — Cancelar pedido

**Como** cliente, **quero** cancelar um pedido meu, **para** desistir do aluguel.

**Critérios de aceitação**
1. Consigo cancelar um pedido meu com status "Em análise" ou "Aprovado".
2. O sistema pede confirmação e, depois, o pedido fica com status "Cancelado".
3. Pedidos reprovados, cancelados ou contratados não podem ser cancelados.
4. Agentes não podem cancelar pedidos.

**Regras:** RN05, RN08

## HU09 — Gerenciar clientes

**Como** agente, **quero** consultar, editar e excluir clientes, **para** manter o cadastro de contratantes correto.

**Critérios de aceitação**
1. Vejo a lista de clientes e posso buscar por nome ou CPF.
2. Abro o detalhe de um cliente e posso editar os dados dele, com as mesmas validações do cadastro.
3. Posso excluir um cliente, mas não se ele tiver pedidos.
4. Clientes não têm acesso a esta tela.

**Regras:** RN02, RN03, RN05, RN15

## HU10 — Gerenciar automóveis

**Como** agente, **quero** cadastrar, editar e excluir automóveis, **para** que os clientes possam escolhê-los nos pedidos.

**Critérios de aceitação**
1. O formulário pede matrícula, ano, marca, modelo e placa.
2. O automóvel cadastrado fica com o meu agente como proprietário, e a lista mostra o proprietário de cada carro.
3. Placa fora do formato, placa ou matrícula repetida ou ano fora do intervalo mostram erro.
4. Não consigo excluir um automóvel que tenha pedidos. Clientes veem a lista, mas não os botões de gerenciar.

**Regras:** RN14, RN15, RN16

## HU11 — Modificar pedido como agente

**Como** agente, **quero** trocar o automóvel ou as datas de qualquer pedido em análise, **para** ajustá-lo antes de avaliar.

**Critérios de aceitação**
1. Consigo modificar qualquer pedido com status "Em análise".
2. As novas datas seguem as mesmas regras da criação.
3. Num pedido com outro status, a modificação é recusada com uma mensagem.

**Regras:** RN05, RN06, RN07

## HU12 — Avaliar pedido

**Como** agente, **quero** aprovar ou reprovar um pedido com um parecer financeiro, **para** decidir se o aluguel pode virar contrato.

**Critérios de aceitação**
1. No detalhe de um pedido "Em análise", vejo os dados do cliente, incluindo empregos e rendimentos, e escolho aprovar ou reprovar.
2. O parecer é obrigatório, com 5 a 500 caracteres.
3. Depois da avaliação, o pedido fica "Aprovado" ou "Reprovado", e o detalhe mostra o parecer, o agente e a data.
4. Se o automóvel já estiver aprovado ou contratado num período que se sobrepõe, a aprovação é recusada com uma mensagem.

**Regras:** RN09, RN10

## HU13 — Executar contrato

**Como** agente, **quero** executar o contrato de um pedido aprovado, **para** formalizar o aluguel e registrar quem fica com o automóvel.

**Critérios de aceitação**
1. Só consigo executar o contrato de um pedido "Aprovado".
2. Escolho o proprietário do automóvel: cliente, empresa ou banco.
3. Depois do contrato, o pedido fica "Contratado" e o proprietário do automóvel é atualizado conforme a escolha.
4. O detalhe do pedido mostra o contrato com o tipo de propriedade, o agente e a data.

**Regras:** RN11, RN12, RN13

## HU14 — Conceder crédito

**Como** banco, **quero** conceder um contrato de crédito ao executar o contrato de um pedido, **para** financiar o aluguel do cliente.

**Critérios de aceitação**
1. Só um agente do tipo banco vê e consegue preencher os dados de crédito.
2. O crédito tem valor maior que zero, taxa de juros de 0 a 100% ao mês e de 1 a 60 parcelas.
3. Com propriedade "banco", o crédito é obrigatório, e o automóvel passa para o banco que o concedeu.
4. O detalhe do pedido mostra o banco, o valor, a taxa e as parcelas.

**Regras:** RN12, RN13

---

## Regras de negócio

- **RN01** Só login e cadastro de cliente são públicos. Todo o resto exige login.
- **RN02** Usuário, CPF e RG são únicos. O CPF precisa ser válido e é salvo só com dígitos.
- **RN03** Cliente tem de 0 a 3 empregos. Cada um tem empregador e rendimento maior que zero.
- **RN04** Senha com no mínimo 8 caracteres, salva com BCrypt.
- **RN05** Cliente só vê e altera os próprios dados e pedidos. Agente vê e altera os de todos, respeitando as regras abaixo.
- **RN06** Pedido: data de início a partir de hoje (fuso `America/Sao_Paulo`) e data de fim depois da de início.
- **RN07** Pedido só pode ser modificado com status "Em análise".
- **RN08** Pedido só pode ser cancelado pelo cliente dono, com status "Em análise" ou "Aprovado".
- **RN09** Avaliação só por agente, só com status "Em análise", com parecer obrigatório (5 a 500 caracteres).
- **RN10** Não dá para criar nem aprovar um pedido se o mesmo automóvel já tem pedido "Aprovado" ou "Contratado" com período que se sobrepõe.
- **RN11** Contrato só por agente, só para pedido "Aprovado". Ao executar, o pedido fica "Contratado".
- **RN12** Contrato de crédito só pode ser concedido por agente do tipo banco. Propriedade "banco" exige contrato de crédito.
- **RN13** Propriedade do automóvel depois do contrato: cliente → passa para o cliente do pedido; banco → passa para o banco que concedeu o crédito; empresa → continua com a empresa que já é dona.
- **RN14** Placa no formato antigo (`ABC1234`) ou Mercosul (`ABC1D23`), salva em maiúsculas e sem hífen. Placa e matrícula são únicas. Ano entre 1950 e o ano seguinte ao atual.
- **RN15** Não dá para excluir cliente nem automóvel que tenha pedidos.
- **RN16** Automóvel cadastrado por um agente nasce com esse agente como proprietário.

---

## Exigências do enunciado → histórias

| Exigência do LAB02 | Histórias |
| --- | --- |
| Login obrigatório com usuário e senha, para clientes e agentes | HU02 |
| Uso só após cadastro prévio | HU01, HU02 |
| Cliente introduz, modifica, consulta e cancela pedidos | HU05, HU06, HU07, HU08 |
| Agente modifica e avalia pedidos | HU11, HU12 |
| Análise financeira e, com parecer positivo, execução do contrato | HU12, HU13 |
| Contratante: RG, CPF, nome, endereço, profissão, até 3 empregadores com rendimentos | HU01, HU03 |
| Automóvel: matrícula, ano, marca, modelo e placa | HU10 |
| Automóvel registrado como propriedade do cliente, da empresa ou do banco, conforme o contrato | HU13, HU14 |
| Contrato de crédito concedido por um banco agente | HU14 |
| CRUD de cliente | HU01, HU03, HU04, HU09 |
| Protótipo: usuário cria e vê o status de um pedido | HU05, HU06 |
