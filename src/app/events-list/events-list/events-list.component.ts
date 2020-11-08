import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { ApiEvent, MyEvent } from 'src/app/models/event.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  events: ApiEvent[] = [];

  noEvents = false;

  constructor(private eventService: EventService, private authService: AuthService, private fireStore: AngularFirestore) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        console.log('Current user found !');
        this.eventService.getEvents(user.uid).subscribe(
          (data) => {

            console.log(data);
            if(data.length == 0)
            {
              this.noEvents = true;
            }
            this.events = data;
          },
          (error) => {
            console.log(error);
            this.noEvents = true;
          }
        )
      }
    )
  }

  getHype(event: ApiEvent)
  {
    if(event.isHyped)
    {
      console.log("IsHyped value : " + event.isHyped);
      console.log("EventId value :" + event.id);

      this.eventService.RemoveHypeToEvent(event.id).subscribe(
        (data) => {
          if(data == null)
          {
            event.isHyped = false;
            event.hypedNumber--;
          }
        }
      )
    }
    else {
      console.log("IsHyped value : " + event.isHyped);
      console.log("EventId value :" + event.id);
      this.eventService.AddHypeToEvent(event.id).subscribe(
        (data) => {
          event.isHyped = data;
          event.hypedNumber++;
        }
      );
    }
  }
}
