import bcrypt from "bcryptjs";
import { getCollection } from "../../../db_client";
import { JwtHelpers } from "../../helpers/jwt-helper";
import { UserCreateDto } from "./dto/user-create.dto";
import config from "../../config";
import { User } from "./entity/user.entity";
import { ObjectId } from 'mongodb'

const getUserCollect = () => {
 return getCollection('users')
}

const signup = async (payload: UserCreateDto) => {
  const db = getUserCollect()
  const password = payload.password
  
  payload.password = await bcrypt.hash(password, +(config.BCRYPT_SALT_ROUNDS ?? '8'))

  const createdUser = await db.insertOne(payload);

  const user = await db.findOne({_id: createdUser.insertedId})
  console.log({user})
  delete (user as unknown as User)?.password
  return user
}

const signIn = async (payload: {email: string; password: string})=>{
 try{
  const db = getUserCollect()
    const userExist = await db?.findOne({
    email: payload.email
  })

  if(!userExist)
  throw new Error( 'User does not exist!');

  if(userExist?.password && !(await bcrypt.compare(payload.password, userExist?.password)))
    throw new Error('Email or Password not matched!');

    const accessToken = JwtHelpers.generateToken({userId: userExist?.id, role: userExist?.role})
    const {password, ...user} = userExist
    return {accessToken, user}

 } catch(e: any){
    throw new Error(e);
 }
}
export const AuthService = {
  signup,
  signIn
} 