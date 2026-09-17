import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectResponse } from '../../../../core/models/api.models';
import { Button } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { ProjectCard } from './project-card/project-card';

const SKELETON_COUNT = 4;

@Component({
  selector: 'app-shortlist',
  imports: [SectionHeading, ProjectCard, Button, Skeleton, ScrollRevealDirective],
  templateUrl: './shortlist.html',
  styleUrl: './shortlist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shortlist {
  readonly projects = input.required<readonly ProjectResponse[]>();
  readonly loading = input(false);
  readonly failed = input(false);

  readonly interested = output<string>();
  readonly retry = output<void>();

  protected readonly skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => i);
}
