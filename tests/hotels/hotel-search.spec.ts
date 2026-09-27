import { expect, test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';

test.describe('Hospedagens | Motor de busca', () => {
  test('exibe os campos públicos de destino, datas e hóspedes', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await page.getByText('Hospedagens', { exact: true }).last().click();

    await expect(page.getByPlaceholder('Qual o seu destino?')).toBeVisible();
    await expect(page.getByPlaceholder('Datas de entrada e saída')).toBeVisible();
    await expect(page.getByPlaceholder('Hóspedes, quartos')).toBeVisible();
  });
});
