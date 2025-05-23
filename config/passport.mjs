import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../db/connectdb.mjs';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [
          email,
        ]);
        const user = rows[0];
        if (!user) {
          return done(null, false, {
            message: 'Error enter password or login',
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: 'Error enter password or login',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
