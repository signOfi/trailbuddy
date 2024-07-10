declare var google: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef;

  event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  map: any;
  geocoder: any;

  ngOnInit() {
    this.initMap();
    this.setupAddressAutocomplete();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 0, lng: 0 },
      zoom: 8
    });
    this.geocoder = new google.maps.Geocoder();
  }

  setupAddressAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);
        new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
          title: place.name
        });
        this.event.location = place.formatted_address || '';
      }
    });
  }

  onSubmit() {
    console.log('Event submitted:', this.event);
    // Here you would typically send the data to your backend
  }
}
