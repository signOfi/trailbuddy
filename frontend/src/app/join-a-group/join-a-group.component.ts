import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, NavigationEnd } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-join-a-group',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './join-a-group.component.html',
  styleUrl: './join-a-group.component.css'
})
export class JoinAGroupComponent implements OnInit {
  groupProfiles = [
    {
      trailName: 'Mountain Ridge Trail',
      trailImage: '/assets/trails/defaultTrail1.png',
      date: 'July 15, 2024',
      organizer: 'Alex Hiker',
      organizerImage: '/assets/hikers/defaultHiker1.png',
      difficulty: 'Challenging',
      spotsLeft: 3,
      trailInfo: 'Scenic mountain views, 12-mile loop, elevation gain: 3000 ft',
      address: '123 Pine Ridge Rd',
      zipCode: '80302'
    },
    {
      trailName: 'Lakeside Loop',
      trailImage: '/assets/trails/defaultTrail2.png',
      date: 'July 20, 2024',
      organizer: 'Emma Nature',
      organizerImage: '/assets/hikers/defaultHiker2.png',
      difficulty: 'Easy',
      spotsLeft: 5,
      trailInfo: 'Peaceful lake trail, 5-mile loop, mostly flat terrain',
      address: '456 Lakeshore Dr',
      zipCode: '54901'
    },
    {
      trailName: 'Forest Adventure Path',
      trailImage: '/assets/trails/defaultTrail3.png',
      date: 'July 25, 2024',
      organizer: 'Mike Wilderness',
      organizerImage: '/assets/hikers/defaultHiker3.png',
      difficulty: 'Moderate',
      spotsLeft: 4,
      trailInfo: 'Dense forest trail, 8-mile out and back, varied terrain',
      address: '789 Forest Lane',
      zipCode: '97701'
    },
    {
      trailName: 'Canyon Explorer Route',
      trailImage: '/assets/trails/defaultTrail4.png',
      date: 'August 1, 2024',
      organizer: 'Sarah Adventurer',
      organizerImage: '/assets/hikers/defaultHiker4.png',
      difficulty: 'Challenging',
      spotsLeft: 2,
      trailInfo: 'Steep canyon walls, 10-mile trek, technical climbing sections',
      address: '321 Canyon View',
      zipCode: '86023'
    },
    {
      trailName: 'Coastal Cliff Walk',
      trailImage: '/assets/trails/defaultTrail5.png',
      date: 'August 5, 2024',
      organizer: 'Tom Seabreeze',
      organizerImage: '/assets/hikers/defaultHiker5.png',
      difficulty: 'Moderate',
      spotsLeft: 6,
      trailInfo: 'Breathtaking ocean views, 7-mile coastal path, some steep sections',
      address: '654 Oceanfront Ave',
      zipCode: '93940'
    },
    {
      trailName: 'Desert Oasis Trek',
      trailImage: '/assets/trails/defaultTrail6.png',
      date: 'August 10, 2024',
      organizer: 'Lisa Sandwalker',
      organizerImage: '/assets/hikers/defaultHiker6.png',
      difficulty: 'Challenging',
      spotsLeft: 3,
      trailInfo: 'Unique desert landscapes, 15-mile journey, sun exposure',
      address: '987 Cactus Rd',
      zipCode: '85364'
    },
    {
      trailName: 'Waterfall Wonders Trail',
      trailImage: '/assets/trails/defaultTrail7.png',
      date: 'August 15, 2024',
      organizerImage: '/assets/hikers/defaultHiker7.png',
      organizer: 'David Cascade',
      difficulty: 'Moderate',
      spotsLeft: 4,
      trailInfo: 'Multiple waterfall views, 6-mile loop, some slippery sections',
      address: '159 Cascade Way',
      zipCode: '98801'
    },
    {
      trailName: 'Alpine Meadow Path',
      trailImage: '/assets/trails/defaultTrail8.png',
      date: 'August 20, 2024',
      organizer: 'Rachel Mountaineer',
      organizerImage: '/assets/hikers/defaultHiker8.png',
      difficulty: 'Easy',
      spotsLeft: 7,
      trailInfo: 'Beautiful wildflowers, 4-mile gentle climb, high altitude',
      address: '753 Meadow Lane',
      zipCode: '81611'
    },
    {
      trailName: 'Riverside Ramble',
      trailImage: '/assets/trails/defaultTrail9.png',
      date: 'August 25, 2024',
      organizer: 'Oliver Stream',
      organizerImage: '/assets/hikers/defaultHiker9.png',
      difficulty: 'Easy',
      spotsLeft: 8,
      trailInfo: 'Scenic river walk, 3-mile out and back, perfect for beginners',
      address: '246 River Rd',
      zipCode: '59801'
    },
    {
      trailName: 'Summit Seeker Challenge',
      trailImage: '/assets/trails/defaultTrail10.png',
      date: 'August 30, 2024',
      organizer: 'Petra Peakbagger',
      organizerImage: '/assets/hikers/defaultHiker10.png',
      difficulty: 'Challenging',
      spotsLeft: 2,
      trailInfo: 'Epic mountain climb, 14-mile round trip, significant elevation gain',
      address: '135 Summit Ave',
      zipCode: '83340'
    }
  ];

  displayedProfiles: any[];
  autocomplete: any;

  constructor(private ngZone: NgZone, private router: Router) {
    this.displayedProfiles = this.groupProfiles;

    // Subscribe to router events to reinitialize the component on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initializeComponent();
      }
    });
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.displayedProfiles = [...this.groupProfiles];
    this.loadImages();
    this.initAutocomplete();
  }

  loadImages() {
    this.groupProfiles.forEach(profile => {
      const trailImg = new Image();
      trailImg.src = profile.trailImage;
      const organizerImg = new Image();
      organizerImg.src = profile.organizerImage;
    });
  }

  initAutocomplete() {
    this.ngZone.runOutsideAngular(() => {
      const input = document.getElementById('location-search') as HTMLInputElement;
      if (input && !this.autocomplete) {
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode']
        });

        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => this.handlePlaceSelection());
        });
      }
    });
  }

  handlePlaceSelection() {
    const place = this.autocomplete.getPlace();
    if (place.geometry) {
      console.log('Selected place:', place.formatted_address);
      this.searchLocation();
    }
  }

  searchLocation() {
    const input = document.getElementById('location-search') as HTMLInputElement;
    const searchTerm = input.value.toLowerCase().trim();
    console.log('Searching for:', searchTerm);

    if (searchTerm) {
      this.displayedProfiles = this.groupProfiles.filter(profile =>
        profile.address.toLowerCase().includes(searchTerm) ||
        profile.zipCode.includes(searchTerm)
      );
    } else {
      this.displayedProfiles = [...this.groupProfiles];
    }
  }
}
