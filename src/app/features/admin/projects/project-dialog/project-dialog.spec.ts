import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { Company, CreateProjectDto, ProjectResponse } from '../../../../core/models/api.models';
import { CompanyService } from '../../../../core/services/company.service';
import { ImageService } from '../../../../core/services/image.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ProjectDialog } from './project-dialog';

const COMPANY: Company = {
  _id: 'company-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  companyName: 'Anaklia Group',
  projectsCompleted: 12,
  unitsDelivered: 900,
  activeProjects: 3,
  operatingSince: 2011,
  companyLocationGe: 'ბათუმი',
  companyLocationEn: 'Batumi',
  companyLocationRu: 'Батуми',
  companyDescriptionGe: 'აღწერა',
  companyDescriptionEn: 'Description',
  companyDescriptionRu: 'Описание',
};

const PROJECT: ProjectResponse = {
  _id: 'project-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  companyInfo: COMPANY,
  projectName: 'Sea Tower',
  projectImages: ['image-1', 'image-2'],
  apartmentPlans: [
    {
      apartmentType: 'Studio',
      apartmentPlanImages: ['plan-1'],
      apartmentCardsGe: ['<p>ბალკონი</p>'],
      apartmentCardsEn: ['<p>Balcony</p>'],
      apartmentCardsRu: ['<p>Балкон</p>'],
    },
  ],
  projectLocationGe: 'ბათუმი, ნინოშვილის 12',
  projectLocationEn: 'Batumi, Ninoshvili 12',
  projectLocationRu: 'Батуми, Ниношвили 12',
  projectLatitude: 41.65,
  projectLongitude: 41.64,
  projectDescriptionCards: [
    {
      projectDescriptionCardContentGe: '<h3>მდებარეობა</h3><p>ისტორიული ცენტრი</p>',
      projectDescriptionCardContentEn: '<h3>Location</h3><p>Historic centre</p>',
      projectDescriptionCardContentRu: '<h3>Расположение</h3><p>Исторический центр</p>',
    },
  ],
  projectAdvantagesGe: ['ზღვასთან ახლოს'],
  projectAdvantagesEn: ['250 m to the sea'],
  projectAdvantagesRu: ['250 м до моря'],
  paymentDescriptionGe: 'გადახდის შენიშვნა',
  paymentDescriptionEn: 'Payment note',
  paymentDescriptionRu: 'Примечание об оплате',
  projectDescription: {
    projectDescriptionGe: '<h2>ჩვენი შეფასება</h2><p>ტექსტი</p>',
    projectDescriptionEn: '<h2>Our take</h2><p>Body text</p>',
    projectDescriptionRu: '<h2>Наше мнение</h2><p>Текст</p>',
    projectShortDescriptionGe: '<p>მოკლე</p>',
    projectShortDescriptionEn: '<p>Short</p>',
    projectShortDescriptionRu: '<p>Кратко</p>',
  },
  verificationChecklistGe: ['ნებართვა შემოწმებულია'],
  verificationChecklistEn: ['Construction permit verified'],
  verificationChecklistRu: ['Разрешение проверено'],
  investmentCards: [
    {
      investmentCardContentGe: '<h3>ფასი</h3><p>$75,000</p>',
      investmentCardContentEn: '<h3>Price</h3><p>$75,000</p>',
      investmentCardContentRu: '<h3>Цена</h3><p>$75,000</p>',
    },
  ],
  buildingTypeGe: 'საცხოვრებელი',
  buildingTypeEn: 'Residential',
  buildingTypeRu: 'Жилой',
  totalFloors: 24,
  unitsInBuilding: 310,
  unitSizesAvailable: '28–75 m²',
  finishingGe: 'თეთრი კარკასი',
  finishingEn: 'White frame',
  finishingRu: 'Белый каркас',
  furniturePackageGe: 'ავეჯის პაკეტი',
  furniturePackageEn: 'Furniture package',
  furniturePackageRu: 'Мебельный пакет',
  strManagementOnSiteGe: 'კი',
  strManagementOnSiteEn: 'Yes',
  strManagementOnSiteRu: 'Да',
  distanceToSea: '250 m',
  distanceToCityCenter: '2 km',
  paymentPlans: [
    {
      paymentStageGe: 'პირველი შენატანი',
      paymentStageEn: 'Down payment',
      paymentStageRu: 'Первый взнос',
      paymentAmount: 30,
      whenGe: 'ხელშეკრულებისას',
      whenEn: 'On signing',
      whenRu: 'При подписании',
    },
  ],
  paymentAdvantagesGe: ['0% განვადება'],
  paymentAdvantagesEn: ['0% interest instalments'],
  paymentAdvantagesRu: ['Рассрочка 0%'],
};

function configure(data: ProjectResponse | null) {
  const projectService = {
    create: jasmine.createSpy('create').and.returnValue(of(PROJECT)),
    update: jasmine.createSpy('update').and.returnValue(of(PROJECT)),
  };

  TestBed.configureTestingModule({
    imports: [ProjectDialog],
    providers: [
      provideZonelessChangeDetection(),
      provideNoopAnimations(),
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
      { provide: ProjectService, useValue: projectService },
      { provide: CompanyService, useValue: { getAll: () => of([COMPANY]) } },
      {
        provide: ImageService,
        useValue: {
          imageUrl: (id: string) => `/images/${id}`,
          upload: () => of([{ _id: 'uploaded-1' }]),
        },
      },
    ],
  });

  return projectService;
}

