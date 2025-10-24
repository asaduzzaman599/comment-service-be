import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
const router = express.Router()

router
  .route("/")
  .post(
    auth,
    CommentController.create
  );

router
  .route("/")
  .get(
    auth,
    CommentController.findAll
  );

router
  .route("/remove/:id")
  .delete(
    auth,
    CommentController.remove
  );
router
  .route("/reply/:id")
  .get(
    auth,
    CommentController.findAllReplay
  );
router
  .route("/reply/:id")
  .post(
    auth,
    CommentController.reply
  );
router
  .route("/like/:id")
  .patch(
    auth,
    CommentController.like
  );
router
  .route("/dislike/:id")
  .patch(
    auth,
    CommentController.dislike
  );

router
  .route("/:id")
  .get(
    auth,
    CommentController.findOne
  );

export const CommentRouter = router;