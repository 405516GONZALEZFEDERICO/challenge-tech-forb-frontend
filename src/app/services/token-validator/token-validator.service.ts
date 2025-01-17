import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenValidatorService {
  // private checkInterval: any;
  // private readonly INTERVAL_TIME = 30000; 

  //   private authService= inject(AuthService);
  //   private router=inject (Router);


  // startTokenValidation() {
  //   this.validateTokens();
    
  //   this.checkInterval = setInterval(() => {
  //     this.validateTokens();
  //   }, this.INTERVAL_TIME);
  // }

  // stopTokenValidation() {
  //   if (this.checkInterval) {
  //     clearInterval(this.checkInterval);
  //   }
  // }

  // ngOnDestroy() {
  //   this.stopTokenValidation();
  // }

  // private validateTokens() {
  //   const accessToken = this.authService.getToken();
  //   const refreshToken = this.authService.getRefreshTokenValidator(); 

  //   if (!accessToken || !refreshToken) {
  //     this.handleInvalidToken();
  //     return;
  //   }

  //   // Verificar primero el refresh token
  //   if (this.authService.isTokenExpired(refreshToken)) {
  //     console.log('Refresh token expirado - Forzando logout');
  //     this.handleInvalidToken();
  //     return;
  //   }

  //   // Si el access token está expirado pero el refresh es válido
  //   if (this.authService.isTokenExpired(accessToken)) {
  //     console.log('Access token expirado - Intentando refresh');
  //     this.authService.refreshToken().subscribe({
  //       error: (error) => {
  //         console.error('Error al refrescar token', error);
  //         this.handleInvalidToken();
  //       }
  //     });
  //   }
  // }

  // private handleInvalidToken() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
}
