import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { asyncHandler } from "../middlewares/AsyncHandler.MIDDLEWARE";
import { joinWorkspaceByInviteService } from "../services/Member.SERVICE";
import { z } from "zod";

export const joinWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
  }
);