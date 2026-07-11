import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Company } from '../../../core/models/api.models';
import { CompanyService } from '../../../core/services/company.service';
import { ConfirmDialog, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog';
import { CompanyDialog } from './company-dialog/company-dialog';

@Component({
  selector: 'app-admin-companies',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCompanies {
  private readonly companyService = inject(CompanyService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly companies = signal<Company[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.companyService.getAll().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  protected openCreate(): void {
    this.openDialog(null);
  }

  protected openEdit(company: Company): void {
    this.openDialog(company);
  }

  protected confirmDelete(company: Company): void {
    const data: ConfirmDialogData = {
      title: 'Delete company',
      message: `Are you sure you want to delete "${company.companyName}"? This cannot be undone.`,
      confirmLabel: 'Delete',
    };

    this.dialog
      .open(ConfirmDialog, { data, maxWidth: '26rem' })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }
        this.companyService.delete(company._id).subscribe({
          next: () => {
            this.companies.update((list) => list.filter((c) => c._id !== company._id));
            this.snackBar.open('Company deleted', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete company', 'OK', { duration: 4000 }),
        });
      });
  }

  private openDialog(company: Company | null): void {
    this.dialog
      .open(CompanyDialog, {
        data: company,
        width: '46rem',
        maxWidth: 'calc(100vw - 2rem)',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((saved: Company | undefined) => {
        if (!saved) {
          return;
        }
        this.companies.update((list) => {
          const index = list.findIndex((c) => c._id === saved._id);
          return index === -1
            ? [saved, ...list]
            : list.map((c) => (c._id === saved._id ? saved : c));
        });
        this.snackBar.open(company ? 'Company updated' : 'Company created', 'OK', {
          duration: 3000,
        });
      });
  }
}
