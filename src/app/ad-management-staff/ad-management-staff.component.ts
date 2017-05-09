import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { User } from '../models/user';
import { Shift } from '../models/shift';
import { WorkingTime } from '../models/working-time';

declare var $:any;

@Component({
  selector: 'app-ad-management-staff',
  templateUrl: './ad-management-staff.component.html',
  styleUrls: ['./ad-management-staff.component.scss']
})
export class AdManagementStaffComponent implements OnInit {

	staffs: User[];
  staffList: User[];
	workingTimes: WorkingTime[];
	staff: User;
  shiftId = "";
  staffId = "";
	workingTime: WorkingTime;
	name: string;
	password: string;
	email: string;
  shifts: Shift[];
  workingDate = "";
	confirmPassword: string;
  sortBy = "name";
  searchKey = "";

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  	this.getAllStaff();
    this.getAllShifts();
  }

  getAllStaff(){
    this.adminService.getAllStaff().subscribe(res => {
      this.staffs = JSON.parse(res._body);
      this.staffList = JSON.parse(res._body);
    }, err => {
      console.log(err);
    });
  }

  getAllShifts(){
    this.adminService.getAllShifts().subscribe(res => {
      this.shifts = JSON.parse(res._body);
    }, err => {
      console.log(err);
    })
  }

  searchByKey(){
    if(this.searchKey == ""){
      this.staffs = this.staffList;
    } else {
      this.staffs = [];
      for (let i = 0; i < this.staffList.length; i++){
        let user = this.staffList[i];
        if (user.name.toLowerCase().includes(this.searchKey.toLowerCase().trim())){
          this.staffs.push(user);
        } else if (this.searchKey.toLowerCase().trim() == "male"){
          if(user.gender == 0){
            this.staffs.push(user);
          }
        } else if (this.searchKey.toLowerCase().trim() == "female"){
          if(user.gender == 1){
            this.staffs.push(user);
          }
        }
      }
    }
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
  			this.getDetailWorkingTime(this.staff);
          $('#deleteWorkingTime').modal('hide');
  		}
  	}, err => {
  		console.log(err);
  	})
  }

  addWorkingTime(){
    let date = new Date(this.workingDate);
    if (this.shiftId == "" || this.staffId == "" || this.workingDate == ""){
      alert("Please input all fields to add working time!");
    } else if (date > new Date()){
      alert("You can't add working time for staff for this date: " + this.workingDate);
    } else {
      console.log("Shift ", this.shiftId, " staff ", this.staffId, " workingDate ", date.getTime());
      let body = {"userId": this.staffId, "shiftId": this.shiftId, "date": date.getTime()};
      console.log(body);
      this.adminService.createWorkingTime(body).subscribe(res => {
        console.log(res);
        if (res.status == 201){
          $('#addWorkingTime').modal('hide');
          this.staffId = "";
          this.workingDate = "";
          this.shiftId = "";
        }
      }, err => {
        console.log(err);
      })
    }
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
	    		this.getAllStaff();
          $('#addStaff').modal('hide');
          this.name = "";
          this.email = "";
          this.password = "";
          this.confirmPassword = "";
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
  			this.getAllStaff();
          $('#deleteStaff').modal('hide');
  		}
  	}, err => {
  		console.log(err);
  	})
  }

}
