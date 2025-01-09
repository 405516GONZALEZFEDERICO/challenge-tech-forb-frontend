import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy{


  showPassword: boolean = false;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
