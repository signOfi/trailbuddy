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

  selectedEventId: number | null = null;

  ngOnInit() {
    this.selectEvent(1);
  }

  selectEvent(eventId: number) {
    this.selectedEventId = eventId;
    this.loadEventData(eventId);
  }

  loadEventData(eventId: number) {
    if (eventId === 1) {
      this.event = {
        title: 'Sample Event 1',
        date: '2024-07-15',
        time: '10:00',
        location: 'Sample Location 1',
        description: 'This is a sample event description for Event 1.',
        difficulty: 'moderate',
        leaderName: 'John Doe',
        spots: 10,
        image: null,
        imageName: ''
      };
    } else if (eventId === 2) {
      this.event = {
        title: 'Sample Event 2',
        date: '2024-08-20',
        time: '14:00',
        location: 'Sample Location 2',
        description: 'This is a sample event description for Event 2.',
        difficulty: 'challenging',
        leaderName: 'Jane Smith',
        spots: 15,
        image: null,
        imageName: ''
      };
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
    console.log('Event changes submitted:', this.event);
  }
}
