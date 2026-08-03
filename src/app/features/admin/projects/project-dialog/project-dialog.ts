import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
import { ChipListInput } from '../../shared/chip-list-input/chip-list-input';
import {
  allOrNothing,
  backendMessage,
  deepTrim,
  missingFieldsMessage,
  notBlank,
  textOrNull,
  withoutNulls,
} from '../../shared/form-utils';
import { ImageUploader } from '../../shared/image-uploader/image-uploader';
import { LANGUAGES } from '../../shared/languages';

type TriField = Record<string, string>;

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
    ChipListInput,
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
  protected readonly expandAll = signal(false);
  protected readonly heroExpanded = signal(true);
  /** Image lists live outside the form, so their errors only show once saving was attempted. */
  protected readonly submitted = signal(false);

  protected readonly projectImages = signal<string[]>([...(this.project?.projectImages ?? [])]);
  protected readonly floorPlanImages = signal<string[]>([...(this.project?.floorPlanImages ?? [])]);

  protected readonly projectImagesMissing = computed(
    () => this.submitted() && this.projectImages().length === 0,
  );
  protected readonly floorPlanImagesMissing = computed(
    () => this.submitted() && this.floorPlanImages().length === 0,
  );

  /** Only these seven fields are required by the backend; everything else may be left empty. */
  protected readonly form = this.formBuilder.nonNullable.group({
    projectName: [this.project?.projectName ?? '', [Validators.required, notBlank]],
    company: [this.project?.companyInfo?._id ?? '', Validators.required],
    projectLocationEn: [this.project?.projectLocationEn ?? '', [Validators.required, notBlank]],
    projectLatitude: this.formBuilder.control<number | null>(
      this.project?.projectLatitude ?? 41.6461,
      [Validators.required, Validators.min(-90), Validators.max(90)],
    ),
    projectLongitude: this.formBuilder.control<number | null>(
      this.project?.projectLongitude ?? 41.6399,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ),
    lastVerified: this.formBuilder.control<Date | null>(
      this.project?.lastVerified ? new Date(this.project.lastVerified) : new Date(),
    ),
    projectLocationGe: [this.project?.projectLocationGe ?? ''],
    projectLocationRu: [this.project?.projectLocationRu ?? ''],
    buildingTypeGe: [this.project?.buildingTypeGe ?? ''],
    buildingTypeEn: [this.project?.buildingTypeEn ?? ''],
    buildingTypeRu: [this.project?.buildingTypeRu ?? ''],
    totalFloors: this.formBuilder.control<number | null>(
      this.project?.totalFloors ?? null,
      Validators.min(0),
    ),
    unitsInBuilding: this.formBuilder.control<number | null>(
      this.project?.unitsInBuilding ?? null,
      Validators.min(0),
    ),
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
    // The backend requires every field of this object once it is sent, so it is all-or-nothing.
    projectDescription: this.formBuilder.nonNullable.group(
      {
        projectDescriptionTitleGe: [
          this.project?.projectDescription?.projectDescriptionTitleGe ?? '',
        ],
        projectDescriptionTitleEn: [
          this.project?.projectDescription?.projectDescriptionTitleEn ?? '',
        ],
        projectDescriptionTitleRu: [
          this.project?.projectDescription?.projectDescriptionTitleRu ?? '',
        ],
        projectDescriptionContentGe: [
          this.project?.projectDescription?.projectDescriptionContentGe ?? '',
        ],
        projectDescriptionContentEn: [
          this.project?.projectDescription?.projectDescriptionContentEn ?? '',
        ],
        projectDescriptionContentRu: [
          this.project?.projectDescription?.projectDescriptionContentRu ?? '',
        ],
        projectShortDescriptionGe: [
          this.project?.projectDescription?.projectShortDescriptionGe ?? '',
        ],
        projectShortDescriptionEn: [
          this.project?.projectDescription?.projectShortDescriptionEn ?? '',
        ],
        projectShortDescriptionRu: [
          this.project?.projectDescription?.projectShortDescriptionRu ?? '',
        ],
      },
      { validators: allOrNothing },
    ),
    projectAdvantagesGe: this.stringList(this.project?.projectAdvantagesGe),
    projectAdvantagesEn: this.stringList(this.project?.projectAdvantagesEn),
    projectAdvantagesRu: this.stringList(this.project?.projectAdvantagesRu),
    verificationChecklistGe: this.stringList(this.project?.verificationChecklistGe),
    verificationChecklistEn: this.stringList(this.project?.verificationChecklistEn),
    verificationChecklistRu: this.stringList(this.project?.verificationChecklistRu),
    paymentAdvantagesGe: this.stringList(this.project?.paymentAdvantagesGe),
    paymentAdvantagesEn: this.stringList(this.project?.paymentAdvantagesEn),
    paymentAdvantagesRu: this.stringList(this.project?.paymentAdvantagesRu),
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
    if (this.saving()) {
      return;
    }

    this.submitted.set(true);

    const raw = this.form.getRawValue();
    const { projectLatitude, projectLongitude } = raw;
    const missingImages = [
      ...(this.projectImages().length === 0 ? ['Project images'] : []),
      ...(this.floorPlanImages().length === 0 ? ['Floor plan images'] : []),
    ];

    if (
      this.form.invalid ||
      projectLatitude === null ||
      projectLongitude === null ||
      missingImages.length > 0
    ) {
      this.form.markAllAsTouched();
      this.expandAll.set(true);
      this.saveError.set(missingFieldsMessage(this.form, missingImages));
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    // A partially filled description cannot pass validation, so any filled field means all are.
    const hasDescription = Object.values(raw.projectDescription).some(
      (value) => textOrNull(value) !== null,
    );

    const payload: CreateProjectDto = {
      projectName: raw.projectName,
      company: raw.company,
      projectImages: this.projectImages(),
      floorPlanImages: this.floorPlanImages(),
      projectLocationEn: raw.projectLocationEn,
      projectLatitude,
      projectLongitude,
      lastVerified: raw.lastVerified?.toISOString() ?? null,
      projectLocationGe: textOrNull(raw.projectLocationGe),
      projectLocationRu: textOrNull(raw.projectLocationRu),
      buildingTypeGe: textOrNull(raw.buildingTypeGe),
      buildingTypeEn: textOrNull(raw.buildingTypeEn),
      buildingTypeRu: textOrNull(raw.buildingTypeRu),
      totalFloors: raw.totalFloors,
      unitsInBuilding: raw.unitsInBuilding,
      unitSizesAvailable: textOrNull(raw.unitSizesAvailable),
      finishingGe: textOrNull(raw.finishingGe),
      finishingEn: textOrNull(raw.finishingEn),
      finishingRu: textOrNull(raw.finishingRu),
      furniturePackageGe: textOrNull(raw.furniturePackageGe),
      furniturePackageEn: textOrNull(raw.furniturePackageEn),
      furniturePackageRu: textOrNull(raw.furniturePackageRu),
      strManagementOnSiteGe: textOrNull(raw.strManagementOnSiteGe),
      strManagementOnSiteEn: textOrNull(raw.strManagementOnSiteEn),
      strManagementOnSiteRu: textOrNull(raw.strManagementOnSiteRu),
      distanceToSea: textOrNull(raw.distanceToSea),
      distanceToCityCenter: textOrNull(raw.distanceToCityCenter),
      paymentDescriptionGe: textOrNull(raw.paymentDescriptionGe),
      paymentDescriptionEn: textOrNull(raw.paymentDescriptionEn),
      paymentDescriptionRu: textOrNull(raw.paymentDescriptionRu),
      projectDescription: hasDescription ? raw.projectDescription : null,
      projectAdvantagesGe: raw.projectAdvantagesGe,
      projectAdvantagesEn: raw.projectAdvantagesEn,
      projectAdvantagesRu: raw.projectAdvantagesRu,
      verificationChecklistGe: raw.verificationChecklistGe,
      verificationChecklistEn: raw.verificationChecklistEn,
      verificationChecklistRu: raw.verificationChecklistRu,
      paymentAdvantagesGe: raw.paymentAdvantagesGe,
      paymentAdvantagesEn: raw.paymentAdvantagesEn,
      paymentAdvantagesRu: raw.paymentAdvantagesRu,
      projectDescriptionCards: raw.projectDescriptionCards as ProjectDescriptionCard[],
      investmentCards: raw.investmentCards as InvestmentCard[],
      pricingBySquareMeters: raw.pricingBySquareMeters as PricingBySquareMeter[],
      paymentPlans: raw.paymentPlans as PaymentPlan[],
    };
    // On edit, `null` clears a field that was emptied; on create there is nothing to clear.
    const dto = deepTrim(this.project ? payload : withoutNulls(payload));

    const request = this.project
      ? this.projectService.update(this.project._id, dto)
      : this.projectService.create(dto);

    request.subscribe({
      next: (saved) => this.dialogRef.close(saved),
      error: (error: unknown) => {
        this.saving.set(false);
        this.saveError.set(
          backendMessage(error) ??
            'Failed to save the project. Please check the fields and try again.',
        );
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

  /** Control backing a chip list, holding the array the backend expects. */
  private stringList(values: readonly string[] | undefined): FormControl<string[]> {
    return this.formBuilder.nonNullable.control<string[]>([...(values ?? [])]);
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

  /** Builds required `{base}{Ge|En|Ru}` string controls for each base field name. */
  private triGroup(
    baseNames: readonly string[],
    values?: TriField,
  ): Record<string, [string, ValidatorFn]> {
    const controls: Record<string, [string, ValidatorFn]> = {};
    for (const base of baseNames) {
      for (const language of LANGUAGES) {
        const key = `${base}${language.suffix}`;
        controls[key] = [values?.[key] ?? '', Validators.required];
      }
    }
    return controls;
  }
}
