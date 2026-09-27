import { expect, test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';

test.describe('Voos | Motor de busca', () => {
  test('autocomplete seleciona o aeroporto de origem informado', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await flightSearch.selectOrigin('São Paulo', 'CGH');

    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveValue(/CGH/);
  });

  test('pesquisa sem dados obrigatórios não avança para resultados', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await page.getByRole('button', { name: 'Pesquisar', exact: true }).click();

    await expect(page).toHaveURL(/zupper\.com\.br\/$/);
    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveValue('');
  });
});
