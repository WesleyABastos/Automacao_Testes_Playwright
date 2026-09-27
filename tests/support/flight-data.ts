import type { FlightSearch } from '../pages/flight-search.page';

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const createFamilyRoundTrip = (today = new Date()): FlightSearch => {
  const departureDate = addDays(today, 5);

  return {
    origin: 'São Paulo',
    originAirportCode: 'CGH',
    destination: 'Natal',
    destinationAirportCode: 'NAT',
    departureDate,
    returnDate: addDays(departureDate, 7),
    adults: 2,
    children: 1,
    infants: 1
  };
};
