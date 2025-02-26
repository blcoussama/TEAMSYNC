import passport, { Passport } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./App.CONFIG";
import { NotFoundException } from "../utils/AppError.UTIL";
import { ProviderEnum } from "../enums/AccountProvider.ENUM";
import { loginOrCreateAccountService, verifyUserService } from "../services/Auth.SERVICE";
import { emailSchema } from "../validation/Auth.VALIDATION";

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
                const {email, sub: googleId, picture} = profile._json; 

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

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true
    },
    async (email, password, done) =>{
        try {
            const user = await verifyUserService({ email, password });
            return done(null, user);
        } catch (error: any) {
            return done(error, false, { message: error?.message })
        }
    }
    )
)

passport.serializeUser(( user: any, done) => done(null, user));
passport.deserializeUser(( user: any, done) => done(null, user));
