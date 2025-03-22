const {  Passport } = require('passport'); // gửi mail
const GoogleStrategy = require('passport-google-oauth20').Strategy; // login google
const FacebookStrategy = require('passport-facebook').Strategy; // login fb

// Tạo một danh sách người dùng mẫu
const users = {};
require('dotenv').config();


passport = new Passport;


// Passport config cho Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
    };
    return cb(null, user);
}));


// Cập nhật serializeUser và deserializeUser để làm việc với danh sách tạm này
passport.serializeUser((user, done) => {
    users[user.googleId] = user;
    console.log(users[user.googleId]);
    done(null, user.googleId);
});

passport.deserializeUser((id, done) => {
    done(null, users[id]);
});

module.exports = passport;