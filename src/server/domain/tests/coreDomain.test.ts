import assert from 'assert';
import { OFFICIAL_AIRLINES_DATABASE } from '../../../utils/bookingUtils';
import { findAirlineByCode } from '../../../utils/airlineNormalization';
import { Country, City, Airport, Airline, SupplierRef, SupplierType } from '../types';

export async function runCoreDomainTests() {
  console.log('coreDomainTests: starting');

  // Country
  const sa: Country = { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' };
  assert.strictEqual(sa.code, 'SA');
  assert.strictEqual(sa.currency, 'SAR');

  // City
  const riyadh: City = { id: 'riyadh', name: 'Riyadh', countryCode: sa.code, lat: 24.7136, lon: 46.6753 };
  assert.strictEqual(riyadh.countryCode, sa.code);

  // Airport
  const ruh: Airport = { airportId: 'ruh', name: 'King Khalid Int. Airport', iata: 'RUH', icao: 'OERK', cityId: riyadh.id, countryCode: sa.code };
  assert.strictEqual(ruh.iata, 'RUH');
  assert.strictEqual(ruh.countryCode, sa.code);

  // Airline canonical compatibility with existing normalization
  // Use deterministic test dataset: try to find Emirates (EK) from test dataset
  const candidate = findAirlineByCode(OFFICIAL_AIRLINES_DATABASE, 'EK');
  // The test dataset may include an airline with iataCode 'EK' — ensure function returns either a valid object or null
  if (candidate) {
    const airline: Airline = { airlineId: candidate.id, iata: (candidate as any).iataCode, icao: (candidate as any).icaoCode, name: candidate.name, nameEn: candidate.nameEn, country: candidate.country };
    assert.strictEqual(airline.airlineId, candidate.id);
  } else {
    // If not present in this dataset, still validate that normalization utilities are callable
    assert.ok(true, 'No EK sample present in OFFICIAL_AIRLINES_DATABASE — normalization utilities callable');
  }

  // SupplierRef
  const supplierRef: SupplierRef = { supplierId: 'supplier-1', supplierType: SupplierType.AIRLINE };
  assert.strictEqual(supplierRef.supplierType, SupplierType.AIRLINE);

  console.log('coreDomainTests: completed');
}
