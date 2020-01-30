import mongoose, { Document } from 'mongoose';
import { Moment } from 'moment';

export interface ConsoleErrorType extends Document {
    siteID: string;
    siteName: string;
    pageType: string;
    url: string;
    created: Moment;
    errorCount: number;
    warningCount: number;
    failedRequestCount: number;
}
const consoleErrorSchema = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    },
    siteName: String,
    pageType: String,
    url: String,
    created: Date,
    errorCount: Number,
    warningCount: Number,
    failedRequestCount: Number,
});

export default mongoose.model<ConsoleErrorType>('ConsoleErrorAudit', consoleErrorSchema);
