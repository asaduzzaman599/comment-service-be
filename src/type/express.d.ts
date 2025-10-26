import { User } from "../app/module/user/user.interface"; 

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}