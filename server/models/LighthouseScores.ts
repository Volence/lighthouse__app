import mongoose from 'mongoose';

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

export default mongoose.model('LighthouseScores', lighthouseScoreSchema);
