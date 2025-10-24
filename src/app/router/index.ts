import express from 'express'
import { AuthRouter } from '../module/auth/auth.router'
import { CommentRouter } from '../module/comment/comment.router'

const router = express.Router()

const routes = [
  { path: '/auth', module: AuthRouter },
  {  path: '/comments', module: CommentRouter,},
]

routes.forEach(route=>{
  router.use(route.path, route.module)
})

export const AppRouter = router