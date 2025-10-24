import { ObjectId } from "mongodb"
import { getCollection } from "../../../db_client"
import { CommentCreateDto } from "./dto/comment-create.dto"


const getCommentCollect = () => {
 return getCollection('comments')
}

const create = async (payload: CommentCreateDto, userId: ObjectId) => {
  const db = getCommentCollect()
    payload.createdAt = new Date()
    payload.userId = userId
  const createdComment = await db.insertOne(payload);

  return await db.findOne({_id: createdComment.insertedId})
}

const reply = async (payload: CommentCreateDto, userId: ObjectId, commentId: ObjectId) => {
  const db = getCommentCollect()
    payload.createdAt = new Date()
    payload.userId = userId
    payload.parentId = commentId
  const createdComment = await db.insertOne(payload);

  return await db.findOne({_id: createdComment.insertedId})
}
const findOne = async (commentId: ObjectId) => {

  return await getCommentCollect().findOne({_id: commentId})
}
const findAll = async (option?: {sortBy: string; sortOrder: 'asc' | 'desc'; limit: number; page: number }) => {
    const limit = option?.limit
    const page = option?.page
    const skip = page && limit?( page- 1 )* limit: null
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
    console.log({_id: commentId, userId})
  const exist = await db.findOne({_id: commentId, userId})
  if(!exist) throw new Error('No comment found!')

  return await db.deleteOne({_id: exist._id});
}

const like  = async(commentId: ObjectId,  userId: ObjectId) => {
 const db = getCommentCollect()
  const exist = await db.findOne({_id: commentId})
  if(!exist) throw new Error('No comment found!')
  const likeIds = toggleObjectId(exist.likeIds ?? [], userId)
  const dislikeIds = (exist.dislikeIds ?? []).filter((item: ObjectId) => !item.equals(userId));
  return await db.updateOne({_id: exist._id},  { $set: { likeIds, dislikeIds } });
}
const dislike  = async(commentId: ObjectId,  userId: ObjectId) => {
 const db = getCommentCollect()
  const exist = await db.findOne({_id: commentId})
  if(!exist) throw new Error('No comment found!')
  const dislikeIds = toggleObjectId(exist.dislikeIds  ?? [], userId)
  const likeIds = (exist.likeIds ?? []).filter((item: ObjectId) => !item.equals(userId));
  return await db.updateOne({_id: exist._id},  { $set: { likeIds, dislikeIds } });
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