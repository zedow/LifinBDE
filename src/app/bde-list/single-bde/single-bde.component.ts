import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bde } from 'src/app/models/bde.model';
import { BdeService } from 'src/app/services/bde.service';

@Component({
  selector: 'app-single-bde',
  templateUrl: './single-bde.component.html',
  styleUrls: ['./single-bde.component.scss']
})
export class SingleBdeComponent implements OnInit {

  bde: Bde = null;

  constructor(private route: ActivatedRoute, private bdeService: BdeService, private router: Router) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get("id")
    this.bdeService.getBde(id).subscribe(
      (data) => {
        const bdeData = data.data();
        this.bde = {
          name: bdeData.name,
          id: data.id,
          school: bdeData.school,
          description: bdeData.description
        };
      }
    );
  }
}
