import { test } from '@playwright/test';
import { FlightSearchPage } from './pages/flight-search.page';

test.describe('Busca de passagens aéreas', () => {
  test('[SMOKE] ida e volta para 2 adultos, 1 criança e 1 bebê', async ({ page }) => {
    const departureDate = addDays(new Date(), 5);
    const returnDate = addDays(departureDate, 7);
    const flightSearch = new FlightSearchPage(page);

    await flightSearch.open();
    await flightSearch.search({
      origin: 'São Paulo',
      originAirportCode: 'CGH',
      destination: 'Natal',
      destinationAirportCode: 'NAT',
      departureDate,
      returnDate,
      adults: 2,
      children: 1,
      infants: 1
    });
    await flightSearch.expectAvailableFlights();
  });
});

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
