import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async function (userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    throw new ApiError(400, "Username or email already exists");
  }

  let user;

  try {
    user = await User.create({
      username,
      email,
      password,
      isEmailVerified: false,
    });

    const { unhashedToken, hashedToken, tempTokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tempTokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`,
      ),
    });
  } catch (error) {
    if (user?._id) {
      await User.deleteOne({
        _id: user._id,
      });
    }

    console.error("Registration Failed: ", error.message);
    throw new ApiError(500, "User registration Failed, try again in a while");
  }

  const registeredUser = await User.findById(user._id).select(
    "-refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshTokenExpiry",
  );

  if (!registeredUser) {
    throw new ApiError(500, "Error occurred while registring user, try again in a moment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user: registeredUser }, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "Invalid username or password");
  }

  const isUserValid = await user.isPasswordCorrect(password);

  if (!isUserValid) {
    throw new ApiError(400, "Invalid username or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshTokenExpiry",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Error occurred while login user, try again in a moment");
  }

  const options = {
    secure: true,
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(400, "Unauthorized access");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { currentUser: req.user }, "Current user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser };
