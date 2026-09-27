import { expect, test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';

test.describe('Voos | Multidestinos', () => {
  test('permite adicionar um terceiro trecho sem pesquisar', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await flightSearch.selectFlightMode('multiple');

    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveCount(2);
    await page.getByText('Adicionar Trecho', { exact: true }).click();
    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveCount(3);
    await expect(page.getByPlaceholder('Data de ida')).toHaveCount(3);
  });
});
