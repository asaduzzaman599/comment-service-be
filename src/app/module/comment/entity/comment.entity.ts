import { ObjectId } from "mongodb"

export interface Comment {
    _id: string
    comment: string
    userId: string
    createAt: Date
    likeIds: ObjectId[]
    dislikeIds: ObjectId[]
    parentId?: ObjectId
}