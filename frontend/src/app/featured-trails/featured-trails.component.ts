import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrailProfile {
  name: string;
  profileImage: string;
  trailName: string;
  trailImage: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-featured-trails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-trails.component.html',
  styleUrl: './featured-trails.component.css'
})
export class FeaturedTrailsComponent {
  trailProfiles: TrailProfile[] = [
    {
      name: "Tori Chase",
      profileImage: "assets/hikers/defaultHiker1.png",
      trailName: "Mountain Ridge Trail",
      trailImage: "assets/trails/defaultTrail1.png",
      date: "July 15, 2024",
      description: "Join me for a challenging hike with breathtaking views!"
    },
    {
      name: "Andrew Holden",
      profileImage: "assets/hikers/defaultHiker2.png",
      trailImage: "assets/trails/defaultTrail2.png",
      trailName: "Lakeside Loop",
      date: "July 20, 2024",
      description: "Easy trail around a beautiful lake. Perfect for beginners!"
    },
    {
      name: "Cara Baker",
      profileImage: "assets/hikers/defaultHiker3.png",
      trailImage: "assets/trails/defaultTrail3.png",
      trailName: "Forest Adventure Path",
      date: "July 25, 2024",
      description: "Explore the wonders of the forest on this moderate trail."
    }
  ];
}
