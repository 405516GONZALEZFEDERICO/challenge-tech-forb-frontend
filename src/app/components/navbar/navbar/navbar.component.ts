import { Component, HostListener, inject } from '@angular/core';
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
  isMobileView = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 393;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('.navbar');
    const navList = document.querySelector('.nav-list');
    
    if (navbar && navList) {
      navbar.classList.toggle('navbar-mobile');
      navList.classList.toggle('nav-list-mobile');
    }
  }

  logout() {
    console.log("Logout clicked");
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
