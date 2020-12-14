import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {BdeService } from '../services/bde.service';
import {ApiBde, Bde, BdeListItem, IApiUserBde} from '../models/bde.model';
import { BehaviorSubject, merge, Observable, of as ObservableOf, Subject} from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-bde-list',
  templateUrl: './bde-list.component.html',
  styleUrls: ['./bde-list.component.scss']
})

export class BdeListComponent implements AfterViewInit  {


  bdeList: IApiUserBde[] = [];

  user : any;

  // MatPaginator Output
  pageEvent: PageEvent;

  isLoadingResults = true;
  resultLength = 0;
  lastPageIndex = 0;

  filterValue: BehaviorSubject<string> = new BehaviorSubject(null)
  filtertext: string;
  limit = 2;

  currentUserId: string;

  constructor(private bdeService: BdeService, private fireAuth: AngularFireAuth ,private _authService: AuthService, private _snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {

    this.fireAuth.authState.subscribe(
      (user) => {
        this.currentUserId = user.uid;
      }
    );

    this.fireAuth.onAuthStateChanged((user) => {
      console.log(" ALLO");

      console.log(user);
    })

    this.filterValue.subscribe(data => {
      this.filtertext = data;
    });
    merge(this.filterValue).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        console.log('In the switch map');
        return this.bdeService.GetUserBdeList(this.filtertext,this.currentUserId);
      }),
      map(
        data => {
          this.isLoadingResults = false;
          //this.resultLength = data.total_count;
          console.log(data);
          return data;
        }
      ),
      catchError((error) => {
        this.isLoadingResults = false;
        console.log(error);
        return ObservableOf([]);
      })
    ).subscribe(data => this.bdeList = data)

  }

  followBde(bde: IApiUserBde) {

    this.bdeService.FollowBde(bde.bde.id).subscribe(
      (data) => {

        if(data == null)
        {
          this._snackBar.open('Une erreur est survenue, veuillez réessayer',null,{duration: 2000});
        }
        else {
          this._snackBar.open(`Vous suivez désormais ${bde.bde.name}`,null,{duration: 2000});
          bde.isFollowed = true;
        }
      },
      (error) => {
        console.log(error);
        this._snackBar.open('Une erreur est survenue',null,{duration: 2000});
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue.next(filterValue.toLowerCase());
    console.log("Recherche lancée sur les termes : " + filterValue);
  }
}
