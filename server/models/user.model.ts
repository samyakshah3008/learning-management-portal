import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Document, Model, Schema, model } from "mongoose";
import { emailRegex } from "../constants/regex";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid email. ",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters. "],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser & Document>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN!);
};

userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN!);
};

userSchema.methods.comparePassword = async function (
  userInputPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userInputPassword, this.password);
};

const User: Model<IUser> = model("User", userSchema);

export { User };
