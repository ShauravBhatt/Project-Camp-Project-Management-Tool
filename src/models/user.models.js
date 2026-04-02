import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://www.placehold.co/120x120",
        localPath: "",
      },
    },
    fullName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
      unique: true,
      index: true,
      required: [true, "Username is required"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      index: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      select: false,
      minlength: 7,
      maxlength: 25,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  return;
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
