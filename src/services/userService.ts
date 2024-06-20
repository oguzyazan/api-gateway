import LoginDto from "../dtos/user/loginDto";
import UpdateCreateUserDto from "../dtos/user/updateCreateUserDto";
import userRepository from "../repositories/userRepository";

const getList = async () => {
  return await userRepository.getList();
};

const update = async (userId: string, user: UpdateCreateUserDto) => {
  return await userRepository.update(userId, user);
};

const _delete = async (userId: string) => {
  return await userRepository.delete(userId);
};

const register = async (user: UpdateCreateUserDto) => {
  return await userRepository.register(user);
};

const login = async (user: LoginDto) => {
  return await userRepository.login(user);
};

const logout = async (userId: string, token: string) => {
  return await userRepository.logout(userId, token);
};

export default {
  getList,
  update,
  delete: _delete,
  register,
  login,
  logout,
};
