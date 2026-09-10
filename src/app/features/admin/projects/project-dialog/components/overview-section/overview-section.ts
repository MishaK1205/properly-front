import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';
import { ProjectForm } from '../../project-form';

/** "The Property" → Overview tab: the fact rows and the distances. */
@Component({
  selector: 'app-overview-section',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './overview-section.html',
  styleUrl: './overview-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  protected readonly languages = LANGUAGES;
  protected readonly expanded = signal(false);
}
