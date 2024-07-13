import { Component } from '@angular/core';
import { UserService } from "../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    console.log('Attempting login for user:', this.username);
    this.userService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log("Login success", response);
        this.successMessage = "Login successful! Redirecting to home page...";
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        console.error("Login failed", error);
        this.errorMessage = error.error || "Login failed. Please check your credentials";
        this.successMessage = '';
      }
    });
  }

  validateForm(): boolean {
    if (!this.username || !this.password) {
      this.errorMessage = "Please enter both username and password.";
      return false;
    }
    return true;
  }
}
