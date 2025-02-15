import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { FeaturedTrailsComponent } from '../featured-trails/featured-trails.component';
import { HostEventComponent } from '../host-event/host-event.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    FeaturedTrailsComponent,
    HostEventComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  activeTab: string = 'featured';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
