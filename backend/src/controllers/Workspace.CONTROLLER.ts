import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { asyncHandler } from "../middlewares/AsyncHandler.MIDDLEWARE";
import { createWorkspaceService } from "../services/Workspace.SERVICE";
import { createWorkspaceSchema } from "../validation/Workspace.VALIDATION";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;
    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Workspace created successfully",
      workspace,
    });
  }
);