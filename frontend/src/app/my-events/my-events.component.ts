import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';
import { EventDTO } from '../model/EventDTO';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  hostedEvents: EventDTO[] = [];
  participatedEvents: EventDTO[] = [];
  selectedEvent: EventDTO | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadHostedEvents();
    this.loadParticipatedEvents();
  }

  loadHostedEvents(): void {
    this.eventService.getUserHostedEvents().subscribe(
      events => {
        this.hostedEvents = events;
        if (this.hostedEvents.length > 0 && !this.selectedEvent) {
          this.selectedEvent = this.hostedEvents[0];
        }
      },
      error => console.error('Error loading hosted events:', error)
    );
  }

  loadParticipatedEvents(): void {
    this.eventService.getUserParticipatedEvents().subscribe(
      events => {
        this.participatedEvents = events;
        if (this.participatedEvents.length > 0 && !this.selectedEvent) {
          this.selectedEvent = this.participatedEvents[0];
        }
      },
      error => console.error('Error loading participated events:', error)
    );
  }

  selectEvent(event: EventDTO): void {
    this.selectedEvent = event;
  }

  confirmLeaveEvent(): void {
    if (confirm('Are you sure you want to leave this event?')) {
      this.leaveEvent();
    }
  }

  leaveEvent(): void {
    if (this.selectedEvent) {
      this.eventService.leaveEvent(this.selectedEvent.id).subscribe(
        () => {
          this.participatedEvents = this.participatedEvents.filter(e => e.id !== this.selectedEvent?.id);
          this.selectedEvent = this.participatedEvents.length > 0 ? this.participatedEvents[0] : null;
        },
        error => console.error('Error leaving event:', error)
      );
    }
  }

  getEventImage(event: EventDTO): string {
    return event.eventImageUrl || 'assets/trails/default-event-image.png';
  }
}
