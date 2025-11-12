import { inject } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    const user = authService.getCurrentUser();
    const hasRole = user?.roles?.some(role => allowedRoles.includes(role));

    if (hasRole) {
      return true;
    }

    router.navigate(['/acesso-negado']);
    return false;
  };
};
