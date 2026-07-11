import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { Image } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/images`;

  /** Public URL that streams the binary image — usable directly in `src`. */
  imageUrl(id: string): string {
    return `${this.url}/${id}`;
  }

  upload(files: readonly File[]): Observable<Image[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }
    return this.http.post<Image[]>(this.url, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
