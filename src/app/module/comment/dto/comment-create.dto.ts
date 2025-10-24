import { ObjectId } from "mongodb"

export interface CommentCreateDto {
    comment: string
    userId: ObjectId
    parentId?: ObjectId
    createdAt: Date
}