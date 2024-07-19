import { constants } from './constants';

export class User {
  _id: number = 0;
  username: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";
  age: number = 0;
  salary: number = 0;
  authorities: string = constants.ROLE_USER;
}
