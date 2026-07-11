import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProjectResponse } from '../../../core/models/api.models';
import { ImageService } from '../../../core/services/image.service';
import { ProjectService } from '../../../core/services/project.service';
import { ConfirmDialog, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog';
import { ProjectDialog } from './project-dialog/project-dialog';

@Component({
  selector: 'app-admin-projects',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjects {
  private readonly projectService = inject(ProjectService);
  private readonly imageService = inject(ImageService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly projects = signal<ProjectResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  protected coverImage(project: ProjectResponse): string | null {
    const id = project.projectImages[0];
    return id ? this.imageService.imageUrl(id) : null;
  }

  protected openCreate(): void {
    this.openDialog(null);
  }

  protected openEdit(project: ProjectResponse): void {
    this.openDialog(project);
  }

  protected confirmDelete(project: ProjectResponse): void {
    const data: ConfirmDialogData = {
      title: 'Delete project',
      message: `Are you sure you want to delete "${project.projectName}"? This cannot be undone.`,
      confirmLabel: 'Delete',
    };

    this.dialog
      .open(ConfirmDialog, { data, maxWidth: '26rem' })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }
        this.projectService.delete(project._id).subscribe({
          next: () => {
            this.projects.update((list) => list.filter((p) => p._id !== project._id));
            this.snackBar.open('Project deleted', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete project', 'OK', { duration: 4000 }),
        });
      });
  }

  private openDialog(project: ProjectResponse | null): void {
    this.dialog
      .open(ProjectDialog, {
        data: project,
        width: '56rem',
        maxWidth: 'calc(100vw - 1rem)',
        maxHeight: 'calc(100dvh - 2rem)',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((saved: ProjectResponse | undefined) => {
        if (!saved) {
          return;
        }
        this.projects.update((list) => {
          const index = list.findIndex((p) => p._id === saved._id);
          return index === -1
            ? [saved, ...list]
            : list.map((p) => (p._id === saved._id ? saved : p));
        });
        this.snackBar.open(project ? 'Project updated' : 'Project created', 'OK', {
          duration: 3000,
        });
      });
  }
}
