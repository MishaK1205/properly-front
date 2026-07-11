import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ADMIN_NAV_LINKS } from './admin.data';

@Component({
  selector: 'app-admin-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly auth = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly sidenav = viewChild.required(MatSidenav);
  protected readonly navLinks = ADMIN_NAV_LINKS;
  protected readonly adminEmail = this.auth.adminEmail;

  protected readonly isDesktop = toSignal(
    this.breakpointObserver
      .observe('(min-width: 1024px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  protected closeOnMobile(): void {
    if (!this.isDesktop()) {
      void this.sidenav().close();
    }
  }

  protected logout(): void {
    this.auth.logout();
  }
}
