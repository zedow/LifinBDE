import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BdeService } from '../services/bde.service';
import {Bde} from '../models/bde.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bde-list',
  templateUrl: './bde-list.component.html',
  styleUrls: ['./bde-list.component.scss']
})

export class BdeListComponent implements OnInit {

  constructor(private bdeService: BdeService) { }

  bdeList: Observable<Bde[]>;

  ngOnInit(): void {

    this.bdeList = this.bdeService.getBdeList();
  }

}
