import { Component, OnInit, Directive, ElementRef, ComponentFactoryResolver,
        ComponentRef, Input } from '@angular/core';
import { MenuService } from './menu.services';
import { FoodAndDrink } from '../models/food-and-drink';
import { ViewEncapsulation } from '@angular/core';

import { Observable }        from 'rxjs/Observable';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/map';
import { Rating } from '../models/Rating';
import { RatingPost } from '../models/rating-post';
import { Payment } from '../models/payment';
import { FoodCombination } from '../models/FoodCombination';
import { FoodLocalStorage } from '../models/food-localStorage';
import { OrderingCombination } from '../models/ordering-combination';

import * as _ from 'lodash';
declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MenuComponent implements OnInit {
  food: FoodAndDrink[];
  allFood: FoodAndDrink[];
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
  invoiceId: string;
  isPayed: boolean;
  permitedOrder: boolean;
  paymentForm: string;
  foodCombinations: FoodCombination[];
  foodLocalStorages: FoodLocalStorage[];
  foodLocalStoragesOrdered: FoodLocalStorage[];
  foodLocalStoragesOrdering: FoodLocalStorage[];
  orderingCombinations: OrderingCombination[];
  tableId: number;
  //search
  text: string;
  currentFood = [];

  constructor(private menuService: MenuService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private elementRef: ElementRef) {
                this.foodLocalStorages = [];
               }

  ngOnInit() {
    this.tableId = parseInt(localStorage.getItem("tableId"));
    this.orderingCombinations = [];
    this.foodLocalStoragesOrdering = [];
    this.foodLocalStoragesOrdered = [];
    this.quantity = 1;
    this.permitedOrder = false;
    if(localStorage.getItem('foodOrderLocal')) {
        this.foodLocalStorages = JSON.parse(localStorage.getItem('foodOrderLocal'));
        console.log("123", this.foodLocalStorages);
        this.showFoodFromLocalStorage(this.foodLocalStorages);
        if(this.foodLocalStoragesOrdering.length > 0) this.permitedOrder = true;
    }
    this.menuService.getAllFood()
        .subscribe(allFood => {this.allFood = allFood;
        this.food = this.getFood(1);

    });
    this.totalMoney();
    this.textSearch = "";
  }

  getFood(id: number) {
    var foodByType = [];
    this.allFood.forEach( (foodDrink, index) => {
      if(foodDrink.foodAndDrinkType.id === id) foodByType.push(foodDrink);
    });
    this.food = foodByType;
    return foodByType;
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

  getDetail(afood: FoodAndDrink) {
    this.getCombination(afood);
    this.quantity = 1;
    this.afood = afood;
    this.thisPrice = afood.price;
    this.priceNumFirst = this.afood.price;
  }

  quantityUp(type,index) {
    var foodCombinQuanity = document.getElementsByClassName('show-detail__number');
    switch (type) {
      case 'main': {
        this.quantity += 1;
        var priceNum = this.priceNumFirst * this.quantity;
        this.afood.price = priceNum;
        break;
      }
      case 'combind': {
        var currentQuantityOfCombind = parseInt(foodCombinQuanity[index+1].innerHTML);
        console.log('combind ', foodCombinQuanity[index+1].innerHTML);
        foodCombinQuanity[index+1].innerHTML = (currentQuantityOfCombind+1).toString();
        break;
      }
    }
  }

  quantityDown(type,index) {
    var foodCombinQuanity = document.getElementsByClassName('show-detail__number');
    switch (type) {
      case 'main': {
        this.quantity -= 1;
        if(this.quantity <= 0) this.quantity = 1;
        var priceNum = this.priceNumFirst * this.quantity;
        this.afood.price = priceNum;
        break;
      }
      case 'combind': {
        var currentQuantityOfCombind = parseInt(foodCombinQuanity[index+1].innerHTML);
        console.log('combind ', foodCombinQuanity[index+1].innerHTML);
        if(currentQuantityOfCombind === 0) {
          foodCombinQuanity[index+1].innerHTML = "0";
        }
        else {
          foodCombinQuanity[index+1].innerHTML = (currentQuantityOfCombind-1).toString();
        }
        break;
      }
    }
  }

  orderingFoodAndCombind(foodChoosed: FoodAndDrink) {
    var foodCombinQuanity = document.getElementsByClassName('show-detail__number');
    var numOfCombind_1 = parseInt(foodCombinQuanity[1].innerHTML);
    var numOfCombind_2 = parseInt(foodCombinQuanity[2].innerHTML);
    console.log('numOfCombind_1 ', numOfCombind_1, ' numOfCombind_2', numOfCombind_2);
    this.ordering(foodChoosed, 0);
    if(numOfCombind_1 > 0) {
      this.ordering(this.orderingCombinations[0].food, numOfCombind_1);
    }
    if(numOfCombind_2 > 0) {
      this.ordering(this.orderingCombinations[1].food, numOfCombind_2);
    }
  }

  changePrice(event) {
    var BACKSPACE_KEY= 8;
    if(this.quantity > 0) {
      var priceNum = this.priceNumFirst * this.quantity;
      this.afood.price = priceNum;
    }
    else if(this.quantity < 0){
      this.quantity = 1;
    }
  }

  clearFood(event) {
    console.log('event ', event);

    var parent = document.getElementsByClassName("ordering__food")[0];
    var foodClear = document.getElementsByClassName(event)[0];
    var listChild = parent.children;

    parent.removeChild(foodClear);
    if(listChild.length > 2) {
      this.permitedOrder = true;
      console.log("children ", listChild);
    } else this.permitedOrder = false;
    var currentPrice = this.totalMoney();
    this.totalMoney();
  }

// get order in list food
  getLastestOrder(): number {
    var numOrder = 0;
    var orders = $(".no-food");
    var sizeOrders = orders.length;
    if(sizeOrders > 0) {
      var lastestOrderClass = orders[sizeOrders -1];
      var classes = lastestOrderClass.className;
      var rangeClasses = classes.split(' ');

      var foodClasses = _.filter(rangeClasses, function(item) {
        return(_.includes(item, 'food'));
      });
      var classOrder = _.last(foodClasses);
      numOrder = parseInt(classOrder.split('food')[1]);
    }
    return numOrder;
  }

  closeFoodDetail(afood: FoodAndDrink) {
    this.quantity = 1;
    afood.price = this.thisPrice;
    $('#detailFood').modal('hide');
  }

  // save food into LocalStorage
  saveFoodIntoLocal(foodSaving: FoodLocalStorage) {
    var foodLocalStorages = JSON.parse(localStorage.getItem('foodOrderLocal'));
    if(foodLocalStorages && foodLocalStorages.length > 0) {
      var sizeFoodLocalStorages = foodLocalStorages.length;
      for(var i = 0; i < sizeFoodLocalStorages; i++) {
        console.log('infor @@@@ ');
        if((foodSaving.foodAndDrink.id === foodLocalStorages[i].foodAndDrink.id) &&
            (foodLocalStorages[i].ordered === foodSaving.ordered)) {
              console.log('test $$$ ', i);

              foodLocalStorages[i].quantity += foodSaving.quantity;
              foodLocalStorages[i].total += foodSaving.total;
              localStorage.setItem('foodOrderLocal', JSON.stringify(foodLocalStorages));
              return;
        }
        else if(i === (sizeFoodLocalStorages-1)) {
          console.log('test @@@@ ', foodSaving);
          foodLocalStorages.push(foodSaving);
          localStorage.setItem('foodOrderLocal', JSON.stringify(foodLocalStorages));
        }
      }
    }
    else {
      var local = [];
      local.push(foodSaving);
      console.log('not existed ', foodSaving);
      localStorage.setItem('foodOrderLocal', JSON.stringify(local));
    }
  }

  //remove out of local
  removeFromLocalStorage(foodRemoving: FoodLocalStorage) {
    var foodLocalStorages = JSON.parse(localStorage.getItem('foodOrderLocal'));
    var sizeFoodLocalStorages = foodLocalStorages.length;
    for(var i = 0; i < sizeFoodLocalStorages; i++) {
      if((foodRemoving.foodAndDrink.id === foodLocalStorages[i].foodAndDrink.id)) {
        console.log('remove ', foodLocalStorages[i]);

        foodLocalStorages.splice(i, 1);
        console.log('after remove ', foodLocalStorages);
        localStorage.setItem('foodOrderLocal', JSON.stringify(foodLocalStorages));
        return;
      }
    }
  }

  showFoodFromLocalStorage(foodLocals: FoodLocalStorage[]) {
    var self = this;
    var sizeFoodLocals = foodLocals.length;
    for(var j = 0; j < sizeFoodLocals; j++) {
      if(foodLocals[j].ordering) {
        this.foodLocalStoragesOrdering.push(foodLocals[j]);
        this.permitedOrder = true;
      }
      if(foodLocals[j].ordered) {
        this.foodLocalStoragesOrdered.push(foodLocals[j]);
      }
    }
    window.addEventListener('DOMContentLoaded', function () {
      var foodOrderedUI = document.getElementsByClassName('inner-odered');
      var foodOrderingUI = document.getElementsByClassName('ordered__food');

      // set class on ordered
      for(var i = 0; i < self.foodLocalStoragesOrdered.length; i++) {
        for(var j = 0; j < foodOrderedUI.length; j++) {
          var idFoodUI = parseInt(foodOrderedUI[j].children[3].innerHTML);
          if(idFoodUI == self.foodLocalStoragesOrdered[i].foodAndDrink.id) {
            console.log('idFoodUI ', idFoodUI);
            foodOrderedUI[j].classList.add(self.foodLocalStoragesOrdered[i].currentClass);
          }
        }
      }
      for(var i = 0; i < self.foodLocalStoragesOrdering.length; i++) {
        for(var j = 0; j < foodOrderingUI.length; j++) {
          var idFoodUI = parseInt(foodOrderingUI[j].children[4].innerHTML);
          if(idFoodUI == self.foodLocalStoragesOrdering[i].foodAndDrink.id) {
            var currentFood = self.foodLocalStoragesOrdering[i];
            var currentClass = currentFood.currentClass;
            foodOrderingUI[j].classList.add(currentClass);
            console.log('UI ', foodOrderingUI);
            var btnClear = foodOrderingUI[j].children[3];
            btnClear.classList.add(currentClass);
            (function(j, currentFood) {

              var btnClear = foodOrderingUI[j].children[3];
              btnClear.addEventListener("click", () => {
                console.log('btn clear ', btnClear);

                var classNameClear =  btnClear.className.split(" ")[1];
                console.log('classNameClear@@@@ ', classNameClear);

                self.clearFood(classNameClear);
                self.removeFromLocalStorage(currentFood);
              });
            }(j,currentFood));
          }
        }
      }
      self.totalMoney();
    }, true);
    console.log("cxcxccxc");
  }

  // //insert food choosed into ordering board
  ordering(afood: FoodAndDrink, quantityCombind) {
    var foodOrdering = document.getElementsByClassName("ordering__food")[0];
    var orderedFoodList = document.getElementsByClassName("ordered__food");
    var order = this.getLastestOrder() + 1;
    console.log('string ', order);
    var sizeOrderedFoodList = orderedFoodList.length;
    var isExist = false;

    //check: if food existed in ordering board => updateRate
    for(var i = 0; i < sizeOrderedFoodList; i++ ) {
      if(orderedFoodList[i].children[0].innerHTML == afood.name) {
        var currentQuantity =parseInt(orderedFoodList[i].children[1].innerHTML);
        var currentPrice =parseFloat(orderedFoodList[i].children[2].innerHTML.split(' ')[0]);
        if(quantityCombind > 0) {
          orderedFoodList[i].children[1].innerHTML = (currentQuantity + quantityCombind).toString();
        }
        else {
          orderedFoodList[i].children[1].innerHTML = (currentQuantity+ this.quantity).toString();
        }
        orderedFoodList[i].children[2].innerHTML = (currentPrice + afood.price).toString();
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      var addFood = document.createElement("div");
      var newClassDiv = "food"+order;
      // var newClassClear = "clear"+order;
      addFood.setAttribute("class", "ordering__food--text ordered__food no-food flex-box "+newClassDiv);
      if(quantityCombind > 0) {
        addFood.innerHTML =`
          <p class="ordered__food--name">`+afood.name+`</p>
          <p class="ordered__food--quantity">`+quantityCombind+`</p>
          <p class="ordered__food--price">`+afood.price+` d</p>
          <button class="ordered__food--clear `+newClassDiv+`">x</button>
          <p class="ordered__food--id">`+afood.id+`</p>
        `;
      }
      else {
        addFood.innerHTML =`
          <p class="ordered__food--name">`+afood.name+`</p>
          <p class="ordered__food--quantity">`+this.quantity+`</p>
          <p class="ordered__food--price">`+afood.price+` d</p>
          <button class="ordered__food--clear `+newClassDiv+`">x</button>
          <p class="ordered__food--id">`+afood.id+`</p>
        `;
      }
      foodOrdering.appendChild(addFood);
    }

    //save into localStorage
    console.log('current class ', newClassDiv);
    var savingFoodLocal = new FoodLocalStorage();
    savingFoodLocal.foodAndDrink = afood;
    savingFoodLocal.ordered = false;
    savingFoodLocal.ordering = true;
    if(quantityCombind > 0) {
      savingFoodLocal.quantity = quantityCombind;
    }
    else {
      savingFoodLocal.quantity = this.quantity;
    }
    savingFoodLocal.total = afood.price;
    savingFoodLocal.currentClass = newClassDiv;
    this.saveFoodIntoLocal(savingFoodLocal);
    console.log('@@@saved ', savingFoodLocal);

    this.permitedOrder = true;
    var buttonClear = this.elementRef.nativeElement.getElementsByClassName(newClassDiv)[1];
    buttonClear.addEventListener("click", () => {
      this.clearFood(newClassDiv);
    }, this);

    this.quantity = 1;
    this.totalMoney();
    var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
    btnOrder.classList.add("btn--suggest");
    afood.price = this.thisPrice;
    console.log('this.thisPrice ', this.thisPrice);

    $('#detailFood').modal('hide');
  }

  hotOrder(afood: FoodAndDrink) {
    this.thisPrice = afood.price;
    this.quantity = 1;
    this.ordering(afood, 0);
  }

  ordered() {
    let invoiceId = localStorage.getItem("invoiceId");
    var orderedWrap = document.getElementsByClassName("ordering__food")[0];
    var orderedFood = document.getElementById("ordered-food__wrap");
    var orderedFoodLst = orderedFood.children;
    var sizeOrderedFoodLst = orderedFoodLst.length;
    var orderingFoodLst = document.getElementsByClassName("ordered__food");
    var sizeOrderingFoodLst = orderingFoodLst.length;

    // if not exist food that ordered => push all
    if(sizeOrderingFoodLst === 0) {
      var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
      btnOrder.classList.add("btn--normal");
    }

    //if doesn't exist food ordered, append all food ordering to list ordered
    else if(sizeOrderedFoodLst === 0) {

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

      while(orderingFoodLst.length > 0) {
        orderedFood.appendChild(orderingFoodLst[0]);
        orderingFoodLst[0].classList.add("inner-odered");
        orderingFoodLst[0].classList.remove("ordered__food");
      }

      console.log("id "+ idArr);
      console.log("quantityId "+ quantityId);

      let orderBoard = {
        "tableId": this.tableId + "",
        "foodAndDrinkId": idArr,
        "quantity": quantityId
      };

      console.log(orderBoard);
      this.menuService.postOrder(orderBoard)
            .subscribe(res => {this.invoiceId = res._body; console.log(this.invoiceId);
                              localStorage.setItem("invoiceId", this.invoiceId+"")});
    }

    //if existed, check all food, if the same food, increase quantity, opposite, append into list ordered
    else {
      var arrNewId = '';
      var arrNewQuantity = '';
      console.log("sizeOrderingFoodLst "+ sizeOrderingFoodLst);

      //list order send to server
      var orderingIds = [];
      for(var b = 0; b < sizeOrderingFoodLst; b++) {
        console.log('orderingFoodLst[b].children[4] ', orderingFoodLst[b].children);
        if(orderingFoodLst[b].children.length !== 0) {
          orderingIds.push(parseInt(orderingFoodLst[b].children[4].innerHTML));
          if(b === (sizeOrderingFoodLst-1)) {
            arrNewId += orderingFoodLst[b].children[4].innerHTML;
            arrNewQuantity += orderingFoodLst[b].children[1].innerHTML;
          }
          else {
            arrNewId += orderingFoodLst[b].children[4].innerHTML + ',';
            arrNewQuantity += orderingFoodLst[b].children[1].innerHTML + ',';
          }
        }
      }
      var orderedIds = [];
      for(var t = 0; t < sizeOrderedFoodLst; t++) {
        if(orderedFoodLst[t].children.length > 0) {
          orderedIds.push(parseInt(orderedFoodLst[t].children[3].innerHTML));
        }
      }

      console.log('ing ', orderingIds, ' ed ', orderedIds);
      var differFood = _.difference(orderingIds, orderedIds); //get id of new food (not include in ordered list)
      var sizeDifferFood = differFood.length;

      // show on UI
      for(let i = 0; i < sizeDifferFood; i++) {
        let j = 0;
        while(differFood[i] != orderingFoodLst[j].children[4].innerHTML) j++;
        orderedFood.appendChild(orderingFoodLst[j]);
        orderingFoodLst[j].classList.add("inner-odered");
        orderingFoodLst[j].classList.remove("ordered__food");
      }

      //existed
      sizeOrderingFoodLst = orderingFoodLst.length;
      if(sizeOrderingFoodLst > 0) {
        var sizeOrderedIds = orderedIds.length;
        for(let i = 0; i < sizeOrderedIds; i++) {
          for(let j = 0; j < sizeOrderingFoodLst; j++) {
            if((orderedIds[i] == orderingFoodLst[j].children[4].innerHTML) && orderingFoodLst[j] ) {
              var existedFood = parseInt(orderedFoodLst[i].children[1].innerHTML);
              var addQuantityFood = parseInt(orderingFoodLst[j].children[1].innerHTML);
              var totalQuantity = existedFood+addQuantityFood;
              var existedPrice = parseFloat(orderedFoodLst[i].children[2].innerHTML.split(" ")[0]);
              var addPrice = parseFloat(orderingFoodLst[j].children[2].innerHTML.split(" ")[0]);
              var totalPrice = existedPrice + addPrice;
              orderedFoodLst[i].children[1].innerHTML = totalQuantity.toString();
              orderedFoodLst[i].children[2].innerHTML = totalPrice.toString() + " d";
            }

          }
        }
      }

      this.invoiceId = localStorage.getItem("invoiceId");
      let orderNew = {
        "invoiceId": this.invoiceId,
        "foodAndDrinkId": arrNewId,
        "quantity": arrNewQuantity
      }

      console.log(orderNew);
      this.menuService.updateOrder(orderNew)
            .subscribe(res => {console.log(res)});
      while (orderingFoodLst.length > 0) {
        orderingFoodLst[0].remove();
      }
    }

    // update localStorage
    var foodLocal = JSON.parse(localStorage.getItem('foodOrderLocal'));
    var foodLocalOrdering = [];
    var foodLocalOrdered = [];
    foodLocal.forEach(function(food, index) {
      if(food.ordering) foodLocalOrdering.push(food);
      else foodLocalOrdered.push(food);
    });

    console.log('##food ordered ', foodLocalOrdered);
    console.log('##food ordering ', foodLocalOrdering);

    var indexOrderingCommon = [];
    var indexOrderings = [];
    foodLocalOrdering.forEach(function(foodOrdering, indexOrdering) {
      indexOrderings.push(indexOrdering);
      console.log('index ordering ', indexOrdering);
    });
    foodLocalOrdered.forEach(function(foodOrdered, indexOrdered) {
      foodLocalOrdering.forEach(function(foodOrdering, indexOrdering) {
        if(foodOrdered.foodAndDrink.id === foodOrdering.foodAndDrink.id) {
          foodOrdered.quantity += foodOrdering.quantity;
          foodOrdered.total += foodOrdering.total;
          indexOrderingCommon.push(indexOrdering);
        }
      })
    });
    var differOrdering = _.difference(indexOrderings, indexOrderingCommon);
    console.log('indexOrderings ', indexOrderings);
    console.log('differOrdering ', differOrdering);
    console.log('common ', indexOrderingCommon);
    foodLocalOrdering.forEach(function(foodOrdering, index) {
      if(differOrdering[index] === index) {
        foodOrdering.ordered = true;
        console.log('ordered $$$ ', foodOrdering);
        foodOrdering.ordering = false;
        foodLocalOrdered.push(foodOrdering);
      }
    });
    localStorage.setItem('foodOrderLocal', JSON.stringify(foodLocalOrdered));
    console.log('ordered ', foodLocalOrdered);

     //  remove btn clear
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
     this.totalMoney();
  }

  filterFoodFromCombination(food: FoodAndDrink, foodCombinations: FoodCombination[]) {
    // var self = this;
    var orderingCombinations = [];
    foodCombinations.forEach(function(foodCom, index) {
      var foodCombination = new OrderingCombination();
      foodCombination.quantity = 0;
      if(food.foodAndDrinkType.mainDish) {
        foodCombination.food = foodCom.drinkOrDesert;
      }
      else {
        foodCombination.food = foodCom.mainDish;
      }
      orderingCombinations.push(foodCombination);
    });
    return orderingCombinations;
  }

  getCombination(food) {
    return this.menuService.getCombination(food.id)
      .subscribe(res => {this.foodCombinations = res;
        console.log('combination: ', this.foodCombinations);
        this.orderingCombinations = this.filterFoodFromCombination(food, this.foodCombinations);
        console.log('combination + quantity ',this.orderingCombinations);
        });
  }

  requestPayment() {
    console.log('payment ', this.paymentForm);
    var payment = new Payment;
    payment.invoiceId = this.invoiceId;
    payment.paymentType = this.paymentForm;
    localStorage.removeItem("foodOrderLocal");
    this.foodLocalStorages = JSON.parse(localStorage.getItem("foodOrderLocal"));
    this.foodLocalStoragesOrdered = [];
    this.foodLocalStoragesOrdering = [];
    this.totalMoney();
    $('#paymentForm').modal('hide');
    // return this.menuService.paymentRequest(payment)
    //   .subscribe(res => {this.isPayed = res; ; console.log("pay ", this.isPayed );
    //     localStorage.removeItem("invoiceId")},
    //     err => {console.log(err)});
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
    var foodScore = this.itemSvg.selectedPuk;
    var serviceScore = this.itemSvgService.selectedStars;
    var numOfpeopleFood = 0;
    var numOfPeopleService = 0;
    var newRate= new RatingPost();
    newRate.invoiceId = this.invoiceId;
    newRate.score = foodScore + "," + serviceScore;
    this.menuService.updateRate(newRate);
    $('#rating').modal('hide');
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
