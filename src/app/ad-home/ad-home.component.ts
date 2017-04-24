import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';

@Component({
  selector: 'app-ad-home',
  templateUrl: './ad-home.component.html',
  styleUrls: ['./ad-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdHomeComponent implements OnInit {
  tables:Table[];
  groupThreeTables: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.adminService.getAllTable().subscribe(res => {
      this.tables = JSON.parse(res._body);
      this.groupThreeTables = [];
      var i = 0;
      var temp = [];
      for(let k = 0; k < this.tables.length; k++){
        temp.push(this.tables[k]);
      }
      let numOfGroup = Math.floor(this.tables.length / 3) + 1;
      for(let i = 0; i < numOfGroup; i++){
        var group = [];
        for (let l = 0; l < 3; l++){
          console.log(l + i * 3);
          console.log(temp[l + i * 3]);
          group.push(temp[l + i * 3]);
          if (l == 2){
            this.groupThreeTables.push(group);
          } else if((l + i * 3 + 1) == this.tables.length){
            this.groupThreeTables.push(group);
            break;
          }
        }
      }
    }, err => {
      console.log(err);
    })
  }

  openInvoice(table: Table){

  }

  detailTable(table: Table) {
    // console.log('detailTable ', id);

    this.router.navigate([table.id], { relativeTo: this.route });
  }
}
