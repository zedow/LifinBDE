import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBde, Bde } from 'src/app/models/bde.model';
import { BdeService } from 'src/app/services/bde.service';

@Component({
  selector: 'app-single-bde',
  templateUrl: './single-bde.component.html',
  styleUrls: ['./single-bde.component.scss']
})
export class SingleBdeComponent implements OnInit {

  bde: ApiBde = null;

  constructor(private route: ActivatedRoute, private bdeService: BdeService) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get("id")
    this.bdeService.getBde(id).subscribe(
      (data) => {
        this.bde = data;
      }
    );
  }
}
