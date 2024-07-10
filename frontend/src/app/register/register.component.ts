import { Component } from '@angular/core';
import { UserService } from "../services/user.service";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  dob: string = '';
  gender: string = '';
  state: string = '';
  city: string = '';
  communicationPreference: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password,
      dob: this.dob,
      gender: this.gender,
      state: this.state,
      city: this.city,
      communicationPreference: this.communicationPreference
    };

    this.userService.register(userData).subscribe(
      response => {
        console.log("Register Success", response);
        // Handle successful registration (e.g., redirect to login page)
      },
      error => {
        console.log("Register failed", error);
        this.errorMessage = "Registration failed. Please try again";
      }
    );
  }
}
