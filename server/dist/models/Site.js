"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const siteListSchema = new mongoose_1.default.Schema({
    siteName: {
        type: String,
        trim: true,
        required: 'Please enter the name of the site!'
    },
    mainURL: {
        type: String,
        trim: true,
        required: 'Please enter your main url!'
    },
    mainURLAudits: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    mainURLAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    mainURLLighthouseScores: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    mainURLLighthouseAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    categoryURL: {
        type: String,
        trim: true,
        required: 'Please enter your category url!'
    },
    categoryURLAudits: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    categoryURLAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    categoryURLLighthouseScores: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    categoryURLLighthouseAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    productURL: {
        type: String,
        trim: true,
        required: 'Please enter your product url!'
    },
    productURLAudits: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    productURLAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    productURLLighthouseScores: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    productURLLighthouseAuditDetails: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    created: {
        type: Date,
        default: moment_1.default.utc()
    }
});
exports.default = mongoose_1.default.model('Site', siteListSchema);
//# sourceMappingURL=Site.js.map