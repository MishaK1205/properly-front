import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { JwtPayload, LoginDto, LoginResponse } from '../models/api.models';

const TOKEN_STORAGE_KEY = 'admin_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly tokenSignal = signal<string | null>(this.readStoredToken());

  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    return token !== null && !isExpired(token);
  });
  readonly adminEmail = computed(() => {
    const token = this.tokenSignal();
    return token ? (decodePayload(token)?.email ?? null) : null;
  });

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials)
      .pipe(tap(({ accessToken }) => this.storeToken(accessToken)));
  }

  logout(): void {
    this.storeToken(null);
    void this.router.navigate(['/admin/login']);
  }

  private storeToken(token: string | null): void {
    this.tokenSignal.set(token);
    if (!this.isBrowser) {
      return;
    }
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private readStoredToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    return token && !isExpired(token) ? token : null;
  }
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const payload = decodePayload(token);
  if (!payload?.exp) {
    return false;
  }
  return Date.now() >= payload.exp * 1000;
}
