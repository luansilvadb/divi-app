# ADR 001: Motor de Insights Locais (Heurística Client-Side)

## Contexto
Com a transição para a visão v2.0 do divi, focada em proatividade inteligente, precisamos de um mecanismo para analisar os dados financeiros do usuário (transações, orçamentos) e gerar alertas úteis (insights).

## Opções Consideradas
1. **Cloud-Based AI/ML Engine:** Enviar todos os dados financeiros do usuário para um backend ou serviço de terceiros (ex: OpenAI, AWS SageMaker) para processamento pesado.
2. **Local Heuristic Engine (Client-Side):** Executar funções lógicas simples e matemáticas puras (heurísticas) diretamente no navegador/dispositivo do usuário (Vue/TypeScript), aproveitando o cache local do Dexie.

## Decisão
Optamos pelo **Local Heuristic Engine (Client-Side)**.

## Consequências

### Positivas
* **Privacidade Absoluta:** O core value do produto ("privacy-focused") é 100% mantido. Nenhum dado transacional de comportamento precisa deixar o dispositivo do usuário para gerar os insights.
* **Custo Zero de Servidor:** Não há custos de processamento em cloud ou chamadas a APIs pagas.
* **Disponibilidade Offline:** Funciona perfeitamente offline (PWA), rodando junto com o Dexie localmente.
* **Alta Velocidade:** Processamento instantâneo via web workers ou na main thread se o dataset for pequeno.

### Negativas
* **Limitação de "Inteligência":** Não poderemos usar modelos de ML complexos ou LLMs reais. Tudo se resumirá a algoritmos "If/Else" avançados baseados em estatística básica.
* **Uso de CPU do Client:** Em aparelhos mais velhos com bases de dados gigantes, pode causar um leve impacto de performance (deveremos monitorar a necessidade de Web Workers no futuro).

## Implementação
Criar um módulo puramente funcional (Domain Logic) dentro de `src/modules/insights` que receba os dados cacheados e retorne as notificações.