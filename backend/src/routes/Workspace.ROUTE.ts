import { Router } from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController, getWorkspaceByIdController } from "../controllers/Workspace.CONTROLLER";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.post("")

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRoutes.get("/:id", getWorkspaceByIdController);


export default workspaceRoutes;