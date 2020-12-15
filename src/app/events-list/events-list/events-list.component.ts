import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
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

  currentUser: string;

  constructor(private eventService: EventService, private authService: AuthService, private fireStore: AngularFirestore,private fireAuth: AngularFireAuth) { }

  ngOnInit(): void {

    // this.fireAuth.authState.subscribe(
    //   (user) => {
    //     this.currentUser = user.uid;

    //   }
    // )

    this.fireAuth.currentUser.then(
      (user) => {
        console.log(user);
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
        );
      }
    )

  }

  getHype(event: ApiEvent)
  {
    if(event.isHyped)
    {
      console.log("IsHyped value : " + event.isHyped);
      console.log("EventId value :" + event.id);

      this.eventService.RemoveHypeToEvent(event.id,this.currentUser).subscribe(
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
      this.eventService.AddHypeToEvent(event.id,this.currentUser).subscribe(
        (data) => {
          event.isHyped = data;
          event.hypedNumber++;
        }
      );
    }
  }
}
