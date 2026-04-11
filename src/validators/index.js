import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email can't be empty")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username can't be empty")
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be of atleast 4 characters"),
    body("password")
      .notEmpty()
      .withMessage("Password can't be empty")
      .isLength({ min: 7 })
      .withMessage("Password must be of atleast 7 characters"),
  ];
};

const userLoginValidator = () => {
  return [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Either email or username is must required")
      .isLength({ min: 3 })
      .withMessage("Invalid email or username"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 7 })
      .withMessage("Password should be atleast of minimum 7 characters"),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .withMessage("Email can't be empty")
      .isEmail()
      .withMessage("Invalid email"),
  ];
};

const resetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("Password can't be empty")
      .isLength({ min: 7 })
      .withMessage("Password must be of atleast 7 characters"),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetForgotPasswordValidator,
};
