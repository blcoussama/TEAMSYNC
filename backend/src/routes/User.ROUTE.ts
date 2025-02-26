import { Router } from "express";
import { getCurrentUserController } from "../controllers/User.CONTROLLER";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);


export default userRoutes;