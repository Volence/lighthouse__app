import mongoose from 'mongoose';

const consoleErrorDetailsSchema = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('ConsoleErrorDetails', consoleErrorDetailsSchema);
