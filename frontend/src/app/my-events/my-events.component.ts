import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  difficulty: string;
  leader: string;
  spotsLeft: number;
  image: string;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [
    {
      id: 1,
      title: 'Mountain Ridge Trail',
      date: new Date('2024-07-14'),
      time: '09:00 AM',
      location: '123 Pine Ridge Rd, 80302',
      description: 'Scenic mountain views, 12-mile loop, elevation gain: 3000 ft',
      difficulty: 'Challenging',
      leader: 'Alex Hiker',
      spotsLeft: 3,
      image: 'defaultTrail1.png'
    },
    {
      id: 2,
      title: 'Lakeside Loop',
      date: new Date('2024-07-20'),
      time: '10:00 AM',
      location: '456 Lakeshore Dr, 54901',
      description: 'Peaceful lake trail, 5-mile loop, mostly flat terrain',
      difficulty: 'Easy',
      leader: 'Emma Nature',
      spotsLeft: 5,
      image: 'defaultTrail2.png'
    }
  ];

  selectedEvent: Event | null = null;

  ngOnInit(): void {
    if (this.events.length > 0) {
      this.selectedEvent = this.events[0];
    }
  }

  selectEvent(event: Event): void {
    this.selectedEvent = event;
  }

  confirmLeaveEvent(): void {
    if (confirm('Are you sure you want to leave this event?')) {
      this.leaveEvent();
    }
  }

  leaveEvent(): void {
    // Implement leave functionality
    console.log('Leaving event:', this.selectedEvent);
    // Remove the event from the list
    this.events = this.events.filter(e => e.id !== this.selectedEvent?.id);
    // Select the next event or null if no events left
    this.selectedEvent = this.events.length > 0 ? this.events[0] : null;
  }

  getEventImage(event: Event): string {
    return `assets/trails/${event.image}`;
  }
}
