import { FoodAndDrink } from './food-and-drink';

export class InvoiceDetail {
  id: number,
  foodAndDrink: FoodAndDrink,
  quantity: number,
  price: number,
  orderingTime: string,
  visible: boolean,
  made: boolean
}
