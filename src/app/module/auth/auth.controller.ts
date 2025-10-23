import { NextFunction, Request, RequestHandler, Response } from "express"

const signup = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

 } catch(e){
    next(e)
 }
}

const signIn= async (req: Request, res: Response, next:  NextFunction)=>{
 try{

 } catch(e){
    next(e)
 }
}

export const AuthController = {
  signup,
  signIn
} 