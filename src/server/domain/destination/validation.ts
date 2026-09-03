/**
 * Canonical Destination Domain Validation & Integrity Checker
 * EP1-002: Verifies Destination, City, Country, and Airport relationship consistency.
 * 
 * Rules:
 * - Deterministic, non-throwing validation
 * - Checks Country -> City -> Airport relationships
 * - Validates geographic coordinates and numeric bounds
 */

import { Destination, GeoCoordinates, IdealStayDuration } from './types';
import { destinationRepository } from './repository';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Validates geographic coordinate values.
 */
export function validateCoordinates(coords?: GeoCoordinates): ValidationResult {
  if (!coords) {
    return { isValid: true, errors: [] };
  }

  const errors: string[] = [];
  if (typeof coords.latitude !== 'number' || coords.latitude < -90 || coords.latitude > 90) {
    errors.push(`Invalid latitude: ${coords.latitude}. Must be between -90 and 90.`);
  }

  if (typeof coords.longitude !== 'number' || coords.longitude < -180 || coords.longitude > 180) {
    errors.push(`Invalid longitude: ${coords.longitude}. Must be between -180 and 180.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates ideal stay duration range and logical bounds.
 */
export function validateStayDuration(duration?: IdealStayDuration): ValidationResult {
  if (!duration) {
    return { isValid: true, errors: [] };
  }

  const errors: string[] = [];
  if (duration.minDays < 1) {
    errors.push(`minDays (${duration.minDays}) must be at least 1.`);
  }

  if (duration.maxDays < duration.minDays) {
    errors.push(`maxDays (${duration.maxDays}) cannot be less than minDays (${duration.minDays}).`);
  }

  if (duration.recommendedDays < duration.minDays || duration.recommendedDays > duration.maxDays) {
    errors.push(
      `recommendedDays (${duration.recommendedDays}) must be between minDays (${duration.minDays}) and maxDays (${duration.maxDays}).`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the full domain hierarchy of a Destination:
 * Country -> City -> Airport
 */
export function validateDestinationHierarchy(dest: Destination): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Basic Identity Validation
  if (!dest.id || !dest.id.startsWith('dst_')) {
    errors.push(`Invalid DestinationId format: ${dest.id}`);
  }

  if (!dest.name || !dest.name.trim()) {
    errors.push('Destination name is required.');
  }

  if (!dest.countryCode || dest.countryCode.length !== 2) {
    errors.push(`Invalid countryCode: ${dest.countryCode}. Must be 2-letter ISO code.`);
  }

  // 2. Country Relationship Validation
  const country = destinationRepository.getCountryByCode(dest.countryCode);
  if (!country) {
    errors.push(`Country with code '${dest.countryCode}' does not exist in canonical registry.`);
  }

  // 3. City Relationship Validation (if cityId is present)
  if (dest.cityId) {
    const city = destinationRepository.getCityById(dest.cityId);
    if (!city) {
      warnings.push(`Referenced cityId '${dest.cityId}' was not found in city registry.`);
    } else if (city.countryCode.toUpperCase() !== dest.countryCode.toUpperCase()) {
      errors.push(
        `Destination countryCode '${dest.countryCode}' mismatches city countryCode '${city.countryCode}'.`
      );
    }
  }

  // 4. Primary Airport / Transit Hub Validation (if present)
  if (dest.primaryAirportIata) {
    const airport = destinationRepository.getAirportByIata(dest.primaryAirportIata);
    if (!airport) {
      warnings.push(`Primary airport with IATA code '${dest.primaryAirportIata}' is not in known airport index.`);
    } else if (airport.countryCode.toUpperCase() !== dest.countryCode.toUpperCase()) {
      warnings.push(
        `Primary airport '${dest.primaryAirportIata}' is registered under country '${airport.countryCode}', different from destination '${dest.countryCode}'.`
      );
    }
  }

  // 5. Geographic & Duration Validation
  const coordResult = validateCoordinates(dest.coordinates);
  if (!coordResult.isValid) {
    errors.push(...coordResult.errors);
  }

  const durationResult = validateStayDuration(dest.idealStayDuration);
  if (!durationResult.isValid) {
    errors.push(...durationResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
