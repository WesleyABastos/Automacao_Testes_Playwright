import { test } from '@playwright/test';
import { FlightSearchPage } from './pages/flight-search.page';
import { createFamilyRoundTrip } from './support/flight-data';

test.describe('Busca de passagens aéreas', () => {
  test('[SMOKE] ida e volta para 2 adultos, 1 criança e 1 bebê', async ({ page }, testInfo) => {
    const flightSearch = new FlightSearchPage(page);
    const trip = createFamilyRoundTrip();

    await test.step('Acessar a página inicial e validar sua disponibilidade', async () => {
      await flightSearch.open();
    });

    await test.step('Buscar a viagem configurada', async () => {
      await flightSearch.search(trip);
    });

    await test.step('Validar tarifas, voos e controles de resultado', async () => {
      await flightSearch.expectAvailableFlights();
      await flightSearch.expectResultsControls();
    });

    await testInfo.attach('resultado-da-busca', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });
  });
});
