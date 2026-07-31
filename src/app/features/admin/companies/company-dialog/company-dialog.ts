import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { Company, CreateCompanyDto } from '../../../../core/models/api.models';
import { CompanyService } from '../../../../core/services/company.service';
import {
  backendMessage,
  deepTrim,
  missingFieldsMessage,
  notBlank,
} from '../../shared/form-utils';
import { Language, LANGUAGES } from '../../shared/languages';

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
  private readonly injector = inject(Injector);

  private readonly errorBanner = viewChild<ElementRef<HTMLElement>>('errorBanner');

  protected readonly company = inject<Company | null>(MAT_DIALOG_DATA);
  protected readonly languages = LANGUAGES;
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly selectedTab = signal(0);

  private readonly submitAttempted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    companyName: [this.company?.companyName ?? '', [Validators.required, notBlank]],
    projectsCompleted: [
      this.company?.projectsCompleted ?? 0,
      [Validators.required, Validators.min(0)],
    ],
    unitsDelivered: [this.company?.unitsDelivered ?? 0, [Validators.required, Validators.min(0)]],
    activeProjects: [this.company?.activeProjects ?? 0, [Validators.required, Validators.min(0)]],
    operatingSince: [
      this.company?.operatingSince ?? new Date().getFullYear(),
      [Validators.required, Validators.min(1800), Validators.max(2100)],
    ],
    companyLocationGe: [this.company?.companyLocationGe ?? '', [Validators.required, notBlank]],
    companyLocationEn: [this.company?.companyLocationEn ?? '', [Validators.required, notBlank]],
    companyLocationRu: [this.company?.companyLocationRu ?? '', [Validators.required, notBlank]],
    companyDescriptionGe: [
      this.company?.companyDescriptionGe ?? '',
      [Validators.required, notBlank],
    ],
    companyDescriptionEn: [
      this.company?.companyDescriptionEn ?? '',
      [Validators.required, notBlank],
    ],
    companyDescriptionRu: [
      this.company?.companyDescriptionRu ?? '',
      [Validators.required, notBlank],
    ],
  });

  private readonly formEvents = toSignal(this.form.events, { initialValue: null });

  /** Suffixes of languages still missing input, flagged on the tab labels once a save was attempted. */
  protected readonly incompleteLanguages = computed<ReadonlySet<Language['suffix']>>(() => {
    this.formEvents();
    if (!this.submitAttempted()) {
      return new Set<Language['suffix']>();
    }
    return new Set(
      LANGUAGES.filter((language) => this.isLanguageIncomplete(language)).map(
        (language) => language.suffix,
      ),
    );
  });

  protected save(): void {
    if (this.saving()) {
      return;
    }

    this.submitAttempted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.revealFirstIncompleteLanguage();
      this.saveError.set(missingFieldsMessage(this.form));
      this.scrollErrorIntoView();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    const dto = deepTrim<CreateCompanyDto>(this.form.getRawValue());

    const request = this.company
      ? this.companyService.update(this.company._id, dto)
      : this.companyService.create(dto);

    request.subscribe({
      next: (saved) => this.dialogRef.close(saved),
      error: (error: unknown) => {
        this.saving.set(false);
        this.saveError.set(
          backendMessage(error) ??
            'Failed to save the company. Please check the fields and try again.',
        );
        this.scrollErrorIntoView();
      },
    });
  }

  /** The dialog body scrolls, so the message can land off-screen below the fold. */
  private scrollErrorIntoView(): void {
    afterNextRender(
      () => this.errorBanner()?.nativeElement.scrollIntoView({ block: 'nearest' }),
      { injector: this.injector },
    );
  }

  /** Required fields live behind language tabs, so an invalid one must be brought into view. */
  private revealFirstIncompleteLanguage(): void {
    const index = LANGUAGES.findIndex((language) => this.isLanguageIncomplete(language));
    if (index !== -1) {
      this.selectedTab.set(index);
    }
  }

  private isLanguageIncomplete(language: Language): boolean {
    return this.languageControls(language).some((control) => control.invalid);
  }

  private languageControls(language: Language): readonly AbstractControl[] {
    const { controls } = this.form;
    return [
      controls[`companyLocation${language.suffix}`],
      controls[`companyDescription${language.suffix}`],
    ];
  }
}
