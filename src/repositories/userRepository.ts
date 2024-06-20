import LoginDto from "../dtos/user/loginDto";
import UpdateCreateUserDto from "../dtos/user/updateCreateUserDto";
import User from "../schemas/user";

const getList = async () => {
  return await User.find();
};

const register = async (user: UpdateCreateUserDto) => {
  const existingUser = await User.findOne({ Email: user.Email });
  if (existingUser) {
    return {
      error: "User with that email already exists.",
    };
  }

  const newUser = new User({
    Username: user.Username,
    Password: user.Password,
    Email: user.Email,
    FirstName: user.FirstName,
    LastName: user.LastName,
    Phone: user.Phone,
    Tokens: [],
  });

  await newUser.save();
  return {
    user: newUser,
  };
};

const login = async (user: LoginDto) => {
  const existingUser = await User.findByCredentials(
    user.Username,
    user.Password
  );
  if (!existingUser) {
    return null;
  }
  const token = await existingUser.generateAuthToken();
  return {
    user: existingUser,
    token,
  };
};

const update = async (userId: string, user: UpdateCreateUserDto) => {
  return await User.findByIdAndUpdate(userId, user);
};

const _delete = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

const logout = async (userId: string, token: string) => {
  const user = await User.findOne({ _id: userId });
  user.Tokens = user.Tokens.filter((t) => {
    return t.token != token;
  });

  await user.save();
};

export default {
  getList,
  update,
  delete: _delete,
  register,
  login,
  logout,
};
