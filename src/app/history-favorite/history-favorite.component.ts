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
  constructor(
    private historyFavoriteService: HistoryFavoriteService
  ) { }

  ngOnInit() {
    this.historyFavoriteService.getAllFavorite()
      .subscribe(res => { this.favoriteFood = res;
        console.log('favorite ', res);
      },
      err => {console.log(err)});
  }

}
