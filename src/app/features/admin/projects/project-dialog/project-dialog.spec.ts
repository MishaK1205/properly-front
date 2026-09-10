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
  floorPlanImages: ['plan-1'],
  projectLocationGe: 'ბათუმი, ნინოშვილის 12',
  projectLocationEn: 'Batumi, Ninoshvili 12',
  projectLocationRu: 'Батуми, Ниношвили 12',
  projectLatitude: 41.65,
  projectLongitude: 41.64,
  projectDescriptionCards: [
    {
      projectDescriptionCardTitleGe: 'სათაური',
      projectDescriptionCardTitleEn: 'Title',
      projectDescriptionCardTitleRu: 'Заголовок',
      projectDescriptionCardContentGe: '8%',
      projectDescriptionCardContentEn: '8%',
      projectDescriptionCardContentRu: '8%',
      projectDescriptionCardDescriptionGe: 'აღწერა',
      projectDescriptionCardDescriptionEn: 'Description',
      projectDescriptionCardDescriptionRu: 'Описание',
    },
  ],
  projectAdvantagesGe: ['ზღვასთან ახლოს'],
  projectAdvantagesEn: ['250 m to the sea'],
  projectAdvantagesRu: ['250 м до моря'],
  paymentDescriptionGe: 'გადახდის შენიშვნა',
  paymentDescriptionEn: 'Payment note',
  paymentDescriptionRu: 'Примечание об оплате',
  projectDescription: {
    projectDescriptionTitleGe: 'ჩვენი შეფასება',
    projectDescriptionTitleEn: 'Our take',
    projectDescriptionTitleRu: 'Наше мнение',
    projectDescriptionContentGe: 'ტექსტი',
    projectDescriptionContentEn: 'Body text',
    projectDescriptionContentRu: 'Текст',
    projectShortDescriptionGe: 'მოკლე',
    projectShortDescriptionEn: 'Short',
    projectShortDescriptionRu: 'Кратко',
  },
  verificationChecklistGe: ['ნებართვა შემოწმებულია'],
  verificationChecklistEn: ['Construction permit verified'],
  verificationChecklistRu: ['Разрешение проверено'],
  investmentCards: [
    {
      investmentCardTitleGe: 'ფასი',
      investmentCardTitleEn: 'Price',
      investmentCardTitleRu: 'Цена',
      investmentCardContentGe: '$75,000',
      investmentCardContentEn: '$75,000',
      investmentCardContentRu: '$75,000',
      investmentCardDescriptionGe: 'საშუალო',
      investmentCardDescriptionEn: 'Average unit',
      investmentCardDescriptionRu: 'Средняя',
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
  pricingBySquareMeters: [{ squareMeterRange: '30–45 m²', startingPrice: 1400 }],
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

function panels(fixture: ComponentFixture<ProjectDialog>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('mat-expansion-panel'));
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
  it('renders one panel per section of the property page', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('mat-panel-title') as NodeListOf<HTMLElement>,
    ).map((title) => title.textContent?.trim());

    expect(titles.length).toBe(6);
    expect(titles[0]).toContain('1 · Hero');
    expect(titles[5]).toContain('6 · The Property — Payment Plan tab');
  });

  it('shows the values of an existing project in the fields of every section', () => {
    configure(PROJECT);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    const values = Array.from(
      fixture.nativeElement.querySelectorAll('input, textarea') as NodeListOf<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ).map((field) => field.value);

    expect(values).toContain('Sea Tower');
    expect(values).toContain('Batumi, Ninoshvili 12');
    expect(values).toContain('Body text');
    expect(values).toContain('Residential');
    expect(values).toContain('30–45 m²');
    expect(values).toContain('Down payment');
    expect(values).toContain('$75,000');
    // Chips only render when the chip list resolved its control through the tabs component.
    expect(fixture.nativeElement.textContent).toContain('250 m to the sea');
    expect(fixture.nativeElement.textContent).toContain('Construction permit verified');
    expect(fixture.nativeElement.textContent).toContain('0% interest instalments');
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

  it('opens the hero panel and leaves the rest collapsed', () => {
    configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    const expanded = panels(fixture).map((panel) => panel.classList.contains('mat-expanded'));
    expect(expanded).toEqual([true, false, false, false, false, false]);
  });

  it('adds a row to every list section and renders its fields', () => {
    configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    clickByText(fixture, 'Add summary card');
    clickByText(fixture, 'Add investment card');
    clickByText(fixture, 'Add pricing row');
    clickByText(fixture, 'Add payment stage');

    const text = fixture.nativeElement.textContent as string;
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('mat-label') as NodeListOf<HTMLElement>,
    ).map((label) => label.textContent?.trim());

    expect(text).toContain('Card 1');
    expect(text).toContain('Investment card 1');
    expect(text).toContain('Stage 1');
    expect(labels).toContain('Title (English)');
    expect(labels).toContain('Square meter range');
    expect(labels).toContain('Payment stage (English)');
  });

  it('removes a payment stage again', () => {
    configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    clickByText(fixture, 'Add payment stage');
    expect(fixture.nativeElement.textContent).toContain('Stage 1');

    const remove = buttons(fixture).find(
      (button) => button.getAttribute('aria-label') === 'Remove payment plan',
    );
    remove?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Stage 1');
  });

  it('names the missing fields and opens every panel instead of saving an empty project', () => {
    const projectService = configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    submit(fixture);

    const error = fixture.nativeElement.querySelector('.project-form__error') as HTMLElement;
    expect(projectService.create).not.toHaveBeenCalled();
    expect(error.textContent).toContain('Please fill the required fields');
    expect(error.textContent).toContain('Project name');
    expect(panels(fixture).every((panel) => panel.classList.contains('mat-expanded'))).toBeTrue();
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

  it('sends the images uploaded inside the gallery and floor plan sections', () => {
    const projectService = configure(null);
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();

    const fileInputs = fixture.nativeElement.querySelectorAll(
      'input[type=file]',
    ) as NodeListOf<HTMLInputElement>;
    expect(fileInputs.length).toBe(2);

    for (const fileInput of Array.from(fileInputs)) {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['image'], 'photo.png', { type: 'image/png' }));
      fileInput.files = transfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
    fixture.detectChanges();

    fillRequiredFields(fixture);
    submit(fixture);

    const dto = projectService.create.calls.mostRecent().args[0] as CreateProjectDto;
    expect(dto.projectImages).toEqual(['uploaded-1']);
    expect(dto.floorPlanImages).toEqual(['uploaded-1']);
  });
});
