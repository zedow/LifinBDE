import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {BdeService } from '../services/bde.service';
import {Bde, BdeListItem} from '../models/bde.model';
import { BehaviorSubject, Observable, of as ObservableOf} from 'rxjs';
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


  bdeList: Bde[] = [];

  user : any;

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoadingResults = true;
  resultLength = 0;
  lastPageIndex = 0;

  constructor(private bdeService: BdeService, private authService: AuthService) {
  }

  ngAfterViewInit(): void {

    //this.getServerData(null);
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        console.log('In the switch map');
        var firstDocId = this.bdeList.length > 0 ? this.bdeList[0].id : null;
        var lastDocId =this.bdeList.length > 0 ? this.bdeList[this.bdeList.length -1].id : null;
        console.log(firstDocId + " est le premier Id de la liste actuelle ! et " + lastDocId + " est le dernier Id de la liste actuelle !");
        this.bdeService.getTotalBdeCount().subscribe(
          (result) => {
            this.resultLength = result
          }
        );
        return this.bdeService.getPaginatedBdeList(this.paginator.pageIndex,firstDocId,lastDocId,this.lastPageIndex);
      }),
      map(
        data => {
          this.isLoadingResults = false;
          this.lastPageIndex = this.paginator.pageIndex;
          //this.resultLength = data.total_count;
          console.log(data);

          return data;
        }
      ),
      catchError(() => {
        this.isLoadingResults = false;
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

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  getServerData($event?:PageEvent) {
    this.bdeService.getBdeList().subscribe(
      list => this.bdeList = list
  );
  }
}
