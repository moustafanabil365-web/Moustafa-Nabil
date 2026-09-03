import {
  findAirlineByIata,
  findAirlineByIcao,
  findAirlineByQuery,
  normalizeAirlineQuery,
  ENHANCED_AIRLINES_DATABASE,
} from '../utils/airlineNormalization';

export function runAirlineTests(): { name: string; passed: boolean; message?: string }[] {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    results.push({
      name: `[Airlines] ${name}`,
      passed: Boolean(condition),
      message: condition ? undefined : (message || 'Assertion failed'),
    });
  }

  // 1. IATA Lookup
  const saudiaIata = findAirlineByIata('SV');
  assert('IATA lookup SV returns Saudia', saudiaIata?.id === 'saudia');

  const emiratesIata = findAirlineByIata('ek'); // case-insensitivity
  assert('IATA lookup lowercase "ek" returns Emirates', emiratesIata?.id === 'emirates');

  const qatarIata = findAirlineByIata('QR');
  assert('IATA lookup QR returns Qatar Airways', qatarIata?.id === 'qatar');

  const flynasIata = findAirlineByIata('XY');
  assert('IATA lookup XY returns flynas', flynasIata?.id === 'flynas');

  // 2. ICAO Lookup
  const saudiaIcao = findAirlineByIcao('SVA');
  assert('ICAO lookup SVA returns Saudia', saudiaIcao?.id === 'saudia');

  const lufthansaIcao = findAirlineByIcao('dlh'); // case-insensitivity
  assert('ICAO lookup lowercase "dlh" returns Lufthansa', lufthansaIcao?.id === 'lufthansa');

  // 3. Normalized Name & Query Matching
  const arabicSaudia = findAirlineByQuery('الخطوط السعودية');
  assert('Arabic query "الخطوط السعودية" matches Saudia', arabicSaudia?.id === 'saudia');

  const arabicEmirates = findAirlineByQuery('طيران الامارات');
  assert('Arabic query "طيران الامارات" matches Emirates', arabicEmirates?.id === 'emirates');

  const englishQatar = findAirlineByQuery('  qatar   airways  ');
  assert('Whitespace-padded "  qatar   airways  " matches Qatar Airways', englishQatar?.id === 'qatar');

  const punctuatedQuery = findAirlineByQuery('fly-nas!');
  assert('Punctuated query "fly-nas!" matches flynas', punctuatedQuery?.id === 'flynas');

  // 4. Service Level & Classification
  assert('Saudia service level is PREMIUM', saudiaIata?.serviceLevel === 'PREMIUM');
  assert('Flynas service level is BUDGET', flynasIata?.serviceLevel === 'BUDGET');

  // 5. Unknown airline handling
  const unknownIata = findAirlineByIata('ZZ');
  assert('Unknown IATA "ZZ" returns undefined safely', unknownIata === undefined);

  const unknownQuery = findAirlineByQuery('NonExistentAirlines999');
  assert('Unknown airline query returns undefined safely', unknownQuery === undefined);

  const emptyQuery = findAirlineByQuery('');
  assert('Empty query returns undefined safely', emptyQuery === undefined);

  // 6. Normalization helper verification
  assert(
    'normalizeAirlineQuery strips accents and punctuation',
    normalizeAirlineQuery('  Émirates - Airlines!  ') === 'emirates airlines'
  );

  return results;
}
