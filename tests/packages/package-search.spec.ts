import { expect, test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';

test.describe('Pacotes | Motor de busca', () => {
  test('exibe os campos públicos de origem, destino, datas e quartos', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await page.getByText('Pacotes', { exact: true }).last().click();

    await expect(page.getByPlaceholder('Qual sua origem?')).toBeVisible();
    await expect(page.getByPlaceholder('Qual seu destino?')).toBeVisible();
    await expect(page.getByPlaceholder('Datas de ida e volta')).toBeVisible();
    await expect(page.getByPlaceholder('Viajantes, quartos')).toBeVisible();
  });
});
