import express from "express";
import { AuthController } from "./auth.controller";

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

export const AuthRouter = router;