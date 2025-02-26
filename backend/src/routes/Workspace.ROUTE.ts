import { Router } from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController } from "../controllers/Workspace.CONTROLLER";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);


export default workspaceRoutes;