function buttons(fixture: ComponentFixture<ProjectDialog>): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('button'));
}

/** Clicks the dialog's save button, which submits the form by its `form` attribute. */
function submit(fixture: ComponentFixture<ProjectDialog>): void {
  const save = buttons(fixture).find((button) => button.type === 'submit');
  save?.click();
  fixture.detectChanges();
}

function clickByText(fixture: ComponentFixture<ProjectDialog>, text: string): void {
  const button = buttons(fixture).find((candidate) => candidate.textContent?.includes(text));
  expect(button).withContext(`button "${text}"`).toBeTruthy();
  button?.click();
  fixture.detectChanges();
}

function steps(fixture: ComponentFixture<ProjectDialog>): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('.section-nav__item'));
}

/** Clicks a step in the rail, which swaps the section rendered in the body. */
function goToStep(fixture: ComponentFixture<ProjectDialog>, label: string): void {
  const step = steps(fixture).find((candidate) => candidate.textContent?.includes(label));
  expect(step).withContext(`step "${label}"`).toBeTruthy();
  step?.click();
  fixture.detectChanges();
}

function activeStep(fixture: ComponentFixture<ProjectDialog>): string {
  const active = steps(fixture).find((step) => step.getAttribute('aria-current') === 'step');
  return active?.textContent?.trim() ?? '';
}

/** Clicks a language in the header switcher, which rebinds every translated field. */
function selectLanguage(fixture: ComponentFixture<ProjectDialog>, code: string): void {
  const option = Array.from(
    fixture.nativeElement.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>,
  ).find((candidate) => candidate.textContent?.trim().startsWith(code));

  expect(option).withContext(`language "${code}"`).toBeTruthy();
  option?.click();
  fixture.detectChanges();
}

function fieldValues(fixture: ComponentFixture<ProjectDialog>): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('input, textarea') as NodeListOf<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ).map((field) => field.value);
}

function fieldLabels(fixture: ComponentFixture<ProjectDialog>): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('mat-label') as NodeListOf<HTMLElement>,
  ).map((label) => label.textContent?.trim() ?? '');
}

function editors(fixture: ComponentFixture<ProjectDialog>): number {
  return fixture.nativeElement.querySelectorAll('app-rich-text-editor').length;
}

/** Copies the fixture's plain fields into the form, leaving the lists empty. */
function fillRequiredFields(fixture: ComponentFixture<ProjectDialog>): void {
  const { _id, createdAt, updatedAt, companyInfo, ...fields } = PROJECT;
  const formDirective = fixture.debugElement
    .query(By.directive(FormGroupDirective))
    .injector.get(FormGroupDirective);

  formDirective.form.patchValue({ ...fields, company: companyInfo?._id });
  fixture.detectChanges();
}

