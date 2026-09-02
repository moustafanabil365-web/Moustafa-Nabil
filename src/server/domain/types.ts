/* Canonical domain types for TraviQ — EP0-001
 * This file defines server-side interfaces and enums for Products, Suppliers,
 * Quotes, Sessions, Bookings, CancellationPolicy, Money, and PriceBreakdown.
 * These are compile-time TypeScript types only (no runtime validation in this ticket).
 */

export type UUID = string;

export enum ProductType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  TRANSFER = 'TRANSFER',
  E_SIM = 'E_SIM',
  TOUR = 'TOUR',
  ACTIVITY = 'ACTIVITY',
  ATTRACTION = 'ATTRACTION',
  CAR_RENTAL = 'CAR_RENTAL',
  LOUNGE = 'LOUNGE',
  EXTRA = 'EXTRA',
}

export enum AvailabilityModel {
  PER_UNIT = 'PER_UNIT',         // e.g., rooms
  PER_SEAT = 'PER_SEAT',         // e.g., flight seats
  PER_DATE = 'PER_DATE',         // availability by date
  INVENTORY_POOL = 'INVENTORY_POOL',
}

export enum SessionStatus {
  DRAFT = 'DRAFT',
  PENDING_REVALIDATION = 'PENDING_REVALIDATION',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  BOOKING_IN_PROGRESS = 'BOOKING_IN_PROGRESS',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export enum BookingStatus {
  INIT = 'INIT',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  BOOKING_PENDING = 'BOOKING_PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLATION_PENDING = 'CANCELLATION_PENDING',
  CANCELLED = 'CANCELLED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum SupplierCapability {
  SEARCH = 'SEARCH',
  QUOTE = 'QUOTE',
  HOLD = 'HOLD',
  BOOK = 'BOOK',
  GET_BOOKING = 'GET_BOOKING',
  CANCEL = 'CANCEL',
  REFUND = 'REFUND',
}

export type Currency = string; // ISO4217, e.g., 'USD', 'EUR'

// Money uses integer minor units only. No floats.
export interface Money {
  amountMinor: number; // integer in minor units (e.g., cents)
  currency: Currency;
}

export interface TaxLine {
  type: string;
  amount: Money;
}

export interface FeeLine {
  type: string;
  amount: Money;
}

export interface PriceBreakdown {
  baseAmount: Money;
  taxes?: TaxLine[];
  fees?: FeeLine[];
  markup?: Money;    // platform markup
  discount?: Money;  // applied discount
  supplierCost?: Money; // supplier-side cost
  totalCustomerPrice: Money; // final customer price (base + taxes + fees + markup - discount)
}

export interface LocalizedString {
  [locale: string]: string; // e.g., 'en': 'Hotel ABC', 'ar': 'فندق'
}

export interface ImageAsset {
  url: string;
  caption?: LocalizedString;
  order?: number;
}

export interface Destination {
  countryCode?: string; // ISO3166
  region?: string;
  city?: string;
  lat?: number;
  lon?: number;
  placeId?: string; // external place identifier
}

export interface TravelProduct {
  productId: UUID;
  productType: ProductType;
  supplierId: UUID;
  supplierProductCode?: string;
  title: LocalizedString;
  description?: LocalizedString;
  images?: ImageAsset[];
  destination?: Destination;
  location?: string; // free-form address or meeting point
  availabilityModel?: AvailabilityModel;
  metadata?: Record<string, any>; // type-specific JSON
  metadataVersion?: string;
  version?: number; // optimistic locking version
  createdAt?: string; // ISO timestamp
  updatedAt?: string;
  isPublished?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  tags?: string[];
}

export interface Supplier {
  supplierId: UUID;
  name: string;
  legalName?: string;
  primaryCountry?: string;
  defaultCurrency?: Currency;
  capabilities: SupplierCapability[];
  status?: 'ACTIVE' | 'SUSPENDED' | 'MAINTENANCE' | 'TEST';
  // configuration boundary: opaque pointer to credentials stored server-side (never exposed)
  credentialRef?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export enum QuoteStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  INVALIDATED = 'INVALIDATED',
  BOOKED = 'BOOKED',
}

export interface AvailabilitySnapshot {
  availableUnits?: number;
  inventoryRef?: string;
  expiresAt?: string; // ISO
}

export interface Quote {
  quoteId: UUID;
  productId: UUID;
  productType: ProductType;
  supplierId: UUID;
  priceSnapshot: PriceBreakdown;
  availabilitySnapshot?: AvailabilitySnapshot;
  expiration?: string; // ISO timestamp
  termsRef?: string; // cancellation policy id
  quoteStatus: QuoteStatus;
  createdAt?: string;
  idempotencyKey?: string;
  sourceTrace?: {
    adapterRequestId?: string;
    supplierResponseId?: string;
  };
}

export interface TravelerInfo {
  travelerId: UUID;
  firstName?: string;
  lastName?: string;
  dob?: string; // ISO date
  passportNumber?: string;
  nationality?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface SessionLine {
  lineId: UUID;
  productId: UUID;
  quoteId?: UUID;
  quantity?: number;
  travelerRefs?: UUID[]; // references to TravelerInfo
}

export interface RevalidationResult {
  revalidatedAt: string;
  quoteId: UUID;
  priceChanged?: boolean;
  availabilityChanged?: boolean;
  oldPrice?: PriceBreakdown;
  newPrice?: PriceBreakdown;
}

export interface BookingSession {
  sessionId: UUID;
  customerId?: UUID; // optional guest flow
  guestEmail?: string;
  status: SessionStatus;
  createdAt?: string;
  lastActiveAt?: string;
  expiresAt?: string;
  lines: SessionLine[];
  travelers?: TravelerInfo[];
  currency?: Currency;
  priceSnapshot?: PriceBreakdown;
  paymentReference?: string; // provider payment intent id or token
  revalidationHistory?: RevalidationResult[];
  version?: number;
}

export interface Booking {
  bookingId: UUID;
  sessionId: UUID;
  supplierBookingRef?: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
  lines?: SessionLine[]; // snapshot of booked lines
  priceSnapshot?: PriceBreakdown;
  customerContact?: { email?: string; phone?: string };
  supplierResponseRaw?: any; // for reconciliation
  version?: number;
}

export interface CancellationRule {
  relativeTo: 'BOOKING' | 'CHECKIN' | 'DEPARTURE' | 'START';
  offsetSeconds?: number; // negative means before event
  refundablePercentage: number; // 0-100
  feeAmount?: Money; // fixed fee
}

export interface CancellationPolicy {
  policyId: UUID;
  name?: string;
  rules: CancellationRule[]; // ordered by precedence
  createdAt?: string;
}
