import { expect, test } from '@playwright/test';
import { FlightSearchPage } from '../pages/flight-search.page';
import { createFamilyRoundTrip } from '../support/flight-data';

test.describe('Voos | Só ida', () => {
  test('pesquisa somente a data de partida', async ({ page }) => {
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await flightSearch.search(createFamilyRoundTrip(), 'oneWay');

    await expect(page).toHaveURL(/type=oneWay/);
    await flightSearch.expectAvailableFlights();
  });
});
