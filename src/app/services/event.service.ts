import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, of, scheduled } from 'rxjs';
import { ApiEvent, ApiHype, MyEvent } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsUrl = 'https://51.159.38.160/api/events';
  private usersUrl = 'https://51.159.38.160/api/users';

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService,
    private http: HttpClient) { }

  getEvents(uid: string): Observable<ApiEvent[]> {

    return this.http.get<ApiEvent[]>(`${this.usersUrl}/${uid}/events`);
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
