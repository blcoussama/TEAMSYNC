import { Router } from "express";
import { joinWorkspaceController } from "../controllers/Member.CONTROLLER";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);

export default memberRoutes;