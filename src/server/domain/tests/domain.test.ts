import assert from 'assert';
import { v4 as uuidv4 } from 'uuid';
import {
  ProductType,
  AvailabilityModel,
  Money,
  PriceBreakdown,
  TravelProduct,
  Quote,
  BookingSession,
  Booking,
  SupplierCapability,
  Supplier,
} from '../types';

export async function runDomainTests() {
  console.log('domainTests: starting');

  // Money shape
  const m: Money = { amountMinor: 1000, currency: 'USD' };
  assert.strictEqual(m.amountMinor, 1000);
  assert.strictEqual(m.currency, 'USD');

  // Flight product
  const flight: TravelProduct = {
    productId: uuidv4(),
    productType: ProductType.FLIGHT,
    supplierId: uuidv4(),
    title: { en: 'Flight ABC', ar: 'رحلة ABC' },
    metadata: {
      carrierIata: 'EK',
      flightNumber: '202',
    },
    availabilityModel: AvailabilityModel.PER_SEAT,
    createdAt: new Date().toISOString(),
  };
  assert.strictEqual(flight.productType, ProductType.FLIGHT);

  // Hotel product
  const hotel: TravelProduct = {
    productId: uuidv4(),
    productType: ProductType.HOTEL,
    supplierId: uuidv4(),
    title: { en: 'Hotel ABC' },
    availabilityModel: AvailabilityModel.PER_UNIT,
    metadataVersion: '1',
  };
  assert.strictEqual(hotel.productType, ProductType.HOTEL);

  // Transfer product
  const transfer: TravelProduct = {
    productId: uuidv4(),
    productType: ProductType.TRANSFER,
    supplierId: uuidv4(),
    title: { en: 'Airport Transfer' },
    availabilityModel: AvailabilityModel.INVENTORY_POOL,
  };

  // Tour/Activity product
  const tour: TravelProduct = {
    productId: uuidv4(),
    productType: ProductType.TOUR,
    supplierId: uuidv4(),
    title: { en: 'City Tour' },
    availabilityModel: AvailabilityModel.PER_DATE,
  };

  // Supplier shape
  const supplier: Supplier = {
    supplierId: uuidv4(),
    name: 'Mock Supplier',
    capabilities: [SupplierCapability.SEARCH, SupplierCapability.BOOK],
  };
  assert.ok(supplier.capabilities.includes(SupplierCapability.BOOK));

  // Quote shape
  const quote: Quote = {
    quoteId: uuidv4(),
    productId: flight.productId,
    productType: flight.productType,
    supplierId: flight.supplierId,
    priceSnapshot: {
      baseAmount: { amountMinor: 5000, currency: 'USD' },
      taxes: [{ type: 'VAT', amount: { amountMinor: 500, currency: 'USD' } }],
      fees: [{ type: 'Service', amount: { amountMinor: 200, currency: 'USD' } }],
      markup: { amountMinor: 100, currency: 'USD' },
      discount: { amountMinor: 0, currency: 'USD' },
      supplierCost: { amountMinor: 4800, currency: 'USD' },
      totalCustomerPrice: { amountMinor: 5800, currency: 'USD' },
    } as PriceBreakdown,
    quoteStatus: 'VALID',
    createdAt: new Date().toISOString(),
  } as Quote;

  assert.strictEqual(quote.priceSnapshot.totalCustomerPrice.amountMinor, 5800);

  // BookingSession shape
  const session: BookingSession = {
    sessionId: uuidv4(),
    status: 'DRAFT',
    lines: [
      {
        lineId: uuidv4(),
        productId: flight.productId,
        quoteId: quote.quoteId,
        quantity: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    version: 1,
  } as BookingSession;
  assert.strictEqual(session.lines.length, 1);

  // Booking shape
  const booking: Booking = {
    bookingId: uuidv4(),
    sessionId: session.sessionId,
    supplierBookingRef: 'SUPP-123',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    lines: session.lines,
  } as Booking;
  assert.strictEqual(booking.status, 'CONFIRMED');

  console.log('domainTests: completed');
}
