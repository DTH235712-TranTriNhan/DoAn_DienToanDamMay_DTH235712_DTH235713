import { getUserProfile } from "../../../services/auth/getUserProfile.js";

export const getMeHandler = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserProfile(userId);

  res.json({
    success: true,
    data: user
  });
};
