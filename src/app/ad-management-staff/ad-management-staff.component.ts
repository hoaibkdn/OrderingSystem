import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { User } from '../models/user';
import { WorkingTime } from '../models/working-time';

@Component({
  selector: 'app-ad-management-staff',
  templateUrl: './ad-management-staff.component.html',
  styleUrls: ['./ad-management-staff.component.scss']
})
export class AdManagementStaffComponent implements OnInit {

	staffs: User[];
	workingTimes: WorkingTime[];
	staff: User;
	workingTime: WorkingTime;
	name: string;
	password: string;
	email: string;
	confirmPassword: string;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  	this.adminService.getAllStaff().subscribe(res => {
  		this.staffs = JSON.parse(res._body);
  	}, err => {
  		console.log(err);
  	})
  }

  deleteWT(wt: WorkingTime){
  	this.workingTime = wt;
  }

  getDetailWorkingTime(staff: User){
  	this.staff = staff;
  	this.adminService.getAllWorkingTime(staff.id).subscribe(res => {
  		this.workingTimes = JSON.parse(res._body);
  	}, err => {
  		console.log(err);
  	})
  }
  deleteWorkingTime(wt: WorkingTime){
  	this.adminService.deleteWorkingTimeById(wt.id).subscribe(res => {
  		if(res.status == 200){
  			window.location.reload();
  		}
  	}, err => {
  		console.log(err);
  	})
  }

  addStaff(){
  	console.log(this.name, this.email, this.password, this.confirmPassword);
  	if (this.password !== this.confirmPassword){
  		alert("Please enter match passwords");
  	} else {
  		let body = '{"name": "' + this.name
	    + '", "email": "' + this.email
	    + '", "password": "' + this.password
	    + '", "roleId": "' + 3
	    + '"}';
    // console.log(JSON.parse(body));
	    this.adminService.createStaff(JSON.parse(body)).subscribe(res => {
	    	if (res.status == 201){
	    		window.location.reload();
	    	}
	    }, err => {
	    	console.log(err);
	    });
  	}
  	
  }

  deleteStaffAccount(staff: User){
  	this.staff = staff;
  }

  deleteStaff(staff: User){
  	console.log(staff.name);
  	this.adminService.deleteStaff(staff.id).subscribe(res => {
  		if (res.status == 200){
  			window.location.reload();
  		}
  	}, err => {
  		console.log(err);
  	})
  }

}
