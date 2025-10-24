import { NextFunction, Response, Request } from "express"
import responseData from "../../helpers/response-data"
import { CommentService } from "./comment.service"
import { User } from "../auth/entity/user.entity"
import { CommentCreateDto } from "./dto/comment-create.dto"
import { ObjectId } from "mongodb"

const create = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const body = req.body as unknown as CommentCreateDto
     const user = (req as any).user as User; 


  const result = await CommentService.create(body, new ObjectId(user._id))

  return responseData({
    result,
    message: 'Comment created successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}

const reply = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const body = req.body as unknown as CommentCreateDto
     const user = (req as any).user as User;
     const id = req.params.id 


  const result = await CommentService.reply(body, new ObjectId(user._id), new ObjectId(id))

  return responseData({
    result,
    message: 'Reply created successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}

const findOne = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const id = req.params.id as unknown as string


  const result = await CommentService.findOne(new ObjectId(id))

  return responseData({
    result,
  }, res)

 } catch(e){
    next(e)
 }
}
const findAll = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const query = req.query as any


  const result = await CommentService.findAll(query)

  return responseData({
    result,
  }, res)

 } catch(e){
    next(e)
 }
}
const findAllReplay = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const query = req.query as any
    
    const id = req.params.id as unknown as string


  const result = await CommentService.findAllReplay(new ObjectId(id), query)

  return responseData({
    result,
  }, res)

 } catch(e){
    next(e)
 }
}

const remove = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const commentId = req.params.id as string; 
     const user = (req as any).user as User; 

  const result = await CommentService.remove(new ObjectId(commentId), new ObjectId(user._id))

  return responseData({
    result,
    message: 'Comment removed successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}

const like = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const commentId = req.params.id as string; 
     const user = (req as any).user as User; 

  const result = await CommentService.like(new ObjectId(commentId), new ObjectId(user._id))

  return responseData({
    result,
    message: 'Comment like successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}
const dislike = async (req: Request, res: Response, next:  NextFunction)=>{
 try{

    const commentId = req.params.id as string; 
     const user = (req as any).user as User; 

  const result = await CommentService.dislike(new ObjectId(commentId), new ObjectId(user._id))

  return responseData({
    result,
    message: 'Comment dislike successfully!'
  }, res)

 } catch(e){
    next(e)
 }
}

export const CommentController = {
    create, remove, like, dislike, findOne, findAll, reply, findAllReplay
}