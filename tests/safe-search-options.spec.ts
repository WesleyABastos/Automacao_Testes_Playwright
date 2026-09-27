import { expect, test } from '@playwright/test';
import { FlightSearchPage } from './pages/flight-search.page';
import { createFamilyRoundTrip } from './support/flight-data';

test.describe('Fluxos públicos seguros', () => {
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
  });

  test('Só Ida pesquisa somente a data de partida', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);
    await flightSearch.open();
    await flightSearch.search(createFamilyRoundTrip(), 'oneWay');
    await expect(page).toHaveURL(/type=oneWay/);
    await flightSearch.expectAvailableFlights();
  });

  test('Multidestinos permite adicionar um terceiro trecho', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);
    await flightSearch.open();
    await flightSearch.selectFlightMode('multiple');
    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveCount(2);
    await page.getByText('Adicionar Trecho', { exact: true }).click();
    await expect(page.getByPlaceholder('Qual sua origem?')).toHaveCount(3);
  });

  test('Hospedagens exibe seu motor público', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);
    await flightSearch.open();
    await page.getByText('Hospedagens', { exact: true }).last().click();
    await expect(page.getByPlaceholder('Qual o seu destino?')).toBeVisible();
  });

  test('Pacotes exibe seu motor público', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);
    await flightSearch.open();
    await page.getByText('Pacotes', { exact: true }).last().click();
    await expect(page.getByPlaceholder('Viajantes, quartos')).toBeVisible();
  });
});
