import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ImageService } from '../../../../core/services/image.service';

/**
 * Uploads images to the backend and manages a list of image ids.
 * Used for project images and floor plan images.
 */
@Component({
  selector: 'app-image-uploader',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploader {
  private readonly imageService = inject(ImageService);
  private readonly snackBar = inject(MatSnackBar);

  readonly label = input.required<string>();
  readonly imageIds = model.required<string[]>();

  protected readonly uploading = signal(false);

  protected imageUrl(id: string): string {
    return this.imageService.imageUrl(id);
  }

  protected onFilesSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files ?? []);
    inputElement.value = '';

    if (files.length === 0) {
      return;
    }
    if (files.length > 10) {
      this.snackBar.open('You can upload up to 10 images at once', 'OK', { duration: 4000 });
      return;
    }

    this.uploading.set(true);
    this.imageService.upload(files).subscribe({
      next: (images) => {
        this.imageIds.update((ids) => [...ids, ...images.map((image) => image._id)]);
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.snackBar.open('Image upload failed', 'OK', { duration: 4000 });
      },
    });
  }

  protected remove(id: string): void {
    this.imageIds.update((ids) => ids.filter((existing) => existing !== id));
  }
}
