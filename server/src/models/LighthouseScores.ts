import mongoose, { Document } from 'mongoose';
import { Moment } from 'moment';
import { LighthouseAuditDetailsType } from './LighthouseAuditDetails';

export interface LighthouseScoreType extends Document {
    siteID: string;
    created: Moment;
    lighthouseAuditDetails: LighthouseAuditDetailsType;
    siteName: string;
    pageType: string;
    url: string;
    scores: {
        performance: number;
        bestPractice: number;
        accessibility: number;
        seo: number;
    };
    metrics: {
        firstContentfulPaint: {
            score: number;
            value: number;
        };
        firstMeaningfulPaint: {
            score: number;
            value: number;
        };
        speedIndex: {
            score: number;
            value: number;
        };
        interactive: {
            score: number;
            value: number;
        };
        firstCPUIdle: {
            score: number;
            value: number;
        };
        estimatedInputLatency: {
            score: number;
            value: number;
        };
    };
}

const lighthouseScoreSchema = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    },
    created: Date,
    lighthouseAuditDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LighthouseAuditDetails',
    },
    siteName: String,
    pageType: String,
    url: String,
    scores: {
        performance: Number,
        bestPractice: Number,
        accessibility: Number,
        seo: Number,
    },
    metrics: {
        firstContentfulPaint: {
            score: Number,
            value: Number,
        },
        firstMeaningfulPaint: {
            score: Number,
            value: Number,
        },
        speedIndex: {
            score: Number,
            value: Number,
        },
        interactive: {
            score: Number,
            value: Number,
        },
        firstCPUIdle: {
            score: Number,
            value: Number,
        },
        estimatedInputLatency: {
            score: Number,
            value: Number,
        },
    },
});

export default mongoose.model<LighthouseScoreType>('LighthouseScores', lighthouseScoreSchema);
