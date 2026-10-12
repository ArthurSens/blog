---
lang: pt-BR
translationKey: promcon-shared-maintenance
title: "Interoperabilidade por meio de manutenção compartilhada"
excerpt: "Protocolos compatíveis são úteis. Compartilhar a responsabilidade pela implementação difícil pode ser ainda mais importante."
coverImage: '/assets/blog/prometheus-agent-support/cover.png'
date: '2026-10-10T00:00:00.000Z'
author:
  name: Arthur Sens
  picture: '/assets/blog/authors/arthursens.jpg'
ogImage:
  url: '/assets/blog/prometheus-agent-support/cover.png'
---

A próxima fase da interoperabilidade entre Prometheus e OpenTelemetry talvez tenha menos a ver com traduzir um formato de protocolo e mais com compartilhar a engenharia que existe por baixo dele.

Essa distinção importa.

Um sender compatível com Remote Write ainda pode ter sua própria fila, suas próprias suposições sobre WAL, regras de durabilidade, tentativas de reenvio e semântica de recuperação. Dois componentes podem falar o mesmo protocolo e, mesmo assim, exigir dois grupos diferentes para manter as partes mais difíceis.

A documentação do Prometheus descreve o Remote Write como um caminho que lê do WAL, mantém amostras em filas na memória e as envia para o destino. Essa fronteira de implementação não faz parte do protocolo de comunicação. Ela é a maquinaria operacional ao redor do protocolo, e é nela que vivem muitas das decisões difíceis sobre falhas e recuperação.

A programação do PromCon EU 2026 inclui uma palestra sobre o modo Agent do Prometheus, e discussões relacionadas no Dev Summit em Munique exploraram se partes da implementação do Remote Write poderiam ser reutilizadas entre o Prometheus e o OpenTelemetry Collector. Essa direção é interessante porque muda a pergunta de “esses sistemas conseguem trocar dados?” para “eles conseguem evitar manter o mesmo comportamento difícil duas vezes?”.

Isso não é um anúncio de fusão. Não é evidência de que o Agent mode será descontinuado, de que o exporter do Collector incorporará um banco de dados Prometheus ou de que já exista um pacote compartilhado. É uma direção de design que ainda precisa de limites precisos.

Uma fronteira útil talvez seja:

- compartilhar a implementação quando o problema for realmente o mesmo;
- preservar as diferenças quando Prometheus e OpenTelemetry tiverem responsabilidades diferentes de coleta, armazenamento ou pipeline;
- tornar explícitas as garantias de durabilidade e falha, em vez de presumir que compatibilidade de protocolo implica compatibilidade operacional.

A unidade reutilizável importa. É um sender? Uma fila? Uma abstração de WAL? Um conjunto de políticas de retry e backoff? Uma biblioteca que possa ser consumida tanto pelo Prometheus quanto por uma distribuição do OpenTelemetry Collector? Cada resposta traz consequências diferentes para ownership, testes, configuração e comportamento visível para o usuário.

Também existe uma pergunta menos glamourosa: quem mantém isso?

Compartilhar código pode reduzir duplicação, mas também pode criar uma nova fronteira de coordenação. Um componente usado por dois ecossistemas precisa de expectativas claras de compatibilidade, disciplina de release, testes que exercitem os dois consumidores e mantenedores capazes de tomar decisões sem transformar cada mudança em uma negociação entre projetos. Manutenção compartilhada só é valiosa quando o modelo de ownership é tão claro quanto a API.

Essa é uma definição mais exigente de interoperabilidade. Ela pergunta não apenas se dois sistemas conseguem trocar mensagens compatíveis, mas se conseguem compartilhar as partes da implementação que deveriam ser compartilhadas sem esconder as diferenças das quais os usuários dependem.

A proposta é interessante justamente porque não é simples. Uma implementação compartilhada de Remote Write pode ser mais valiosa do que outro diagrama de compatibilidade, mas somente se essa fronteira for desenhada com cuidado e as garantias resultantes forem documentadas com honestidade.

## Fontes e validações pendentes

- [Programação do PromCon EU 2026](https://promcon.io/2026-munich/schedule/), incluindo a palestra de Kyle Eckhart sobre Agent mode.
- [Documentação do Prometheus sobre ajuste do Remote Write](https://prometheus.io/docs/practices/remote_write/), para o comportamento de WAL e filas descrito acima.
- [Especificação do Prometheus Remote Write 2.0](https://prometheus.io/docs/specs/prw/remote_write_spec_2_0/), que continua marcada como experimental.
- [VALIDAR — afirmação técnica] Adicionar a fonte pública exata da discussão no Dev Summit em Munique sobre reutilização da implementação do Remote Write entre Prometheus e OpenTelemetry Collector.
- [VALIDAR — afirmação técnica] Confirmar o trecho exato da palestra e a atribuição ao palestrante antes da publicação.
