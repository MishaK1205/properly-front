import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/companies`;

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.url);
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.url}/${id}`);
  }

  create(dto: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(this.url, dto);
  }

  update(id: string, dto: UpdateCompanyDto): Observable<Company> {
    return this.http.put<Company>(`${this.url}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
