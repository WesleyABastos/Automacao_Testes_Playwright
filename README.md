# Desafio Zupper com Playwright

Reimplementação em TypeScript do cenário principal do projeto Ruby: busca de voos de ida e volta de São Paulo (CGH) para Natal (NAT), para 2 adultos, 1 criança e 1 bebê.

## O que o projeto cobre

- Page Object para manter os seletores e as interações fora do teste;
- datas calculadas dinamicamente: ida em cinco dias e volta sete dias depois;
- tratamento não bloqueante dos avisos de cookies e de push;
- validação de matriz de preços, tarifa preenchida e quantidade positiva de voos;
- validação da disponibilidade HTTP da página inicial;
- relatório HTML e JUnit, trace, vídeo e screenshot em falhas;
- evidência em imagem da busca concluída, anexada ao relatório.

## Escopo seguro para produção

Esta suíte é intencionalmente limitada a consultas públicas. Ela cobre autocomplete, campos obrigatórios, ida e volta, só ida, multi-destinos, resultados, filtros visíveis e os motores de hospedagens e pacotes.

Não há testes de login, seleção de oferta para checkout, dados de viajantes, dados pessoais, pagamento, confirmação ou criação de pedido. Assim, ela pode ser usada como exemplo público sem risco de realizar uma compra.

## Pré-requisitos

- Node.js 20 ou superior.

## Instalação e execução

```bash
npm install
npx playwright install chromium
npm test
```

Para executar somente o smoke test:

```bash
npm run test:smoke
```

Para acompanhar o navegador:

```bash
npm run test:headed
```

Para usar a interface interativa do Playwright:

```bash
npm run test:ui
```

No Playwright UI, clique no ícone de olho (**Show browser**) antes de executar o teste para abrir uma janela do Chromium e acompanhar a execução ao vivo. Depois da execução, selecione o cenário na lista à esquerda: as ações e capturas do navegador ficam disponíveis no painel lateral. O projeto grava trace em todas as execuções justamente para permitir essa visualização, inclusive quando o teste passa.

### Navegadores do Playwright

Além das dependências do Node, o Playwright precisa baixar seus navegadores. O comando de instalação abaixo prepara o Chromium para execuções normais, acompanhadas e pelo modo UI:

```bash
npx playwright install chromium
```

Se o Playwright UI informar que o executável `chromium_headless_shell` não foi encontrado, instale-o separadamente:

```bash
npx playwright install chromium-headless-shell
```

Esse erro ocorre antes de o teste acessar a Zupper: ele indica somente que o navegador local ainda não está instalado.

Após uma execução, abra o relatório com:

```bash
npm run report
```

Em uma esteira de CI, o arquivo `test-results/junit.xml` pode ser publicado como resultado de testes. Defina `BASE_URL` caso precise executar contra outro ambiente autorizado.

## Estrutura

```text
tests/
  flights/                    # ida e volta, só ida, multi-destinos e resultados
  hotels/                     # motor de busca de hospedagens
  packages/                   # motor de busca de pacotes
  pages/flight-search.page.ts # Page Object e validações da página
  support/flight-data.ts      # massa dinâmica para voos
playwright.config.ts          # browser, evidências e relatório
```

> Como o site é externo, disponibilidade de voos, tarifas e o próprio DOM podem variar. Os locators preservam os atributos `data-zt` utilizados no projeto Ruby original.
