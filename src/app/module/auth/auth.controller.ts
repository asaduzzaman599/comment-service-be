import { NextFunction, Request, RequestHandler, Response } from "express"
import responseData from "../../helpers/response-data"
import { AuthService } from "./auth.service"
import { UserCreateDto } from "./dto/user-create.dto"

const signup = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

   const user = req.body

  const result = await AuthService.signup(user)

  return responseData({
    result,
    message: 'User created successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}

const signIn= async (req: Request, res: Response, next:  NextFunction)=>{
 try{
   

  const userCredential = req.body

  const result = await AuthService.signIn(userCredential)

  return responseData({
    message: "User signin successfully!",
    result
  }, res)

 } catch(e){
    next(e)
 }
}

export const AuthController = {
  signup,
  signIn
} 