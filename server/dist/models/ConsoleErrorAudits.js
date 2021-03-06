"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const consoleErrorSchema = new mongoose_1.default.Schema({
    siteID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('ConsoleErrorAudit', consoleErrorSchema);
//# sourceMappingURL=ConsoleErrorAudits.js.map