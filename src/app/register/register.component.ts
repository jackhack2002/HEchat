import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  password: any;
  email: any;
  name: any;
  showPass: boolean = false;
  Type: string = 'password';

  constructor(private router: Router, private auth: AuthService) {}

  register() {
    this.auth.signup(this.email, this.password,this.name);
  }

  RegisterWithGoogle() {
    this.auth.signupWithGoogle();
  }

  navToLogin() {
    this.router.navigate(['/login']);
  }

  ShowPass() {
    this.showPass = !this.showPass;
    this.Type = this.Type === 'password' ? 'text' : 'password';
  }
}
