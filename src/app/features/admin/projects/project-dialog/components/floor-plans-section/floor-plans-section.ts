import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ImageUploader } from '../../../../shared/image-uploader/image-uploader';
import {
  ApartmentPlanForm,
  buildApartmentCard,
  buildApartmentPlan,
  ProjectForm,
} from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { RichTextCardList } from '../rich-text-card-list/rich-text-card-list';

/** "The Property" → Floor Plans tab: plan images and highlight cards per apartment type. */
@Component({
  selector: 'app-floor-plans-section',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FieldGroup,
    ImageUploader,
    RichTextCardList,
  ],
  templateUrl: './floor-plans-section.html',
  styleUrl: './floor-plans-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorPlansSection {
  readonly form = input.required<ProjectForm>();

  protected readonly apartmentPlans = computed(() => this.form().controls.apartmentPlans);

  protected addApartmentPlan(): void {
    this.apartmentPlans().push(buildApartmentPlan());
  }

  protected removeApartmentPlan(index: number): void {
    this.apartmentPlans().removeAt(index);
  }

  protected addApartmentCard(plan: ApartmentPlanForm): void {
    plan.controls.apartmentCards.push(buildApartmentCard());
  }

  /** The uploader owns a plain array, so its changes are written back into the control. */
  protected setPlanImages(plan: ApartmentPlanForm, imageIds: string[]): void {
    plan.controls.apartmentPlanImages.setValue(imageIds);
    plan.controls.apartmentPlanImages.markAsDirty();
  }
}
