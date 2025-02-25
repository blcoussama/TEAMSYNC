import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/AsyncHandler.MIDDLEWARE";
import { config } from "../config/App.CONFIG";
import { registerSchema } from "../validation/Auth.VALIDATION";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { registerUserService } from "../services/Auth.SERVICE";


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
)

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
)