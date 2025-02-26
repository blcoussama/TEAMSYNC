import "dotenv/config"
import "./config/Passport.CONFIG";
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import session from "express-session"
import { config } from "./config/App.CONFIG"
import connectDatabase from "./config/Database.CONFIG"
import { errorHandler } from "./middlewares/ErrorHandler.MIDDLEWARE"
import { HTTPSTATUS } from "./config/Http.CONFIG"
import { asyncHandler } from "./middlewares/AsyncHandler.MIDDLEWARE"
import passport from "passport"
import authRoutes from "./routes/Auth.ROUTE"
import userRoutes from "./routes/User.ROUTE";
import isAuthenticated from "./middlewares/IsAuthenticated.MIDDLEWARE";
import workspaceRoutes from "./routes/Workspace.ROUTE";
import memberRoutes from "./routes/Member.ROUTE";
import projectRoutes from "./routes/Project.ROUTE";


const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

app.use(
    session({
        secret: config.SESSION_SECRET, // Use 'secret' instead of 'keys'
        resave: false,                // Prevents unnecessary session saves
        saveUninitialized: false,     // Avoids saving uninitialized sessions
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            secure: config.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax"
        }
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true
    })
)

app.get("/", 
    asyncHandler( async(req: Request, res: Response, next: NextFunction) => {
        res.status(HTTPSTATUS.OK).json({
            message: "This is TEAMSync APP."
        })
    })
)

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    await connectDatabase();
})