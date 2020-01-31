import mongoose, { Document } from 'mongoose';
import { Moment } from 'moment';

export interface LighthouseAuditDetailsType extends Document {
    siteID?: string;
    created?: Moment;
    siteName?: string;
    pageType?: string;
    url?: string;
    performanceAudits?: { [key: string]: any[] };
    seoAudits?: { [key: string]: any[] };
    accessibilityAudits?: { [key: string]: any[] };
    bestPracticesAudits?: { [key: string]: any[] };
}

const LighthouseAuditDetails = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    },
    created: Date,
    siteName: String,
    pageType: String,
    url: String,
    performanceAudits: {},
    seoAudits: {},
    accessibilityAudits: {},
    bestPracticesAudits: {},
});

export default mongoose.model<LighthouseAuditDetailsType>('LighthouseAuditDetails', LighthouseAuditDetails);
