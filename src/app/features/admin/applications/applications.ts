import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';

import { GetInTouchWithProject } from '../../../core/models/api.models';
import { GetInTouchService } from '../../../core/services/get-in-touch.service';

@Component({
  selector: 'app-admin-applications',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminApplications {
  private readonly getInTouchService = inject(GetInTouchService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly applications = signal<GetInTouchWithProject[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  protected readonly columns = ['fullName', 'whatsAppNumber', 'project', 'budgetRange', 'investmentPurpose', 'createdAt'] as const;

  protected readonly isDesktop = toSignal(
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map((state) => state.matches)),
    { initialValue: true },
  );

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.getInTouchService.getAll().subscribe({
      next: (applications) => {
        this.applications.set(applications);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  protected whatsAppLink(number: string): string {
    return `https://wa.me/${number.replace(/[^\d]/g, '')}`;
  }
}
