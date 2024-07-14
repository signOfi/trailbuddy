import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { EventService } from '../services/event.service';
import { EventDTO } from '../model/EventDTO';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  hostedEvents: EventDTO[] = [];
  participatedEvents: EventDTO[] = [];
  selectedEvent: EventDTO | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadHostedEvents();
    this.loadParticipatedEvents();
  }

  loadHostedEvents() {
    this.eventService.getUserHostedEvents().subscribe(
      (events) => {
        this.hostedEvents = events;
        if (events.length > 0 && !this.selectedEvent) {
          this.selectEvent(events[0]);
        }
      },
      (error) => {
        console.error('Error loading hosted events:', error);
      }
    );
  }

  loadParticipatedEvents() {
    this.eventService.getUserParticipatedEvents().subscribe(
      (events) => {
        this.participatedEvents = events;
        if (events.length > 0 && !this.selectedEvent && this.hostedEvents.length === 0) {
          this.selectEvent(events[0]);
        }
      },
      (error) => {
        console.error('Error loading participated events:', error);
      }
    );
  }

  selectEvent(event: EventDTO) {
    this.selectedEvent = event;
  }

  deleteEvent() {
    if (this.selectedEvent && this.isHostedEvent(this.selectedEvent)) {
      if (confirm('Are you sure you want to delete this event?')) {
        this.eventService.cancelEvent(this.selectedEvent.id).subscribe(
          () => {
            this.loadHostedEvents();
            this.selectedEvent = null;
          },
          (error) => {
            console.error('Error deleting event:', error);
          }
        );
      }
    }
  }

  leaveEvent() {
    if (this.selectedEvent && this.isParticipatedEvent(this.selectedEvent)) {
      if (confirm('Are you sure you want to leave this event?')) {
        this.eventService.leaveEvent(this.selectedEvent.id).subscribe(
          () => {
            this.loadParticipatedEvents();
            this.selectedEvent = null;
          },
          (error) => {
            console.error('Error leaving event:', error);
          }
        );
      }
    }
  }

  isHostedEvent(event: EventDTO): boolean {
    return this.hostedEvents.some(e => e.id === event.id);
  }

  isParticipatedEvent(event: EventDTO): boolean {
    return this.participatedEvents.some(e => e.id === event.id);
  }
}
