import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import {
  ApartmentPlan,
  CreateProjectDto,
  InvestmentCard,
  PaymentPlan,
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

/** The `{Base}Ge`, `{Base}En`, `{Base}Ru` values of one translated field. */
type TranslatedValues<Base extends string> = {
  [Key in `${Base}${Language['suffix']}`]: string;
};

/** The whole dialog form. Every section component takes it as an input. */
export type ProjectForm = ReturnType<typeof buildProjectForm>;

export type DescriptionCardForm = ReturnType<typeof buildDescriptionCard>;
export type InvestmentCardForm = ReturnType<typeof buildInvestmentCard>;
export type ApartmentPlanForm = ReturnType<typeof buildApartmentPlan>;
export type ApartmentCardForm = ReturnType<typeof buildApartmentCard>;
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
      ...translatedText('projectDescription', description),
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
    apartmentPlans: new FormArray<ApartmentPlanForm>(
      (project?.apartmentPlans ?? []).map((plan) => buildApartmentPlan(plan)),
    ),
    paymentPlans: new FormArray<PaymentPlanForm>(
      (project?.paymentPlans ?? []).map((plan) => buildPaymentPlan(plan)),
    ),
  });
}

/** One card of the summary row under the hero location, holding rich text HTML. */
export function buildDescriptionCard(card?: ProjectDescriptionCard) {
  return new FormGroup({
    ...translatedText('projectDescriptionCardContent', card),
  });
}

/** One tile of the investment breakdown grid, holding rich text HTML. */
export function buildInvestmentCard(card?: InvestmentCard) {
  return new FormGroup({
    ...translatedText('investmentCardContent', card),
  });
}

/**
 * One apartment type of the floor plans tab. The images are uploaded to the backend before the
 * project is saved, so the control holds the ids they came back with.
 */
export function buildApartmentPlan(plan?: ApartmentPlan) {
  return new FormGroup({
    apartmentType: requiredText(plan?.apartmentType),
    apartmentPlanImages: new FormControl<string[]>([...(plan?.apartmentPlanImages ?? [])], {
      nonNullable: true,
    }),
    apartmentCards: new FormArray<ApartmentCardForm>(
      apartmentCardRows(plan).map((card) => buildApartmentCard(card)),
    ),
  });
}

/** One highlight card of an apartment type, holding rich text HTML. */
export function buildApartmentCard(card?: ApartmentCardRow) {
  return new FormGroup({
    ...translatedText('apartmentCards', card),
  });
}

/** One card across the three languages, the shape the dialog edits a card in. */
type ApartmentCardRow = TranslatedValues<'apartmentCards'>;

type ApartmentPlanValue = ReturnType<ApartmentPlanForm['getRawValue']>;

/**
 * The backend keeps one array per language, all in the same order, while the dialog edits a card
 * at a time. A short array means a card was never translated, so it is filled in as empty.
 */
function apartmentCardRows(plan?: ApartmentPlan): readonly ApartmentCardRow[] {
  const ge = plan?.apartmentCardsGe ?? [];
  const en = plan?.apartmentCardsEn ?? [];
  const ru = plan?.apartmentCardsRu ?? [];

  return Array.from({ length: Math.max(ge.length, en.length, ru.length) }, (_, index) => ({
    apartmentCardsGe: ge[index] ?? '',
    apartmentCardsEn: en[index] ?? '',
    apartmentCardsRu: ru[index] ?? '',
  }));
}

/** Turns the edited cards back into the one-array-per-language shape the backend takes. */
function toApartmentPlan(plan: ApartmentPlanValue): ApartmentPlan {
  const cards = plan.apartmentCards;

  return {
    apartmentType: plan.apartmentType,
    apartmentPlanImages: plan.apartmentPlanImages,
    apartmentCardsGe: cards.map((card) => card.apartmentCardsGe),
    apartmentCardsEn: cards.map((card) => card.apartmentCardsEn),
    apartmentCardsRu: cards.map((card) => card.apartmentCardsRu),
  };
}

/** One row of the payment plan table. */
export function buildPaymentPlan(plan?: PaymentPlan) {
  return new FormGroup({
    ...translatedText('paymentStage', plan),
    ...translatedText('when', plan),
    paymentAmount: requiredNumber(plan?.paymentAmount ?? 0, Validators.min(0)),
  });
}

/** The gallery images are uploaded outside the form, so they are passed in separately. */
export function toCreateProjectDto(
  form: ProjectForm,
  projectImages: readonly string[],
): CreateProjectDto {
  const { apartmentPlans, ...fields } = form.getRawValue();

  return {
    ...fields,
    projectImages: [...projectImages],
    apartmentPlans: apartmentPlans.map((plan) => toApartmentPlan(plan)),
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
