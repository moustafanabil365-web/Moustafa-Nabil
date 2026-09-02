import { OfficialAirline } from './bookingUtils';

export function filterAirlinesByServiceLevel(airlines: OfficialAirline[], level: 'PREMIUM' | 'STANDARD' | 'ECONOMY') {
  return airlines.filter((a) => a.serviceLevel === level);
}

export function filterAirlinesByBusinessModel(
  airlines: OfficialAirline[],
  model: NonNullable<OfficialAirline['businessModel']>
) {
  return airlines.filter((a) => a.businessModel === model);
}

export function filterAirlinesByNetworkType(
  airlines: OfficialAirline[],
  network: NonNullable<OfficialAirline['networkType']>
) {
  return airlines.filter((a) => a.networkType === network);
}

export function filterAirlinesByOperationType(
  airlines: OfficialAirline[],
  op: NonNullable<OfficialAirline['operationType']>
) {
  return airlines.filter((a) => a.operationType === op);
}

export function filterAirlinesByAlliance(airlines: OfficialAirline[], alliance: string) {
  return airlines.filter((a) => a.alliance === alliance);
}
