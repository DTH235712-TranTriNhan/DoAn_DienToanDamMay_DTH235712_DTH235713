import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateUser } from "../services/auth/findOrCreateUser.js"; // Nhớ đuôi .js

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"] // Nên thêm scope để lấy đủ thông tin
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // profile chứa các thông tin như: id, emails, displayName, photos
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Cấu hình Serialize/Deserialize để duy trì session (nếu bạn dùng session)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
