const mongoose = require('mongoose');
const moment = require ('moment');

const consoleErrorSchema = mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    siteName: String,
    pageType: String,
    url: String,
    created: {
        type: Date,
        default: moment.utc()
    },
    summary: String,
    errorCount: Number,
    warningCount: Number,
    failedRequestCount: Number,
    errorsText: [],
    warningsText: [],
    failedRequestsText: []
});

module.exports = mongoose.model('ConsoleErrorAudit', consoleErrorSchema);