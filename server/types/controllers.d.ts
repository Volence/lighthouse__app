// Console Error Controller Items

interface ConsoleErrorDetailsContent {
    siteID: string;
    created: Date;
    siteName: string;
    pageType: string;
    url: string;
    summary?: string;
    errorsText?: string[];
    warningsText?: string[];
    failedRequestsText?: string[];
}

interface ConsoleErrorDetailsBySiteName {
    [url: string]: ConsoleErrorDetails;
}

interface ConsoleErrorDetails {
    summary?: string;
    errorCount?: number;
    warningCount?: number;
    failedRequestCount?: number;
    errors?: string[];
    warnings?: string[];
    failedRequests?: string[];
}

interface LighthouseAuditDetailsType {
    siteID?: string;
    created?: Date;
    siteName?: string;
    pageType?: string;
    url?: string;
    performanceAudits?: { [key: string]: any[] };
    seoAudits?: { [key: string]: any[] };
    accessibilityAudits?: { [key: string]: any[] };
    bestPracticesAudits?: { [key: string]: any[] };
}
