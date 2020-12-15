import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, scheduled } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiCreateEvent, ApiEvent, ApiHype, MyEvent } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsUrl = `${environment.apiUrl}events`;
  private usersUrl = `${environment.apiUrl}users`;

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService,
    private http: HttpClient) { }

  getEvents(uid: string): Observable<ApiEvent[]> {

    return this.http.get<ApiEvent[]>(`${this.usersUrl}/${uid}/events`);
  }

  AddEvent(event: ApiCreateEvent) {
    return this.http.post<ApiCreateEvent>(`${this.eventsUrl}`,event);
  }

  AddHypeToEvent(eventId: number,uid: string): Observable<boolean> {

    const hype: ApiHype = {
      userId: uid,
      eventId: eventId
    };
    return this.http.post<boolean>(`${this.usersUrl}/events`,hype);
  }

  RemoveHypeToEvent(eventId: number,uid: string): Observable<object> {

    const url = `${this.usersUrl}/${uid}/events/${eventId}`;
    console.log(url);

    return this.http.delete(url);
  }
}
