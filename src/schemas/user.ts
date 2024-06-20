import { Schema, model, Document, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRoles } from "../enums/user/userRoles";

export interface IUser extends Document {
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  IsDeleted: boolean;
  CreationTime: Date;
  Tokens: { token: string }[];
  Roles: number[];
}

export interface IUserMethods {
  generateAuthToken(): Promise<string>;
  toJSON(): IUser;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema: Schema = new Schema<IUser, UserModel, IUserMethods>({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  IsDeleted: { type: Boolean, default: false },
  CreationTime: { type: Date, default: new Date() },
  Tokens: [{ token: { type: String, required: true, default: [] } }],
  Roles: { type: [Number], default: [UserRoles.User] },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);
  user.Tokens = user.Tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.Password;
  delete userObject.Tokens;
  return userObject;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ Username: username });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.Password);
  if (!isMatch) {
    return null;
  }
  return user;
};

const User = model<IUser, UserModel>("User", userSchema);
export default User;
