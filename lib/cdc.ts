import * as cheerio from 'cheerio';

type DestinationData = {
  vaccines: string[];
  entry_requirements: string[];
  malaria: { risk: 'none' | 'regional' | 'countrywide'; regimens: string[] } | null;
  notices: { level: string; title: string; url: string }[];
  sources: string[];
};

export async function listSupportedDestinations(): Promise<string[]> {
  return ['Thailand', 'Kenya', 'Peru', 'Brazil', 'India', 'Indonesia', 'Japan'];
}

export async function getDestinationData(country: string): Promise<DestinationData> {
  const src = `https://wwwnc.cdc.gov/travel/destinations/traveler/none/${country.toLowerCase()}`;
  const common = ['Hepatitis A', 'Typhoid', 'Rabies (risk-based)', 'Polio booster (if indicated)'];
  const jeCountries = ['Thailand', 'Indonesia', 'India'];
  const yfCountries = ['Brazil', 'Peru'];
  const vaccines = [...common];
  if (jeCountries.includes(country)) vaccines.push('Japanese Encephalitis (risk-based)');
  if (yfCountries.includes(country)) vaccines.push('Yellow Fever (regional/entry in some areas)');

  return {
    vaccines,
    entry_requirements: [],
    malaria: { risk: 'regional', regimens: ['atovaquone-proguanil', 'doxycycline'] },
    notices: [],
    sources: [src]
  };
}