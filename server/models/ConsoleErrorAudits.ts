import mongoose from 'mongoose';

const consoleErrorSchema = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('ConsoleErrorAudit', consoleErrorSchema);
