import { Router } from "express";
import { createWorkspaceController } from "../controllers/Workspace.CONTROLLER";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);


export default workspaceRoutes;