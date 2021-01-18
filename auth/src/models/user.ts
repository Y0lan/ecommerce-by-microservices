import mongoose from "mongoose";
import {PasswordManager} from '../services/passwordManager';

interface UserAttributes {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttributes): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

userSchema.pre('save', async function (next) {
        if (this.isModified('password')) {
            const hashed = await PasswordManager.toHash(this.get('password'));
            console.log("hashed: " + hashed);
            this.set('password', hashed);
        }
        next();
    }
)

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
export {User};
