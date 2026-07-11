import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { GetInTouchWithProject } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GetInTouchService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/get-in-touch`;

  getAll(): Observable<GetInTouchWithProject[]> {
    return this.http.get<GetInTouchWithProject[]>(this.url);
  }
}
