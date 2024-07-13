import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from "@angular/common";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private userService: UserService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit() {
    this.userService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  signOut() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
