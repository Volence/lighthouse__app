const mongoose = require('mongoose');

const consoleErrorSchema = mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    siteName: String,
    pageType: String,
    url: String,
    created: Date,
    errorCount: Number,
    warningCount: Number,
    failedRequestCount: Number
});

module.exports = mongoose.model('ConsoleErrorAudit', consoleErrorSchema);