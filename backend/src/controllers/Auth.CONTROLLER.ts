import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/AsyncHandler.MIDDLEWARE";
import { config } from "../config/App.CONFIG";
import { registerSchema } from "../validation/Auth.VALIDATION";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { registerUserService } from "../services/Auth.SERVICE";
import passport from "passport";


export const googleLoginCallback = asyncHandler(
    async(req: Request, res: Response) => {
        const currentWorkspace = req.user?.currentWorkspace;

        if(!currentWorkspace) {
            return (
                res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
            )
        }

        return (
            res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)
        )
    }
);

export const registerUserController = asyncHandler(
    async(req: Request, res: Response) => {
        const body = registerSchema.parse({
            ...req.body,
        })

        await registerUserService(body);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "User Created Successfully."
        })
    }
);

export const loginUserController = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", 
            (err: Error | null, user: Express.User | false, info: { message: string | undefined }) => {
                if(err) {
                    return next(err);
                }

                if(!user) {
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                        message: info?.message || "Invalid Email or Password."
                    })
                }

                req.login(user, (err) => {
                    if(err) { 
                        return next(err);
                    }

                    return res.status(HTTPSTATUS.OK).json({
                        message: "Logged In Successfully.",
                        user
                    })
                })
            }
        )(req, res, next);
    }
);