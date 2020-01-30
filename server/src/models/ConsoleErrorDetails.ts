import mongoose, { Schema, Document } from 'mongoose';
import { Moment } from 'moment';

export interface ConsoleErrorDetailsType extends Document {
    siteID: string;
    siteName: string;
    pageType: string;
    url: string;
    created: Moment;
    summary: string;
    errorsText: string[];
    warningsText: string[];
    failedRequestsText: string[];
}

const consoleErrorDetailsSchema = new Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    },
    siteName: String,
    pageType: String,
    url: String,
    created: Date,
    summary: String,
    errorsText: [],
    warningsText: [],
    failedRequestsText: [],
});

export default mongoose.model<ConsoleErrorDetailsType>('ConsoleErrorDetails', consoleErrorDetailsSchema);
