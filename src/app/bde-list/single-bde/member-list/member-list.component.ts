import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApiMember } from 'src/app/models/bde.model';
import { Member } from 'src/app/models/user.model';
import { BdeService } from 'src/app/services/bde.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'role'];

  memberList: ApiMember[] = null;
  dataSource: MatTableDataSource<ApiMember>;

  @Input() bdeId: number;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private bdeService: BdeService) { }

  ngAfterViewInit(): void {

    this.bdeService.GetBdeMembers(this.bdeId).subscribe(
      (members) => {
        console.log(members);
        this.memberList = members;
        console.log('Data initialisées');
        this.dataSource = new MatTableDataSource(this.memberList);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
  }

}
