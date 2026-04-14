import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { ProjectMember } from "../models/projectmember.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const encodedToken =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!encodedToken) {
    throw new ApiError(401, "Invalid access token");
  }

  try {
    const decodedToken = jwt.verify(encodedToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?._id) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decodedToken?._id).select(
      "-refreshToken -password -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshTokenExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("Authentication err: ", err.message);
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }
});

export const validateUserRoles = (validRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user._id) {
      throw new ApiError(401, "Unauthorized access");
    }

    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project Id is missing");
    }

    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "You are not a member of this project");
    }

    const givenRole = membership.role;

    req.user.role = givenRole;

    if (!validRoles.includes(givenRole)) {
      throw new ApiError(403, "You don't have permission to perform this task");
    }

    next();
  });
};
