import { RateType } from './rate-type';
import { User } from './user';
import { Invoice } from './invoice';
export class RatingGet {
  id: number;
  user: User;
  rateType: RateType;
  score: number;
  invoice: Invoice;
  rateTime: Date;
}
