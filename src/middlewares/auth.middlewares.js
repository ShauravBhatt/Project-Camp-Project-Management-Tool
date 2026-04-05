import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

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
