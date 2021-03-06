"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphqlSchema = graphql_1.buildSchema(`
    scalar Date

    type Site {
        _id: ID!
        created: Date!
        siteName: String!
        mainURL: String!
        categoryURL: String!
        productURL: String!
        mainURLAudits: [ConsoleErrorAudits!]
        mainURLAuditDetails: [ConsoleErrorAuditDetails!]
        categoryURLAudits: [ConsoleErrorAudits!]
        categoryURLAuditDetails: [ConsoleErrorAuditDetails!]
        productURLAudits: [ConsoleErrorAudits!]
        productURLAuditDetails: [ConsoleErrorAuditDetails!]
        mainURLLighthouseScores: [LighthouseScores!]
        categoryURLLighthouseScores: [LighthouseScores!]
        productURLLighthouseScores: [LighthouseScores!]
        mainURLLighthouseAuditDetails: [LighthouseAuditDetails!]
        categoryURLLighthouseAuditDetails: [LighthouseAuditDetails!]
        productURLLighthouseAuditDetails: [LighthouseAuditDetails!]
    }



    type ConsoleErrorAudits {
        _id: ID!
        created: Date!
        siteID: Site!
        siteName: String!
        pageType: String!
        url: String!
        errorCount: Int!
        warningCount: Int!
        failedRequestCount: Int!
    }
    type ConsoleErrorAuditDetails {
        _id: ID!
        created: Date!
        siteID: Site!
        siteName: String!
        pageType: String!
        url: String!
        summary: String!
        errorsText: [String!]!
        warningsText: [String!]!
        failedRequestsText: [String!]!
    }



    type LighthouseScores {
        _id: ID
        created: Date
        siteID: Site
        siteName: String
        pageType: String
        url: String
        scores: Scores
        metrics: Metrics
    }
    type Scores {
        performance: Float
        bestPractice: Float
        accessibility: Float
        seo: Float
    }
    type Metrics {
        firstContentfulPaint: MetricsData
        firstMeaningfulPaint: MetricsData
        speedIndex: MetricsData
        interactive: MetricsData
        firstCPUIdle: MetricsData
        maxPotentialFid: MetricsData
    }
    type MetricsData {
        score: Float
        value: Float
    }



    type LighthouseAuditDetails {
        performanceAudits: PerformanceAudits!
        seoAudits: SeoAudits!
        accessibilityAudits: AccessibilityAudits!
        bestPracticesAudits: BestPracticesAudits!
    }

    type PerformanceAudits {
        metrics: MetricsAudit!
        noGroup: PerformanceNoGroup!
        loadOpportunities: LoadOpportunities!
        diagnostics: Diagnostics!
    }
    type MetricsAudit {
        firstContentfulPaint: AuditSchema!
        firstMeaningfulPaint: AuditSchema
        speedIndex: AuditSchema
        interactive: AuditSchema!
        firstCpuIdle: AuditSchema!
        maxPotentialFid: AuditSchema!
    }
    type PerformanceNoGroup {
        estimatedInputLatency: AuditSchema!
        totalBlockingTime: AuditSchema!
        networkRequests: AuditSchema!
        networkRtt: AuditSchema!
        networkServerLatency: AuditSchema!
        mainThreadTasks: AuditSchema!
        diagnostics: AuditSchema!
        metrics: AuditSchema!
        screenshotThumbnails: AuditSchema!
        finalScreenshot: AuditSchema!
    }
    type LoadOpportunities {
        renderBlockingResources: AuditSchema!
        usesResponsiveImages: AuditSchema!
        offscreenImages: AuditSchema!
        unminifiedCss: AuditSchema!
        unminifiedJavascript: AuditSchema!
        unusedCssRules: AuditSchema!
        usesOptimizedImages: AuditSchema!
        usesWebpImages: AuditSchema!
        usesTextCompression: AuditSchema!
        usesRelPreconnect: AuditSchema!
        timeToFirstByte: AuditSchema!
        redirects: AuditSchema!
        usesRelPreload: AuditSchema!
        efficientAnimatedContent: AuditSchema!
    }
    type Diagnostics {
        totalByteWeight: AuditSchema!
        usesLongCacheTtl: AuditSchema!
        domSize: AuditSchema!
        criticalRequestChains: AuditSchema!
        userTimings: AuditSchema!
        bootupTime: AuditSchema!
        mainthreadWorkBreakdown: AuditSchema!
        fontDisplay: AuditSchema!
        resourceSummary: AuditSchema!
        thirdPartySummary: AuditSchema!
    }

    type SeoAudits {
        seoMobile: SeoMobile!
        seoContent: SeoContent!
        seoCrawl: SeoCrawl!
        noGroup: SeoNoGroup!
    }
    type SeoMobile {
        viewport: AuditSchema!
        fontSize: AuditSchema!
        tapTargets: AuditSchema!
    }
    type SeoContent {
        documentTitle: AuditSchema!
        metaDescription: AuditSchema!
        linkText: AuditSchema!
        imageAlt: AuditSchema!
        hreflang: AuditSchema!
        canonical: AuditSchema!
        plugins: AuditSchema!
    }
    type SeoCrawl {
        httpStatusCode: AuditSchema!
        isCrawlable: AuditSchema!
        robotsTxt: AuditSchema!
    }
    type SeoNoGroup {
        structuredData: AuditSchema!
    }

    type AccessibilityAudits {
        allyNavigation: AllyNavigation!
        allyAria: AllyAria!
        allyAudioVideo: AllyAudioVideo!
        allyNamesLabels: AllyAudioLabels!
        allyColorContrast: AllyColorContrast!
        allyTablesLists: AllyTablesList!
        allyBestPractices: AllyBestPractices!
        allyLanguage: AllyLanguage!
        noGroup: AllyNoGroup!
    }
    type AllyNavigation {
        accesskeys: AuditSchema!
        bypass: AuditSchema!
        tabindex: AuditSchema!
    }
    type AllyAria {
        ariaAllowedAttr: AuditSchema!
        ariaRequiredAttr: AuditSchema!
        ariaRequiredChildren: AuditSchema!
        ariaRequiredParent: AuditSchema!
        ariaRoles: AuditSchema!
        ariaValidAttrValue: AuditSchema!
        ariaValidAttr: AuditSchema!
    }
    type AllyAudioVideo {
        audioCaption: AuditSchema!
        videoCaption: AuditSchema!
        videoDescription: AuditSchema!
    }
    type AllyAudioLabels {
        buttonName: AuditSchema!
        documentTitle: AuditSchema!
        frameTitle: AuditSchema!
        imageAlt: AuditSchema!
        inputImageAlt: AuditSchema!
        label: AuditSchema!
        linkName: AuditSchema!
        objectAlt: AuditSchema!
    }
    type AllyColorContrast {
        colorContrast: AuditSchema!
    }
    type AllyTablesList {
        definitionList: AuditSchema!
        dlitem: AuditSchema!
        layoutTable: AuditSchema!
        list: AuditSchema!
        listitem: AuditSchema!
        tdHeadersAttr: AuditSchema!
        thHasDataCells: AuditSchema!
    }
    type AllyBestPractices {
        duplicateId: AuditSchema!
        metaRefresh: AuditSchema!
        metaViewport: AuditSchema!
    }
    type AllyLanguage {
        htmlHasLang: AuditSchema!
        htmlLangValid: AuditSchema!
        validLang: AuditSchema!
    }
    type AllyNoGroup {
        logicalTabOrder: AuditSchema!
        focusableControls: AuditSchema!
        interactiveElementsAffordance: AuditSchema!
        managedFocus: AuditSchema!
        focusTraps: AuditSchema!
        customControlsLabels: AuditSchema!
        customControlsRoles: AuditSchema!
        visualOrderFollowsDom: AuditSchema!
        offscreenContentHidden: AuditSchema!
        headingLevels: AuditSchema!
        useLandmarks: AuditSchema!
    }
    
    type BestPracticesAudits {
        noGroup: BestPracticesNoGroup!
    }
    type BestPracticesNoGroup {
        appcacheManifest: AuditSchema!
        isOnHttps: AuditSchema!
        usesHttp2: AuditSchema!
        userPassiveEventListeners: AuditSchema!
        noDocumentWrite: AuditSchema!
        externalAnchorsUseRelNoopener: AuditSchema!
        geolocationOnStart: AuditSchema!
        doctype: AuditSchema!
        noVulnerableLibraries: AuditSchema!
        jsLibraries: AuditSchema!
        notificationsOnSart: AuditSchema!
        deprecations: AuditSchema!
        passwordInputsCanBePastedInto: AuditSchema!
        errorsInConsole: AuditSchema!
        imageAspectRatio: AuditSchema!
    }
    
    type AuditSchema {
        title: String!
        description: String!
        score: Float!
        value: Float!
        displayValue: String!
    }

    input SiteInput {
        siteName: String!
        mainURL: String!
        categoryURL: String!
        productURL: String!
    }

    type RootQuery {
        sites(siteName: String): [Site!]!
        users: [ClientData]!
        consoleErrorAudits(siteName: String): [ConsoleErrorAudits!]!
    }
    input SignInData {
        userName: String
        email: String!
        clientToken: String!
        userID: String!
    }

    type ClientData {
        userName: String
        created: Date
        lastSignIn: Date
        email: String
        error: String
        userID: String
        userType: String
    }

    type AdminEdit {
        error: String
        success: String
    }

    type RootMutation {
        createSite(siteInput: SiteInput): Site
        runSiteAudits(siteName: [String]): AdminEdit
        signIn(clientData: SignInData): ClientData
        addAdmin(email: String!): AdminEdit
        removeAdmin(email: String!): AdminEdit
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
exports.default = graphqlSchema;
//# sourceMappingURL=index.js.map