import mongoose, { Document, Schema} from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/AccountProvider.ENUM";

export interface AccountDocument extends Document {
    provider: ProviderEnumType;
    providerId: string; // Store email, googleId, facebookId, githubId
    userId: mongoose.Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null;
}

const accountSchema = new Schema<AccountDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            required: true
        },
        providerId: {
            type: String,
            required: true,
            unique: true
        },
        refreshToken: {
            type: String,
            default: null
        },
        tokenExpiry: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken;
            }
        }
    }
)

const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;