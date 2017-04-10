import { User} from './user';
import { Table} from './table';

export class Invoice {
  id: number;
  customerUser : User;
  staffUser: User;
  table: Table;
  paid: boolean;
  visible: boolean;
}
