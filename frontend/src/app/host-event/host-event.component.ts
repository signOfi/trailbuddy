import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { environment } from '../../environments/environment';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
import { EventDTO } from '../model/EventDTO';
import { Difficulty } from '../model/Difficulty';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './host-event.component.html',
  styleUrls: ['./host-event.component.css']
})
export class HostEventComponent implements AfterViewInit {
  @ViewChild('addressInput') addressInput!: ElementRef;

  event: Partial<EventDTO> & {
    time: string;
    image: File | null;
    imageName: string;
  } = {
    title: '',
    date: new Date(),
    time: '',
    location: '',
    description: '',
    difficulty: Difficulty.EASY,
    spots: 1,
    eventImageUrl: '',
    image: null,
    imageName: ''
  };

  isSubmitting = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

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

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      this.event.image = file;
      this.event.imageName = file.name;
    } else {
      alert('Please select an image file.');
    }
  }

  onSubmit() {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;

      const eventData: Partial<EventDTO> = {
        title: this.event.title,
        date: new Date(`${this.event.date}T${this.event.time}`),
        location: this.event.location,
        description: this.event.description,
        difficulty: this.event.difficulty,
        spots: this.event.spots,
        eventImageUrl: this.event.eventImageUrl,
        participants: []
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (createdEvent) => {
          console.log('Event created successfully:', createdEvent);

          if (this.event.image) {
            this.eventService.uploadEventImage(createdEvent.id, this.event.image).subscribe({
              next: (imageUrl) => {
                console.log('Image uploaded successfully:', imageUrl);
                createdEvent.eventImageUrl = imageUrl;
                this.eventService.updateEvent(createdEvent.id, createdEvent).subscribe({
                  next: () => {
                    console.log('Event updated with image URL');
                    this.navigateToHomepage();
                  },
                  error: (error) => {
                    console.error('Error updating event with image URL:', error);
                    this.navigateToHomepage();
                  }
                });
              },
              error: (error) => {
                console.error('Error uploading image:', error);
                this.navigateToHomepage();
              }
            });
          } else {
            this.navigateToHomepage();
          }
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.isSubmitting = false;
          // Handle error (e.g., show error message to user)
        }
      });
    }
  }

  private navigateToHomepage() {
    this.isSubmitting = false;
    console.log('Attempting to navigate to homepage');
    this.router.navigate(['/'])
      .then(() => console.log('Navigation to homepage successful'))
      .catch(error => console.error('Error navigating to homepage:', error));
  }

  isFormValid(): boolean {
    return !!(
      this.event.title &&
      this.event.date &&
      this.event.time &&
      this.event.location &&
      this.event.description &&
      this.event.difficulty &&
      this.event.spots &&
      this.event.image
    );
  }
}
