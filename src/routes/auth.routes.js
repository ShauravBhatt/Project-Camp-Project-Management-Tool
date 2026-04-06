import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userLoginValidator, userRegistrationValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//unsecured routes
router.route("/register").post(userRegistrationValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
