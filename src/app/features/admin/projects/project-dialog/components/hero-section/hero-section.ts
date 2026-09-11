import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Company } from '../../../../../../core/models/api.models';
import { CompanyService } from '../../../../../../core/services/company.service';
import { ImageUploader } from '../../../../shared/image-uploader/image-uploader';
import { buildDescriptionCard, ProjectForm } from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { RichTextCardList } from '../rich-text-card-list/rich-text-card-list';
import { TranslatedChips } from '../translated-chips/translated-chips';
import { TranslatedField } from '../translated-field/translated-field';

/** Top of the property page: gallery, name, location, summary cards, chips and payment note. */
@Component({
  selector: 'app-hero-section',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FieldGroup,
    ImageUploader,
    RichTextCardList,
    TranslatedChips,
    TranslatedField,
  ],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  private readonly companyService = inject(CompanyService);

  readonly form = input.required<ProjectForm>();

  /** Gallery image ids, uploaded outside the form. */
  readonly images = model.required<string[]>();

  protected readonly companies = signal<Company[]>([]);
  protected readonly summaryCards = computed(() => this.form().controls.projectDescriptionCards);

  constructor() {
    this.companyService.getAll().subscribe((companies) => this.companies.set(companies));
  }

  protected addSummaryCard(): void {
    this.summaryCards().push(buildDescriptionCard());
  }
}
