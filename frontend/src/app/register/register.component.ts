import { Component } from '@angular/core';
import { UserService } from "../services/user.service";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { UserDTO } from '../model/UserDTO';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent,
    CommonModule
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
  dateOfBirth: string = '';
  state: string = '';
  zipcode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  profilePicture: File | null = null;
  profilePictureName: string = '';
  formErrors: { [key: string]: string } = {};

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (this.validateForm()) {
      const userData: UserDTO = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
        dateOfBirth: this.dateOfBirth,
        state: this.state,
        zipcode: this.zipcode,
        profilePictureUrl: null
      };

      this.userService.register(userData).subscribe(
        response => {
          console.log("Register Success", response);
          this.successMessage = "Registration successful! Redirecting to home page...";
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error => {
          console.error("Register failed", error);
          this.errorMessage = "Registration failed. Please try again";
          this.successMessage = '';
        }
      );
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.firstName) {
      this.formErrors['firstName'] = "First name is required.";
      isValid = false;
    }

    if (!this.lastName) {
      this.formErrors['lastName'] = "Last name is required.";
      isValid = false;
    }

    if (!this.email) {
      this.formErrors['email'] = "Email is required.";
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.formErrors['email'] = "Please enter a valid email address.";
      isValid = false;
    }

    if (!this.username) {
      this.formErrors['username'] = "Username is required.";
      isValid = false;
    }

    if (!this.password) {
      this.formErrors['password'] = "Password is required.";
      isValid = false;
    } else if (this.password.length < 8) {
      this.formErrors['password'] = "Password must be at least 8 characters long.";
      isValid = false;
    }

    if (!this.confirmPassword) {
      this.formErrors['confirmPassword'] = "Please confirm your password.";
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.formErrors['confirmPassword'] = "Passwords do not match.";
      isValid = false;
    }

    if (!this.dateOfBirth) {
      this.formErrors['dateOfBirth'] = "Date of birth is required.";
      isValid = false;
    }

    if (!this.state) {
      this.formErrors['state'] = "State is required.";
      isValid = false;
    }

    if (!this.zipcode) {
      this.formErrors['zipcode'] = "Zip code is required.";
      isValid = false;
    } else if (!this.isValidZipcode(this.zipcode)) {
      this.formErrors['zipcode'] = "Please enter a valid zip code.";
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidZipcode(zipcode: string): boolean {
    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    return zipcodeRegex.test(zipcode);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      this.profilePicture = file;
      this.profilePictureName = file.name;
    } else {
      this.errorMessage = 'Please select an image file.';
    }
  }
}
