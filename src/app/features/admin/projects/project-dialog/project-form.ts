import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import {
  CreateProjectDto,
  InvestmentCard,
  PaymentPlan,
  PricingBySquareMeter,
  ProjectDescriptionCard,
  ProjectResponse,
} from '../../../../core/models/api.models';
import { Language, LANGUAGES } from '../../shared/languages';

/** Batumi city centre, used as the starting point for a new project. */
const DEFAULT_LATITUDE = 41.6461;
const DEFAULT_LONGITUDE = 41.6399;

/** The `{Base}Ge`, `{Base}En`, `{Base}Ru` controls of one translated field. */
type TranslatedControls<Base extends string, Value> = {
  [Key in `${Base}${Language['suffix']}`]: FormControl<Value>;
};

/** The whole dialog form. Every section component takes it as an input. */
export type ProjectForm = ReturnType<typeof buildProjectForm>;

export type DescriptionCardForm = ReturnType<typeof buildDescriptionCard>;
export type InvestmentCardForm = ReturnType<typeof buildInvestmentCard>;
export type PricingRowForm = ReturnType<typeof buildPricingRow>;
export type PaymentPlanForm = ReturnType<typeof buildPaymentPlan>;

export function buildProjectForm(project: ProjectResponse | null) {
  const description = project?.projectDescription;

  return new FormGroup({
    projectName: requiredText(project?.projectName),
    company: requiredText(project?.companyInfo?._id),
    ...translatedText('projectLocation', project),
    projectLatitude: requiredNumber(
      project?.projectLatitude ?? DEFAULT_LATITUDE,
      Validators.min(-90),
      Validators.max(90),
    ),
    projectLongitude: requiredNumber(
      project?.projectLongitude ?? DEFAULT_LONGITUDE,
      Validators.min(-180),
      Validators.max(180),
    ),
    ...translatedText('buildingType', project),
    totalFloors: requiredNumber(project?.totalFloors ?? 0, Validators.min(0)),
    unitsInBuilding: requiredNumber(project?.unitsInBuilding ?? 0, Validators.min(0)),
    unitSizesAvailable: requiredText(project?.unitSizesAvailable),
    ...translatedText('finishing', project),
    ...translatedText('furniturePackage', project),
    ...translatedText('strManagementOnSite', project),
    distanceToSea: requiredText(project?.distanceToSea),
    distanceToCityCenter: requiredText(project?.distanceToCityCenter),
    ...translatedText('paymentDescription', project),
    projectDescription: new FormGroup({
      ...translatedText('projectDescriptionTitle', description),
      ...translatedText('projectDescriptionContent', description),
      ...translatedText('projectShortDescription', description),
    }),
    ...translatedLists('projectAdvantages', project),
    ...translatedLists('verificationChecklist', project),
    ...translatedLists('paymentAdvantages', project),
    projectDescriptionCards: new FormArray<DescriptionCardForm>(
      (project?.projectDescriptionCards ?? []).map((card) => buildDescriptionCard(card)),
    ),
    investmentCards: new FormArray<InvestmentCardForm>(
      (project?.investmentCards ?? []).map((card) => buildInvestmentCard(card)),
    ),
    pricingBySquareMeters: new FormArray<PricingRowForm>(
      (project?.pricingBySquareMeters ?? []).map((row) => buildPricingRow(row)),
    ),
    paymentPlans: new FormArray<PaymentPlanForm>(
      (project?.paymentPlans ?? []).map((plan) => buildPaymentPlan(plan)),
    ),
  });
}

/** One card of the summary row under the hero location. */
export function buildDescriptionCard(card?: ProjectDescriptionCard) {
  return new FormGroup({
    ...translatedText('projectDescriptionCardTitle', card),
    ...translatedText('projectDescriptionCardContent', card),
    ...translatedText('projectDescriptionCardDescription', card),
  });
}

/** One tile of the investment breakdown grid. */
export function buildInvestmentCard(card?: InvestmentCard) {
  return new FormGroup({
    ...translatedText('investmentCardTitle', card),
    ...translatedText('investmentCardContent', card),
    ...translatedText('investmentCardDescription', card),
  });
}

/** One option of the unit size selector on the floor plans tab. */
export function buildPricingRow(row?: PricingBySquareMeter) {
  return new FormGroup({
    squareMeterRange: requiredText(row?.squareMeterRange),
    startingPrice: requiredNumber(row?.startingPrice ?? 0, Validators.min(0)),
  });
}

/** One row of the payment plan table. */
export function buildPaymentPlan(plan?: PaymentPlan) {
  return new FormGroup({
    ...translatedText('paymentStage', plan),
    ...translatedText('when', plan),
    paymentAmount: requiredNumber(plan?.paymentAmount ?? 0, Validators.min(0)),
  });
}

/** The images are uploaded outside the form, so they are passed in separately. */
export function toCreateProjectDto(
  form: ProjectForm,
  projectImages: readonly string[],
  floorPlanImages: readonly string[],
): CreateProjectDto {
  return {
    ...form.getRawValue(),
    projectImages: [...projectImages],
    floorPlanImages: [...floorPlanImages],
  };
}

function requiredText(value?: string): FormControl<string> {
  return new FormControl(value ?? '', {
    nonNullable: true,
    validators: Validators.required,
  });
}

function requiredNumber(value: number, ...validators: ValidatorFn[]): FormControl<number> {
  return new FormControl(value, {
    nonNullable: true,
    validators: [Validators.required, ...validators],
  });
}

function translatedText<Base extends string>(
  base: Base,
  source?: object | null,
): TranslatedControls<Base, string> {
  const values = (source ?? {}) as Record<string, unknown>;
  const controls: Record<string, FormControl<string>> = {};

  for (const language of LANGUAGES) {
    const key = `${base}${language.suffix}`;
    const value = values[key];
    controls[key] = requiredText(typeof value === 'string' ? value : '');
  }
  return controls as TranslatedControls<Base, string>;
}

/** Controls backing a chip list, holding the arrays the backend expects. Not required. */
function translatedLists<Base extends string>(
  base: Base,
  source?: object | null,
): TranslatedControls<Base, string[]> {
  const values = (source ?? {}) as Record<string, unknown>;
  const controls: Record<string, FormControl<string[]>> = {};

  for (const language of LANGUAGES) {
    const key = `${base}${language.suffix}`;
    const value = values[key];
    controls[key] = new FormControl<string[]>(Array.isArray(value) ? [...value] : [], {
      nonNullable: true,
    });
  }
  return controls as TranslatedControls<Base, string[]>;
}
