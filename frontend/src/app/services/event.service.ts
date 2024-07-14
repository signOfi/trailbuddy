import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDTO } from '../model/EventDTO';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createEvent(eventData: Partial<EventDTO>): Observable<EventDTO> {
    return this.http.post<EventDTO>(`${this.apiUrl}/events`, eventData, { headers: this.getHeaders() });
  }

  getEvent(id: number): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/events/${id}`, { headers: this.getHeaders() });
  }

  getAllEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/events`, { headers: this.getHeaders() });
  }

  getUpcomingEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/events/upcoming`, { headers: this.getHeaders() });
  }

  updateEvent(id: number, eventData: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/events/${id}`, eventData, { headers: this.getHeaders() });
  }

  joinEvent(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/events/${id}/join`, {}, { headers: this.getHeaders() });
  }

  leaveEvent(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/events/${id}/leave`, {}, { headers: this.getHeaders() });
  }

  cancelEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`, { headers: this.getHeaders() });
  }

  uploadEventImage(eventId: number, imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<string>(`${this.apiUrl}/events/${eventId}/upload-image`, formData, { headers });
  }

  getUserHostedEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/events/hosted`, { headers: this.getHeaders() });
  }

  getUserParticipatedEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/events/participated`, { headers: this.getHeaders() });
  }
}
