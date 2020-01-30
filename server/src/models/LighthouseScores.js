const mongoose = require('mongoose');

const lighthouseScoreSchema = mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    created: Date,
    lighthouseAuditDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LighthouseAuditDetails'
    },
    siteName: String,
    pageType: String,
    url: String,
    scores: {
        performance: Number,
        bestPractice: Number,
        accessibility: Number,
        seo: Number
    },
    metrics: {
        firstContentfulPaint: {
            score: Number,
            value: Number
        },
        firstMeaningfulPaint: {
            score: Number,
            value: Number
        },
        speedIndex: {
            score: Number,
            value: Number
        },
        interactive: {
            score: Number,
            value: Number
        },
        firstCPUIdle: {
            score: Number,
            value: Number
        },
        estimatedInputLatency: {
            score: Number,
            value: Number
        },
    }
});

module.exports = mongoose.model('LighthouseScores', lighthouseScoreSchema);