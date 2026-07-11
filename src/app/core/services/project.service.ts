import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { CreateProjectDto, ProjectResponse, UpdateProjectDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/projects`;

  getAll(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.url);
  }

  getById(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.url}/${id}`);
  }

  create(dto: CreateProjectDto): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.url, dto);
  }

  update(id: string, dto: UpdateProjectDto): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.url}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
