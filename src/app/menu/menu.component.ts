import { Component, OnInit, Directive, ElementRef, ComponentFactoryResolver,
        ComponentRef, Input } from '@angular/core';
import { MenuService } from './menu.services';
import { FoodAndDrink } from '../models/food-and-drink';
import { ViewEncapsulation } from '@angular/core';

import { Observable }        from 'rxjs/Observable';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/map';
import { Rating } from '../models/Rating';

declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MenuComponent implements OnInit {
  food: FoodAndDrink[];
  afood: FoodAndDrink;
  errorMessage: string;
  quantity: number;
  priceStr: string;
  priceNumFirst : number;
  foodSearch: FoodAndDrink;
  textSearch: string;
  thisPrice: number;
  ratingFood: Rating;
  ratingService: Rating;

  constructor( private menuService: MenuService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.quantity = 1;
    this.menuService.getFood(1)
        .subscribe(food => this.food = food);
    this.totalMoney();
    this.textSearch = "";
  }

  // get total price
  totalMoney(): number {
    var foodPrice = document.getElementsByClassName("ordered__food--price");
    var totalPrice = document.getElementsByClassName("ordering__total--money")[0];
    var total = 0;

    for(var i = 0; i < foodPrice.length; i++) {
      // var price = foodPrice[i].innerHTML.split(".")[0];
      total += parseFloat(foodPrice[i].innerHTML);
    }
    if(total == 0) totalPrice.innerHTML = "0 d";
    else totalPrice.innerHTML = total + " d";
    return total;
  }

  getFood(id: Number) {
    this.menuService.getFood(id)
        .subscribe(food => this.food = food);
  }
  getDetail(afood: FoodAndDrink) {
    this.afood = afood;
    this.thisPrice = afood.price;
    this.priceNumFirst = this.afood.price;
  }

  quantityUp() {
    this.quantity += 1;
    var priceNum = this.priceNumFirst * this.quantity;
    // this.priceStr = priceNum + ".000 d";
    this.afood.price = priceNum;
  }
  quantityDown() {
    this.quantity -= 1;
    if(this.quantity <= 0) this.quantity = 0;
    var priceNum = this.priceNumFirst * this.quantity;
    // this.priceStr = priceNum + ".000 d";
    this.afood.price = priceNum;
  }

  clearFood(event) {
    var parent = document.getElementsByClassName("ordering__food")[0];
    var foodClear = document.getElementsByClassName(event)[0];
    parent.removeChild(foodClear);
    var currentPrice = this.totalMoney();
    this.totalMoney();
  }

  // //insert food choosed into ordering board
  ordering(afood: FoodAndDrink) {
    var foodOrdering = document.getElementsByClassName("ordering__food")[0];
    var orderedFoodList = document.getElementsByClassName("ordered__food");
    var endFood;
    var order = 1;
    var sizeOrderedFoodList = orderedFoodList.length;
    var isExist = false;
    if(sizeOrderedFoodList > 0) {
      endFood = orderedFoodList[orderedFoodList.length-1];
      console.log("end food " + endFood);

      var classNameLst = endFood.className.split(" ");
      order = parseInt(classNameLst[classNameLst.length-1].split("food")[1])+1;
    }

    //check: if food existed in ordering board => updateRate
    for(var i = 0; i < sizeOrderedFoodList; i++ ) {
      if(orderedFoodList[i].children[0].innerHTML == afood.name) isExist = true;
    }
    if (isExist) {
      var currentQuantity =parseInt(orderedFoodList[i].children[1].innerHTML);
      orderedFoodList[i].children[1].innerHTML = (currentQuantity+ this.quantity).toString();
    }
    else {
      var addFood = document.createElement("div");
      var newClassDiv = "food"+order;
      var newClassClear = "clear"+order;

      addFood.setAttribute("class", "ordering__food--text ordered__food flex-box "+newClassDiv);

      addFood.innerHTML =`
        <p class="ordered__food--name">`+afood.name+`</p>
        <p class="ordered__food--quantity">`+this.quantity+`</p>
        <p class="ordered__food--price">`+afood.price+` d</p>
        <button class="ordered__food--clear `+newClassDiv+`">x</button>
      `;
      foodOrdering.appendChild(addFood);
    }

    var buttonClear = this.elementRef.nativeElement.getElementsByClassName(newClassDiv)[1];
    console.log("btn "+ buttonClear.className);

    buttonClear.addEventListener("click", () => {
      this.clearFood(newClassDiv);
    }, this);

    this.quantity = 1;
    this.totalMoney();
    var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
    btnOrder.classList.add("btn--suggest");
    afood.price = this.thisPrice;
    $('#detailFood').modal('hide');
  }

  ordered() {
     var orderedWrap = document.getElementsByClassName("ordering__food")[0];
     var orderedFood = document.getElementById("ordered-food__wrap");
     var orderedFoodLst = orderedFood.children;
     var sizeOrderedFoodLst = orderedFoodLst.length;
     var orderingFoodLst = document.getElementsByClassName("ordered__food");
     var isExist = false;
     for (var i = 0; i < orderingFoodLst.length; i++) {
      for(var j=0; j <sizeOrderedFoodLst; j++ ) {
        if(orderedFoodLst[j].children[0].innerHTML === orderingFoodLst[i].children[0].innerHTML) {
          isExist = true;
          var existedFood = parseInt(orderedFoodLst[j].children[1].innerHTML);
          var addQuantityFood = parseInt(orderingFoodLst[i].children[1].innerHTML);
          var totalQuantity = existedFood+addQuantityFood;
          orderedFoodLst[j].children[1].innerHTML = totalQuantity.toString();
          orderingFoodLst[i].remove();
        }
      }
     }
     if(!isExist) {
      for (var i = 0; i < orderingFoodLst.length; i++) {
        orderedFood.appendChild(orderingFoodLst[i]);
        orderingFoodLst[i].classList.add("inner-odered");
        orderingFoodLst[i].classList.remove("ordered__food");
      }
     }
     var btnRemove = document.getElementsByClassName("ordered__food--clear");
     var size = btnRemove.length;
     while(size > 0) {
       btnRemove[size-1].remove();
       size--;
     }
     var btnPaymen = document.getElementsByClassName("ordering__btn--payment")[0];
     btnPaymen.classList.add("btn--suggest");
     var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
     btnOrder.classList.add("btn--normal");
     btnOrder.classList.remove("btn--suggest");

     let orderBoard = {
       "invoiceId": "INV123",
       "numberOfInvoiceDetails":3,
       "tableId": 1,
       "foodAndDrinkId": "1,2,3",
       "quantity": "2,3,4"
     };
     this.menuService.postOrder(orderBoard).subscribe(res => {
       console.log(res);
     console.log(orderBoard);

     }, err => {
       console.log(err);
     });

  }

  public itemSvg:any =
  {
      "puk": 5,
      "selectedPuk": 0,
  };

  public itemSvgService:any =
  {
      "stars": 5,
      "selectedStars": 0,
  };

  public itemHover:number;


  pukChangeSvg(newPukValue:number):void {
      this.itemSvg.selectedPuk = newPukValue;
  };



  pukHover(pukValue:number) {
      this.itemHover = pukValue;
  }


  public itemServiceHover:number;

  serviceChangeSvg(newserviceValue:number):void {
      this.itemSvgService.selectedStars = newserviceValue;
  };

  serviceHover(serviceValue:number) {
      this.itemServiceHover = serviceValue;
  }

  sendRating(): void {
    console.log("food "+ this.itemSvg.selectedPuk);
    console.log("service "+ this.itemSvgService.selectedStars);

    this.menuService.getRate("food", this.itemSvg.selectedPuk)
        .subscribe(ratingFood => {
         this.ratingFood = ratingFood;
         console.log("food rate ", ratingFood);
         this.ratingFood.numOfPeople++;
         this.menuService.updateRate("food", this.ratingFood);
         $('#rating').modal('hide');},
         error => {
           console.log(error);
         });
     this.menuService.getRate("service", this.itemSvgService.selectedStars)
        .subscribe(ratingService => {
         this.ratingService = ratingService;
         this.ratingService.numOfPeople++;
         this.menuService.updateRate("service", this.ratingService);
         $('#rating').modal('hide');},
         error => {
           console.log(error);
         });
  }
}
