import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ImageUploader } from '../../../../shared/image-uploader/image-uploader';
import { buildPricingRow, ProjectForm } from '../../project-form';

/** "The Property" → Floor Plans tab: plan images paired with the unit size prices. */
@Component({
  selector: 'app-floor-plans-section',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ImageUploader,
  ],
  templateUrl: './floor-plans-section.html',
  styleUrl: './floor-plans-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorPlansSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  /** Floor plan image ids, uploaded outside the form. */
  readonly images = model.required<string[]>();

  protected readonly expanded = signal(false);
  protected readonly pricingRows = computed(() => this.form().controls.pricingBySquareMeters);

  protected addPricingRow(): void {
    this.pricingRows().push(buildPricingRow());
  }

  protected removePricingRow(index: number): void {
    this.pricingRows().removeAt(index);
  }
}
