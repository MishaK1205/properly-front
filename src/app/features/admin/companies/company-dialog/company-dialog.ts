import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { Company, CreateCompanyDto } from '../../../../core/models/api.models';
import { CompanyService } from '../../../../core/services/company.service';
import { LANGUAGES } from '../../shared/languages';

@Component({
  selector: 'app-company-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  templateUrl: './company-dialog.html',
  styleUrl: './company-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly dialogRef = inject(MatDialogRef<CompanyDialog>);

  protected readonly company = inject<Company | null>(MAT_DIALOG_DATA);
  protected readonly languages = LANGUAGES;
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    companyName: [this.company?.companyName ?? '', Validators.required],
    projectsCompleted: [this.company?.projectsCompleted ?? 0, [Validators.required, Validators.min(0)]],
    unitsDelivered: [this.company?.unitsDelivered ?? 0, [Validators.required, Validators.min(0)]],
    activeProjects: [this.company?.activeProjects ?? 0, [Validators.required, Validators.min(0)]],
    operatingSince: [
      this.company?.operatingSince ?? new Date().getFullYear(),
      [Validators.required, Validators.min(1800), Validators.max(2100)],
    ],
    companyLocationGe: [this.company?.companyLocationGe ?? '', Validators.required],
    companyLocationEn: [this.company?.companyLocationEn ?? '', Validators.required],
    companyLocationRu: [this.company?.companyLocationRu ?? '', Validators.required],
    companyDescriptionGe: [this.company?.companyDescriptionGe ?? '', Validators.required],
    companyDescriptionEn: [this.company?.companyDescriptionEn ?? '', Validators.required],
    companyDescriptionRu: [this.company?.companyDescriptionRu ?? '', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(false);
    const dto: CreateCompanyDto = this.form.getRawValue();

    const request = this.company
      ? this.companyService.update(this.company._id, dto)
      : this.companyService.create(dto);

    request.subscribe({
      next: (saved) => this.dialogRef.close(saved),
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }
}
