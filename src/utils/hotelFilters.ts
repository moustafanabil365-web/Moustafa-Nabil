import { OfficialHotelChain } from './bookingUtils';

export function filterHotelsByServiceLevel(hotels: OfficialHotelChain[], level: NonNullable<OfficialHotelChain['serviceLevel']>) {
  return hotels.filter((h) => h.serviceLevel === level);
}

export function filterHotelsByPropertyType(hotels: OfficialHotelChain[], type: NonNullable<OfficialHotelChain['propertyType']>) {
  return hotels.filter((h) => h.propertyType === type);
}

export function filterHotelsByStarRating(hotels: OfficialHotelChain[], stars: number) {
  return hotels.filter((h) => h.starRating === stars);
}

export function filterHotelsBySegment(hotels: OfficialHotelChain[], segment: NonNullable<OfficialHotelChain['hotelSegment']>) {
  return hotels.filter((h) => h.hotelSegment === segment);
}
