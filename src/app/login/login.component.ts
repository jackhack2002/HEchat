import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPass: any;
  email: any;
  Type: any;
  password: any;

  constructor(private router: Router,private userauth:AuthService) {}


  login() {
    this.userauth.login(this.email, this.password);
  }

  loginWithGoogle(): void {
    this.userauth.signupWithGoogle();
  }

  navToRegister() {
    this.router.navigate(['/register']);
  }

  ShowPass() {
    this.showPass = !this.showPass;
    this.Type = this.Type === 'password' ? 'text' : 'password'; 
  }
}
