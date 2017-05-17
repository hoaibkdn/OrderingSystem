import { Component, OnInit, Directive, ElementRef, ComponentFactoryResolver,
        ComponentRef, Input } from '@angular/core';
import { MenuService } from './menu.services';
import { FoodAndDrink } from '../models/food-and-drink';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/map';
import { Rating } from '../models/Rating';
import { RatingPost } from '../models/rating-post';
import { Payment } from '../models/payment';
import { FoodCombination } from '../models/FoodCombination';
import { FoodLocalStorage } from '../models/food-localstorage';
import { OrderingCombination } from '../models/ordering-combination';
import { FoodAndDrinkType } from '../models/food-and-drink-type';
import { UserProfileService } from '../user-profile/user-profile.service';
import { LoadingPage } from './../loading-indicator/loading-page';
import { AdminService } from './../admin/admin.service';
import { AdStatisticDrinkService } from './../ad-statistic-drink/ad-statistic-drink.service';
import { Table } from '../models/table';
import { Chart } from 'angular-highcharts';
// import { TruncatePipe } from './../truncate';

import * as _ from 'lodash';
declare var $:any;
declare var Stomp: any;

@Component({
  selector: 'app-menu',
  // pipes: [ TruncatePipe ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MenuComponent extends LoadingPage implements OnInit {
  food: FoodAndDrink[];
  allFood: FoodAndDrink[];
  afood: FoodAndDrink;
  isfilteringFood: boolean = true;
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
  isPaid: boolean;
  permitedOrder: boolean;
  paymentForm: string;
  foodCombinations: FoodCombination[];
  foodLocalStorages: FoodLocalStorage[];
  foodLocalStoragesOrdered: FoodLocalStorage[];
  foodLocalStoragesOrdering: FoodLocalStorage[];
  orderingCombinations: OrderingCombination[];
  tableId: number;
  typeOfFoods: FoodAndDrinkType[];
  text: string;
  currentFood = [];
  stompClient: any;
  longitude: number;
  latitude: number;
  distance: number;
  resLon: number;
  resLat: number;
  widthDevice: number;
  isMobileInvoiceOpen: boolean;
  isOpenedModal: boolean = false;
  tables: Table[];
  currentTable: Table;
  temporaryTable: Table;
  chart: Chart;
  ratingFoodArr: Rating[];
  ratingServiceArr: Rating[];
  showOrder: boolean;
  typeChoosing: number;
  options = {
    timeout: 10000
  };

  constructor(private menuService: MenuService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private elementRef: ElementRef,
              private router: Router,
              private userProfileService: UserProfileService,
              private adminService: AdminService,
              private adStatisticDrinkService: AdStatisticDrinkService) {
                super(false);
                this.foodLocalStorages = [];
  }

  error(err) {
    console.log(err);
  }

  setPosition(position){
      this.longitude = position.coords.longitude;
      this.latitude = position.coords.latitude;
      this.userProfileService.getLocation().subscribe(res => {
        let location = res._body;
        this.resLat = location.split(',')[0];
        this.resLon = location.split(',')[1];
        localStorage.setItem('resLat', this.resLat + "");
        localStorage.setItem('resLon', this.resLon + "");
        this.distance = this.distanceInKmBetweenEarthCoordinates(this.resLat, this.resLon, this.latitude, this.longitude);
        console.log("Distance: ", this.distance.toFixed(2), " km");
      }, err => {
        console.log(err);
      })
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  // https://en.wikipedia.org/wiki/Haversine_formula
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2-lat1);
    var dLon = this.degreesToRadians(lon2-lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    this.distance = earthRadiusKm * c * 1000
    return earthRadiusKm * c;
  }

  // Call to get distance
  getDistance(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(this.setPosition.bind(this), this.error, this.options);
     } else {
         alert("No location is supported");
     }
  }

  ngOnInit() {
    this.standby();
    this.isfilteringFood = true;

    // set isPaid from localStorage
    var isPaidLocal = localStorage.getItem('isPaid');
    if(isPaidLocal) {
      console.log("Is pay in local storage", isPaidLocal);
      this.isPaid = (isPaidLocal === "true");
    }
    else {
      this.isPaid = false;
    }
    localStorage.setItem('isPaid', this.isPaid.toString());

    // set permitedOrder from localStorage
    var permitedOrderLocal = localStorage.getItem('permitedOrder');
    if(permitedOrderLocal) {
      console.log("Is pay in local storage", permitedOrderLocal);
      this.permitedOrder = (permitedOrderLocal === "true");
    }
    else {
      this.permitedOrder = false;
    }
    localStorage.setItem('permitedOrder', this.permitedOrder.toString());

    // set showOrder from localStorage
    // localStorage.removeItem('showOrder');
    var showOrderLocal = localStorage.getItem('showOrder');
    console.log('showOrderLocal ', showOrderLocal);

    if(showOrderLocal) {
      this.showOrder = (showOrderLocal === "true");
      if(this.showOrder) {
        $('.chart').hide();
        $('.ordering__food').show();
      }
    }
    else {
      this.showOrder = false;
      $('.ordering__food').hide();
    }
    localStorage.setItem('permitedOrder', this.permitedOrder.toString());
    localStorage.setItem('showOrder', this.showOrder.toString());

    let isCustomer = localStorage.getItem("isCustomer");
    if(isCustomer && isCustomer.includes("true")){
      this.connectAdmin();
    }

    // TODO: Fix table id
    var existedTable = localStorage.getItem('currentTable');
    if(existedTable) {
      this.currentTable = JSON.parse(localStorage.getItem('currentTable'));
      this.tableId = this.currentTable.id;
      localStorage.setItem("tableId", this.tableId + "");
      console.log('tableId ', this.tableId);
    }
    this.isOpenedModal = false;
    this.getTypeOfFood();
    this.orderingCombinations = [];
    this.foodLocalStoragesOrdering = [];
    this.foodLocalStoragesOrdered = [];
    this.quantity = 1;
    this.permitedOrder = false;
    localStorage.setItem('permitedOrder', this.permitedOrder.toString());
    if(localStorage.getItem('foodOrderLocal')) {
        this.foodLocalStorages = JSON.parse(localStorage.getItem('foodOrderLocal'));
        console.log("123", this.foodLocalStorages);
        this.showFoodFromLocalStorage(this.foodLocalStorages);
        if(this.foodLocalStoragesOrdering.length > 0) {
          this.permitedOrder = true;
          localStorage.setItem('permitedOrder', this.permitedOrder.toString());
        }
    }
    this.menuService.getAllFood()
        .subscribe(allFood => {this.allFood = allFood;
        this.food = this.getFood(0);
        this.ready();
        this.typeChoosing = 0;
    });
    this.totalMoney();
    this.textSearch = "";
    this.checkCurrentType();
    this.getDistance();
    this.isMobileInvoiceOpen = false;
    this.isOpenedModal = false;
    console.log('init modal ', this.isMobileInvoiceOpen);
    var self = this;
    // this.checkInvoiceMobileOpen();
    $('body').on('click', function(e){
      console.log('@@@@@ modal close1 ', self.isMobileInvoiceOpen);
      var isOpen = $('#invoiceMobile').hasClass('in');
      console.log('body isOpenedModal ', self.isOpenedModal);
      if(self.isMobileInvoiceOpen && self.isOpenedModal && !isOpen) {
        console.log('@@@@@ modal close2 ', self.isMobileInvoiceOpen);
        var allInvoice = $('.ordering');
        var boxInvoiceTb = $('.invoice');
        boxInvoiceTb.append(allInvoice);
        self.isMobileInvoiceOpen = false;
        self.isOpenedModal = false;
        console.log('@@@@@ modal close3 ', self.isMobileInvoiceOpen);
      }
    });

    // init chart
    this.adStatisticDrinkService.getRatingDrink()
      .subscribe(rateFood => {this.ratingFoodArr = rateFood;
      this.adStatisticDrinkService.getRatingService()
        .subscribe(rateService => {this.ratingServiceArr = rateService;
          var dataFood = [parseInt(this.ratingFoodArr[0].numOfPeople), parseInt(this.ratingFoodArr[1].numOfPeople),
          parseInt(this.ratingFoodArr[2].numOfPeople), parseInt(this.ratingFoodArr[3].numOfPeople), parseInt(this.ratingFoodArr[4].numOfPeople)]
          var dataService = [parseInt(this.ratingServiceArr[0].numOfPeople), parseInt(this.ratingServiceArr[1].numOfPeople),
          parseInt(this.ratingServiceArr[2].numOfPeople), parseInt(this.ratingServiceArr[3].numOfPeople), parseInt(this.ratingServiceArr[4].numOfPeople)]
          self.chart = new Chart({
            chart: {
              type: 'column',
              width: 220,
              height: 290,
            },

            title: {
                text: 'Rating of food and service',
                'style': {
                  'font-size': '12px'
                }
            },
            xAxis: {
                categories: [
                    '1*',
                    '2*',
                    '3*',
                    '4*',
                    '5*'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Num of people rating",
                    'style': {
                      'font-size': '10px'
                    }
                }
            },
            plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0,
                  shadow: false
              }
            },
            series: [{
              name: "food",
              data: dataFood,
            }, {
              name: "service",
              data: dataService,
            }]
          });
    })})
  }

  showInvoiceMobile() {
    var widthDevice = $(window).width();
    console.log('widthDevice ', widthDevice);
    if(widthDevice <= 768) {
      var allInvoice = $('.ordering');
      var boxInvoiceMb = $('.show-invoice-mobile');
      boxInvoiceMb.append(allInvoice);
      this.isMobileInvoiceOpen = true;
      // this.isOpenedModal = true;
      //   console.log('isOpenedModal ', this.isOpenedModal);
      var that = this;
      setTimeout(function() {
        console.log('isOpenedModal1 ', that.isOpenedModal);
        that.isOpenedModal = true;
        console.log('isOpenedModal2 ', that.isOpenedModal);
      }, 500);
      console.log('show invoice ', this.isMobileInvoiceOpen);

    }
  }

  closeInvoiceMobile() {
    var allInvoice = $('.ordering');
    var boxInvoiceTb = $('.invoice');
    boxInvoiceTb.append(allInvoice);
    this.isMobileInvoiceOpen = false;
    this.isOpenedModal = false;
    $('#invoiceMobile').modal('hide');
  }

  connectAdmin(): void {
    this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
        console.log(this.stompClient);
        setInterval(() => {
            if(!this.stompClient.connected){
              console.log("Failed to connect");
            } else {
              console.log("Interval at " + new Date());
              this.stompClient.send("/app/admin", {}, "");
            }
          }, 30000);
        this.stompClient.subscribe('/request/admin', (messageOutput) => {
          var tag = document.getElementsByClassName('chat-box')[0];
          console.log("Received message: ", messageOutput.body);
        });
    });
  }

  getFood(id: number) {
    if(id === 0) {
      this.food = this.allFood;
      this.typeChoosing = 0;
      return this.food;
    }
    this.isfilteringFood = true;
    var foodByType = [];
    this.allFood.forEach( (foodDrink, index) => {
      if(foodDrink.foodAndDrinkType.id === id) foodByType.push(foodDrink);
    });
    this.food = foodByType;
    this.typeChoosing = id;
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
    this.showOrder = true;
    localStorage.setItem('showOrder', this.showOrder.toString());
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
    $('.chart').hide();
    $('.ordering__food').show();
    this.showOrder = true;
    localStorage.setItem('showOrder', this.showOrder.toString());
    // if(this.distance > 1) {
    //   alert("You cannot order food or drink outside the restaurant");
    // }
    // else {
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
    // }
  }

  changePrice(event) {
    var BACKSPACE_KEY= 8;
    if(this.quantity > 0) {
      var priceNum = this.priceNumFirst * this.quantity;
      this.afood.price = priceNum;
    }
    else if(this.quantity <= 0){
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
      localStorage.setItem('permitedOrder', this.permitedOrder.toString());
      console.log("children ", listChild);
    } else {
      this.permitedOrder = false;
      localStorage.setItem('permitedOrder', this.permitedOrder.toString());
      this.isPaid = false;
      localStorage.setItem('isPaid', this.isPaid+'');
      var colapseFood = document.getElementById('#ordered-food__wrap');
      console.log('colapseFood ', colapseFood);

      if(!colapseFood) {
        console.log('show chart');
        var widthSize = $(window).width();
        if(widthSize > 768) {
          $('.chart').show();
        }
        this.showOrder = false;
        localStorage.setItem('showOrder', this.showOrder+'');
      }
    }
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

      var foodClasses = _.filter(rangeClasses, function(item: string) {
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
        localStorage.setItem('permitedOrder', this.permitedOrder.toString());
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
    localStorage.setItem('permitedOrder', this.permitedOrder.toString());
    var buttonClear = this.elementRef.nativeElement.getElementsByClassName(newClassDiv)[1];
    buttonClear.addEventListener("click", () => {
      this.clearFood(newClassDiv);
      this.removeFromLocalStorage(savingFoodLocal);
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
    $('.ordering__food').show();
    this.showOrder = true;
    localStorage.setItem('showOrder', this.showOrder.toString());
    this.thisPrice = afood.price;
    this.quantity = 1;
    this.ordering(afood, 0);
    $('.chart').hide();
  }

  actOrder() {
    if(!this.currentTable) {
      this.chooseTable();
    }
    else this.ordered();
  }

  ordered() {
    // if(this.currentTable) {
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

      var orderIdLst = orderingFoodLst;
      var idArr = "";
      var quantityId = "";
      for(var a=0; a < sizeOrderingFoodLst; a++) {
        console.log('657575 ', orderIdLst[a].children[4].innerHTML);
        if(a === orderIdLst.length-1 ) {
          console.log('657575 ', orderIdLst[a].children[4].innerHTML);

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
        "tableId": this.currentTable.id + "",
        "foodAndDrinkId": idArr,
        "quantity": quantityId
      };

      console.log(orderBoard);
      this.menuService.postOrder(orderBoard)
            .subscribe(res => {
              console.log('status1 ', res._body);

              // update to UI
              while(orderingFoodLst.length > 0) {
                orderedFood.appendChild(orderingFoodLst[0]);
                orderingFoodLst[0].classList.add("inner-odered");
                orderingFoodLst[0].classList.remove("ordered__food");
              }

              updateBtn();
              updatLocalStorage();

              this.invoiceId = res._body;
              console.log(this.invoiceId);
              this.sendMessageAdmin();
              localStorage.setItem("invoiceId", this.invoiceId+"")
            });
              // this.invoiceId = res._body;
              // console.log(this.invoiceId);
              // this.sendMessageAdmin();
              // localStorage.setItem("invoiceId", this.invoiceId+"")});

      // // update to UI
      // while(orderingFoodLst.length > 0) {
      //   orderedFood.appendChild(orderingFoodLst[0]);
      //   orderingFoodLst[0].classList.add("inner-odered");
      //   orderingFoodLst[0].classList.remove("ordered__food");
      // }
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

      this.invoiceId = localStorage.getItem("invoiceId");
      let orderNew = {
        "invoiceId": this.invoiceId,
        "foodAndDrinkId": arrNewId,
        "quantity": arrNewQuantity
      }

      console.log(orderNew);
      this.menuService.updateOrder(orderNew)
            .subscribe(res => {
              console.log('status2 ', res);
              this.sendMessageAdmin();
              showOnUI();
              updateBtn();
              updatLocalStorage();
            });

      // show on UI
      var showOnUI = function() {
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
        while (orderingFoodLst.length > 0) {
          orderingFoodLst[0].remove();
        }
      };
    }

    // update localStorage
    var updatLocalStorage = function() {
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
    }


     //  remove btn clear
     var that = this;
     var updateBtn = function() {
       var btnRemove = document.getElementsByClassName("ordered__food--clear");
       var size = btnRemove.length;
       while(size > 0) {
         btnRemove[size-1].remove();
         size--;
       }
       var btnPaymen = document.getElementsByClassName("ordering__btn--payment")[0];
       that.isPaid = true;
       localStorage.setItem("isPaid", that.isPaid.toString());
       console.log('isPaid ', that.isPaid);

       var btnOrder = document.getElementsByClassName("ordering__btn--order")[0];
       btnOrder.classList.add("btn--normal");
       btnOrder.classList.remove("btn--suggest");
       that.totalMoney();
     }
    // }
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
    localStorage.removeItem("isPaid");
    localStorage.removeItem("currentTable");
    this.foodLocalStorages = JSON.parse(localStorage.getItem("foodOrderLocal"));
    this.foodLocalStoragesOrdered = [];
    this.foodLocalStoragesOrdering = [];
    this.totalMoney();
    this.stompClient.send("/app/admin", {}, "Table: " + localStorage.getItem("tableId")
      + " - InvoiceId: " + payment.invoiceId + " is requesting payment with type: " + payment.paymentType);
    $('#paymentForm').modal('hide');
    // location.reload();
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
    this.menuService.updateRate(newRate).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
    $('#rating').modal('hide');
    this.router.navigate(["/"]);
    this.isPaid = false;
    localStorage.setItem('isPaid', this.isPaid.toString());
    this.showOrder = false;
    localStorage.setItem('showOrder', this.showOrder.toString());
    this.showTotalIsPaid();
    // localStorage.removeItem("tableId");
    // localStorage.removeItem('currentTable');
    // location.reload();
  }

  closeRating() {
    this.router.navigate(["/"]);
    $('#rating').modal('hide');
    this.isPaid = false;
    localStorage.setItem('isPaid', this.isPaid.toString());
    $('.ordering__food').hide();
    this.showOrder = false;
    localStorage.setItem('showOrder', this.showOrder.toString());
    this.showTotalIsPaid();
    // localStorage.removeItem("tableId");
    // localStorage.removeItem('currentTable');
  }

  showTotalIsPaid() {
    var total = document.getElementsByClassName('ordering__total--money')[0];
    total.innerHTML = '0 d';
    $('.chart').show();
  }

  onKey(event:any) {
    this.isfilteringFood = false;
    console.log('on key @@@@ ' , this.textSearch);

    // reverst food
    var sizeCurrentFood = this.currentFood.length;
    if(sizeCurrentFood > 0) {

      //pop all food in food
      var sizeAllFood = this.allFood.length;
      while(sizeAllFood > 0) {
        this.allFood.splice(0, 1);
        sizeAllFood--;
      }
      this.currentFood.forEach((value, index) => {
        this.allFood.push(value);
      }, this);
    }

    else {
      this.allFood.forEach(function(value, index) {
        this.currentFood.push(value);
      }, this);
    }

    var ENTER_KEY = 13;
    var indexArr = [];

    this.currentFood.forEach(function(value, index) {
      if(!value.name.toLowerCase().includes(this.textSearch) && !value.detail.toLowerCase().includes(this.textSearch)) {
        indexArr.push(index);
      }
    }, this);
    var size = indexArr.length;

// push food out of array => filter for search
    for (var x = 0; x < size; x++ ) {
      this.allFood.splice(indexArr[x], 1);
      if(size > 0 && x < (size -1)) {
        for (var y = 1; y < size; y++ ) {
          indexArr[y] -= 1;
        }
      }
    }

    console.log("all food size "+ this.allFood.length);
    console.log("current food size "+ this.currentFood.length);

    if(event.keyCode === ENTER_KEY) {
      this.searchTags();
    }
  }

  searchTags() {
    console.log('textSearch ', this.textSearch);
    this.isfilteringFood === false;
    this.menuService.searchTags(this.textSearch)
      .subscribe(res => {this.allFood = res;
        console.log('search tag ', this.allFood);
        });
  }

  getTypeOfFood() {
    this.menuService.getTypeOfFood()
    .subscribe(res => {this.typeOfFoods = res;
      console.log('type ', this.typeOfFoods);
      })
  }


  typeUpDown() {


    var top = parseInt($('.btn-type').css('top').split('px')[0]);
    if(top === 0) {
      $('.type-down').css({'color': '#EA6D24'});
      $('.type-down').prop('disabled', false);
      $('.type-up').css({'color': '#ccc'});
      $('.type-up').prop('disabled', true);
    }
    $('.menu').on('click', '.type-down', function(event) {
      event.preventDefault();
      var top = parseInt($('.btn-type').css('top').split('px')[0]);
      if(top > -300) {
        $('.btn-type').css({'top': top-80+'px'});
        $('.type-down').css({'color': '#EA6D24'});
        $('.type-down').prop('disabled', false);
      }
      else {
        $('.type-down').css({'color': '#ccc'});
        $('.type-down').prop('disabled', true);
      }
      if(top > -200 && top <= 0) {
        $('.type-up').css({'color': '#EA6D24'});
        $('.type-up').prop('disabled', false);
      }
      if(top > -300 && top < -100) {
         $('.type-down').css({'color': '#ccc'});
         $('.type-down').prop('disabled', true);
      }
      console.log('top down', top);
    });
    $('.menu').on('click', '.type-up', function(event) {
      event.preventDefault();
      var top = parseInt($('.btn-type').css('top').split('px')[0]);

      if(top < 0) {
        $('.btn-type').css({'top': top+150+'px'});
        $('.type-up').css({'color': '#EA6D24'});
        $('.type-up').prop('disabled', false);
      }
      else {
        $('.type-up').css({'color': '#ccc'});
        $('.type-up').prop('disabled', true);
      }
      if(top > -100) {
        $('.type-down').css({'color': '#EA6D24'});
        $('.type-up').css({'color': '#ccc'});
        $('.type-up').prop('disabled', true);
      }
      if(top > -200 && top < 0) {
        $('.type-down').css({'color': '#EA6D24'});
        $('.type-up').css({'color': '#ccc'});
        $('.type-up').prop('disabled', true);
        $('.type-down').prop('disabled', false);
      }
      console.log('top down', top);
    });
  }

  checkCurrentType() {
    var sizeBtnType = 80;
    var numOfBtnType = document.getElementsByClassName("btn-menu").length;
    console.log('numOfBtnType ', numOfBtnType);
    var top = parseInt($('.btn-type').css('top').split('px')[0]);
    if(top === 0) {
      $('.type-down').css({'color': '#EA6D24'});
      $('.type-down').prop('disabled', false);
      $('.type-up').css({'color': '#ccc'});
      $('.type-up').prop('disabled', true);
    }
    else if(top === (-sizeBtnType*numOfBtnType)) {
      $('.type-down').css({'color': '#ccc'});
      $('.type-down').prop('disabled', true);
      $('.type-up').css({'color': '#EA6D24'});
      $('.type-up').prop('disabled', false);
    }
  }

  upType() {
    this.checkCurrentType();
    var sizeBtnType = 80;
    var currentTop = parseInt($('.btn-type').css('top').split('px')[0]);
    var numOfBtnType = document.getElementsByClassName("btn-menu").length;
    var valueChange = sizeBtnType*3;
    var allSizeBtnType = sizeBtnType*numOfBtnType;
    var absCurrentTop = Math.abs(currentTop);
    if(absCurrentTop > 0) {
      $('.btn-type').css({'top': (currentTop+valueChange)+'px'});
      $('.type-down').css({'color': '#EA6D24'});
      $('.type-down').prop('disabled', false);
    }
    if((allSizeBtnType-Math.abs(currentTop+valueChange)) == allSizeBtnType) {
      $('.type-down').css({'color': '#EA6D24'});
      $('.type-down').prop('disabled', false);
      $('.type-up').css({'color': '#ccc'});
      $('.type-up').prop('disabled', true);
    }
  }

  downType() {
    this.checkCurrentType();
    var sizeBtnType = 80;
    var currentTop = parseInt($('.btn-type').css('top').split('px')[0]);
    var numOfBtnType = document.getElementsByClassName("btn-menu").length;
    var valueChange = sizeBtnType*3;
    var absCurrentTop = Math.abs(currentTop);
    var allSizeBtnType = sizeBtnType*numOfBtnType;
    if(absCurrentTop < (allSizeBtnType - valueChange)) {
      $('.btn-type').css({'top': (currentTop-valueChange)+'px'});
      $('.type-up').css({'color': '#EA6D24'});
      $('.type-up').prop('disabled', false);
    }
    if((allSizeBtnType-Math.abs(currentTop-valueChange)) < sizeBtnType*5) {
      $('.type-down').css({'color': '#ccc'});
      $('.type-down').prop('disabled', true);
      $('.type-up').css({'color': '#EA6D24'});
      $('.type-up').prop('disabled', false);
    }
  }

  sendMessageAdmin(): void {
    let table = JSON.parse(localStorage.getItem("currentTable"));
    this.stompClient.send("/app/admin", {}, "Table " + table.tableNumber + " is ordering");
  };

  chooseTable():boolean {
    $("#chooseTable").modal('show');
    var allTable = this.adminService.getAllTable()
      .subscribe(res => {this.tables = JSON.parse(res._body);;
        console.log('tables ', this.tables);});
    if(this.currentTable) return true;
    else false;
  }
  getNumOfTable(table: Table) {
    if(table.tableStatus !== 0) {
      $('#confirmTable').modal('show');
    }
    else {
      this.temporaryTable = table;
    }
  }

  selectTable() {
    this.currentTable = this.temporaryTable;
    localStorage.setItem('currentTable', JSON.stringify(this.currentTable));
    console.log('choose table: ', JSON.parse(localStorage.getItem('currentTable')));
    this.ordered();
    $("#chooseTable").modal('hide');
  }
}
