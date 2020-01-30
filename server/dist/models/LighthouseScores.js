"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const lighthouseScoreSchema = new mongoose_1.default.Schema({
    siteID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Site',
    },
    created: Date,
    lighthouseAuditDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('LighthouseScores', lighthouseScoreSchema);
//# sourceMappingURL=LighthouseScores.js.map