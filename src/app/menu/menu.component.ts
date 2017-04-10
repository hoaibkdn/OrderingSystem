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
  invoiceId: number;
  isPayed: boolean;
  permitedOder: boolean;

  //search
  text: string;
  currentFood = [];

  constructor( private menuService: MenuService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.quantity = 1;
    this.menuService.getFood(1)
        .subscribe(food => this.food = food);
    this.totalMoney();
    this.textSearch = "";
    this.permitedOder = false;
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
    var listChild = parent.children;
    parent.removeChild(foodClear);
    if(listChild.length === 0) {
      this.permitedOder = true;
    }
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
      if(orderedFoodList[i].children[0].innerHTML == afood.name) {
        var currentQuantity =parseInt(orderedFoodList[i].children[1].innerHTML);
        orderedFoodList[i].children[1].innerHTML = (currentQuantity+ this.quantity).toString();
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      var addFood = document.createElement("div");
      var newClassDiv = "food"+order;
      var newClassClear = "clear"+order;

      addFood.setAttribute("class", "ordering__food--text ordered__food flex-box "+newClassDiv);

      addFood.innerHTML =`
        <p class="ordered__food--name">`+afood.name+`</p>
        <p class="ordered__food--quantity">`+this.quantity+`</p>
        <p class="ordered__food--price">`+afood.price+` d</p>
        <button class="ordered__food--clear `+newClassDiv+`">x</button>
        <p class="ordered__food--id">`+afood.id+`</p>
      `;
      foodOrdering.appendChild(addFood);
    }

    this.permitedOder = true;

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

  getInvoiceId(){
    this.menuService.getInvoiceId()
      .subscribe(invoiceId => this.invoiceId = invoiceId);
  }

  ordered() {
    let invoiceId = localStorage.getItem("invoiceId");

    var orderedWrap = document.getElementsByClassName("ordering__food")[0];
    var orderedFood = document.getElementById("ordered-food__wrap");
    var orderedFoodLst = orderedFood.children;
    var sizeOrderedFoodLst = orderedFoodLst.length;
    var orderingFoodLst = document.getElementsByClassName("ordered__food");
    var sizeOrderingFoodLst = orderingFoodLst.length;

    var i = 0, j = 0;

    // if not exist food that ordered => push all
    if(sizeOrderingFoodLst === 0) {
      var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
      btnOrder.classList.add("btn--normal");
    }
    else if(sizeOrderedFoodLst === 0) {
      while(orderingFoodLst.length > 0) {
        orderedFood.appendChild(orderingFoodLst[0]);
        orderingFoodLst[0].classList.add("inner-odered");
        orderingFoodLst[0].classList.remove("ordered__food");
      }

      var orderIdLst = orderedFood.children;
      var idArr = "";
      var quantityId = "";
      for(var a=0; a < orderIdLst.length; a++) {
        if(a === orderIdLst.length-1 ) {
          idArr += orderIdLst[a].children[4].innerHTML;
          quantityId += orderIdLst[a].children[1].innerHTML;
        }
        else {
          idArr += orderIdLst[a].children[4].innerHTML+ ",";
          quantityId += orderIdLst[a].children[1].innerHTML+ ",";
        }
      }

      console.log("id "+ idArr);
      console.log("quantityId "+ quantityId);

      let orderBoard = {
        "tableId": 1 + "",
        "foodAndDrinkId": idArr,
        "quantity": quantityId
      };

      console.log(orderBoard);
      this.menuService.postOrder(orderBoard)
            .subscribe(res => {this.invoiceId = res._body; console.log(this.invoiceId);
                              localStorage.setItem("invoiceId ", this.invoiceId+"")});
    }
    else {
      var arrNewId = "";
      var arrNewQuantity = '';
      console.log("sizeOrderingFoodLst "+ sizeOrderingFoodLst);

      for(var b = 0; b < sizeOrderingFoodLst; b++) {
        if(b === sizeOrderingFoodLst-1 ) {
          arrNewId += orderingFoodLst[b].children[4].innerHTML;
          arrNewQuantity += orderingFoodLst[b].children[1].innerHTML;
        }
        else {
          arrNewId += orderingFoodLst[b].children[4].innerHTML + ',';
          arrNewQuantity += orderingFoodLst[b].children[1].innerHTML + ',';
        }
      }

      while(i < sizeOrderingFoodLst){
        if(orderedFoodLst[j] !== undefined) {

          // add new food into orderedList
          if(orderedFoodLst[j].children[0].innerHTML === orderingFoodLst[i].children[0].innerHTML) {
            var existedFood = parseInt(orderedFoodLst[j].children[1].innerHTML);
            var addQuantityFood = parseInt(orderingFoodLst[i].children[1].innerHTML);
            var totalQuantity = existedFood+addQuantityFood;
            var existedPrice = parseFloat(orderedFoodLst[j].children[2].innerHTML.split(" ")[0]);
            var addPrice = parseFloat(orderingFoodLst[i].children[2].innerHTML.split(" ")[0]);
            var totalPrice = existedPrice + addPrice;

            orderedFoodLst[j].children[1].innerHTML = totalQuantity.toString();
            orderedFoodLst[j].children[2].innerHTML = totalPrice.toString() + " d";
          }
          else {
            orderedFood.appendChild(orderingFoodLst[i]);
            orderingFoodLst[i].classList.add("inner-odered");
            orderingFoodLst[i].classList.remove("ordered__food");
          }
          if(orderingFoodLst[i++] !== undefined) {
            j++;
            continue;
          }
        }
      }

      let orderNew = {
        "invoiceId": this.invoiceId,
        "foodAndDrinkId": arrNewId,
        "quantity": arrNewQuantity
      }

      console.log(orderNew);
      this.menuService.postOrder(orderNew)
            .subscribe(res => {this.invoiceId = res._body; console.log(this.invoiceId);});

      for (var x = 0; x <orderingFoodLst.length; x++) {
        orderingFoodLst[x].remove();
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
  }

  reguestPayment() {
    return this.menuService.paymentRequest(this.invoiceId)
      .subscribe(res => {this.isPayed = res; this.invoiceId = 0; console.log("pay ", this.isPayed );
        localStorage.removeItem("invoiceId")},
        err => {console.log(err)});
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
    var numOfpeopleFood = 0;
    var numOfPeopleService = 0;
    this.menuService.getRate("food", this.itemSvg.selectedPuk)
        .subscribe(ratingFood => {
         this.ratingFood = ratingFood;
         console.log("food rate ", ratingFood);
         numOfpeopleFood = parseInt(this.ratingFood.numOfPeople);
         this.ratingFood.numOfPeople = (numOfpeopleFood++).toString();
         this.menuService.updateRate("food", this.ratingFood);
         });
     this.menuService.getRate("service", this.itemSvgService.selectedStars)
        .subscribe(ratingService => {
         this.ratingService = ratingService;
         numOfPeopleService = parseInt(this.ratingService.numOfPeople);
         this.ratingService.numOfPeople = (numOfPeopleService++).toString();
         this.menuService.updateRate("service", this.ratingService);
         $('#rating').modal('hide');},
         error => {
           console.log(error);
         });
  }

  onKey(event:any) {
    console.log('on key @@@@ ' , this.textSearch);

    // reverst food
    var sizeCurrentFood = this.currentFood.length;
    if(sizeCurrentFood > 0) {

      //pop all food in food
      var sizeAllFood = this.food.length;
      while(sizeAllFood > 0) {
        this.food.splice(0, 1);
        sizeAllFood--;
      }
      this.currentFood.forEach((value, index) => {
        this.food.push(value);
      }, this);
    }

    else {
      this.food.forEach(function(value, index) {
        this.currentFood.push(value);
      }, this);
    }

    var BACKSPACE_KEY= 8;
    var ALT_KEY = 18;
    var CTRL_KEY = 17;
    var SHIFT_KEY = 16;
    var keySearch = String.fromCharCode(event.keyCode);
    var indexArr = [];

    this.currentFood.forEach(function(value, index) {
      if(!value.name.includes(this.textSearch)) {
        indexArr.push(index);
      }
    }, this);
    var size = indexArr.length;

// push food out of array => filter for search
    for (var x = 0; x < size; x++ ) {
      this.food.splice(indexArr[x], 1);
      if(size > 0 && x < (size -1)) {
        for (var y = 1; y < size; y++ ) {
          indexArr[y] -= 1;
        }
      }
    }

    console.log("all food size "+ this.food.length);
    console.log("current food size "+ this.currentFood.length);
  }
}
