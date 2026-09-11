import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { Language, LANGUAGES } from '../../shared/languages';
import { ProjectForm } from './project-form';

export type ProjectSectionId =
  | 'hero'
  | 'our-take'
  | 'numbers'
  | 'overview'
  | 'floor-plans'
  | 'payment';

/** One step of the dialog. Only the active step is rendered, so the form stays short. */
export interface ProjectSection {
  readonly id: ProjectSectionId;
  readonly icon: string;
  /** Short name, shown in the step rail. */
  readonly label: string;
  /** Where the step ends up on the property page, shown under the step heading. */
  readonly summary: string;
  /** The form controls this step edits, named without their language suffix. */
  readonly controls: readonly string[];
}

/** A step plus the position and validity the rail needs to render it. */
export interface ProjectStep extends ProjectSection {
  readonly step: number;
  readonly active: boolean;
  /** Whether the step still holds required fields that are empty. */
  readonly missing: boolean;
}

/** The steps follow the property page from top to bottom. */
export const PROJECT_SECTIONS: readonly ProjectSection[] = [
  {
    id: 'hero',
    icon: 'photo_library',
    label: 'Hero',
    summary: 'The gallery and the summary card at the top of the page.',
    controls: [
      'projectName',
      'company',
      'projectLocation',
      'projectLatitude',
      'projectLongitude',
      'projectDescriptionCards',
      'projectAdvantages',
      'paymentDescription',
    ],
  },
  {
    id: 'our-take',
    icon: 'notes',
    label: 'Our Take',
    summary: 'The write-up and the verification checklist beside it.',
    controls: ['projectDescription', 'verificationChecklist'],
  },
  {
    id: 'numbers',
    icon: 'trending_up',
    label: 'The Numbers',
    summary: 'The investment breakdown grid.',
    controls: ['investmentCards'],
  },
  {
    id: 'overview',
    icon: 'apartment',
    label: 'Overview',
    summary: 'The fact rows of the Overview tab. Empty rows are hidden on the page.',
    controls: [
      'buildingType',
      'totalFloors',
      'unitsInBuilding',
      'unitSizesAvailable',
      'finishing',
      'furniturePackage',
      'strManagementOnSite',
      'distanceToSea',
      'distanceToCityCenter',
    ],
  },
  {
    id: 'floor-plans',
    icon: 'architecture',
    label: 'Floor Plans',
    summary: 'The plan images of each apartment type.',
    controls: ['apartmentPlans'],
  },
  {
    id: 'payment',
    icon: 'payments',
    label: 'Payment Plan',
    summary: 'The stage table and the notes under it.',
    controls: ['paymentPlans', 'paymentAdvantages'],
  },
];

export function isSectionInvalid(form: ProjectForm, section: ProjectSection): boolean {
  return sectionControls(form, section).some(({ control }) => control.invalid);
}

/**
 * Language of the first empty required field of a step, so the switcher can jump to it.
 * `null` when the missing field is not a translated one.
 */
export function firstMissingLanguage(
  form: ProjectForm,
  section: ProjectSection,
): Language['suffix'] | null {
  for (const { name, control } of sectionControls(form, section)) {
    for (const invalid of invalidControlNames(control, name)) {
      const suffix = languageSuffix(invalid);
      if (suffix) {
        return suffix;
      }
    }
  }
  return null;
}

/** Languages still missing input, flagged on the switcher once a save was attempted. */
export function languagesWithMissingFields(form: ProjectForm): ReadonlySet<Language['suffix']> {
  const missing = new Set<Language['suffix']>();
  for (const name of invalidControlNames(form)) {
    const suffix = languageSuffix(name);
    if (suffix) {
      missing.add(suffix);
    }
  }
  return missing;
}

/** The controls a step edits, with the translated ones expanded over the language suffixes. */
function sectionControls(
  form: ProjectForm,
  section: ProjectSection,
): readonly { readonly name: string; readonly control: AbstractControl }[] {
  const found: { name: string; control: AbstractControl }[] = [];

  for (const base of section.controls) {
    for (const name of [base, ...LANGUAGES.map((language) => `${base}${language.suffix}`)]) {
      const control: AbstractControl | null = form.get(name);
      if (control) {
        found.push({ name, control });
      }
    }
  }
  return found;
}

/** Names of the invalid leaf controls under `control`, including the one passed in. */
function invalidControlNames(control: AbstractControl, name = ''): readonly string[] {
  if (control.valid) {
    return [];
  }
  if (control instanceof FormGroup) {
    return Object.entries(control.controls).flatMap(([key, child]) =>
      invalidControlNames(child, key),
    );
  }
  if (control instanceof FormArray) {
    // Rows of an array share the name of the array itself, which carries no language suffix.
    return control.controls.flatMap((child) => invalidControlNames(child, name));
  }
  return [name];
}

function languageSuffix(controlName: string): Language['suffix'] | null {
  return LANGUAGES.find((language) => controlName.endsWith(language.suffix))?.suffix ?? null;
}
