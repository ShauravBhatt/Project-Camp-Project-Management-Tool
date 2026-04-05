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

export { userRegistrationValidator };
