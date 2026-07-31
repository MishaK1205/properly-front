import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { backendMessage, deepTrim, missingFieldsMessage } from '../../shared/form-utils';
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
    buildingTypeGe: [this.project?.buildingTypeGe ?? '', Validators.required],
    buildingTypeEn: [this.project?.buildingTypeEn ?? '', Validators.required],
    buildingTypeRu: [this.project?.buildingTypeRu ?? '', Validators.required],
    totalFloors: [this.project?.totalFloors ?? 0, [Validators.required, Validators.min(0)]],
    unitsInBuilding: [this.project?.unitsInBuilding ?? 0, [Validators.required, Validators.min(0)]],
    unitSizesAvailable: [this.project?.unitSizesAvailable ?? '', Validators.required],
    finishingGe: [this.project?.finishingGe ?? '', Validators.required],
    finishingEn: [this.project?.finishingEn ?? '', Validators.required],
    finishingRu: [this.project?.finishingRu ?? '', Validators.required],
    furniturePackageGe: [this.project?.furniturePackageGe ?? '', Validators.required],
    furniturePackageEn: [this.project?.furniturePackageEn ?? '', Validators.required],
    furniturePackageRu: [this.project?.furniturePackageRu ?? '', Validators.required],
    strManagementOnSiteGe: [this.project?.strManagementOnSiteGe ?? '', Validators.required],
    strManagementOnSiteEn: [this.project?.strManagementOnSiteEn ?? '', Validators.required],
    strManagementOnSiteRu: [this.project?.strManagementOnSiteRu ?? '', Validators.required],
    distanceToSea: [this.project?.distanceToSea ?? '', Validators.required],
    distanceToCityCenter: [this.project?.distanceToCityCenter ?? '', Validators.required],
    paymentDescriptionGe: [this.project?.paymentDescriptionGe ?? '', Validators.required],
    paymentDescriptionEn: [this.project?.paymentDescriptionEn ?? '', Validators.required],
    paymentDescriptionRu: [this.project?.paymentDescriptionRu ?? '', Validators.required],
    projectDescription: this.formBuilder.nonNullable.group({
      projectDescriptionTitleGe: [
        this.project?.projectDescription?.projectDescriptionTitleGe ?? '',
        Validators.required,
      ],
      projectDescriptionTitleEn: [
        this.project?.projectDescription?.projectDescriptionTitleEn ?? '',
        Validators.required,
      ],
      projectDescriptionTitleRu: [
        this.project?.projectDescription?.projectDescriptionTitleRu ?? '',
        Validators.required,
      ],
      projectDescriptionContentGe: [
        this.project?.projectDescription?.projectDescriptionContentGe ?? '',
        Validators.required,
      ],
      projectDescriptionContentEn: [
        this.project?.projectDescription?.projectDescriptionContentEn ?? '',
        Validators.required,
      ],
      projectDescriptionContentRu: [
        this.project?.projectDescription?.projectDescriptionContentRu ?? '',
        Validators.required,
      ],
      projectShortDescriptionGe: [
        this.project?.projectDescription?.projectShortDescriptionGe ?? '',
        Validators.required,
      ],
      projectShortDescriptionEn: [
        this.project?.projectDescription?.projectShortDescriptionEn ?? '',
        Validators.required,
      ],
      projectShortDescriptionRu: [
        this.project?.projectDescription?.projectShortDescriptionRu ?? '',
        Validators.required,
      ],
    }),
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

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.expandAll.set(true);
      this.saveError.set(missingFieldsMessage(this.form));
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const raw = this.form.getRawValue();
    const payload: CreateProjectDto = {
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
    const dto = deepTrim(payload);

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
