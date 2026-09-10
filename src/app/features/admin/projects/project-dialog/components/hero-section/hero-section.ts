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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { Company } from '../../../../../../core/models/api.models';
import { CompanyService } from '../../../../../../core/services/company.service';
import { ImageUploader } from '../../../../shared/image-uploader/image-uploader';
import { LANGUAGES } from '../../../../shared/languages';
import { buildDescriptionCard, ProjectForm } from '../../project-form';
import { ChipListTabs } from '../chip-list-tabs/chip-list-tabs';
import { TranslatedCardList } from '../translated-card-list/translated-card-list';

/** Top of the property page: gallery, name, location, summary cards, chips and payment note. */
@Component({
  selector: 'app-hero-section',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ChipListTabs,
    ImageUploader,
    TranslatedCardList,
  ],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  private readonly companyService = inject(CompanyService);

  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  /** Gallery image ids, uploaded outside the form. */
  readonly images = model.required<string[]>();

  protected readonly languages = LANGUAGES;
  protected readonly companies = signal<Company[]>([]);
  protected readonly expanded = signal(true);
  protected readonly summaryCards = computed(() => this.form().controls.projectDescriptionCards);

  constructor() {
    this.companyService.getAll().subscribe((companies) => this.companies.set(companies));
  }

  protected addSummaryCard(): void {
    this.summaryCards().push(buildDescriptionCard());
  }
}
