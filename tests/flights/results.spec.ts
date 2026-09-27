import { test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';
import { createFamilyRoundTrip } from '../support/flight-data';

test.describe('Voos | Resultados', () => {
  test('exibe tarifas, voos e controles de resultado', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await flightSearch.search(createFamilyRoundTrip());
    await flightSearch.expectAvailableFlights();
    await flightSearch.expectResultsControls();
  });
});
