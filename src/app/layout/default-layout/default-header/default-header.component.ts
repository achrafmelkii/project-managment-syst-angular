import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [
    CommonModule,
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    BreadcrumbRouterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    BadgeComponent,
    DropdownDividerDirective,
  ],
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  user: User | null = null; // Strongly type user

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' },
  ];
  userRole: string | null = null; // Store the user role

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return (
      this.colorModes.find((mode) => mode.name === currentMode)?.icon ??
      'cilSun'
    );
  });

  imagePreview: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    super();
    this.loadUserRole();
    this.loadUserData();
  }

  loadUserRole() {
    this.userRole = this.authService.getUserRole(); // Assume you have this method in AuthService
    console.log('User role:', this.userRole);
  }

  loadUserData(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.log('No user ID found. Please login again.');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        this.user = userData as User;
        this.imagePreview =
          this.user?.image ||
          'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
        console.log('Image preview set to:', this.imagePreview); // Debug log
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading user data:', err);
        this.imagePreview =
          'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
      },
    });
  }

  logout(): void {
    console.log('Token before logout:', localStorage.getItem('token'));

    this.authService.logout();

    const tokenExists = this.authService.hasToken();
    console.log('Token after logout:', tokenExists);

    this.router.navigate(['/login']); // Redirect if needed
  }

  sidebarId = input('sidebar1');

  navigateToProfile() {
    this.router.navigate([`${this.userRole}/profile`]);
  }
}
