import { Component, OnInit } from '@angular/core';
import { HistoryFavoriteService } from './history-favorite.service'
import { Favorite } from '../models/favorite';

@Component({
  selector: 'app-history-favorite',
  templateUrl: './history-favorite.component.html',
  styleUrls: ['./history-favorite.component.scss']
})
export class HistoryFavoriteComponent implements OnInit {
  favoriteFood: Favorite[];
  sortBy = "quantity";
  constructor(
    private historyFavoriteService: HistoryFavoriteService
  ) { }

  ngOnInit() {
    this.historyFavoriteService.getAllFavorite()
      .subscribe(res => { this.favoriteFood = res;
        console.log('favorite ', this.favoriteFood);
        for(let i = 0; i < this.favoriteFood.length; i++){
          this.favoriteFood[i].price = parseInt(this.favoriteFood[i].price + "");
          this.favoriteFood[i].quantity = parseInt(this.favoriteFood[i].quantity + "");
        }
      },
      err => {console.log(err)});
  }

}
