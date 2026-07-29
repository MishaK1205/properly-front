/** Static labels and editorial boilerplate for the property detail page. */

export const YIELD_DISCLAIMER =
  'Yield projections based on current Batumi STR market data. Actual returns may vary.';

export const OVERVIEW_LABELS = {
  buildingType: 'Building type',
  totalFloors: 'Total floors',
  unitsInBuilding: 'Units in building',
  unitSizes: 'Unit sizes available',
  finishing: 'Finishing',
  furniturePackage: 'Furniture package',
  strManagement: 'STR management on-site',
  distanceToSea: 'Distance to sea',
  distanceToCityCenter: 'Distance to city center',
} as const;

export const DEVELOPER_LABELS = {
  projectsCompleted: 'Projects completed',
  unitsDelivered: 'Units delivered',
  activeProjects: 'Active projects',
} as const;

export const FORM_TRUST_ITEMS: readonly string[] = [
  '✓ Free for buyers',
  '✓ No spam',
  '✓ Giorgi responds within 24h',
];
