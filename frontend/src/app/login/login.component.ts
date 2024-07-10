import { Component } from '@angular/core';
import { UserService } from "../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";

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

  constructor(private userService: UserService) {}

  onSubmit() {
    console.log("Login attempted", this.username, this.password);
    this.userService.login(this.username, this.password).subscribe(
      response => {
        console.log("Login success", response);
      },
      error => {
        console.log("Login failed", error);
        this.errorMessage = "Login failed. Please check your credentials";
      }
    );
  }
}
