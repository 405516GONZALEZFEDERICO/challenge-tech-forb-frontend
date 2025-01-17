import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/login-service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  private authService = inject(AuthService);
  private router = inject(Router);

 
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('.navbar');
    const navList = document.querySelector('.nav-list');
    
    navbar?.classList.toggle('navbar-mobile');
    navList?.classList.toggle('nav-list-mobile');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

}
