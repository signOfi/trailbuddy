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

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

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
        }, 2000); // Redirect after 2 seconds
      },
      error => {
        console.error("Register failed", error);
        this.errorMessage = "Registration failed. Please try again";
        this.successMessage = '';
      }
    );
  }

  validateForm(): boolean {
    if (!this.firstName || !this.lastName || !this.email || !this.username ||
      !this.password || !this.confirmPassword || !this.dateOfBirth ||
      !this.state || !this.zipcode) {
      this.errorMessage = "Please fill in all required fields.";
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return false;
    }
    return true;
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
