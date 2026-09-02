import { OfficialAirline } from './bookingUtils';

export interface AirlineClassification {
  serviceLevel?: OfficialAirline['serviceLevel'];
  businessModel?: OfficialAirline['businessModel'];
  operationType?: OfficialAirline['operationType'];
  networkType?: OfficialAirline['networkType'];
  verified: boolean;
  confidence: number; // 0.0 - 1.0
  dataSource?: string;
}

/**
 * Deterministic classifier that only uses structured properties already present on the airline object.
 * - Does NOT call external services or LLMs
 * - Does NOT guess when information is missing
 * - If a field is already present, it is returned as-is with high confidence
 * - Otherwise returns verified=false and confidence=0
 */
export function classifyAirline(airline: Partial<OfficialAirline>): AirlineClassification {
  const result: AirlineClassification = {
    verified: false,
    confidence: 0,
  };

  // If the airline already has explicit structured fields, trust them deterministically
  if (airline.serviceLevel) {
    result.serviceLevel = airline.serviceLevel;
    result.verified = true;
    result.confidence = 1;
    result.dataSource = airline.dataSource || 'embedded';
  }

  if (airline.businessModel) {
    result.businessModel = airline.businessModel;
    // if we already set verified above keep it, otherwise set from businessModel
    result.verified = result.verified || true;
    result.confidence = Math.max(result.confidence, 1);
    result.dataSource = result.dataSource || airline.dataSource || 'embedded';
  }

  if (airline.operationType) {
    result.operationType = airline.operationType;
    result.verified = result.verified || true;
    result.confidence = Math.max(result.confidence, 1);
    result.dataSource = result.dataSource || airline.dataSource || 'embedded';
  }

  if (airline.networkType) {
    result.networkType = airline.networkType;
    result.verified = result.verified || true;
    result.confidence = Math.max(result.confidence, 1);
    result.dataSource = result.dataSource || airline.dataSource || 'embedded';
  }

  // If none of the structured classification fields exist, return unverified with confidence 0
  return result;
}
