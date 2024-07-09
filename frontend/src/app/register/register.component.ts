import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = ''
  password: string = ''
  confirmPassword: string = ''
  errorMessage: string = ''

  constructor(private userService: UserService) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match"
      return;
    }

    this.userService.register(this.username, this.password).subscribe(
      response => {
        console.log("Register Success", response)
      },
    error => {
      console.log("Register failed", error);
      this.errorMessage = "Register failed. Please try again";
    }
  );
  }

}
