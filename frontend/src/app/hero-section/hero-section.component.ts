import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  scrollToTrips() {
    const tripsElement = document.querySelector('.featured-trails');
    if (tripsElement) {
      tripsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
