"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
// in schema, query fetches data, mutation changes it
var graphqlSchema = graphql_1.buildSchema("\n    scalar Date\n\n    type Site {\n        _id: ID!\n        created: Date!\n        siteName: String!\n        mainURL: String!\n        categoryURL: String!\n        productURL: String!\n        mainURLAudits: [ConsoleErrorAudits!]\n        mainURLAuditDetails: [ConsoleErrorAuditDetails!]\n        categoryURLAudits: [ConsoleErrorAudits!]\n        categoryURLAuditDetails: [ConsoleErrorAuditDetails!]\n        productURLAudits: [ConsoleErrorAudits!]\n        productURLAuditDetails: [ConsoleErrorAuditDetails!]\n        mainURLLighthouseScores: [LighthouseScores!]\n        categoryURLLighthouseScores: [LighthouseScores!]\n        productURLLighthouseScores: [LighthouseScores!]\n        mainURLLighthouseAuditDetails: [LighthouseAuditDetails!]\n        categoryURLLighthouseAuditDetails: [LighthouseAuditDetails!]\n        productURLLighthouseAuditDetails: [LighthouseAuditDetails!]\n    }\n\n\n\n    type ConsoleErrorAudits {\n        _id: ID!\n        created: Date!\n        siteID: Site!\n        siteName: String!\n        pageType: String!\n        url: String!\n        errorCount: Int!\n        warningCount: Int!\n        failedRequestCount: Int!\n    }\n    type ConsoleErrorAuditDetails {\n        _id: ID!\n        created: Date!\n        siteID: Site!\n        siteName: String!\n        pageType: String!\n        url: String!\n        summary: String!\n        errorsText: [String!]!\n        warningsText: [String!]!\n        failedRequestsText: [String!]!\n    }\n\n\n\n    type LighthouseScores {\n        _id: ID\n        created: Date\n        siteID: Site\n        siteName: String\n        pageType: String\n        url: String\n        scores: Scores\n        metrics: Metrics\n    }\n    type Scores {\n        performance: Float\n        bestPractice: Float\n        accessibility: Float\n        seo: Float\n    }\n    type Metrics {\n        firstContentfulPaint: MetricsData\n        firstMeaningfulPaint: MetricsData\n        speedIndex: MetricsData\n        interactive: MetricsData\n        firstCPUIdle: MetricsData\n        estimatedInputLatency: MetricsData\n    }\n    type MetricsData {\n        score: Float\n        value: Float\n    }\n\n\n\n    type LighthouseAuditDetails {\n        performanceAudits: PerformanceAudits!\n        seoAudits: SeoAudits!\n        accessibilityAudits: AccessibilityAudits!\n        bestPracticesAudits: BestPracticesAudits!\n    }\n\n    type PerformanceAudits {\n        metrics: MetricsAudit!\n        noGroup: PerformanceNoGroup!\n        loadOpportunities: LoadOpportunities!\n        diagnostics: Diagnostics!\n    }\n    type MetricsAudit {\n        firstContentfulPaint: AuditSchema!\n        firstMeaningfulPaint: AuditSchema\n        speedIndex: AuditSchema\n        interactive: AuditSchema!\n        firstCpuIdle: AuditSchema!\n        estimatedInputLatency: AuditSchema!\n    }\n    type PerformanceNoGroup {\n        maxPotentialFid: AuditSchema!\n        networkRequests: AuditSchema!\n        networkRtt: AuditSchema!\n        networkServerLatency: AuditSchema!\n        mainThreadTasks: AuditSchema!\n        diagnostics: AuditSchema!\n        metrics: AuditSchema!\n        screenshotThumbnails: AuditSchema!\n        finalScreenshot: AuditSchema!\n    }\n    type LoadOpportunities {\n        renderBlockingResources: AuditSchema!\n        usesResponsiveImages: AuditSchema!\n        offscreenImages: AuditSchema!\n        unminifiedVss: AuditSchema!\n        unminifiedJavascript: AuditSchema!\n        unusedCssRules: AuditSchema!\n        usesOptimizedImages: AuditSchema!\n        usesWebpImages: AuditSchema!\n        usesTextCompression: AuditSchema!\n        usesRelPreconnect: AuditSchema!\n        timeToFirstByte: AuditSchema!\n        redirects: AuditSchema!\n        usesRelPreload: AuditSchema!\n        efficientAnimatedContent: AuditSchema!\n    }\n    type Diagnostics {\n        totalByteWeight: AuditSchema!\n        usesLongCacheTtl: AuditSchema!\n        domSize: AuditSchema!\n        criticalRequestChains: AuditSchema!\n        userTimings: AuditSchema!\n        bootupTime: AuditSchema!\n        mainthreadWorkBreakdown: AuditSchema!\n        fontDisplay: AuditSchema!\n    }\n\n    type SeoAudits {\n        seoMobile: SeoMobile!\n        seoContent: SeoContent!\n        seoCrawl: SeoCrawl!\n        noGroup: SeoNoGroup!\n    }\n    type SeoMobile {\n        viewport: AuditSchema!\n        fontSize: AuditSchema!\n        tapTargets: AuditSchema!\n    }\n    type SeoContent {\n        documentTitle: AuditSchema!\n        metaDescription: AuditSchema!\n        linkText: AuditSchema!\n        hreflang: AuditSchema!\n        canonical: AuditSchema!\n        plugins: AuditSchema!\n    }\n    type SeoCrawl {\n        httpStatusCode: AuditSchema!\n        isCrawlable: AuditSchema!\n        robotsTxt: AuditSchema!\n    }\n    type SeoNoGroup {\n        structuredData: AuditSchema!\n    }\n\n    type AccessibilityAudits {\n        allyNavigation: AllyNavigation!\n        allyAria: AllyAria!\n        allyAudioVideo: AllyAudioVideo!\n        allyNamesLabels: AllyAudioLabels!\n        allyColorContrast: AllyColorContrast!\n        allyTablesLists: AllyTablesList!\n        allyBestPractices: AllyBestPractices!\n        allyLanguage: AllyLanguage!\n        noGroup: AllyNoGroup!\n    }\n    type AllyNavigation {\n        accesskeys: AuditSchema!\n        bypass: AuditSchema!\n        tabindex: AuditSchema!\n    }\n    type AllyAria {\n        ariaAllowedAttr: AuditSchema!\n        ariaRequiredAttr: AuditSchema!\n        ariaRequiredChildren: AuditSchema!\n        ariaRequiredParent: AuditSchema!\n        ariaRoles: AuditSchema!\n        ariaValidAttrValue: AuditSchema!\n        ariaValidAttr: AuditSchema!\n    }\n    type AllyAudioVideo {\n        audioCaption: AuditSchema!\n        videoCaption: AuditSchema!\n        videoDescription: AuditSchema!\n    }\n    type AllyAudioLabels {\n        buttonName: AuditSchema!\n        documentTitle: AuditSchema!\n        frameTitle: AuditSchema!\n        imageAlt: AuditSchema!\n        inputImageAlt: AuditSchema!\n        label: AuditSchema!\n        linkName: AuditSchema!\n        objectAlt: AuditSchema!\n    }\n    type AllyColorContrast {\n        colorContrast: AuditSchema!\n    }\n    type AllyTablesList {\n        definitionList: AuditSchema!\n        dlitem: AuditSchema!\n        layoutTable: AuditSchema!\n        list: AuditSchema!\n        listitem: AuditSchema!\n        tdHeadersAttr: AuditSchema!\n        thHasDataCells: AuditSchema!\n    }\n    type AllyBestPractices {\n        duplicateId: AuditSchema!\n        metaRefresh: AuditSchema!\n        metaViewport: AuditSchema!\n    }\n    type AllyLanguage {\n        htmlHasLang: AuditSchema!\n        htmlLangValid: AuditSchema!\n        validLang: AuditSchema!\n    }\n    type AllyNoGroup {\n        logicalTabOrder: AuditSchema!\n        focusableVontrols: AuditSchema!\n        interactiveElementsAffordance: AuditSchema!\n        managedFocus: AuditSchema!\n        focusTraps: AuditSchema!\n        customCntrolsLabels: AuditSchema!\n        customControlsRoles: AuditSchema!\n        visualOrderFollowsDom: AuditSchema!\n        offscreenContentHidden: AuditSchema!\n        headingLevels: AuditSchema!\n        useLandmarks: AuditSchema!\n    }\n    \n    type BestPracticesAudits {\n        noGroup: BestPracticesNoGroup!\n    }\n    type BestPracticesNoGroup {\n        appcacheManifest: AuditSchema!\n        isOnHttps: AuditSchema!\n        usesHttp: AuditSchema!\n        userPassiveEventListeners: AuditSchema!\n        noDocumentWrite: AuditSchema!\n        externalAnchorsUseRelNoopener: AuditSchema!\n        geolocationOnStart: AuditSchema!\n        doctype: AuditSchema!\n        noVulnerableLibraries: AuditSchema!\n        jsLibraries: AuditSchema!\n        notificationsOnSart: AuditSchema!\n        deprecations: AuditSchema!\n        passwordInputsCanBePastedInto: AuditSchema!\n        errorsInConsole: AuditSchema!\n        imageAspectRatio: AuditSchema!\n    }\n    \n    type AuditSchema {\n        title: String!\n        description: String!\n        score: Float!\n        value: Float!\n        displayValue: String!\n    }\n\n    input SiteInput {\n        siteName: String!\n        mainURL: String!\n        categoryURL: String!\n        productURL: String!\n    }\n\n    type RootQuery {\n        sites(siteName: String): [Site!]!\n        consoleErrorAudits(siteName: String): [ConsoleErrorAudits!]!\n    }\n\n    type RootMutation {\n        createSite(siteInput: SiteInput): Site\n    }\n\n    schema {\n        query: RootQuery\n        mutation: RootMutation\n    }\n");
exports["default"] = graphqlSchema;
