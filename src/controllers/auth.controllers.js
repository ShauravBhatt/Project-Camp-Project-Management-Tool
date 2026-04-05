import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

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

export { registerUser };
