import { Shift } from './shift';
import { User } from './user';



export class WorkingTime{
	id: number;
	user: User;
	shift: Shift;
	date: Date;
}