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
| Avaliar pedido | HU12 |
| Executar contrato | HU13 |
| Conceder crédito | HU14 |
