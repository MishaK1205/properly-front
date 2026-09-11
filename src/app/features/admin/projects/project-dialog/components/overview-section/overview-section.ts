import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProjectForm } from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { TranslatedField } from '../translated-field/translated-field';

/** "The Property" → Overview tab: the fact rows and the distances. */
@Component({
  selector: 'app-overview-section',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FieldGroup,
    TranslatedField,
  ],
  templateUrl: './overview-section.html',
  styleUrl: './overview-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewSection {
  readonly form = input.required<ProjectForm>();
}
