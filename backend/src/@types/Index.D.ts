import { UserDocument } from "../models/User.MODEL";

declare global {
    namespace Express {
        interface User extends UserDocument {
            _id?: any;
        }
    }
}