describe('ProjectDialog', () => {
  it('renders one step per section of the property page', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    const labels = steps(fixture).map((step) => step.textContent?.trim());

    expect(labels.length).toBe(6);
    expect(labels[0]).toContain('Hero');
    expect(labels[5]).toContain('Payment Plan');
  });

  it('starts on the hero step and renders that section only', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    expect(activeStep(fixture)).toContain('Hero');
    expect(fieldValues(fixture)).toContain('Sea Tower');
    // A field of a later step, which must stay out of the DOM until that step is picked.
    expect(fieldValues(fixture)).not.toContain('Residential');
  });

  it('shows the values of an existing project in the fields of every step', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    expect(fieldValues(fixture)).toContain('Batumi, Ninoshvili 12');
    expect(fixture.nativeElement.textContent).toContain('250 m to the sea');

    goToStep(fixture, 'Our Take');
    expect(fixture.nativeElement.textContent).toContain('Construction permit verified');

    goToStep(fixture, 'Overview');
    expect(fieldValues(fixture)).toContain('Residential');

    goToStep(fixture, 'Floor Plans');
    expect(fieldValues(fixture)).toContain('Studio');

    goToStep(fixture, 'Payment Plan');
    expect(fieldValues(fixture)).toContain('Down payment');
    expect(fixture.nativeElement.textContent).toContain('0% interest instalments');
  });

  it('swaps the translated fields when the header language changes', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    expect(fieldValues(fixture)).toContain('Batumi, Ninoshvili 12');

    selectLanguage(fixture, 'GE');

    expect(fieldValues(fixture)).toContain('ბათუმი, ნინოშვილის 12');
    expect(fieldValues(fixture)).not.toContain('Batumi, Ninoshvili 12');
    // Fields that are the same in every language stay put.
    expect(fieldValues(fixture)).toContain('Sea Tower');
  });

  it('loads an existing project into the sections and saves it back unchanged', () => {
    const projectService = configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    submit(fixture);

    const { _id, createdAt, updatedAt, companyInfo, ...fields } = PROJECT;
    expect(projectService.update).toHaveBeenCalledWith(_id, {
      ...fields,
      company: companyInfo?._id,
    });
  });

  it('adds a row to every list step and renders its fields', () => {
    configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    clickByText(fixture, 'Add card');
    expect(fixture.nativeElement.textContent).toContain('Card 1');
    // A summary card is rich text, one editor in the language being edited.
    expect(editors(fixture)).toBe(1);

    goToStep(fixture, 'The Numbers');
    clickByText(fixture, 'Add card');
    expect(fixture.nativeElement.textContent).toContain('Card 1');
    expect(editors(fixture)).toBe(1);

    goToStep(fixture, 'Floor Plans');
    clickByText(fixture, 'Add apartment type');
    expect(fixture.nativeElement.textContent).toContain('Apartment type 1');
    expect(fieldLabels(fixture)).toContain('Apartment type');

    goToStep(fixture, 'Payment Plan');
    clickByText(fixture, 'Add stage');
    expect(fixture.nativeElement.textContent).toContain('Stage 1');
    expect(fieldLabels(fixture)).toContain('When');
  });

  it('removes a payment stage again', () => {
    configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    goToStep(fixture, 'Payment Plan');
    clickByText(fixture, 'Add stage');
    expect(fixture.nativeElement.textContent).toContain('Stage 1');

    const remove = buttons(fixture).find(
      (button) => button.getAttribute('aria-label') === 'Remove payment plan',
    );
    remove?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Stage 1');
  });

  it('names the missing fields and flags the steps holding them', () => {
    const projectService = configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    goToStep(fixture, 'Floor Plans');
    submit(fixture);

    const error = fixture.nativeElement.querySelector('.project-form__error') as HTMLElement;
    const flagged = steps(fixture)
      .filter((step) => step.classList.contains('section-nav__item--missing'))
      .map((step) => step.textContent?.trim());

    expect(projectService.create).not.toHaveBeenCalled();
    expect(error.textContent).toContain('Please fill the required fields');
    expect(error.textContent).toContain('Project name');
    // Saving jumps back to the first step with an empty required field.
    expect(activeStep(fixture)).toContain('Hero');
    expect(flagged.length).toBe(3);
    expect(flagged[0]).toContain('Hero');
  });

  it('creates a project once the required fields are filled', () => {
    const projectService = configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    fillRequiredFields(fixture);
    submit(fixture);

    expect(projectService.create).toHaveBeenCalled();
    const dto = projectService.create.calls.mostRecent().args[0] as CreateProjectDto;
    expect(dto.projectName).toBe('Sea Tower');
    expect(dto.company).toBe('company-1');
    expect(dto.projectAdvantagesEn).toEqual(['250 m to the sea']);
    expect(dto.projectImages).toEqual([]);
  });

  it('keeps the images uploaded in the hero and floor plan steps while stepping between them', () => {
    const projectService = configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    // Each step renders its own uploader, so only the active one is in the DOM.
    upload(fixture);
    fillRequiredFields(fixture);

    goToStep(fixture, 'Floor Plans');
    clickByText(fixture, 'Add apartment type');
    typeInto(fixture, 'Apartment type', 'Studio');
    upload(fixture);

    submit(fixture);

    const dto = projectService.create.calls.mostRecent().args[0] as CreateProjectDto;
    expect(dto.projectImages).toEqual(['uploaded-1']);
    expect(dto.apartmentPlans).toEqual([
      {
        apartmentType: 'Studio',
        apartmentPlanImages: ['uploaded-1'],
        apartmentCardsGe: [],
        apartmentCardsEn: [],
        apartmentCardsRu: [],
      },
    ]);
  });

  /** The backend keeps one array per language; the dialog edits a card at a time. */
  it('edits the highlight cards of an apartment type one card at a time', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    goToStep(fixture, 'Floor Plans');
    // The card the project already has, in the language being edited.
    expect(editors(fixture)).toBe(1);

    clickByText(fixture, 'Add card');
    expect(editors(fixture)).toBe(2);
  });
});

/** Types into the input of the `mat-form-field` carrying `label`. */
function typeInto(fixture: ComponentFixture<ProjectDialog>, label: string, value: string): void {
  const field = Array.from(
    fixture.nativeElement.querySelectorAll('mat-form-field') as NodeListOf<HTMLElement>,
  ).find((candidate) => candidate.querySelector('mat-label')?.textContent?.trim() === label);

  const input = field?.querySelector('input') as HTMLInputElement | null;
  expect(input).withContext(`field "${label}"`).toBeTruthy();

  if (input) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}

/** Picks a file in the uploader of the step on screen. */
function upload(fixture: ComponentFixture<ProjectDialog>): void {
  const fileInputs = fixture.nativeElement.querySelectorAll(
    'input[type=file]',
  ) as NodeListOf<HTMLInputElement>;
  expect(fileInputs.length).toBe(1);

  const transfer = new DataTransfer();
  transfer.items.add(new File(['image'], 'photo.png', { type: 'image/png' }));
  fileInputs[0].files = transfer.files;
  fileInputs[0].dispatchEvent(new Event('change'));
  fixture.detectChanges();
}




