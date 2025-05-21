import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import authModel from "../models/authModel.js";

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (profile, done) => {
      try {
        const existingUser = await authModel.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await authModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (profile, done) => {
      try {
        const existingUser = await authModel.findOne({
          facebookId: profile.id,
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await authModel.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || "No email provided",
          avatar: profile.photos?.[0]?.value || "",
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "/auth/twitter/callback",
      includeEmail: true,
    },
    async (profile, done) => {
      try {
        const existingUser = await authModel.findOne({ twitterId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await authModel.create({
          twitterId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || "No email provided",
          avatar: profile.photos?.[0]?.value || "",
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
