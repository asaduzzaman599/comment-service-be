import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route("/signup")
  .post(
    AuthController.signup
  );
router
  .route("/signin")
  .post(
    AuthController.signIn
  );
router
  .route("/me")
  .get(
    auth ,AuthController.me
  );

export const AuthRouter = router;