import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { User } from '../models/user';
declare var $:any;

@Component({
  selector: 'app-ad-management-user',
  templateUrl: './ad-management-user.component.html',
  styleUrls: ['./ad-management-user.component.scss']
})
export class AdManagementUserComponent implements OnInit {

	customers: User[];
	customerList: User[];
	customer: User;
	searchKey: string;
  constructor(private adminService: AdminService) { }

  ngOnInit() {
  	this.getAllCustomer();
  }

  getAllCustomer(){
  	this.adminService.getAllCustomer().subscribe(res => {
  		this.customers = JSON.parse(res._body);
  		this.customerList = JSON.parse(res._body);
  	}, err => {
  		console.log(err);
  	})
  }

  searchByKey(){
  	if(this.searchKey == ""){
      this.customers = this.customerList;
    } else {
      this.customers = [];
      for (let i = 0; i < this.customerList.length; i++){
        let customer = this.customerList[i];
        if (customer.name.toLowerCase().includes(this.searchKey.toLowerCase())
          || customer.email.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.customers.push(customer);
        }
      }
    }
  }

  deleteCustomer(customer){
  	this.customer = customer;
  }

   deleteCustomers(customer){
  	console.log(customer.name, " - ", customer.email);
  	this.adminService.deleteStaff(customer.id).subscribe(res => {
  		if (res.status == 200){
  			alert("Deleted user: " + customer.name + " successfully!");
  			this.getAllCustomer();
  			$('#deleteCustomer').modal('hide');
  		}
  	}, err => {
  		console.log(err);
  	})
  }

}
