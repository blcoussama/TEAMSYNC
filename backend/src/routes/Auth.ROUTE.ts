import { Router } from "express";
import passport from "passport";
import { config } from "../config/App.CONFIG";
import { googleLoginCallback } from "../controllers/Auth.CONTROLLER";

const faileUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`

const authRoutes = Router();

authRoutes.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
)

authRoutes.get("/google/callback",
    passport.authenticate("google", { 
        failureRedirect: faileUrl, 
    }),
    googleLoginCallback
)

export default authRoutes;