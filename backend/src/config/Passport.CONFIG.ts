import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./App.CONFIG";
import { NotFoundException } from "../utils/AppError.UTIL";
import { ProviderEnum } from "../enums/AccountProvider.ENUM";

passport.use(
    new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const {email, sub:googleId, picture} = profile._json; 

                console.log(profile, "Profile");
                console.log(googleId, "Goodle ID");

                if(!googleId) {
                    throw new NotFoundException("Google ID (sub) is missing.")
                }

                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email 
                })

                done(null, user);

            } catch (error) {
                done(error, false);
            }
        }
    )
);