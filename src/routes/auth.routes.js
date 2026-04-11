import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  emailVerification,
  resendEmailVerification,
  resetRefreshToken,
  forgotPassword,
  resetForgotPassword,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  forgotPasswordValidator,
  resetForgotPasswordValidator,
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//unsecured routes
router.route("/register").post(userRegistrationValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(emailVerification);
router.route("/refresh-token").post(resetRefreshToken);
router.route("/forgot-password").post(forgotPasswordValidator(), validate, forgotPassword);
router
  .route("/reset-password:verificationToken")
  .post(resetForgotPasswordValidator(), validate, resetForgotPassword);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);

export default router;
