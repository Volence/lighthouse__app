"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LighthouseAuditDetails = new mongoose_1.default.Schema({
    siteID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('LighthouseAuditDetails', LighthouseAuditDetails);
//# sourceMappingURL=LighthouseAuditDetails.js.map