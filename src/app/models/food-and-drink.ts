import { FoodAndDrinkType } from './food-and-drink-type';

export class FoodAndDrink {
  id: number;
  name: string;
  price: number;
  detail: string;
  numOrdered: number;
  foodAndDrinkType: FoodAndDrinkType;
  tags: string;
  createdDate: Date;
  visible: boolean;
}
