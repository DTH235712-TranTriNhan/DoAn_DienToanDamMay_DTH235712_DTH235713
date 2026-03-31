import User from "../../models/UserModel.js"; // Nhớ thêm đuôi .js

/**
 * Tìm user theo googleId, nếu chưa có thì tạo mới (Task 2.2)
 * Hàm này giúp tự động hóa việc quản lý tài khoản người dùng từ Google Cloud.
 */
export const findOrCreateUser = async googleProfile => {
  const { id: googleId, emails, displayName, photos } = googleProfile;

  // 1. Kiểm tra xem người dùng này đã từng đăng nhập chưa
  let user = await User.findOne({ googleId });

  if (!user) {
    // 2. Nếu chưa có, tạo tài khoản mới dựa trên dữ liệu Google cung cấp
    // Đây là bước quan trọng để đáp ứng yêu cầu "Sử dụng API Google" của đồ án.
    user = await User.create({
      googleId,
      email: emails[0].value,
      displayName,
      avatar: photos?.[0]?.value || null
    });
    console.log(`[Auth] 🆕 Đã tạo người dùng mới: ${displayName}`);
  } else {
    console.log(`[Auth] 🔑 Người dùng cũ đăng nhập: ${displayName}`);
  }

  return user;
};
