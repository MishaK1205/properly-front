import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ProjectForm } from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { TranslatedChips } from '../translated-chips/translated-chips';
import { TranslatedRichText } from '../translated-rich-text/translated-rich-text';

/** "Our Take" section: the write-up and the verification checklist box beside it. */
@Component({
  selector: 'app-our-take-section',
  imports: [FieldGroup, TranslatedChips, TranslatedRichText],
  templateUrl: './our-take-section.html',
  styleUrl: './our-take-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTakeSection {
  readonly form = input.required<ProjectForm>();

  protected readonly description = computed(() => this.form().controls.projectDescription);
}
