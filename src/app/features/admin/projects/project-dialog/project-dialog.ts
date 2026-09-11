import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectResponse } from '../../../../core/models/api.models';
import { ProjectService } from '../../../../core/services/project.service';
import { backendMessage, deepTrim, missingFieldsMessage } from '../../shared/form-utils';
import { Language } from '../../shared/languages';
import { FloorPlansSection } from './components/floor-plans-section/floor-plans-section';
import { HeroSection } from './components/hero-section/hero-section';
import { LanguageSwitcher } from './components/language-switcher/language-switcher';
import { NumbersSection } from './components/numbers-section/numbers-section';
import { OurTakeSection } from './components/our-take-section/our-take-section';
import { OverviewSection } from './components/overview-section/overview-section';
import { PaymentPlanSection } from './components/payment-plan-section/payment-plan-section';
import { SectionNav } from './components/section-nav/section-nav';
import { buildProjectForm, toCreateProjectDto } from './project-form';
import { ProjectLanguage } from './project-language';
import {
  firstMissingLanguage,
  isSectionInvalid,
  languagesWithMissingFields,
  PROJECT_SECTIONS,
  ProjectSectionId,
  ProjectStep,
} from './project-sections';

/**
 * Creates and edits a project. The step rail picks one section of the property page at a time,
 * and the header switcher picks the language every translated field is bound to, so a field is
 * on screen once instead of once per language. The form itself is built in `project-form.ts`.
 */
@Component({
  selector: 'app-project-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FloorPlansSection,
    HeroSection,
    LanguageSwitcher,
    NumbersSection,
    OurTakeSection,
    OverviewSection,
    PaymentPlanSection,
    SectionNav,
  ],
  providers: [ProjectLanguage],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly projectService = inject(ProjectService);
  private readonly dialogRef = inject(MatDialogRef<ProjectDialog>);
  private readonly language = inject(ProjectLanguage);

  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');

  protected readonly project = inject<ProjectResponse | null>(MAT_DIALOG_DATA);

  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly totalSteps = PROJECT_SECTIONS.length;

  protected readonly projectImages = signal<string[]>([...(this.project?.projectImages ?? [])]);

  protected readonly form = buildProjectForm(this.project);
  protected readonly sectionId = signal<ProjectSectionId>(PROJECT_SECTIONS[0].id);

  /** Empty fields are only flagged once the user tried to save, not on a blank new project. */
  private readonly submitAttempted = signal(false);

  /** Reactive forms report through observables, so validity has to be mirrored into a signal. */
  private readonly formEvents = toSignal(this.form.events, { initialValue: null });

  private readonly activeIndex = computed(() =>
    PROJECT_SECTIONS.findIndex((section) => section.id === this.sectionId()),
  );

  protected readonly steps = computed<readonly ProjectStep[]>(() => {
    this.formEvents();
    const flagMissing = this.submitAttempted();
    const activeId = this.sectionId();

    return PROJECT_SECTIONS.map((section, index) => ({
      ...section,
      step: index + 1,
      active: section.id === activeId,
      missing: flagMissing && isSectionInvalid(this.form, section),
    }));
  });

  protected readonly current = computed(() => this.steps()[this.activeIndex()]);

  protected readonly previous = computed<ProjectStep | null>(() => {
    const index = this.activeIndex();
    return index > 0 ? this.steps()[index - 1] : null;
  });

  protected readonly next = computed<ProjectStep | null>(() => {
    const steps = this.steps();
    const index = this.activeIndex();
    return index < steps.length - 1 ? steps[index + 1] : null;
  });

  protected readonly missingLanguages = computed<ReadonlySet<Language['suffix']>>(() => {
    this.formEvents();
    return this.submitAttempted()
      ? languagesWithMissingFields(this.form)
      : new Set<Language['suffix']>();
  });

  protected goTo(id: ProjectSectionId): void {
    this.sectionId.set(id);
    // The steps share one scroll container, so a new one has to start at its top.
    this.scroller().nativeElement.scrollTop = 0;
  }

  protected save(): void {
    if (this.saving()) {
      return;
    }

    this.submitAttempted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.saveError.set(missingFieldsMessage(this.form));
      this.revealFirstMissingField();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const dto = deepTrim(toCreateProjectDto(this.form, this.projectImages()));

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

  /** Only one step and one language are on screen, so a missing field has to be brought into view. */
  private revealFirstMissingField(): void {
    const section = PROJECT_SECTIONS.find((candidate) => isSectionInvalid(this.form, candidate));
    if (!section) {
      return;
    }

    this.goTo(section.id);

    const suffix = firstMissingLanguage(this.form, section);
    if (suffix) {
      this.language.select(suffix);
    }
  }
}
