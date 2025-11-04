import { ObjectId } from "mongodb"
import { getCollection } from "../../../db_client"
import { CommentCreateDto } from "./dto/comment-create.dto"
import { getIO } from "../../../socket"
import { User } from "../auth/entity/user.entity"
import { getUserCollect } from "../auth/auth.service"


const getCommentCollect = () => {
 return getCollection('comments')
}

const create = async (payload: CommentCreateDto, user: User) => {
  const db = getCommentCollect()
  const io = getIO();
    payload.createdAt = new Date()
    payload.userId =  new ObjectId(user._id)
  const createdComment = await db.insertOne(payload);

  const result = await db.findOne({_id: createdComment.insertedId})
  io.emit("commentCreated", {comment: {...result, user}});
  return result
}

const reply = async (payload: CommentCreateDto, userId: ObjectId, commentId: ObjectId) => {
  const db = getCommentCollect()
  const io = getIO();
    payload.createdAt = new Date()
    payload.userId = userId
    payload.parentId = commentId
  const createdComment = await db.insertOne(payload);

  const result = await db.findOne({_id: createdComment.insertedId})
  io.emit("updateReplies", {comment: result});
  return result
}
const findOne = async (commentId: ObjectId) => {

  const comment = await getCommentCollect().findOne({_id: commentId})

  if(!comment)return null
  const user = await getUserCollect().findOne(comment.userId);
  return {...comment, user}
}
const findAll = async (option?: {sortBy: string; sortOrder: 'asc' | 'desc'; limit: number; page: number }) => {
    const limit = option?.limit ? +option.limit : null
    const page = option?.page ? +option?.page : null
    const skip = page && limit?( +page- 1 )* limit: null
    const sortOrder = option?.sortOrder ?? 'asc'
    const sortBy = option?.sortBy ?? 'createdAt'
const pipeline: any[] = [
    { $match: { parentId: {$eq: null} } },
  
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        "user.password": 0
      }
    },
    {
      $sort: { [sortBy]: sortOrder == 'asc'? 1 : -1 }
    },
    ...(limit && page?[{
      $skip: skip
    },
    {
      $limit: limit
    }]: [])
  ];

  return await getCommentCollect().aggregate(pipeline).toArray();
}
const findAllReplay = async (commentId: ObjectId, option?: {sortBy: string; sortOrder: 'asc' | 'desc'; limit: number; page: number }) => {
    const limit = option?.limit
    const page = option?.page
    const skip = page && limit?( page- 1 )* limit: null
    const sortOrder = option?.sortOrder ?? 'asc'
    const sortBy = option?.sortBy ?? 'createdAt'
const pipeline: any[] = [
    { $match: { parentId: {$eq: commentId} } },
  
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        "user.password": 0
      }
    },
    {
      $sort: { [sortBy]: sortOrder == 'asc'? 1 : -1 }
    },
    ...(limit && page?[{
      $skip: skip
    },
    {
      $limit: limit
    }]: [])
  ];

  return await getCommentCollect().aggregate(pipeline).toArray();
}

const remove = async (commentId: ObjectId,  userId: ObjectId) => {
  const db = getCommentCollect()
  const io = getIO();

  const exist = await db.findOne({_id: commentId, userId})
  if(!exist) throw new Error('No comment found!')

  const result = await db.deleteOne({_id: exist._id});
  
  io.emit("commentRemoved", {commentId});
  
  io.emit("updateReplies", {comment: exist})
  return result
}

const like  = async(commentId: ObjectId,  userId: ObjectId) => {
 const db = getCommentCollect()
  const exist = await db.findOne({_id: commentId})
  const io = getIO();

  if(!exist) throw new Error('No comment found!')
  const likeIds = toggleObjectId(exist.likeIds ?? [], userId)
const dislikeIds = (exist.dislikeIds ?? []).filter((item: ObjectId) => !item.equals(userId));
const result =  await db.updateOne({_id: exist._id},  { $set: { likeIds, dislikeIds } });
  io.emit("commentLikedDisliked", {commentId, likeIds, dislikeIds});
  
  io.emit("updateReplies", {comment: exist})
  return result
}
const dislike  = async(commentId: ObjectId,  userId: ObjectId) => {
 const db = getCommentCollect()
 const io = getIO();

  const exist = await db.findOne({_id: commentId})
  if(!exist) throw new Error('No comment found!')
  const dislikeIds = toggleObjectId(exist.dislikeIds  ?? [], userId)
  const likeIds = (exist.likeIds ?? []).filter((item: ObjectId) => !item.equals(userId));
  const result = await db.updateOne({_id: exist._id},  { $set: { likeIds, dislikeIds } });
   io.emit("commentLikedDisliked", {commentId, likeIds, dislikeIds});
  io.emit("updateReplies", {comment: exist})
  return result
}

function toggleObjectId(arr: ObjectId[], id: ObjectId): ObjectId[] {
  const exists = arr.some(item => item.equals(id));

  if (exists) {
    return arr.filter(item => !item.equals(id));
  } else {
    return [...arr, id];
  }
}

export const CommentService = {
    create,
    remove,
    findOne,
    findAll,
    like,dislike,
    reply,
    findAllReplay
}