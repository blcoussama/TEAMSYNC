import mongoose from "mongoose";
import UserModel from "../models/User.MODEL";
import AccountModel from "../models/Account.MODEL";
import WorkspaceModel from "../models/Workspace.MODEL";
import RoleModel from "../models/RolePermission.MODEL";
import { Roles } from "../enums/Role.ENUM";
import { BadRequestException, NotFoundException } from "../utils/AppError.UTIL";
import MemberModel from "../models/Member.MODEL";
import { ProviderEnum } from "../enums/AccountProvider.ENUM";

export const loginOrCreateAccountService = async (data: {
    provider: string;
    providerId: string;
    displayName: string;
    picture?: string;
    email?: string;
}) => {
    const { provider, providerId, displayName, picture, email } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Started Session...");

        let user = await UserModel.findOne({ email }).session(session);

        if(!user) {
            // Create a new User if He doesnt Exist
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null
            })

            await user.save({ session });

            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId
            })

            await account.save({ session });

            // Create a New Workspace model for the new User
            const workspace = new WorkspaceModel({
                name: `My Workspace`,
                description: `Workspace created for ${user.name}`,
                owner: user._id
            })

            await workspace.save({ session });

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }).session(session);

            if(!ownerRole) {
                throw new NotFoundException("Owner Role not Found.")
            }

            // Create the member
            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date()
            })

            await member.save({ session });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        }
        
        await session.commitTransaction();
        session.endSession();
        console.log("End Session...");

        return { user };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}; 

export const registerUserService = async (body: {
    email: string;
    name: string;
    password: string;
}) => {
    const { email, name, password } = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const existingUser = await UserModel.findOne({ email }).session(session);
        if(existingUser) {
            throw new BadRequestException("A User with this Email already exists.")
        }

        // Create the User
        const user = new UserModel({
            email,
            name,
            password
        })

        await user.save({ session });

        // Create the Account
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email
        })

        await account.save({ session });

         // Create a New Workspace for the new User
        const workspace = new WorkspaceModel({
            name: `My Workspace`,
            description: `Workspace created for ${user.name}`,
            owner: user._id
        })

        await workspace.save({ session });

        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        }).session(session);

        if(!ownerRole) {
            throw new NotFoundException("Owner Role not Found.")
        }

        // Create the member
        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date()
        })

        await member.save({ session });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();
        console.log("End Session...");

        return { userId: user._id, workspaceId: workspace._id };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}