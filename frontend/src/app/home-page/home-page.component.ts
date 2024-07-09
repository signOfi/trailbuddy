import { Component } from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {HeroSectionComponent} from "../hero-section/hero-section.component";
import {FeaturedTrailsComponent} from "../featured-trails/featured-trails.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    FeaturedTrailsComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
