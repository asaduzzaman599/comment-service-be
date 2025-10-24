import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { JwtHelpers } from "../helpers/jwt-helper";
import { User } from "../module/auth/entity/user.entity";

const auth =  (req: Request, res: Response, next: NextFunction) => {
    try {
      

      const { authorization } = req.headers;

      if (!authorization ) {
        throw new Error("Invalid token!");
      }

      let token = authorization as string;
      let user: JwtPayload | null = null;
      try {
        if(authorization)
          user = JwtHelpers.verifyToken(token.replace('Bearer ','')) as unknown as User;
      } catch (err) {
        throw new Error("Forbidden!");
      }
      
      if (!user) throw new Error("Forbidden!");

      (req as any).user = user;


      next();
    } catch (err) {
      next(err);
    }
  };

  
export default auth;