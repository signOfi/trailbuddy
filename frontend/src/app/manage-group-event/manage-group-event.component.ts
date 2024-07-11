import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-manage-group-event',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './manage-group-event.component.html',
  styleUrls: ['./manage-group-event.component.css']
})
export class ManageGroupEventComponent implements OnInit {
  @ViewChild('addressInput') addressInput!: ElementRef;

  event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    difficulty: '',
    leaderName: '',
    spots: 1,
    image: null as File | null,
    imageName: ''
  };

  ngOnInit() {
    this.loadEventData();
    // Uncomment the following line when ready to use Google Maps
    // this.setupAddressAutocomplete();
  }

  loadEventData() {
    // TODO: Implement logic to load existing event data
    this.event = {
      title: 'Sample Event',
      date: '2024-07-15',
      time: '10:00',
      location: 'Sample Location',
      description: 'This is a sample event description.',
      difficulty: 'moderate',
      leaderName: 'John Doe',
      spots: 10,
      image: null,
      imageName: ''
    };
  }

  // Uncomment and implement this method when ready to use Google Maps
  /*
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
  */

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
    console.log('Event changes submitted:', this.event);
    // TODO: Implement logic to save changes
  }
}
