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

  private eventsUrl = 'https://localhost:44392/api/events';
  private usersUrl = 'https://localhost:44392/api/users';

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService,
    private http: HttpClient) { }

  getEvents(uid: string): Observable<ApiEvent[]> {

    return this.http.get<ApiEvent[]>(`${this.usersUrl}/${this.authService.currentUser.uid}/events`);
  }


  AddHypeToEvent(eventId: number): Observable<boolean> {

    const uid = this.authService.currentUser.uid;
    const hype: ApiHype = {
      userId: uid,
      eventId: eventId
    };
    return this.http.post<boolean>(`${this.usersUrl}/events`,hype);
  }

  RemoveHypeToEvent(eventId: number): Observable<object> {

    const uid = this.authService.currentUser.uid;
    const url = `${this.usersUrl}/${uid}/events/${eventId}`;
    console.log(url);

    return this.http.delete(url);
  }
}
