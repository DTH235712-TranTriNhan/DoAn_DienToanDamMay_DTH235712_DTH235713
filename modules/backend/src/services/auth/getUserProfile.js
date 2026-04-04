import User from "../../models/UserModel.js";

export const getUserProfile = async userId => {
  return await User.findById(userId).select("-__v");
};
