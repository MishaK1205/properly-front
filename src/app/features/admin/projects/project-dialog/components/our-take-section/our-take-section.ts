import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';
import { ProjectForm } from '../../project-form';
import { ChipListTabs } from '../chip-list-tabs/chip-list-tabs';

/** "Our Take" section: the write-up and the verification checklist box beside it. */
@Component({
  selector: 'app-our-take-section',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    ChipListTabs,
  ],
  templateUrl: './our-take-section.html',
  styleUrl: './our-take-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTakeSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  protected readonly languages = LANGUAGES;
  protected readonly expanded = signal(false);
}
