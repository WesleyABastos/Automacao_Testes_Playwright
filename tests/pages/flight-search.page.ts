import { expect, type Page } from '@playwright/test';

export type FlightSearch = {
  origin: string;
  originAirportCode: string;
  destination: string;
  destinationAirportCode: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  children: number;
  infants: number;
};

export type FlightMode = 'roundTrip' | 'oneWay' | 'multiple';

export class FlightSearchPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    const response = await this.page.goto('/');
    expect(response, 'A página inicial não retornou uma resposta HTTP.').not.toBeNull();
    expect(response?.ok(), `A página inicial retornou HTTP ${response?.status()}.`).toBeTruthy();
    await this.dismissOptionalOverlays();
    await expect(this.page.locator('[data-zt="flightSearchOrigin"]')).toBeVisible();
  }

  async search(flight: FlightSearch, mode: FlightMode = 'roundTrip'): Promise<void> {
    await this.selectFlightMode(mode);
    await this.selectAirport('flightSearchOrigin', flight.origin, flight.originAirportCode);
    await this.selectAirport('flightSearchDestination', flight.destination, flight.destinationAirportCode);
    await this.selectDates(flight.departureDate, mode === 'oneWay' ? undefined : flight.returnDate);
    await this.selectPassengers(flight.adults, flight.children, flight.infants);
    await this.page.locator('[data-zt="flightSearchSubmit"]').click();
  }

  async selectFlightMode(mode: FlightMode): Promise<void> {
    const labels: Record<FlightMode, string> = {
      roundTrip: 'Ida e Volta',
      oneWay: 'Só Ida',
      multiple: 'Multidestinos'
    };
    await this.page.getByRole('radio', { name: labels[mode] }).check();
  }

  async selectOrigin(origin: string, airportCode: string): Promise<void> {
    await this.selectAirport('flightSearchOrigin', origin, airportCode);
  }

  async expectResultsControls(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /Alterar busca/i }).first()).toBeVisible();
    await expect(this.page.getByText('Filtros', { exact: true })).toBeVisible();
  }

  async expectAvailableFlights(): Promise<void> {
    const priceMatrix = this.page.locator('[data-zt="priceMatrix"]');
    await expect(priceMatrix).toBeVisible({ timeout: 60_000 });

    const prices = priceMatrix.locator('td').filter({ hasText: /R\$/ });
    await expect(prices.first()).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(async () => (await prices.allTextContents()).some((value) => value.trim().length > 0), {
        timeout: 30_000,
        message: 'Nenhuma tarifa foi exibida na matriz de preços.'
      })
      .toBe(true);

    const resultSummary = this.page.getByText(/\d+\s+voos encontrados/i).first();
    await expect(resultSummary).toBeVisible();
    const totalFlights = Number((await resultSummary.textContent())?.match(/\d+/)?.[0]);
    expect(totalFlights).toBeGreaterThan(0);
  }

  private async dismissOptionalOverlays(): Promise<void> {
    const cookieAccept = this.page.locator('#oPrivallyApp-AcceptLink');
    if (await cookieAccept.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await cookieAccept.click();
    }

    const pushFrame = this.page.frameLocator('iframe[src*="vendavalida.com.br"]');
    const pushClose = pushFrame.locator('.push-container__btn-close');
    if (await pushClose.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await pushClose.click();
    }
  }

  private async selectAirport(
    field: 'flightSearchOrigin' | 'flightSearchDestination',
    place: string,
    airportCode: string
  ): Promise<void> {
    const section = this.page.locator(`[data-zt="${field}"]`);
    const input = section.locator('[data-zt="airportSelectionInput"]').first();
    await input.fill(place);
    await this.page.getByText(new RegExp(`- ${airportCode}$`)).first().click();
  }

  private async selectDates(departure: Date, returnDate?: Date): Promise<void> {
    await this.page.locator('[data-zt="calendarTrigger"]').click();
    await this.page.locator(`[data-zt="calendarDate"][data-zt-value="${this.toIsoDate(departure)}"]`).click();
    if (returnDate) {
      await this.page.locator(`[data-zt="calendarDate"][data-zt-value="${this.toIsoDate(returnDate)}"]`).click();
    }
  }

  private async selectPassengers(adults: number, children: number, infants: number): Promise<void> {
    await this.page.locator('[data-zt="passengersConfigTrigger"]').click();
    await this.addPassengers('Adultos (+12 anos)', adults - 1);
    await this.addPassengers('Crianças (2-11 anos)', children);
    await this.addPassengers('Bebês (0-23 meses)', infants);

    const confirm = this.page.getByRole('button', { name: 'Aplicar seleção' });
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    }
  }

  private async addPassengers(category: string, amount: number): Promise<void> {
    const button = this.page
      .getByText(category, { exact: true })
      .locator('..')
      .getByRole('button', { name: '+' });
    for (let index = 0; index < amount; index += 1) {
      await button.click();
    }
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
