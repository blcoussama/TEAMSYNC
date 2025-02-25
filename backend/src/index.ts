import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import session from "cookie-session"
import { config } from "./config/App.CONFIG"
import connectDatabase from "./config/Database.CONFIG"
import { errorHandler } from "./middlewares/ErrorHandler.MIDDLEWARE"
import { HTTPSTATUS } from "./config/Http.CONFIG"
import { asyncHandler } from "./middlewares/AsyncHandler.MIDDLEWARE"
import { BadRequestException } from "./utils/AppError.UTIL"

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    })
)

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true
    })
)

app.get("/", 
    asyncHandler( async(req: Request, res: Response, next: NextFunction) => {
        res.status(HTTPSTATUS.OK).json({
            message: "Hello This TEAMSync APP."
        })
    })
)

app.use(errorHandler);

app.listen(config.PORT, async () => {
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    await connectDatabase();
})