import { Component, OnInit } from '@angular/core';
import { FoodAndDrink } from '../models/food-and-drink';
import { FoodAndDrinkType } from '../models/food-and-drink-type';
import { MenuService } from '../menu/menu.services';
import { AdminService } from '../admin/admin.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-ad-management-fad',
  templateUrl: './ad-management-fad.component.html',
  styleUrls: ['./ad-management-fad.component.scss']
})
export class AdManagementFadComponent implements OnInit {
	foodAndDrinks: FoodAndDrink[];
  foodAndDrinkList: FoodAndDrink[];
  foodAndDrinkType: FoodAndDrinkType[];
  fad: FoodAndDrink;
  id: number;
  name: string;
  detail: string;
  tags: string;
  price: number;
  foodAndDrinkTypeId: number;
  searchKey: string;
  sortBy = "name";

  constructor(private menuService: MenuService, private adminService: AdminService, private router: Router) {
  this.foodAndDrinkTypeId = 1
   }

  ngOnInit() {
  	this.getAllFood();
    this.adminService.getAllFoodAndDrinkType().subscribe(response => {
      this.foodAndDrinkType = JSON.parse(response._body);
    }, err => {
      console.log(err);
    });
    
  }

  getAllFood(){
    this.menuService.getAllFood().subscribe(res => {
      this.foodAndDrinks = res;
      this.foodAndDrinkList = res;
    }, err => {
      console.log("Error: ", err);
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
        this.getAllFood();
        $('#detailFood').modal('hide');
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
        this.getAllFood();
        $('#deleteFood').modal('hide');
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
     this.adminService.createFoodAndDrink(JSON.parse(body)).subscribe(res => {
       console.log(res);
       if(res.status == 201){
         this.getAllFood();
          $('#addFood').modal('hide');
       }
     }, err => {
       console.log(err);
     })
  };

  sortByTags = (fad: FoodAndDrink) => {
     return fad.tags.length;
  }

  searchByKey(){
    // console.log("Search key: ", this.searchKey);
    if(this.searchKey == ""){
      this.foodAndDrinks = this.foodAndDrinkList;
    } else if (this.searchKey.includes('>')) {
      this.foodAndDrinks = [];
      let price = parseInt(this.searchKey.split('>')[1].trim());
      console.log(price);
      for(let i = 0; i < this.foodAndDrinkList.length; i++){
        let fad = this.foodAndDrinkList[i];
          if (fad.price >= price){
            this.foodAndDrinks.push(fad);
        }
      }
    } else if (this.searchKey.includes('<')) {
      this.foodAndDrinks = [];
      let price = parseInt(this.searchKey.split('<')[1].trim());
      console.log(price);
      for(let i = 0; i < this.foodAndDrinkList.length; i++){
        let fad = this.foodAndDrinkList[i];
          if (fad.price <= price){
            this.foodAndDrinks.push(fad);
        }
      }
    } else {
      this.foodAndDrinks = [];
      for(let i = 0; i < this.foodAndDrinkList.length; i++){
        let fad = this.foodAndDrinkList[i];
        if(fad.name.toLowerCase().includes(this.searchKey.toLowerCase())
          || fad.foodAndDrinkType.name.toLowerCase().includes(this.searchKey.toLowerCase())
          || fad.detail.toLowerCase().includes(this.searchKey.toLowerCase())
          || fad.tags.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.foodAndDrinks.push(fad);
        }
      }
    }
  }

}
