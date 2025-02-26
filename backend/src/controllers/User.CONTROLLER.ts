import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { asyncHandler } from "../middlewares/AsyncHandler.MIDDLEWARE";
import { getCurrentUserService } from "../services/User.SERVICE";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);