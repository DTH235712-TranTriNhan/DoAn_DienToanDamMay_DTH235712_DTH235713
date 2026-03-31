const User = require("../../models/UserModel");

// Tìm user theo googleId, nếu chưa có thì tạo mới
const findOrCreateUser = async googleProfile => {
  const { id: googleId, emails, displayName, photos } = googleProfile;

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({
      googleId,
      email: emails[0].value,
      displayName,
      avatar: photos?.[0]?.value || null
    });
  }

  return user;
};

module.exports = { findOrCreateUser };
