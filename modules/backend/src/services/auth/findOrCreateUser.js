import User from "../../models/UserModel.js";

/**
 * Tìm user theo googleId, nếu chưa có thì tạo mới (Task 2.2)
 * Hàm này giúp tự động hóa việc quản lý tài khoản người dùng từ Google Cloud.
 */
export const findOrCreateUser = async googleProfile => {
  const { id: googleId, emails, displayName, photos } = googleProfile;

  // 1. Kiểm tra xem người dùng này đã từng đăng nhập chưa
  let user = await User.findOne({ googleId });
  const avatarUrl = photos?.[0]?.value || null;

  if (!user) {
    // 2. Nếu chưa có, tạo tài khoản mới dựa trên dữ liệu Google cung cấp
    user = await User.create({
      googleId,
      email: emails[0].value,
      displayName,
      avatar: avatarUrl
    });
    console.log(`[Auth] 🆕 Đã tạo người dùng mới: ${displayName}`);
  } else {
    // 2b. Nếu đã có, cập nhật lại Avatar và Tên (phòng trường hợp người dùng đổi trên Google)
    user.avatar = avatarUrl;
    user.displayName = displayName;
    await user.save();
    console.log(`[Auth] 🔑 Người dùng cũ đăng nhập: ${displayName} (Đã cập nhật Profile)`);
  }

  return user;
};
