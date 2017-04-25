import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';
import { Invoice } from '../models/invoice';

@Component({
  selector: 'app-ad-home',
  templateUrl: './ad-home.component.html',
  styleUrls: ['./ad-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdHomeComponent implements OnInit {
  tables:Table[];
  groupThreeTables: any;
  invoices: Invoice[];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute) {
    this.invoices = [];
    }

  ngOnInit() {
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.invoices = JSON.parse(res._body);
      console.log(this.invoices);
      this.adminService.getAllTable().subscribe(res => {
        this.tables = JSON.parse(res._body);
        console.log("Tables: ", this.tables);
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
    });
    });
    
  }

  detailTable(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
