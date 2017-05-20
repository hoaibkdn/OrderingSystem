import { User } from './user';
import { Table } from './table';

export class ReservedTable {
  id: number;
  detail: string;
  user: User;
  table: Table;
  finalStatus: number;
  reservingTime: number;
  travelingTime: number;
}
