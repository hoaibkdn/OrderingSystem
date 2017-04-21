import { Component, OnInit } from '@angular/core';
import { FoodAndDrink } from '../models/food-and-drink';
import { FoodAndDrinkType } from '../models/food-and-drink-type';
import { MenuService } from '../menu/menu.services';
import { AdminService } from '../admin/admin.service';


@Component({
  selector: 'app-ad-management-fad',
  templateUrl: './ad-management-fad.component.html',
  styleUrls: ['./ad-management-fad.component.scss']
})
export class AdManagementFadComponent implements OnInit {
	foodAndDrink: FoodAndDrink[];
  foodAndDrinkType: FoodAndDrinkType[];
  fad: FoodAndDrink;
  id: number;
  name: string;
  detail: string;
  tags: string;
  price: number;
  foodAndDrinkTypeId: number;

  constructor(private menuService: MenuService, private adminService: AdminService) { }

  ngOnInit() {
  	this.menuService.getAllFood().subscribe(res => {
  		this.foodAndDrink = res;
  	}, err => {
  		console.log("Error: ", err);
  	});
    this.adminService.getAllFoodAndDrinkType().subscribe(response => {
      this.foodAndDrinkType = JSON.parse(response._body);
    }, err => {
      console.log(err);
    });
    
  }

  getDetail(afood: FoodAndDrink) {
    this.fad = afood;
    this.name = afood.name;
    this.detail = afood.detail;
    this.tags = afood.tags;
    this.price = afood.price;
    this.id = afood.id;
  }

  updateFoodAndDrink(){
    let body  = '{"foodAndDrinkId" : "' + this.id + '", "name" : "' + this.name + '", "detail": "' + this.detail + '", "tags": "' + this.tags + '", "price": "' + this.price + '"}';
    console.log(JSON.parse(body));
    this.adminService.updateFoodAndDrink(JSON.parse(body)).subscribe(res => {
      console.log(res);
      if (res.status == 201){
        window.location.reload();
      }
    }, err => {
      console.log(err);
    })
  }

  deleteFad(afood: FoodAndDrink){
    this.fad = afood;
    this.name = afood.name;
    this.detail = afood.detail;
    this.tags = afood.tags;
    this.price = afood.price;
    this.id = afood.id;
  }

  deleteFoodAndDrink(){
    this.adminService.deleteFoodAndDrink(this.id).subscribe(res => {
      console.log(res);
      if (res.status == 200){
        window.location.reload();
      }
    }, err => {
      console.log(err);
    })
  }

  clearOldData(){
    this.name = "";
    this.detail = "";
    this.tags = "";
    this.price = 0;
    this.id = 0;
    this.foodAndDrinkTypeId = 0;
  }

//   {
//   "createdDate": "2017-04-20T14:26:57.952Z",
//   "detail": "string",
//   "foodAndDrinkType": {
//     "createdDate": "2017-04-20T14:26:57.952Z",
//     "detail": "string",
//     "id": 0,
//     "mainDish": true,
//     "name": "string",
//     "visible": true
//   },
//   "id": 0,
//   "name": "string",
//   "numOrdered": 0,
//   "price": 0,
//   "tags": "string",
//   "visible": true
// }

  addFoodAndDrink(){
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
    + '", "price": ' + this.price
    + ', "tags": "' + this.tags
    + '", "id": ' + 0
    + ', "foodAndDrinkType": { "id": "' + this.foodAndDrinkTypeId + '"}}';
    // console.log(dateString);
     this.adminService.createFoodAndDrink(JSON.parse(body)).subscribe(res => {
       console.log(res);
       if(res.status == 201){
         window.location.reload();
       }
     }, err => {
       console.log(err);
     })
  };

}