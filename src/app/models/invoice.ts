import { User} from './user';
import { Table} from './table';

export class Invoice {
  id: number;
  customerUser : User;
  staffUser: User;
  table: Table;
  createdDate: Date;
  payingTime: Date;
  totalAmount: number;
  paymentType: string;
  paid: boolean;
  visible: boolean;
  made: boolean;
}
