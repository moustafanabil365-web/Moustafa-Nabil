import { OfficialHotelChain } from './bookingUtils';

export interface HotelClassificationResult {
  serviceLevel?: OfficialHotelChain['serviceLevel'];
  propertyType?: OfficialHotelChain['propertyType'];
  starRating?: OfficialHotelChain['starRating'];
  hotelSegment?: OfficialHotelChain['hotelSegment'];
  verified: boolean;
  confidence: number; // 0.0 - 1.0
  dataSource?: string;
}

/**
 * Deterministic hotel classifier.
 * - Trusts explicit structured fields if present.
 * - Does NOT call external services or infer missing values.
 * - Returns verified=false and confidence=0 when insufficient info.
 */
export function classifyHotel(hotel: Partial<OfficialHotelChain>): HotelClassificationResult {
  const res: HotelClassificationResult = { verified: false, confidence: 0 };

  if (hotel.serviceLevel) {
    res.serviceLevel = hotel.serviceLevel;
    res.verified = true;
    res.confidence = 1;
    res.dataSource = hotel.dataSource || 'embedded';
  }
  if (hotel.propertyType) {
    res.propertyType = hotel.propertyType;
    res.verified = res.verified || true;
    res.confidence = Math.max(res.confidence, 1);
    res.dataSource = res.dataSource || hotel.dataSource || 'embedded';
  }
  if (hotel.starRating) {
    res.starRating = hotel.starRating;
    res.verified = res.verified || true;
    res.confidence = Math.max(res.confidence, 1);
    res.dataSource = res.dataSource || hotel.dataSource || 'embedded';
  }
  if (hotel.hotelSegment) {
    res.hotelSegment = hotel.hotelSegment;
    res.verified = res.verified || true;
    res.confidence = Math.max(res.confidence, 1);
    res.dataSource = res.dataSource || hotel.dataSource || 'embedded';
  }

  return res;
}
