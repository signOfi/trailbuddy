import { environment } from '../../environments/environment';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './host-event.component.html',
  styleUrls: ['./host-event.component.css']
})
export class HostEventComponent implements AfterViewInit {
  @ViewChild('addressInput') addressInput!: ElementRef;

  event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  ngAfterViewInit() {
    this.loadGoogleMapsAPI().then(() => {
      this.setupAddressAutocomplete();
    });
  }

  loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  setupAddressAutocomplete() {
    if (this.addressInput && google && google.maps && google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          this.event.location = place.formatted_address;
        }
      });
    } else {
      console.error('Google Maps API not loaded or address input not found');
    }
  }

  onSubmit() {
    console.log('Event submitted:', this.event);
    // Add your submission logic here
  }
}
