import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {BdeService } from '../services/bde.service';
import {ApiBde, Bde, BdeListItem} from '../models/bde.model';
import { BehaviorSubject, merge, Observable, of as ObservableOf, Subject} from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-bde-list',
  templateUrl: './bde-list.component.html',
  styleUrls: ['./bde-list.component.scss']
})

export class BdeListComponent implements AfterViewInit  {


  bdeList: ApiBde[] = [];

  user : any;

  // MatPaginator Output
  pageEvent: PageEvent;

  isLoadingResults = true;
  resultLength = 0;
  lastPageIndex = 0;

  filterValue: BehaviorSubject<string> = new BehaviorSubject(null)
  filtertext: string;
  limit = 2;

  constructor(private bdeService: BdeService, private authService: AuthService) {
  }

  ngAfterViewInit(): void {

    this.filterValue.subscribe(data => {
      this.filtertext = data;
    })
    merge(this.filterValue).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        console.log('In the switch map');
        return this.bdeService.getBdeList(this.filtertext);
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

  followBde(bdeId: string) {

    this.bdeService.followBde(bdeId).then(
      (result) => {
        console.log("Réussi" + result);
      },
      (error) => {
        console.log(error);
      }
    ).catch(() => {console.log('Erreur')});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue.next(filterValue.toLowerCase());
    console.log("Recherche lancée sur les termes : " + filterValue);
  }
}
