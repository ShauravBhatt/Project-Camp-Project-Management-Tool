import { Router } from "express";
import {
  createProject,
  updateProjectById,
  deleteProjectById,
} from "../controllers/project.controllers.js";
import { verifyJWT, validateUserRoles } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { createProjectValidator, updateProjectValidator } from "../validators/index.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .put(
    updateProjectValidator(),
    validate,
    validateUserRoles([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    updateProjectById,
  );

router.route("/:projectId").delete(validateUserRoles([UserRolesEnum.ADMIN]), deleteProjectById);

export default router;
