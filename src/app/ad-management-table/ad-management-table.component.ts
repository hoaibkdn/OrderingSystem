import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';

declare var $:any;

@Component({
  selector: 'app-ad-management-table',
  templateUrl: './ad-management-table.component.html',
  styleUrls: ['./ad-management-table.component.scss']
})
export class AdManagementTableComponent implements OnInit {
	sortBy = "tableNumber";
  	tables: Table[];
  	table: Table;
  	size: number;
  	tableNumber: number;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  	this.getAllTable();
  }

  getAllTable(){
  	this.adminService.getAllTable().subscribe(res => {
  		this.tables = JSON.parse(res._body);
  	}, err => {
  		console.log(err);
  	})
  }

  updateTable(table: Table){
  	this.size = table.size;
  	this.tableNumber = table.tableNumber;
  }

  addTable(){
  	this.adminService.createTable(this.size).subscribe(res => {
  		console.log(JSON.parse(res._body));
  		if(res.status == 201){
  			this.getAllTable();
        this.size = null;
  			$("#addTable").modal('hide');
  		}
  	}, err => {
  		console.log(err);
  	})
  }

}
