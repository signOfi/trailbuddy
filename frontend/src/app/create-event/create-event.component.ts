import { environment } from '../../environments/environment';
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
  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef;

  event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  ngOnInit() {
    this.loadGoogleMapsAPI().then(() => {
      this.setupAddressAutocomplete();
    });
  }

  loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
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
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        this.event.location = place.formatted_address;
      }
    });
  }

  onSubmit() {
    console.log('Event submitted:', this.event);
  }
}
