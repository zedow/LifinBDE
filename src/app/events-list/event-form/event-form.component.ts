import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiBde } from 'src/app/models/bde.model';
import { BdeService } from 'src/app/services/bde.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  newEvent: FormGroup;
  bdes: ApiBde[];

  constructor(private fireAuth: AngularFireAuth, private _formBuilder: FormBuilder,private bdeService: BdeService, private eventService: EventService,
    private _snackBar: MatSnackBar) {

    this.fireAuth.currentUser.then(
      (user) => {
        this.bdeService.GetOwnedBde(user.uid).subscribe(
          (data) => {
            console.log(data);

            this.bdes = data;
          }
        )
      }
    );

    this.newEvent = _formBuilder.group({
      name: ['',[Validators.required]],
      description: ['',[Validators.required]],
      date: [null,Validators.required],
      bdeId: [null,Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.newEvent.value);

    this.eventService.AddEvent(this.newEvent.value).subscribe(
      (data) => {
        console.log(data);
        this._snackBar.open('événement créé !','close',{duration: 5000});
        this.newEvent.reset();
      }
    )
  }

}
