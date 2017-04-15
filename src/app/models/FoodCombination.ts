import { FoodAndDrink } from './food-and-drink';

export class FoodCombination {
  id: number;
  mainDish: FoodAndDrink;
  drinkOrDesert: FoodAndDrink;
  numOfOrderedTogether: number;
  visible: boolean;
}
