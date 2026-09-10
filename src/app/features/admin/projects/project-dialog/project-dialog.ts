import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectResponse } from '../../../../core/models/api.models';
import { ProjectService } from '../../../../core/services/project.service';
import { backendMessage, deepTrim, missingFieldsMessage } from '../../shared/form-utils';
import { FloorPlansSection } from './components/floor-plans-section/floor-plans-section';
import { HeroSection } from './components/hero-section/hero-section';
import { NumbersSection } from './components/numbers-section/numbers-section';
import { OurTakeSection } from './components/our-take-section/our-take-section';
import { OverviewSection } from './components/overview-section/overview-section';
import { PaymentPlanSection } from './components/payment-plan-section/payment-plan-section';
import { buildProjectForm, toCreateProjectDto } from './project-form';

/**
 * Creates and edits a project. Each accordion panel is one section of the property page,
 * in the order they appear there; the form itself is built in `project-form.ts`.
 */
@Component({
  selector: 'app-project-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FloorPlansSection,
    HeroSection,
    NumbersSection,
    OurTakeSection,
    OverviewSection,
    PaymentPlanSection,
  ],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly projectService = inject(ProjectService);
  private readonly dialogRef = inject(MatDialogRef<ProjectDialog>);

  protected readonly project = inject<ProjectResponse | null>(MAT_DIALOG_DATA);

  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  /** Opens every panel when a save fails, so no invalid field stays hidden. */
  protected readonly expandAll = signal(false);

  protected readonly projectImages = signal<string[]>([...(this.project?.projectImages ?? [])]);
  protected readonly floorPlanImages = signal<string[]>([...(this.project?.floorPlanImages ?? [])]);

  protected readonly form = buildProjectForm(this.project);

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

    const dto = deepTrim(
      toCreateProjectDto(this.form, this.projectImages(), this.floorPlanImages()),
    );

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
}
