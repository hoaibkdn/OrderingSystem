import { Component, OnInit } from '@angular/core';
import { FoodAndDrinkType } from '../models/food-and-drink-type';
import { FoodAndDrink } from '../models/food-and-drink';
import { AdminService } from '../admin/admin.service';
import { MenuService } from '../menu/menu.services';

declare var $:any;

@Component({
  selector: 'app-ad-management-fadt',
  templateUrl: './ad-management-fadt.component.html',
  styleUrls: ['./ad-management-fadt.component.scss']
})
export class AdManagementFadtComponent implements OnInit {

	foodAndDrinkTypes: FoodAndDrinkType[];
	foodAndDrinks: FoodAndDrink[];
  foodAndDrinkTypeList: FoodAndDrinkType[];
	fads: FoodAndDrink[];
	fadt: FoodAndDrinkType;
	name: string;
	detail: string;
	mainDish: boolean;
  sortBy = "name";
  searchKey = "";

  constructor(private adminService: AdminService, private menuService: MenuService) {
  		this.mainDish = true;
   }

  ngOnInit() {
  	this.getAllTypes();
  	this.menuService.getAllFood().subscribe(res => {
  		this.fads = res;
  	}, err => {
  		console.log(err);
  	})
  }

  getAllTypes(){
    this.adminService.getAllFoodAndDrinkType().subscribe(res => {
      this.foodAndDrinkTypes = JSON.parse(res._body);
      this.foodAndDrinkTypeList = JSON.parse(res._body);
    }, err => {
      console.log(err);
    });
  }

  searchByKey(){
    if(this.searchKey == ""){
      this.foodAndDrinkTypes = this.foodAndDrinkTypeList;
    } else {
      this.foodAndDrinkTypes = [];
      for (let i = 0; i < this.foodAndDrinkTypeList.length; i++){
        let fad = this.foodAndDrinkTypeList[i];
        if (fad.name.toLowerCase().includes(this.searchKey.toLowerCase())
          || fad.detail.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.foodAndDrinkTypes.push(fad);
        }
      }
    }
  }

  getAllFoodAndDrinkOfType(fadt: FoodAndDrinkType){
  	this.fadt = fadt;
  	this.foodAndDrinks = this.fads.filter((fad: FoodAndDrink) => {
  		return fad.foodAndDrinkType.id == fadt.id;
  	});
  	console.log(this.foodAndDrinks);
  }

  deleteFadt(fadt: FoodAndDrinkType){
  	this.fadt = fadt;
  }

  deleteFoodAndDrinkType(){
  	this.adminService.deleteFoodAndDrinkType(this.fadt.id).subscribe(res => {
  		console.log(res);
      if (res.status == 200){
        this.getAllTypes();
        $('#deleteFood').modal('hide');
      }
  	}, err => {
  		console.log(err);
  	})
  }

  addFoodAndDrinkType(){
  	let date = new Date();
    let m = date.getMonth() + 1;
    let dateString = date.getFullYear() + "-" 
    + m + "-" 
    + date.getDate() + "T" + date.getHours() + ":" 
    + date.getMinutes() + ":" 
    + date.getSeconds();
  	let body = '{"createdDate": "' + dateString
    + '", "detail": "' + this.detail
    + '", "name": "' + this.name
    + '", "mainDish": ' + this.mainDish
    + ', "id": ' + 0
    + '}';
    console.log(JSON.parse(body));
    this.adminService.createFoodAndDrinkType(JSON.parse(body)).subscribe(res => {
    	console.log(res);
    	if (res.status == 201){
    		this.getAllTypes();
        $('#addFood').modal('hide');
    	}
    }, err => {
    	console.log(err);
    });
  }

}
