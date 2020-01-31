"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const consoleErrorDetailsSchema = new mongoose_1.Schema({
    siteID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('ConsoleErrorDetails', consoleErrorDetailsSchema);
//# sourceMappingURL=ConsoleErrorDetails.js.map