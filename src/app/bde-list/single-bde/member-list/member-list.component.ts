import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Member } from 'src/app/models/user.model';
import { BdeService } from 'src/app/services/bde.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'role'];

  memberList: Member[] = null;
  dataSource: MatTableDataSource<Member>;

  @Input() bdeId: string;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private bdeService: BdeService) { }

  ngAfterViewInit(): void {

    this.bdeService.getBdeMembersList(this.bdeId).subscribe(
      (members) => {
        this.memberList = members;
        console.log('Data initialisées');
        this.dataSource = new MatTableDataSource(this.memberList);
        this.table.renderRows();
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
