import mongoose, { Document } from 'mongoose';
import { Moment } from 'moment';

export interface UserType extends Document {
    userID: string;
    created: Moment;
    lastSignIn: Moment;
    userName: string;
    email: string;
    userType: string;
}

const User = new mongoose.Schema({
    userID: { type: String, unique: true },
    created: Date,
    lastSignIn: Date,
    userName: String,
    email: { type: String, unique: true },
    userType: String,
});

export default mongoose.model<UserType>('Users', User);
