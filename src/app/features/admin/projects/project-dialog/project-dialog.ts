import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import {
  Company,
  CreateProjectDto,
  InvestmentCard,
  PaymentPlan,
  PricingBySquareMeter,
  ProjectDescriptionCard,
  ProjectResponse,
} from '../../../../core/models/api.models';
import { CompanyService } from '../../../../core/services/company.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ImageUploader } from '../../shared/image-uploader/image-uploader';
import { LANGUAGES } from '../../shared/languages';

type TriField = Record<string, string>;

function joinLines(items: readonly string[] | undefined): string {
  return (items ?? []).join('\n');
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

@Component({
  selector: 'app-project-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    ImageUploader,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly companyService = inject(CompanyService);
  private readonly dialogRef = inject(MatDialogRef<ProjectDialog>);

  protected readonly project = inject<ProjectResponse | null>(MAT_DIALOG_DATA);
  protected readonly languages = LANGUAGES;

  protected readonly companies = signal<Company[]>([]);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly projectImages = signal<string[]>([...(this.project?.projectImages ?? [])]);
  protected readonly floorPlanImages = signal<string[]>([...(this.project?.floorPlanImages ?? [])]);

  protected readonly form = this.formBuilder.nonNullable.group({
    projectName: [this.project?.projectName ?? '', Validators.required],
    company: [this.project?.companyInfo?._id ?? '', Validators.required],
    lastVerified: [
      this.project ? new Date(this.project.lastVerified) : new Date(),
      Validators.required,
    ],
    projectLocationGe: [this.project?.projectLocationGe ?? '', Validators.required],
    projectLocationEn: [this.project?.projectLocationEn ?? '', Validators.required],
    projectLocationRu: [this.project?.projectLocationRu ?? '', Validators.required],
    projectLatitude: [
      this.project?.projectLatitude ?? 41.6461,
      [Validators.required, Validators.min(-90), Validators.max(90)],
    ],
    projectLongitude: [
      this.project?.projectLongitude ?? 41.6399,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
    buildingTypeGe: [this.project?.buildingTypeGe ?? ''],
    buildingTypeEn: [this.project?.buildingTypeEn ?? ''],
    buildingTypeRu: [this.project?.buildingTypeRu ?? ''],
    totalFloors: [this.project?.totalFloors ?? 0, [Validators.required, Validators.min(0)]],
    unitsInBuilding: [this.project?.unitsInBuilding ?? 0, [Validators.required, Validators.min(0)]],
    unitSizesAvailable: [this.project?.unitSizesAvailable ?? ''],
    finishingGe: [this.project?.finishingGe ?? ''],
    finishingEn: [this.project?.finishingEn ?? ''],
    finishingRu: [this.project?.finishingRu ?? ''],
    furniturePackageGe: [this.project?.furniturePackageGe ?? ''],
    furniturePackageEn: [this.project?.furniturePackageEn ?? ''],
    furniturePackageRu: [this.project?.furniturePackageRu ?? ''],
    strManagementOnSiteGe: [this.project?.strManagementOnSiteGe ?? ''],
    strManagementOnSiteEn: [this.project?.strManagementOnSiteEn ?? ''],
    strManagementOnSiteRu: [this.project?.strManagementOnSiteRu ?? ''],
    distanceToSea: [this.project?.distanceToSea ?? ''],
    distanceToCityCenter: [this.project?.distanceToCityCenter ?? ''],
    paymentDescriptionGe: [this.project?.paymentDescriptionGe ?? ''],
    paymentDescriptionEn: [this.project?.paymentDescriptionEn ?? ''],
    paymentDescriptionRu: [this.project?.paymentDescriptionRu ?? ''],
    projectDescription: this.formBuilder.nonNullable.group({
      projectDescriptionTitleGe: [this.project?.projectDescription?.projectDescriptionTitleGe ?? ''],
      projectDescriptionTitleEn: [this.project?.projectDescription?.projectDescriptionTitleEn ?? ''],
      projectDescriptionTitleRu: [this.project?.projectDescription?.projectDescriptionTitleRu ?? ''],
      projectDescriptionContentGe: [this.project?.projectDescription?.projectDescriptionContentGe ?? ''],
      projectDescriptionContentEn: [this.project?.projectDescription?.projectDescriptionContentEn ?? ''],
      projectDescriptionContentRu: [this.project?.projectDescription?.projectDescriptionContentRu ?? ''],
      projectShortDescriptionGe: [this.project?.projectDescription?.projectShortDescriptionGe ?? ''],
      projectShortDescriptionEn: [this.project?.projectDescription?.projectShortDescriptionEn ?? ''],
      projectShortDescriptionRu: [this.project?.projectDescription?.projectShortDescriptionRu ?? ''],
    }),
    lists: this.formBuilder.nonNullable.group({
      projectAdvantagesGe: [joinLines(this.project?.projectAdvantagesGe)],
      projectAdvantagesEn: [joinLines(this.project?.projectAdvantagesEn)],
      projectAdvantagesRu: [joinLines(this.project?.projectAdvantagesRu)],
      verificationChecklistGe: [joinLines(this.project?.verificationChecklistGe)],
      verificationChecklistEn: [joinLines(this.project?.verificationChecklistEn)],
      verificationChecklistRu: [joinLines(this.project?.verificationChecklistRu)],
      paymentAdvantagesGe: [joinLines(this.project?.paymentAdvantagesGe)],
      paymentAdvantagesEn: [joinLines(this.project?.paymentAdvantagesEn)],
      paymentAdvantagesRu: [joinLines(this.project?.paymentAdvantagesRu)],
    }),
    projectDescriptionCards: this.formBuilder.array(
      (this.project?.projectDescriptionCards ?? []).map((card) => this.buildDescriptionCard(card)),
    ),
    investmentCards: this.formBuilder.array(
      (this.project?.investmentCards ?? []).map((card) => this.buildInvestmentCard(card)),
    ),
    pricingBySquareMeters: this.formBuilder.array(
      (this.project?.pricingBySquareMeters ?? []).map((row) => this.buildPricingRow(row)),
    ),
    paymentPlans: this.formBuilder.array(
      (this.project?.paymentPlans ?? []).map((plan) => this.buildPaymentPlan(plan)),
    ),
  });

  constructor() {
    this.companyService.getAll().subscribe((companies) => this.companies.set(companies));
  }

  /* ---------- form arrays ---------- */

  protected get descriptionCards(): FormArray {
    return this.form.controls.projectDescriptionCards;
  }

  protected get investmentCardsArray(): FormArray {
    return this.form.controls.investmentCards;
  }

  protected get pricingRows(): FormArray {
    return this.form.controls.pricingBySquareMeters;
  }

  protected get paymentPlansArray(): FormArray {
    return this.form.controls.paymentPlans;
  }

  protected addDescriptionCard(): void {
    this.descriptionCards.push(this.buildDescriptionCard());
  }

  protected addInvestmentCard(): void {
    this.investmentCardsArray.push(this.buildInvestmentCard());
  }

  protected addPricingRow(): void {
    this.pricingRows.push(this.buildPricingRow());
  }

  protected addPaymentPlan(): void {
    this.paymentPlansArray.push(this.buildPaymentPlan());
  }

  protected removeAt(array: FormArray, index: number): void {
    array.removeAt(index);
  }

  /* ---------- save ---------- */

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      this.saveError.set('Some required fields are missing.');
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const raw = this.form.getRawValue();
    const dto: CreateProjectDto = {
      projectName: raw.projectName,
      company: raw.company,
      lastVerified: raw.lastVerified.toISOString(),
      projectImages: this.projectImages(),
      floorPlanImages: this.floorPlanImages(),
      projectLocationGe: raw.projectLocationGe,
      projectLocationEn: raw.projectLocationEn,
      projectLocationRu: raw.projectLocationRu,
      projectLatitude: raw.projectLatitude,
      projectLongitude: raw.projectLongitude,
      buildingTypeGe: raw.buildingTypeGe,
      buildingTypeEn: raw.buildingTypeEn,
      buildingTypeRu: raw.buildingTypeRu,
      totalFloors: raw.totalFloors,
      unitsInBuilding: raw.unitsInBuilding,
      unitSizesAvailable: raw.unitSizesAvailable,
      finishingGe: raw.finishingGe,
      finishingEn: raw.finishingEn,
      finishingRu: raw.finishingRu,
      furniturePackageGe: raw.furniturePackageGe,
      furniturePackageEn: raw.furniturePackageEn,
      furniturePackageRu: raw.furniturePackageRu,
      strManagementOnSiteGe: raw.strManagementOnSiteGe,
      strManagementOnSiteEn: raw.strManagementOnSiteEn,
      strManagementOnSiteRu: raw.strManagementOnSiteRu,
      distanceToSea: raw.distanceToSea,
      distanceToCityCenter: raw.distanceToCityCenter,
      paymentDescriptionGe: raw.paymentDescriptionGe,
      paymentDescriptionEn: raw.paymentDescriptionEn,
      paymentDescriptionRu: raw.paymentDescriptionRu,
      projectDescription: raw.projectDescription,
      projectAdvantagesGe: splitLines(raw.lists.projectAdvantagesGe),
      projectAdvantagesEn: splitLines(raw.lists.projectAdvantagesEn),
      projectAdvantagesRu: splitLines(raw.lists.projectAdvantagesRu),
      verificationChecklistGe: splitLines(raw.lists.verificationChecklistGe),
      verificationChecklistEn: splitLines(raw.lists.verificationChecklistEn),
      verificationChecklistRu: splitLines(raw.lists.verificationChecklistRu),
      paymentAdvantagesGe: splitLines(raw.lists.paymentAdvantagesGe),
      paymentAdvantagesEn: splitLines(raw.lists.paymentAdvantagesEn),
      paymentAdvantagesRu: splitLines(raw.lists.paymentAdvantagesRu),
      projectDescriptionCards: raw.projectDescriptionCards as ProjectDescriptionCard[],
      investmentCards: raw.investmentCards as InvestmentCard[],
      pricingBySquareMeters: raw.pricingBySquareMeters as PricingBySquareMeter[],
      paymentPlans: raw.paymentPlans as PaymentPlan[],
    };

    const request = this.project
      ? this.projectService.update(this.project._id, dto)
      : this.projectService.create(dto);

    request.subscribe({
      next: (saved) => this.dialogRef.close(saved),
      error: () => {
        this.saving.set(false);
        this.saveError.set('Failed to save the project. Please check the fields and try again.');
      },
    });
  }

  /* ---------- group builders ---------- */

  private buildDescriptionCard(card?: ProjectDescriptionCard): FormGroup {
    return this.formBuilder.nonNullable.group(
      this.triGroup(
        ['projectDescriptionCardTitle', 'projectDescriptionCardContent', 'projectDescriptionCardDescription'],
        card as TriField | undefined,
      ),
    );
  }

  private buildInvestmentCard(card?: InvestmentCard): FormGroup {
    return this.formBuilder.nonNullable.group(
      this.triGroup(
        ['investmentCardTitle', 'investmentCardContent', 'investmentCardDescription'],
        card as TriField | undefined,
      ),
    );
  }

  private buildPricingRow(row?: PricingBySquareMeter): FormGroup {
    return this.formBuilder.nonNullable.group({
      squareMeterRange: [row?.squareMeterRange ?? '', Validators.required],
      startingPrice: [row?.startingPrice ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  private buildPaymentPlan(plan?: PaymentPlan): FormGroup {
    return this.formBuilder.nonNullable.group({
      ...this.triGroup(['paymentStage', 'when'], plan as unknown as TriField | undefined),
      paymentAmount: [plan?.paymentAmount ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  /** Builds `{base}{Ge|En|Ru}` string controls for each base field name. */
  private triGroup(
    baseNames: readonly string[],
    values?: TriField,
  ): Record<string, [string]> {
    const controls: Record<string, [string]> = {};
    for (const base of baseNames) {
      for (const language of LANGUAGES) {
        const key = `${base}${language.suffix}`;
        controls[key] = [values?.[key] ?? ''];
      }
    }
    return controls;
  }
}
