import { Router } from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController, getWorkspaceByIdController, getWorkspaceMembersController } from "../controllers/Workspace.CONTROLLER";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.post("")

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRoutes.get("/:id", getWorkspaceByIdController);

workspaceRoutes.get("/members/:id", getWorkspaceMembersController);


export default workspaceRoutes;