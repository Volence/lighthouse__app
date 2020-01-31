"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const LighthouseScores_1 = __importDefault(require("../models/LighthouseScores"));
const LighthouseAuditDetails_1 = __importDefault(require("../models/LighthouseAuditDetails"));
const Site_1 = __importDefault(require("../models/Site"));
const moment = require('moment');
const runAudits = async () => {
    try {
        const sites = await Site_1.default.find();
        let siteCount = 0;
        const siteTotal = sites.length;
        const runEachSite = async ([siteData, ...sites]) => {
            if (siteData === undefined)
                return;
            siteCount++;
            try {
                await runLighthouseAndSaveToDatabase(siteData, siteData.siteName);
            }
            catch (err) {
                console.log('Error: ', err);
            }
            console.log(`---LIGHTHOUSE: ${siteCount} out of ${siteTotal} sites complete`);
            return await runEachSite(sites);
        };
        await runEachSite(sites);
        return '--------------Finished with all audits!-----------------';
    }
    catch (err) {
        return err;
    }
};
exports.runAudits = runAudits;
const runLighthouseRequest = async (siteName) => {
    try {
        let queryParam = { siteName: siteName };
        const siteData = await Site_1.default.findOne(queryParam);
        await runLighthouseAndSaveToDatabase(siteData, siteName);
        return '--------------Finished with Lighthouse request!-----------------';
    }
    catch (err) {
        return err;
    }
};
exports.runLighthouseRequest = runLighthouseRequest;
const runLighthouseAndSaveToDatabase = async (siteData, siteName) => {
    let time = moment.utc();
    let mainResults = await getFormattedAudit(siteData.mainURL);
    await saveLighthouseScores(mainResults, siteData, time, siteName, 'main', siteData.mainURL);
    await saveLighthouseDetails(mainResults, siteData, time, siteName, 'main', siteData.mainURL);
    let categoryResults = await getFormattedAudit(siteData.categoryURL);
    await saveLighthouseScores(categoryResults, siteData, time, siteName, 'category', siteData.categoryURL);
    await saveLighthouseDetails(categoryResults, siteData, time, siteName, 'category', siteData.categoryURL);
    let productResults = await getFormattedAudit(siteData.productURL);
    await saveLighthouseScores(productResults, siteData, time, siteName, 'product', siteData.productURL);
    await saveLighthouseDetails(productResults, siteData, time, siteName, 'product', siteData.productURL);
    return 'Complete';
};
const getFormattedAudit = async (url) => {
    let audit = await launchChromeAndRunLighthouse(url);
    audit = formatResults(audit.lhr);
    console.log(`Finshed lighthouse audit and formats on url ${url}`);
    return audit;
};
const launchChromeAndRunLighthouse = async (url, flags = { chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'], port: 8000 }, config = null) => {
    try {
        const chrome = await chromeLauncher.launch(flags);
        flags.port = chrome.port;
        const results = await lighthouse(url, flags, config);
        await chrome.kill();
        return results;
    }
    catch (err) {
        return err;
    }
};
const formatResults = results => {
    const { categories: { performance: { score: performanceScore }, seo: { score: seoScore }, accessibility: { score: accessibilityScore }, 'best-practices': { score: bestPracticesScore }, }, } = results;
    const resultsFormatted = formatAuditResults(formatListOfAudits(results), results);
    return { ...resultsFormatted, scores: { performance: performanceScore, bestPractice: bestPracticesScore, accessibility: accessibilityScore, seo: seoScore } };
};
const formatListOfAudits = results => {
    const resultsFormatted = {
        performanceAudits: { ...getAuditList(results.categories.performance.auditRefs) },
        seoAudits: { ...getAuditList(results.categories.seo.auditRefs) },
        accessibilityAudits: { ...getAuditList(results.categories.accessibility.auditRefs) },
        bestPracticesAudits: { ...getAuditList(results.categories['best-practices'].auditRefs) },
    };
    return resultsFormatted;
};
const getAuditList = arrayOfAuditDescriptions => {
    let resultsFormatted = {};
    for (let audit of arrayOfAuditDescriptions) {
        let group = audit.group || 'noGroup';
        if (!(group in resultsFormatted)) {
            resultsFormatted[group] = [];
        }
        resultsFormatted[group].push(audit.id);
    }
    return resultsFormatted;
};
const formatAuditResults = (formattedResults, fullResults) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126, _127, _128, _129, _130, _131, _132, _133, _134, _135, _136, _137, _138, _139, _140, _141, _142, _143, _144, _145, _146, _147, _148, _149, _150, _151, _152, _153, _154, _155, _156, _157, _158, _159, _160, _161, _162, _163, _164, _165, _166, _167, _168, _169, _170, _171, _172, _173, _174, _175, _176, _177, _178, _179, _180, _181, _182, _183, _184, _185, _186, _187, _188, _189, _190, _191, _192, _193, _194, _195, _196, _197, _198, _199, _200, _201, _202, _203, _204, _205, _206, _207, _208, _209, _210, _211, _212, _213, _214, _215, _216, _217, _218, _219, _220, _221, _222, _223, _224, _225, _226, _227, _228, _229, _230, _231, _232, _233, _234, _235, _236, _237, _238, _239, _240, _241, _242, _243, _244, _245, _246, _247, _248, _249, _250, _251, _252, _253, _254, _255, _256, _257, _258, _259, _260, _261, _262, _263, _264, _265, _266, _267, _268, _269, _270, _271, _272, _273, _274, _275, _276, _277, _278, _279, _280, _281, _282, _283, _284, _285, _286, _287, _288, _289, _290, _291, _292, _293, _294, _295, _296, _297, _298, _299, _300, _301, _302, _303, _304, _305, _306, _307, _308, _309, _310, _311, _312, _313, _314, _315, _316, _317, _318, _319, _320, _321, _322, _323, _324, _325, _326, _327, _328, _329, _330, _331, _332, _333, _334, _335, _336, _337, _338, _339, _340, _341, _342, _343, _344, _345, _346, _347, _348, _349, _350, _351, _352, _353, _354, _355, _356, _357, _358, _359, _360, _361, _362, _363, _364, _365, _366, _367, _368, _369, _370, _371, _372, _373, _374, _375, _376, _377, _378, _379, _380, _381, _382, _383, _384, _385, _386, _387, _388, _389, _390, _391, _392, _393, _394, _395, _396, _397, _398, _399, _400, _401, _402, _403, _404, _405, _406, _407, _408, _409, _410, _411, _412, _413, _414, _415, _416, _417, _418, _419, _420, _421, _422, _423, _424, _425, _426, _427, _428, _429, _430, _431, _432, _433, _434, _435, _436, _437, _438, _439, _440, _441, _442, _443, _444, _445, _446, _447, _448, _449, _450, _451, _452, _453, _454, _455, _456, _457, _458, _459, _460, _461, _462, _463, _464, _465, _466, _467, _468, _469, _470, _471, _472, _473, _474, _475, _476, _477, _478, _479, _480, _481, _482, _483, _484, _485, _486, _487, _488, _489, _490, _491, _492, _493, _494, _495, _496, _497, _498, _499, _500, _501, _502, _503, _504, _505, _506, _507, _508, _509, _510, _511, _512, _513, _514, _515, _516, _517, _518, _519, _520, _521, _522, _523, _524, _525, _526, _527, _528, _529, _530, _531, _532, _533, _534, _535, _536, _537, _538, _539, _540, _541, _542, _543, _544, _545, _546, _547, _548, _549, _550;
    const results = {
        ...getAuditResultsFromCategory(formattedResults.performanceAudits, fullResults, 'performanceAudits'),
        ...getAuditResultsFromCategory(formattedResults.seoAudits, fullResults, 'seoAudits'),
        ...getAuditResultsFromCategory(formattedResults.accessibilityAudits, fullResults, 'accessibilityAudits'),
        ...getAuditResultsFromCategory(formattedResults.bestPracticesAudits, fullResults, 'bestPracticesAudits'),
    };
    const returnResults = {
        performanceAudits: {
            metrics: {
                firstContentfulPaint: {
                    title: (_a = results.performanceAudits) === null || _a === void 0 ? void 0 : _a.metrics['first-contentful-paint'].title,
                    description: (_b = results.performanceAudits) === null || _b === void 0 ? void 0 : _b.metrics['first-contentful-paint'].description,
                    score: (_c = results.performanceAudits) === null || _c === void 0 ? void 0 : _c.metrics['first-contentful-paint'].score,
                    value: (_d = results.performanceAudits) === null || _d === void 0 ? void 0 : _d.metrics['first-contentful-paint'].rawValue,
                    displayValue: (_e = results.performanceAudits) === null || _e === void 0 ? void 0 : _e.metrics['first-contentful-paint'].displayValue,
                },
                firstMeaningfulPaint: {
                    title: (_f = results.performanceAudits) === null || _f === void 0 ? void 0 : _f.metrics['first-meaningful-paint'].title,
                    description: (_g = results.performanceAudits) === null || _g === void 0 ? void 0 : _g.metrics['first-meaningful-paint'].description,
                    score: (_h = results.performanceAudits) === null || _h === void 0 ? void 0 : _h.metrics['first-meaningful-paint'].score,
                    value: (_j = results.performanceAudits) === null || _j === void 0 ? void 0 : _j.metrics['first-meaningful-paint'].rawValue,
                    displayValue: (_k = results.performanceAudits) === null || _k === void 0 ? void 0 : _k.metrics['first-meaningful-paint'].displayValue,
                },
                speedIndex: {
                    title: (_l = results.performanceAudits) === null || _l === void 0 ? void 0 : _l.metrics['speed-index'].title,
                    description: (_m = results.performanceAudits) === null || _m === void 0 ? void 0 : _m.metrics['speed-index'].description,
                    score: (_o = results.performanceAudits) === null || _o === void 0 ? void 0 : _o.metrics['speed-index'].score,
                    value: (_p = results.performanceAudits) === null || _p === void 0 ? void 0 : _p.metrics['speed-index'].rawValue,
                    displayValue: (_q = results.performanceAudits) === null || _q === void 0 ? void 0 : _q.metrics['speed-index'].displayValue,
                },
                interactive: {
                    title: (_r = results.performanceAudits) === null || _r === void 0 ? void 0 : _r.metrics['interactive'].title,
                    description: (_s = results.performanceAudits) === null || _s === void 0 ? void 0 : _s.metrics['interactive'].description,
                    score: (_t = results.performanceAudits) === null || _t === void 0 ? void 0 : _t.metrics['interactive'].score,
                    value: (_u = results.performanceAudits) === null || _u === void 0 ? void 0 : _u.metrics['interactive'].rawValue,
                    displayValue: (_v = results.performanceAudits) === null || _v === void 0 ? void 0 : _v.metrics['interactive'].displayValue,
                },
                firstCpuIdle: {
                    title: (_w = results.performanceAudits) === null || _w === void 0 ? void 0 : _w.metrics['first-cpu-idle'].title,
                    description: (_x = results.performanceAudits) === null || _x === void 0 ? void 0 : _x.metrics['first-cpu-idle'].description,
                    score: (_y = results.performanceAudits) === null || _y === void 0 ? void 0 : _y.metrics['first-cpu-idle'].score,
                    value: (_z = results.performanceAudits) === null || _z === void 0 ? void 0 : _z.metrics['first-cpu-idle'].rawValue,
                    displayValue: (_0 = results.performanceAudits) === null || _0 === void 0 ? void 0 : _0.metrics['first-cpu-idle'].displayValue,
                },
                maxPotentialFid: {
                    title: (_1 = results.performanceAudits) === null || _1 === void 0 ? void 0 : _1.metrics['max-potential-fid'].title,
                    description: (_2 = results.performanceAudits) === null || _2 === void 0 ? void 0 : _2.metrics['max-potential-fid'].description,
                    score: (_3 = results.performanceAudits) === null || _3 === void 0 ? void 0 : _3.metrics['max-potential-fid'].score,
                    value: (_4 = results.performanceAudits) === null || _4 === void 0 ? void 0 : _4.metrics['max-potential-fid'].rawValue,
                    displayValue: (_5 = results.performanceAudits) === null || _5 === void 0 ? void 0 : _5.metrics['max-potential-fid'].displayValue,
                },
            },
            noGroup: {
                estimatedInputLatency: {
                    title: (_6 = results.performanceAudits) === null || _6 === void 0 ? void 0 : _6.noGroup['estimated-input-latency'].title,
                    description: (_7 = results.performanceAudits) === null || _7 === void 0 ? void 0 : _7.noGroup['estimated-input-latency'].description,
                    score: (_8 = results.performanceAudits) === null || _8 === void 0 ? void 0 : _8.noGroup['estimated-input-latency'].score,
                    value: (_9 = results.performanceAudits) === null || _9 === void 0 ? void 0 : _9.noGroup['estimated-input-latency'].rawValue,
                    displayValue: (_10 = results.performanceAudits) === null || _10 === void 0 ? void 0 : _10.noGroup['estimated-input-latency'].displayValue,
                },
                totalBlockingTime: {
                    title: (_11 = results.performanceAudits) === null || _11 === void 0 ? void 0 : _11.noGroup['total-blocking-time'].title,
                    description: (_12 = results.performanceAudits) === null || _12 === void 0 ? void 0 : _12.noGroup['total-blocking-time'].description,
                    score: (_13 = results.performanceAudits) === null || _13 === void 0 ? void 0 : _13.noGroup['total-blocking-time'].score,
                    value: (_14 = results.performanceAudits) === null || _14 === void 0 ? void 0 : _14.noGroup['total-blocking-time'].rawValue,
                    displayValue: (_15 = results.performanceAudits) === null || _15 === void 0 ? void 0 : _15.noGroup['total-blocking-time'].displayValue,
                },
                networkRequests: {
                    title: (_16 = results.performanceAudits) === null || _16 === void 0 ? void 0 : _16.noGroup['network-requests'].title,
                    description: (_17 = results.performanceAudits) === null || _17 === void 0 ? void 0 : _17.noGroup['network-requests'].description,
                    score: (_18 = results.performanceAudits) === null || _18 === void 0 ? void 0 : _18.noGroup['network-requests'].score,
                    value: (_19 = results.performanceAudits) === null || _19 === void 0 ? void 0 : _19.noGroup['network-requests'].rawValue,
                    displayValue: (_20 = results.performanceAudits) === null || _20 === void 0 ? void 0 : _20.noGroup['network-requests'].displayValue,
                },
                networkRtt: {
                    title: (_21 = results.performanceAudits) === null || _21 === void 0 ? void 0 : _21.noGroup['network-rtt'].title,
                    description: (_22 = results.performanceAudits) === null || _22 === void 0 ? void 0 : _22.noGroup['network-rtt'].description,
                    score: (_23 = results.performanceAudits) === null || _23 === void 0 ? void 0 : _23.noGroup['network-rtt'].score,
                    value: (_24 = results.performanceAudits) === null || _24 === void 0 ? void 0 : _24.noGroup['network-rtt'].rawValue,
                    displayValue: (_25 = results.performanceAudits) === null || _25 === void 0 ? void 0 : _25.noGroup['network-rtt'].displayValue,
                },
                networkServerLatency: {
                    title: (_26 = results.performanceAudits) === null || _26 === void 0 ? void 0 : _26.noGroup['network-server-latency'].title,
                    description: (_27 = results.performanceAudits) === null || _27 === void 0 ? void 0 : _27.noGroup['network-server-latency'].description,
                    score: (_28 = results.performanceAudits) === null || _28 === void 0 ? void 0 : _28.noGroup['network-server-latency'].score,
                    value: (_29 = results.performanceAudits) === null || _29 === void 0 ? void 0 : _29.noGroup['network-server-latency'].rawValue,
                    displayValue: (_30 = results.performanceAudits) === null || _30 === void 0 ? void 0 : _30.noGroup['network-server-latency'].displayValue,
                },
                mainThreadTasks: {
                    title: (_31 = results.performanceAudits) === null || _31 === void 0 ? void 0 : _31.noGroup['main-thread-tasks'].title,
                    description: (_32 = results.performanceAudits) === null || _32 === void 0 ? void 0 : _32.noGroup['main-thread-tasks'].description,
                    score: (_33 = results.performanceAudits) === null || _33 === void 0 ? void 0 : _33.noGroup['main-thread-tasks'].score,
                    value: (_34 = results.performanceAudits) === null || _34 === void 0 ? void 0 : _34.noGroup['main-thread-tasks'].rawValue,
                    displayValue: (_35 = results.performanceAudits) === null || _35 === void 0 ? void 0 : _35.noGroup['main-thread-tasks'].displayValue,
                },
                diagnostics: {
                    title: (_36 = results.performanceAudits) === null || _36 === void 0 ? void 0 : _36.noGroup['diagnostics'].title,
                    description: (_37 = results.performanceAudits) === null || _37 === void 0 ? void 0 : _37.noGroup['diagnostics'].description,
                    score: (_38 = results.performanceAudits) === null || _38 === void 0 ? void 0 : _38.noGroup['diagnostics'].score,
                    value: (_39 = results.performanceAudits) === null || _39 === void 0 ? void 0 : _39.noGroup['diagnostics'].rawValue,
                    displayValue: (_40 = results.performanceAudits) === null || _40 === void 0 ? void 0 : _40.noGroup['diagnostics'].displayValue,
                },
                metrics: {
                    title: (_41 = results.performanceAudits) === null || _41 === void 0 ? void 0 : _41.noGroup['metrics'].title,
                    description: (_42 = results.performanceAudits) === null || _42 === void 0 ? void 0 : _42.noGroup['metrics'].description,
                    score: (_43 = results.performanceAudits) === null || _43 === void 0 ? void 0 : _43.noGroup['metrics'].score,
                    value: (_44 = results.performanceAudits) === null || _44 === void 0 ? void 0 : _44.noGroup['metrics'].rawValue,
                    displayValue: (_45 = results.performanceAudits) === null || _45 === void 0 ? void 0 : _45.noGroup['metrics'].displayValue,
                },
                screenshotThumbnails: {
                    title: (_46 = results.performanceAudits) === null || _46 === void 0 ? void 0 : _46.noGroup['screenshot-thumbnails'].title,
                    description: (_47 = results.performanceAudits) === null || _47 === void 0 ? void 0 : _47.noGroup['screenshot-thumbnails'].description,
                    score: (_48 = results.performanceAudits) === null || _48 === void 0 ? void 0 : _48.noGroup['screenshot-thumbnails'].score,
                    value: (_49 = results.performanceAudits) === null || _49 === void 0 ? void 0 : _49.noGroup['screenshot-thumbnails'].rawValue,
                    displayValue: (_50 = results.performanceAudits) === null || _50 === void 0 ? void 0 : _50.noGroup['screenshot-thumbnails'].displayValue,
                },
                finalScreenshot: {
                    title: (_51 = results.performanceAudits) === null || _51 === void 0 ? void 0 : _51.noGroup['final-screenshot'].title,
                    description: (_52 = results.performanceAudits) === null || _52 === void 0 ? void 0 : _52.noGroup['final-screenshot'].description,
                    score: (_53 = results.performanceAudits) === null || _53 === void 0 ? void 0 : _53.noGroup['final-screenshot'].score,
                    value: (_54 = results.performanceAudits) === null || _54 === void 0 ? void 0 : _54.noGroup['final-screenshot'].rawValue,
                    displayValue: (_55 = results.performanceAudits) === null || _55 === void 0 ? void 0 : _55.noGroup['final-screenshot'].displayValue,
                },
            },
            loadOpportunities: {
                renderBlockingResources: {
                    title: (_56 = results.performanceAudits) === null || _56 === void 0 ? void 0 : _56['load-opportunities']['render-blocking-resources'].title,
                    description: (_57 = results.performanceAudits) === null || _57 === void 0 ? void 0 : _57['load-opportunities']['render-blocking-resources'].description,
                    score: (_58 = results.performanceAudits) === null || _58 === void 0 ? void 0 : _58['load-opportunities']['render-blocking-resources'].score,
                    value: (_59 = results.performanceAudits) === null || _59 === void 0 ? void 0 : _59['load-opportunities']['render-blocking-resources'].rawValue,
                    displayValue: (_60 = results.performanceAudits) === null || _60 === void 0 ? void 0 : _60['load-opportunities']['render-blocking-resources'].displayValue,
                },
                usesResponsiveImages: {
                    title: (_61 = results.performanceAudits) === null || _61 === void 0 ? void 0 : _61['load-opportunities']['uses-responsive-images'].title,
                    description: (_62 = results.performanceAudits) === null || _62 === void 0 ? void 0 : _62['load-opportunities']['uses-responsive-images'].description,
                    score: (_63 = results.performanceAudits) === null || _63 === void 0 ? void 0 : _63['load-opportunities']['uses-responsive-images'].score,
                    value: (_64 = results.performanceAudits) === null || _64 === void 0 ? void 0 : _64['load-opportunities']['uses-responsive-images'].rawValue,
                    displayValue: (_65 = results.performanceAudits) === null || _65 === void 0 ? void 0 : _65['load-opportunities']['uses-responsive-images'].displayValue,
                },
                offscreenImages: {
                    title: (_66 = results.performanceAudits) === null || _66 === void 0 ? void 0 : _66['load-opportunities']['offscreen-images'].title,
                    description: (_67 = results.performanceAudits) === null || _67 === void 0 ? void 0 : _67['load-opportunities']['offscreen-images'].description,
                    score: (_68 = results.performanceAudits) === null || _68 === void 0 ? void 0 : _68['load-opportunities']['offscreen-images'].score,
                    value: (_69 = results.performanceAudits) === null || _69 === void 0 ? void 0 : _69['load-opportunities']['offscreen-images'].rawValue,
                    displayValue: (_70 = results.performanceAudits) === null || _70 === void 0 ? void 0 : _70['load-opportunities']['offscreen-images'].displayValue,
                },
                unminifiedCss: {
                    title: (_71 = results.performanceAudits) === null || _71 === void 0 ? void 0 : _71['load-opportunities']['unminified-css'].title,
                    description: (_72 = results.performanceAudits) === null || _72 === void 0 ? void 0 : _72['load-opportunities']['unminified-css'].description,
                    score: (_73 = results.performanceAudits) === null || _73 === void 0 ? void 0 : _73['load-opportunities']['unminified-css'].score,
                    value: (_74 = results.performanceAudits) === null || _74 === void 0 ? void 0 : _74['load-opportunities']['unminified-css'].rawValue,
                    displayValue: (_75 = results.performanceAudits) === null || _75 === void 0 ? void 0 : _75['load-opportunities']['unminified-css'].displayValue,
                },
                unminifiedJavascript: {
                    title: (_76 = results.performanceAudits) === null || _76 === void 0 ? void 0 : _76['load-opportunities']['unminified-javascript'].title,
                    description: (_77 = results.performanceAudits) === null || _77 === void 0 ? void 0 : _77['load-opportunities']['unminified-javascript'].description,
                    score: (_78 = results.performanceAudits) === null || _78 === void 0 ? void 0 : _78['load-opportunities']['unminified-javascript'].score,
                    value: (_79 = results.performanceAudits) === null || _79 === void 0 ? void 0 : _79['load-opportunities']['unminified-javascript'].rawValue,
                    displayValue: (_80 = results.performanceAudits) === null || _80 === void 0 ? void 0 : _80['load-opportunities']['unminified-javascript'].displayValue,
                },
                unusedCssRules: {
                    title: (_81 = results.performanceAudits) === null || _81 === void 0 ? void 0 : _81['load-opportunities']['unused-css-rules'].title,
                    description: (_82 = results.performanceAudits) === null || _82 === void 0 ? void 0 : _82['load-opportunities']['unused-css-rules'].description,
                    score: (_83 = results.performanceAudits) === null || _83 === void 0 ? void 0 : _83['load-opportunities']['unused-css-rules'].score,
                    value: (_84 = results.performanceAudits) === null || _84 === void 0 ? void 0 : _84['load-opportunities']['unused-css-rules'].rawValue,
                    displayValue: (_85 = results.performanceAudits) === null || _85 === void 0 ? void 0 : _85['load-opportunities']['unused-css-rules'].displayValue,
                },
                usesOptimizedImages: {
                    title: (_86 = results.performanceAudits) === null || _86 === void 0 ? void 0 : _86['load-opportunities']['uses-optimized-images'].title,
                    description: (_87 = results.performanceAudits) === null || _87 === void 0 ? void 0 : _87['load-opportunities']['uses-optimized-images'].description,
                    score: (_88 = results.performanceAudits) === null || _88 === void 0 ? void 0 : _88['load-opportunities']['uses-optimized-images'].score,
                    value: (_89 = results.performanceAudits) === null || _89 === void 0 ? void 0 : _89['load-opportunities']['uses-optimized-images'].rawValue,
                    displayValue: (_90 = results.performanceAudits) === null || _90 === void 0 ? void 0 : _90['load-opportunities']['uses-optimized-images'].displayValue,
                },
                usesWebpImages: {
                    title: (_91 = results.performanceAudits) === null || _91 === void 0 ? void 0 : _91['load-opportunities']['uses-webp-images'].title,
                    description: (_92 = results.performanceAudits) === null || _92 === void 0 ? void 0 : _92['load-opportunities']['uses-webp-images'].description,
                    score: (_93 = results.performanceAudits) === null || _93 === void 0 ? void 0 : _93['load-opportunities']['uses-webp-images'].score,
                    value: (_94 = results.performanceAudits) === null || _94 === void 0 ? void 0 : _94['load-opportunities']['uses-webp-images'].rawValue,
                    displayValue: (_95 = results.performanceAudits) === null || _95 === void 0 ? void 0 : _95['load-opportunities']['uses-webp-images'].displayValue,
                },
                usesTextCompression: {
                    title: (_96 = results.performanceAudits) === null || _96 === void 0 ? void 0 : _96['load-opportunities']['uses-text-compression'].title,
                    description: (_97 = results.performanceAudits) === null || _97 === void 0 ? void 0 : _97['load-opportunities']['uses-text-compression'].description,
                    score: (_98 = results.performanceAudits) === null || _98 === void 0 ? void 0 : _98['load-opportunities']['uses-text-compression'].score,
                    value: (_99 = results.performanceAudits) === null || _99 === void 0 ? void 0 : _99['load-opportunities']['uses-text-compression'].rawValue,
                    displayValue: (_100 = results.performanceAudits) === null || _100 === void 0 ? void 0 : _100['load-opportunities']['uses-text-compression'].displayValue,
                },
                usesRelPreconnect: {
                    title: (_101 = results.performanceAudits) === null || _101 === void 0 ? void 0 : _101['load-opportunities']['uses-rel-preconnect'].title,
                    description: (_102 = results.performanceAudits) === null || _102 === void 0 ? void 0 : _102['load-opportunities']['uses-rel-preconnect'].description,
                    score: (_103 = results.performanceAudits) === null || _103 === void 0 ? void 0 : _103['load-opportunities']['uses-rel-preconnect'].score,
                    value: (_104 = results.performanceAudits) === null || _104 === void 0 ? void 0 : _104['load-opportunities']['uses-rel-preconnect'].rawValue,
                    displayValue: (_105 = results.performanceAudits) === null || _105 === void 0 ? void 0 : _105['load-opportunities']['uses-rel-preconnect'].displayValue,
                },
                timeToFirstByte: {
                    title: (_106 = results.performanceAudits) === null || _106 === void 0 ? void 0 : _106['load-opportunities']['time-to-first-byte'].title,
                    description: (_107 = results.performanceAudits) === null || _107 === void 0 ? void 0 : _107['load-opportunities']['time-to-first-byte'].description,
                    score: (_108 = results.performanceAudits) === null || _108 === void 0 ? void 0 : _108['load-opportunities']['time-to-first-byte'].score,
                    value: (_109 = results.performanceAudits) === null || _109 === void 0 ? void 0 : _109['load-opportunities']['time-to-first-byte'].rawValue,
                    displayValue: (_110 = results.performanceAudits) === null || _110 === void 0 ? void 0 : _110['load-opportunities']['time-to-first-byte'].displayValue,
                },
                redirects: {
                    title: (_111 = results.performanceAudits) === null || _111 === void 0 ? void 0 : _111['load-opportunities']['redirects'].title,
                    description: (_112 = results.performanceAudits) === null || _112 === void 0 ? void 0 : _112['load-opportunities']['redirects'].description,
                    score: (_113 = results.performanceAudits) === null || _113 === void 0 ? void 0 : _113['load-opportunities']['redirects'].score,
                    value: (_114 = results.performanceAudits) === null || _114 === void 0 ? void 0 : _114['load-opportunities']['redirects'].rawValue,
                    displayValue: (_115 = results.performanceAudits) === null || _115 === void 0 ? void 0 : _115['load-opportunities']['redirects'].displayValue,
                },
                usesRelPreload: {
                    title: (_116 = results.performanceAudits) === null || _116 === void 0 ? void 0 : _116['load-opportunities']['uses-rel-preload'].title,
                    description: (_117 = results.performanceAudits) === null || _117 === void 0 ? void 0 : _117['load-opportunities']['uses-rel-preload'].description,
                    score: (_118 = results.performanceAudits) === null || _118 === void 0 ? void 0 : _118['load-opportunities']['uses-rel-preload'].score,
                    value: (_119 = results.performanceAudits) === null || _119 === void 0 ? void 0 : _119['load-opportunities']['uses-rel-preload'].rawValue,
                    displayValue: (_120 = results.performanceAudits) === null || _120 === void 0 ? void 0 : _120['load-opportunities']['uses-rel-preload'].displayValue,
                },
                efficientAnimatedContent: {
                    title: (_121 = results.performanceAudits) === null || _121 === void 0 ? void 0 : _121['load-opportunities']['efficient-animated-content'].title,
                    description: (_122 = results.performanceAudits) === null || _122 === void 0 ? void 0 : _122['load-opportunities']['efficient-animated-content'].description,
                    score: (_123 = results.performanceAudits) === null || _123 === void 0 ? void 0 : _123['load-opportunities']['efficient-animated-content'].score,
                    value: (_124 = results.performanceAudits) === null || _124 === void 0 ? void 0 : _124['load-opportunities']['efficient-animated-content'].rawValue,
                    displayValue: (_125 = results.performanceAudits) === null || _125 === void 0 ? void 0 : _125['load-opportunities']['efficient-animated-content'].displayValue,
                },
            },
            diagnostics: {
                totalByteWeight: {
                    title: (_126 = results.performanceAudits) === null || _126 === void 0 ? void 0 : _126.diagnostics['total-byte-weight'].title,
                    description: (_127 = results.performanceAudits) === null || _127 === void 0 ? void 0 : _127.diagnostics['total-byte-weight'].description,
                    score: (_128 = results.performanceAudits) === null || _128 === void 0 ? void 0 : _128.diagnostics['total-byte-weight'].score,
                    value: (_129 = results.performanceAudits) === null || _129 === void 0 ? void 0 : _129.diagnostics['total-byte-weight'].rawValue,
                    displayValue: (_130 = results.performanceAudits) === null || _130 === void 0 ? void 0 : _130.diagnostics['total-byte-weight'].displayValue,
                },
                usesLongCacheTtl: {
                    title: (_131 = results.performanceAudits) === null || _131 === void 0 ? void 0 : _131.diagnostics['uses-long-cache-ttl'].title,
                    description: (_132 = results.performanceAudits) === null || _132 === void 0 ? void 0 : _132.diagnostics['uses-long-cache-ttl'].description,
                    score: (_133 = results.performanceAudits) === null || _133 === void 0 ? void 0 : _133.diagnostics['uses-long-cache-ttl'].score,
                    value: (_134 = results.performanceAudits) === null || _134 === void 0 ? void 0 : _134.diagnostics['uses-long-cache-ttl'].rawValue,
                    displayValue: (_135 = results.performanceAudits) === null || _135 === void 0 ? void 0 : _135.diagnostics['uses-long-cache-ttl'].displayValue,
                },
                domSize: {
                    title: (_136 = results.performanceAudits) === null || _136 === void 0 ? void 0 : _136.diagnostics['dom-size'].title,
                    description: (_137 = results.performanceAudits) === null || _137 === void 0 ? void 0 : _137.diagnostics['dom-size'].description,
                    score: (_138 = results.performanceAudits) === null || _138 === void 0 ? void 0 : _138.diagnostics['dom-size'].score,
                    value: (_139 = results.performanceAudits) === null || _139 === void 0 ? void 0 : _139.diagnostics['dom-size'].rawValue,
                    displayValue: (_140 = results.performanceAudits) === null || _140 === void 0 ? void 0 : _140.diagnostics['dom-size'].displayValue,
                },
                criticalRequestChains: {
                    title: (_141 = results.performanceAudits) === null || _141 === void 0 ? void 0 : _141.diagnostics['critical-request-chains'].title,
                    description: (_142 = results.performanceAudits) === null || _142 === void 0 ? void 0 : _142.diagnostics['critical-request-chains'].description,
                    score: (_143 = results.performanceAudits) === null || _143 === void 0 ? void 0 : _143.diagnostics['critical-request-chains'].score,
                    value: (_144 = results.performanceAudits) === null || _144 === void 0 ? void 0 : _144.diagnostics['critical-request-chains'].rawValue,
                    displayValue: (_145 = results.performanceAudits) === null || _145 === void 0 ? void 0 : _145.diagnostics['critical-request-chains'].displayValue,
                },
                userTimings: {
                    title: (_146 = results.performanceAudits) === null || _146 === void 0 ? void 0 : _146.diagnostics['user-timings'].title,
                    description: (_147 = results.performanceAudits) === null || _147 === void 0 ? void 0 : _147.diagnostics['user-timings'].description,
                    score: (_148 = results.performanceAudits) === null || _148 === void 0 ? void 0 : _148.diagnostics['user-timings'].score,
                    value: (_149 = results.performanceAudits) === null || _149 === void 0 ? void 0 : _149.diagnostics['user-timings'].rawValue,
                    displayValue: (_150 = results.performanceAudits) === null || _150 === void 0 ? void 0 : _150.diagnostics['user-timings'].displayValue,
                },
                bootupTime: {
                    title: (_151 = results.performanceAudits) === null || _151 === void 0 ? void 0 : _151.diagnostics['bootup-time'].title,
                    description: (_152 = results.performanceAudits) === null || _152 === void 0 ? void 0 : _152.diagnostics['bootup-time'].description,
                    score: (_153 = results.performanceAudits) === null || _153 === void 0 ? void 0 : _153.diagnostics['bootup-time'].score,
                    value: (_154 = results.performanceAudits) === null || _154 === void 0 ? void 0 : _154.diagnostics['bootup-time'].rawValue,
                    displayValue: (_155 = results.performanceAudits) === null || _155 === void 0 ? void 0 : _155.diagnostics['bootup-time'].displayValue,
                },
                mainthreadWorkBreakdown: {
                    title: (_156 = results.performanceAudits) === null || _156 === void 0 ? void 0 : _156.diagnostics['mainthread-work-breakdown'].title,
                    description: (_157 = results.performanceAudits) === null || _157 === void 0 ? void 0 : _157.diagnostics['mainthread-work-breakdown'].description,
                    score: (_158 = results.performanceAudits) === null || _158 === void 0 ? void 0 : _158.diagnostics['mainthread-work-breakdown'].score,
                    value: (_159 = results.performanceAudits) === null || _159 === void 0 ? void 0 : _159.diagnostics['mainthread-work-breakdown'].rawValue,
                    displayValue: (_160 = results.performanceAudits) === null || _160 === void 0 ? void 0 : _160.diagnostics['mainthread-work-breakdown'].displayValue,
                },
                fontDisplay: {
                    title: (_161 = results.performanceAudits) === null || _161 === void 0 ? void 0 : _161.diagnostics['font-display'].title,
                    description: (_162 = results.performanceAudits) === null || _162 === void 0 ? void 0 : _162.diagnostics['font-display'].description,
                    score: (_163 = results.performanceAudits) === null || _163 === void 0 ? void 0 : _163.diagnostics['font-display'].score,
                    value: (_164 = results.performanceAudits) === null || _164 === void 0 ? void 0 : _164.diagnostics['font-display'].rawValue,
                    displayValue: (_165 = results.performanceAudits) === null || _165 === void 0 ? void 0 : _165.diagnostics['font-display'].displayValue,
                },
                resourceSummary: {
                    title: (_166 = results.performanceAudits) === null || _166 === void 0 ? void 0 : _166.diagnostics['resource-summary'].title,
                    description: (_167 = results.performanceAudits) === null || _167 === void 0 ? void 0 : _167.diagnostics['resource-summary'].description,
                    score: (_168 = results.performanceAudits) === null || _168 === void 0 ? void 0 : _168.diagnostics['resource-summary'].score,
                    value: (_169 = results.performanceAudits) === null || _169 === void 0 ? void 0 : _169.diagnostics['resource-summary'].rawValue,
                    displayValue: (_170 = results.performanceAudits) === null || _170 === void 0 ? void 0 : _170.diagnostics['resource-summary'].displayValue,
                },
                thirdPartySummary: {
                    title: (_171 = results.performanceAudits) === null || _171 === void 0 ? void 0 : _171.diagnostics['third-party-summary'].title,
                    description: (_172 = results.performanceAudits) === null || _172 === void 0 ? void 0 : _172.diagnostics['third-party-summary'].description,
                    score: (_173 = results.performanceAudits) === null || _173 === void 0 ? void 0 : _173.diagnostics['third-party-summary'].score,
                    value: (_174 = results.performanceAudits) === null || _174 === void 0 ? void 0 : _174.diagnostics['third-party-summary'].rawValue,
                    displayValue: (_175 = results.performanceAudits) === null || _175 === void 0 ? void 0 : _175.diagnostics['third-party-summary'].displayValue,
                },
            },
        },
        seoAudits: {
            seoMobile: {
                viewport: {
                    title: (_176 = results.seoAudits) === null || _176 === void 0 ? void 0 : _176['seo-mobile']['viewport'].title,
                    description: (_177 = results.seoAudits) === null || _177 === void 0 ? void 0 : _177['seo-mobile']['viewport'].description,
                    score: (_178 = results.seoAudits) === null || _178 === void 0 ? void 0 : _178['seo-mobile']['viewport'].score,
                    value: (_179 = results.seoAudits) === null || _179 === void 0 ? void 0 : _179['seo-mobile']['viewport'].rawValue,
                    displayValue: (_180 = results.seoAudits) === null || _180 === void 0 ? void 0 : _180['seo-mobile']['viewport'].displayValue,
                },
                fontSize: {
                    title: (_181 = results.seoAudits) === null || _181 === void 0 ? void 0 : _181['seo-mobile']['font-size'].title,
                    description: (_182 = results.seoAudits) === null || _182 === void 0 ? void 0 : _182['seo-mobile']['font-size'].description,
                    score: (_183 = results.seoAudits) === null || _183 === void 0 ? void 0 : _183['seo-mobile']['font-size'].score,
                    value: (_184 = results.seoAudits) === null || _184 === void 0 ? void 0 : _184['seo-mobile']['font-size'].rawValue,
                    displayValue: (_185 = results.seoAudits) === null || _185 === void 0 ? void 0 : _185['seo-mobile']['font-size'].displayValue,
                },
                tapTargets: {
                    title: (_186 = results.seoAudits) === null || _186 === void 0 ? void 0 : _186['seo-mobile']['tap-targets'].title,
                    description: (_187 = results.seoAudits) === null || _187 === void 0 ? void 0 : _187['seo-mobile']['tap-targets'].description,
                    score: (_188 = results.seoAudits) === null || _188 === void 0 ? void 0 : _188['seo-mobile']['tap-targets'].score,
                    value: (_189 = results.seoAudits) === null || _189 === void 0 ? void 0 : _189['seo-mobile']['tap-targets'].rawValue,
                    displayValue: (_190 = results.seoAudits) === null || _190 === void 0 ? void 0 : _190['seo-mobile']['tap-targets'].displayValue,
                },
            },
            seoContent: {
                documentTitle: {
                    title: (_191 = results.seoAudits) === null || _191 === void 0 ? void 0 : _191['seo-content']['document-title'].title,
                    description: (_192 = results.seoAudits) === null || _192 === void 0 ? void 0 : _192['seo-content']['document-title'].description,
                    score: (_193 = results.seoAudits) === null || _193 === void 0 ? void 0 : _193['seo-content']['document-title'].score,
                    value: (_194 = results.seoAudits) === null || _194 === void 0 ? void 0 : _194['seo-content']['document-title'].rawValue,
                    displayValue: (_195 = results.seoAudits) === null || _195 === void 0 ? void 0 : _195['seo-content']['document-title'].displayValue,
                },
                metaDescription: {
                    title: (_196 = results.seoAudits) === null || _196 === void 0 ? void 0 : _196['seo-content']['meta-description'].title,
                    description: (_197 = results.seoAudits) === null || _197 === void 0 ? void 0 : _197['seo-content']['meta-description'].description,
                    score: (_198 = results.seoAudits) === null || _198 === void 0 ? void 0 : _198['seo-content']['meta-description'].score,
                    value: (_199 = results.seoAudits) === null || _199 === void 0 ? void 0 : _199['seo-content']['meta-description'].rawValue,
                    displayValue: (_200 = results.seoAudits) === null || _200 === void 0 ? void 0 : _200['seo-content']['meta-description'].displayValue,
                },
                linkText: {
                    title: (_201 = results.seoAudits) === null || _201 === void 0 ? void 0 : _201['seo-content']['link-text'].title,
                    description: (_202 = results.seoAudits) === null || _202 === void 0 ? void 0 : _202['seo-content']['link-text'].description,
                    score: (_203 = results.seoAudits) === null || _203 === void 0 ? void 0 : _203['seo-content']['link-text'].score,
                    value: (_204 = results.seoAudits) === null || _204 === void 0 ? void 0 : _204['seo-content']['link-text'].rawValue,
                    displayValue: (_205 = results.seoAudits) === null || _205 === void 0 ? void 0 : _205['seo-content']['link-text'].displayValue,
                },
                imageAlt: {
                    title: (_206 = results.seoAudits) === null || _206 === void 0 ? void 0 : _206['seo-content']['image-alt'].title,
                    description: (_207 = results.seoAudits) === null || _207 === void 0 ? void 0 : _207['seo-content']['image-alt'].description,
                    score: (_208 = results.seoAudits) === null || _208 === void 0 ? void 0 : _208['seo-content']['image-alt'].score,
                    value: (_209 = results.seoAudits) === null || _209 === void 0 ? void 0 : _209['seo-content']['image-alt'].rawValue,
                    displayValue: (_210 = results.seoAudits) === null || _210 === void 0 ? void 0 : _210['seo-content']['image-alt'].displayValue,
                },
                hreflang: {
                    title: (_211 = results.seoAudits) === null || _211 === void 0 ? void 0 : _211['seo-content']['hreflang'].title,
                    description: (_212 = results.seoAudits) === null || _212 === void 0 ? void 0 : _212['seo-content']['hreflang'].description,
                    score: (_213 = results.seoAudits) === null || _213 === void 0 ? void 0 : _213['seo-content']['hreflang'].score,
                    value: (_214 = results.seoAudits) === null || _214 === void 0 ? void 0 : _214['seo-content']['hreflang'].rawValue,
                    displayValue: (_215 = results.seoAudits) === null || _215 === void 0 ? void 0 : _215['seo-content']['hreflang'].displayValue,
                },
                canonical: {
                    title: (_216 = results.seoAudits) === null || _216 === void 0 ? void 0 : _216['seo-content']['canonical'].title,
                    description: (_217 = results.seoAudits) === null || _217 === void 0 ? void 0 : _217['seo-content']['canonical'].description,
                    score: (_218 = results.seoAudits) === null || _218 === void 0 ? void 0 : _218['seo-content']['canonical'].score,
                    value: (_219 = results.seoAudits) === null || _219 === void 0 ? void 0 : _219['seo-content']['canonical'].rawValue,
                    displayValue: (_220 = results.seoAudits) === null || _220 === void 0 ? void 0 : _220['seo-content']['canonical'].displayValue,
                },
                plugins: {
                    title: (_221 = results.seoAudits) === null || _221 === void 0 ? void 0 : _221['seo-content']['plugins'].title,
                    description: (_222 = results.seoAudits) === null || _222 === void 0 ? void 0 : _222['seo-content']['plugins'].description,
                    score: (_223 = results.seoAudits) === null || _223 === void 0 ? void 0 : _223['seo-content']['plugins'].score,
                    value: (_224 = results.seoAudits) === null || _224 === void 0 ? void 0 : _224['seo-content']['plugins'].rawValue,
                    displayValue: (_225 = results.seoAudits) === null || _225 === void 0 ? void 0 : _225['seo-content']['plugins'].displayValue,
                },
            },
            seoCrawl: {
                httpStatusCode: {
                    title: (_226 = results.seoAudits) === null || _226 === void 0 ? void 0 : _226['seo-crawl']['http-status-code'].title,
                    description: (_227 = results.seoAudits) === null || _227 === void 0 ? void 0 : _227['seo-crawl']['http-status-code'].description,
                    score: (_228 = results.seoAudits) === null || _228 === void 0 ? void 0 : _228['seo-crawl']['http-status-code'].score,
                    value: (_229 = results.seoAudits) === null || _229 === void 0 ? void 0 : _229['seo-crawl']['http-status-code'].rawValue,
                    displayValue: (_230 = results.seoAudits) === null || _230 === void 0 ? void 0 : _230['seo-crawl']['http-status-code'].displayValue,
                },
                isCrawlable: {
                    title: (_231 = results.seoAudits) === null || _231 === void 0 ? void 0 : _231['seo-crawl']['is-crawlable'].title,
                    description: (_232 = results.seoAudits) === null || _232 === void 0 ? void 0 : _232['seo-crawl']['is-crawlable'].description,
                    score: (_233 = results.seoAudits) === null || _233 === void 0 ? void 0 : _233['seo-crawl']['is-crawlable'].score,
                    value: (_234 = results.seoAudits) === null || _234 === void 0 ? void 0 : _234['seo-crawl']['is-crawlable'].rawValue,
                    displayValue: (_235 = results.seoAudits) === null || _235 === void 0 ? void 0 : _235['seo-crawl']['is-crawlable'].displayValue,
                },
                robotsTxt: {
                    title: (_236 = results.seoAudits) === null || _236 === void 0 ? void 0 : _236['seo-crawl']['robots-txt'].title,
                    description: (_237 = results.seoAudits) === null || _237 === void 0 ? void 0 : _237['seo-crawl']['robots-txt'].description,
                    score: (_238 = results.seoAudits) === null || _238 === void 0 ? void 0 : _238['seo-crawl']['robots-txt'].score,
                    value: (_239 = results.seoAudits) === null || _239 === void 0 ? void 0 : _239['seo-crawl']['robots-txt'].rawValue,
                    displayValue: (_240 = results.seoAudits) === null || _240 === void 0 ? void 0 : _240['seo-crawl']['robots-txt'].displayValue,
                },
            },
            noGroup: {
                structuredData: {
                    title: (_241 = results.seoAudits) === null || _241 === void 0 ? void 0 : _241.noGroup['structured-data'].title,
                    description: (_242 = results.seoAudits) === null || _242 === void 0 ? void 0 : _242.noGroup['structured-data'].description,
                    score: (_243 = results.seoAudits) === null || _243 === void 0 ? void 0 : _243.noGroup['structured-data'].score,
                    value: (_244 = results.seoAudits) === null || _244 === void 0 ? void 0 : _244.noGroup['structured-data'].rawValue,
                    displayValue: (_245 = results.seoAudits) === null || _245 === void 0 ? void 0 : _245.noGroup['structured-data'].displayValue,
                },
            },
        },
        accessibilityAudits: {
            allyNavigation: {
                accesskeys: {
                    title: (_246 = results.accessibilityAudits) === null || _246 === void 0 ? void 0 : _246['a11y-navigation']['accesskeys'].title,
                    description: (_247 = results.accessibilityAudits) === null || _247 === void 0 ? void 0 : _247['a11y-navigation']['accesskeys'].description,
                    score: (_248 = results.accessibilityAudits) === null || _248 === void 0 ? void 0 : _248['a11y-navigation']['accesskeys'].score,
                    value: (_249 = results.accessibilityAudits) === null || _249 === void 0 ? void 0 : _249['a11y-navigation']['accesskeys'].rawValue,
                    displayValue: (_250 = results.accessibilityAudits) === null || _250 === void 0 ? void 0 : _250['a11y-navigation']['accesskeys'].displayValue,
                },
                bypass: {
                    title: (_251 = results.accessibilityAudits) === null || _251 === void 0 ? void 0 : _251['a11y-navigation']['bypass'].title,
                    description: (_252 = results.accessibilityAudits) === null || _252 === void 0 ? void 0 : _252['a11y-navigation']['bypass'].description,
                    score: (_253 = results.accessibilityAudits) === null || _253 === void 0 ? void 0 : _253['a11y-navigation']['bypass'].score,
                    value: (_254 = results.accessibilityAudits) === null || _254 === void 0 ? void 0 : _254['a11y-navigation']['bypass'].rawValue,
                    displayValue: (_255 = results.accessibilityAudits) === null || _255 === void 0 ? void 0 : _255['a11y-navigation']['bypass'].displayValue,
                },
                tabindex: {
                    title: (_256 = results.accessibilityAudits) === null || _256 === void 0 ? void 0 : _256['a11y-navigation']['tabindex'].title,
                    description: (_257 = results.accessibilityAudits) === null || _257 === void 0 ? void 0 : _257['a11y-navigation']['tabindex'].description,
                    score: (_258 = results.accessibilityAudits) === null || _258 === void 0 ? void 0 : _258['a11y-navigation']['tabindex'].score,
                    value: (_259 = results.accessibilityAudits) === null || _259 === void 0 ? void 0 : _259['a11y-navigation']['tabindex'].rawValue,
                    displayValue: (_260 = results.accessibilityAudits) === null || _260 === void 0 ? void 0 : _260['a11y-navigation']['tabindex'].displayValue,
                },
            },
            allyAria: {
                ariaAllowedAttr: {
                    title: (_261 = results.accessibilityAudits) === null || _261 === void 0 ? void 0 : _261['a11y-aria']['aria-allowed-attr'].title,
                    description: (_262 = results.accessibilityAudits) === null || _262 === void 0 ? void 0 : _262['a11y-aria']['aria-allowed-attr'].description,
                    score: (_263 = results.accessibilityAudits) === null || _263 === void 0 ? void 0 : _263['a11y-aria']['aria-allowed-attr'].score,
                    value: (_264 = results.accessibilityAudits) === null || _264 === void 0 ? void 0 : _264['a11y-aria']['aria-allowed-attr'].rawValue,
                    displayValue: (_265 = results.accessibilityAudits) === null || _265 === void 0 ? void 0 : _265['a11y-aria']['aria-allowed-attr'].displayValue,
                },
                ariaRequiredAttr: {
                    title: (_266 = results.accessibilityAudits) === null || _266 === void 0 ? void 0 : _266['a11y-aria']['aria-required-attr'].title,
                    description: (_267 = results.accessibilityAudits) === null || _267 === void 0 ? void 0 : _267['a11y-aria']['aria-required-attr'].description,
                    score: (_268 = results.accessibilityAudits) === null || _268 === void 0 ? void 0 : _268['a11y-aria']['aria-required-attr'].score,
                    value: (_269 = results.accessibilityAudits) === null || _269 === void 0 ? void 0 : _269['a11y-aria']['aria-required-attr'].rawValue,
                    displayValue: (_270 = results.accessibilityAudits) === null || _270 === void 0 ? void 0 : _270['a11y-aria']['aria-required-attr'].displayValue,
                },
                ariaRequiredChildren: {
                    title: (_271 = results.accessibilityAudits) === null || _271 === void 0 ? void 0 : _271['a11y-aria']['aria-required-children'].title,
                    description: (_272 = results.accessibilityAudits) === null || _272 === void 0 ? void 0 : _272['a11y-aria']['aria-required-children'].description,
                    score: (_273 = results.accessibilityAudits) === null || _273 === void 0 ? void 0 : _273['a11y-aria']['aria-required-children'].score,
                    value: (_274 = results.accessibilityAudits) === null || _274 === void 0 ? void 0 : _274['a11y-aria']['aria-required-children'].rawValue,
                    displayValue: (_275 = results.accessibilityAudits) === null || _275 === void 0 ? void 0 : _275['a11y-aria']['aria-required-children'].displayValue,
                },
                ariaRequiredParent: {
                    title: (_276 = results.accessibilityAudits) === null || _276 === void 0 ? void 0 : _276['a11y-aria']['aria-required-parent'].title,
                    description: (_277 = results.accessibilityAudits) === null || _277 === void 0 ? void 0 : _277['a11y-aria']['aria-required-parent'].description,
                    score: (_278 = results.accessibilityAudits) === null || _278 === void 0 ? void 0 : _278['a11y-aria']['aria-required-parent'].score,
                    value: (_279 = results.accessibilityAudits) === null || _279 === void 0 ? void 0 : _279['a11y-aria']['aria-required-parent'].rawValue,
                    displayValue: (_280 = results.accessibilityAudits) === null || _280 === void 0 ? void 0 : _280['a11y-aria']['aria-required-parent'].displayValue,
                },
                ariaRoles: {
                    title: (_281 = results.accessibilityAudits) === null || _281 === void 0 ? void 0 : _281['a11y-aria']['aria-roles'].title,
                    description: (_282 = results.accessibilityAudits) === null || _282 === void 0 ? void 0 : _282['a11y-aria']['aria-roles'].description,
                    score: (_283 = results.accessibilityAudits) === null || _283 === void 0 ? void 0 : _283['a11y-aria']['aria-roles'].score,
                    value: (_284 = results.accessibilityAudits) === null || _284 === void 0 ? void 0 : _284['a11y-aria']['aria-roles'].rawValue,
                    displayValue: (_285 = results.accessibilityAudits) === null || _285 === void 0 ? void 0 : _285['a11y-aria']['aria-roles'].displayValue,
                },
                ariaValidAttrValue: {
                    title: (_286 = results.accessibilityAudits) === null || _286 === void 0 ? void 0 : _286['a11y-aria']['aria-valid-attr-value'].title,
                    description: (_287 = results.accessibilityAudits) === null || _287 === void 0 ? void 0 : _287['a11y-aria']['aria-valid-attr-value'].description,
                    score: (_288 = results.accessibilityAudits) === null || _288 === void 0 ? void 0 : _288['a11y-aria']['aria-valid-attr-value'].score,
                    value: (_289 = results.accessibilityAudits) === null || _289 === void 0 ? void 0 : _289['a11y-aria']['aria-valid-attr-value'].rawValue,
                    displayValue: (_290 = results.accessibilityAudits) === null || _290 === void 0 ? void 0 : _290['a11y-aria']['aria-valid-attr-value'].displayValue,
                },
                ariaValidAttr: {
                    title: (_291 = results.accessibilityAudits) === null || _291 === void 0 ? void 0 : _291['a11y-aria']['aria-valid-attr'].title,
                    description: (_292 = results.accessibilityAudits) === null || _292 === void 0 ? void 0 : _292['a11y-aria']['aria-valid-attr'].description,
                    score: (_293 = results.accessibilityAudits) === null || _293 === void 0 ? void 0 : _293['a11y-aria']['aria-valid-attr'].score,
                    value: (_294 = results.accessibilityAudits) === null || _294 === void 0 ? void 0 : _294['a11y-aria']['aria-valid-attr'].rawValue,
                    displayValue: (_295 = results.accessibilityAudits) === null || _295 === void 0 ? void 0 : _295['a11y-aria']['aria-valid-attr'].displayValue,
                },
            },
            allyAudioVideo: {
                audioCaption: {
                    title: (_296 = results.accessibilityAudits) === null || _296 === void 0 ? void 0 : _296['a11y-audio-video']['audio-caption'].title,
                    description: (_297 = results.accessibilityAudits) === null || _297 === void 0 ? void 0 : _297['a11y-audio-video']['audio-caption'].description,
                    score: (_298 = results.accessibilityAudits) === null || _298 === void 0 ? void 0 : _298['a11y-audio-video']['audio-caption'].score,
                    value: (_299 = results.accessibilityAudits) === null || _299 === void 0 ? void 0 : _299['a11y-audio-video']['audio-caption'].rawValue,
                    displayValue: (_300 = results.accessibilityAudits) === null || _300 === void 0 ? void 0 : _300['a11y-audio-video']['audio-caption'].displayValue,
                },
                videoCaption: {
                    title: (_301 = results.accessibilityAudits) === null || _301 === void 0 ? void 0 : _301['a11y-audio-video']['video-caption'].title,
                    description: (_302 = results.accessibilityAudits) === null || _302 === void 0 ? void 0 : _302['a11y-audio-video']['video-caption'].description,
                    score: (_303 = results.accessibilityAudits) === null || _303 === void 0 ? void 0 : _303['a11y-audio-video']['video-caption'].score,
                    value: (_304 = results.accessibilityAudits) === null || _304 === void 0 ? void 0 : _304['a11y-audio-video']['video-caption'].rawValue,
                    displayValue: (_305 = results.accessibilityAudits) === null || _305 === void 0 ? void 0 : _305['a11y-audio-video']['video-caption'].displayValue,
                },
                videoDescription: {
                    title: (_306 = results.accessibilityAudits) === null || _306 === void 0 ? void 0 : _306['a11y-audio-video']['video-description'].title,
                    description: (_307 = results.accessibilityAudits) === null || _307 === void 0 ? void 0 : _307['a11y-audio-video']['video-description'].description,
                    score: (_308 = results.accessibilityAudits) === null || _308 === void 0 ? void 0 : _308['a11y-audio-video']['video-description'].score,
                    value: (_309 = results.accessibilityAudits) === null || _309 === void 0 ? void 0 : _309['a11y-audio-video']['video-description'].rawValue,
                    displayValue: (_310 = results.accessibilityAudits) === null || _310 === void 0 ? void 0 : _310['a11y-audio-video']['video-description'].displayValue,
                },
            },
            allyNamesLabels: {
                buttonName: {
                    title: (_311 = results.accessibilityAudits) === null || _311 === void 0 ? void 0 : _311['a11y-names-labels']['button-name'].title,
                    description: (_312 = results.accessibilityAudits) === null || _312 === void 0 ? void 0 : _312['a11y-names-labels']['button-name'].description,
                    score: (_313 = results.accessibilityAudits) === null || _313 === void 0 ? void 0 : _313['a11y-names-labels']['button-name'].score,
                    value: (_314 = results.accessibilityAudits) === null || _314 === void 0 ? void 0 : _314['a11y-names-labels']['button-name'].rawValue,
                    displayValue: (_315 = results.accessibilityAudits) === null || _315 === void 0 ? void 0 : _315['a11y-names-labels']['button-name'].displayValue,
                },
                documentTitle: {
                    title: (_316 = results.accessibilityAudits) === null || _316 === void 0 ? void 0 : _316['a11y-names-labels']['document-title'].title,
                    description: (_317 = results.accessibilityAudits) === null || _317 === void 0 ? void 0 : _317['a11y-names-labels']['document-title'].description,
                    score: (_318 = results.accessibilityAudits) === null || _318 === void 0 ? void 0 : _318['a11y-names-labels']['document-title'].score,
                    value: (_319 = results.accessibilityAudits) === null || _319 === void 0 ? void 0 : _319['a11y-names-labels']['document-title'].rawValue,
                    displayValue: (_320 = results.accessibilityAudits) === null || _320 === void 0 ? void 0 : _320['a11y-names-labels']['document-title'].displayValue,
                },
                frameTitle: {
                    title: (_321 = results.accessibilityAudits) === null || _321 === void 0 ? void 0 : _321['a11y-names-labels']['frame-title'].title,
                    description: (_322 = results.accessibilityAudits) === null || _322 === void 0 ? void 0 : _322['a11y-names-labels']['frame-title'].description,
                    score: (_323 = results.accessibilityAudits) === null || _323 === void 0 ? void 0 : _323['a11y-names-labels']['frame-title'].score,
                    value: (_324 = results.accessibilityAudits) === null || _324 === void 0 ? void 0 : _324['a11y-names-labels']['frame-title'].rawValue,
                    displayValue: (_325 = results.accessibilityAudits) === null || _325 === void 0 ? void 0 : _325['a11y-names-labels']['frame-title'].displayValue,
                },
                imageAlt: {
                    title: (_326 = results.accessibilityAudits) === null || _326 === void 0 ? void 0 : _326['a11y-names-labels']['image-alt'].title,
                    description: (_327 = results.accessibilityAudits) === null || _327 === void 0 ? void 0 : _327['a11y-names-labels']['image-alt'].description,
                    score: (_328 = results.accessibilityAudits) === null || _328 === void 0 ? void 0 : _328['a11y-names-labels']['image-alt'].score,
                    value: (_329 = results.accessibilityAudits) === null || _329 === void 0 ? void 0 : _329['a11y-names-labels']['image-alt'].rawValue,
                    displayValue: (_330 = results.accessibilityAudits) === null || _330 === void 0 ? void 0 : _330['a11y-names-labels']['image-alt'].displayValue,
                },
                inputImageAlt: {
                    title: (_331 = results.accessibilityAudits) === null || _331 === void 0 ? void 0 : _331['a11y-names-labels']['input-image-alt'].title,
                    description: (_332 = results.accessibilityAudits) === null || _332 === void 0 ? void 0 : _332['a11y-names-labels']['input-image-alt'].description,
                    score: (_333 = results.accessibilityAudits) === null || _333 === void 0 ? void 0 : _333['a11y-names-labels']['input-image-alt'].score,
                    value: (_334 = results.accessibilityAudits) === null || _334 === void 0 ? void 0 : _334['a11y-names-labels']['input-image-alt'].rawValue,
                    displayValue: (_335 = results.accessibilityAudits) === null || _335 === void 0 ? void 0 : _335['a11y-names-labels']['input-image-alt'].displayValue,
                },
                label: {
                    title: (_336 = results.accessibilityAudits) === null || _336 === void 0 ? void 0 : _336['a11y-names-labels']['label'].title,
                    description: (_337 = results.accessibilityAudits) === null || _337 === void 0 ? void 0 : _337['a11y-names-labels']['label'].description,
                    score: (_338 = results.accessibilityAudits) === null || _338 === void 0 ? void 0 : _338['a11y-names-labels']['label'].score,
                    value: (_339 = results.accessibilityAudits) === null || _339 === void 0 ? void 0 : _339['a11y-names-labels']['label'].rawValue,
                    displayValue: (_340 = results.accessibilityAudits) === null || _340 === void 0 ? void 0 : _340['a11y-names-labels']['label'].displayValue,
                },
                linkName: {
                    title: (_341 = results.accessibilityAudits) === null || _341 === void 0 ? void 0 : _341['a11y-names-labels']['link-name'].title,
                    description: (_342 = results.accessibilityAudits) === null || _342 === void 0 ? void 0 : _342['a11y-names-labels']['link-name'].description,
                    score: (_343 = results.accessibilityAudits) === null || _343 === void 0 ? void 0 : _343['a11y-names-labels']['link-name'].score,
                    value: (_344 = results.accessibilityAudits) === null || _344 === void 0 ? void 0 : _344['a11y-names-labels']['link-name'].rawValue,
                    displayValue: (_345 = results.accessibilityAudits) === null || _345 === void 0 ? void 0 : _345['a11y-names-labels']['link-name'].displayValue,
                },
                objectAlt: {
                    title: (_346 = results.accessibilityAudits) === null || _346 === void 0 ? void 0 : _346['a11y-names-labels']['object-alt'].title,
                    description: (_347 = results.accessibilityAudits) === null || _347 === void 0 ? void 0 : _347['a11y-names-labels']['object-alt'].description,
                    score: (_348 = results.accessibilityAudits) === null || _348 === void 0 ? void 0 : _348['a11y-names-labels']['object-alt'].score,
                    value: (_349 = results.accessibilityAudits) === null || _349 === void 0 ? void 0 : _349['a11y-names-labels']['object-alt'].rawValue,
                    displayValue: (_350 = results.accessibilityAudits) === null || _350 === void 0 ? void 0 : _350['a11y-names-labels']['object-alt'].displayValue,
                },
            },
            allyColorContrast: {
                colorContrast: {
                    title: (_351 = results.accessibilityAudits) === null || _351 === void 0 ? void 0 : _351['a11y-color-contrast']['color-contrast'].title,
                    description: (_352 = results.accessibilityAudits) === null || _352 === void 0 ? void 0 : _352['a11y-color-contrast']['color-contrast'].description,
                    score: (_353 = results.accessibilityAudits) === null || _353 === void 0 ? void 0 : _353['a11y-color-contrast']['color-contrast'].score,
                    value: (_354 = results.accessibilityAudits) === null || _354 === void 0 ? void 0 : _354['a11y-color-contrast']['color-contrast'].rawValue,
                    displayValue: (_355 = results.accessibilityAudits) === null || _355 === void 0 ? void 0 : _355['a11y-color-contrast']['color-contrast'].displayValue,
                },
            },
            allyTablesLists: {
                definitionList: {
                    title: (_356 = results.accessibilityAudits) === null || _356 === void 0 ? void 0 : _356['a11y-tables-lists']['definition-list'].title,
                    description: (_357 = results.accessibilityAudits) === null || _357 === void 0 ? void 0 : _357['a11y-tables-lists']['definition-list'].description,
                    score: (_358 = results.accessibilityAudits) === null || _358 === void 0 ? void 0 : _358['a11y-tables-lists']['definition-list'].score,
                    value: (_359 = results.accessibilityAudits) === null || _359 === void 0 ? void 0 : _359['a11y-tables-lists']['definition-list'].rawValue,
                    displayValue: (_360 = results.accessibilityAudits) === null || _360 === void 0 ? void 0 : _360['a11y-tables-lists']['definition-list'].displayValue,
                },
                dlitem: {
                    title: (_361 = results.accessibilityAudits) === null || _361 === void 0 ? void 0 : _361['a11y-tables-lists']['dlitem'].title,
                    description: (_362 = results.accessibilityAudits) === null || _362 === void 0 ? void 0 : _362['a11y-tables-lists']['dlitem'].description,
                    score: (_363 = results.accessibilityAudits) === null || _363 === void 0 ? void 0 : _363['a11y-tables-lists']['dlitem'].score,
                    value: (_364 = results.accessibilityAudits) === null || _364 === void 0 ? void 0 : _364['a11y-tables-lists']['dlitem'].rawValue,
                    displayValue: (_365 = results.accessibilityAudits) === null || _365 === void 0 ? void 0 : _365['a11y-tables-lists']['dlitem'].displayValue,
                },
                layoutTable: {
                    title: (_366 = results.accessibilityAudits) === null || _366 === void 0 ? void 0 : _366['a11y-tables-lists']['layout-table'].title,
                    description: (_367 = results.accessibilityAudits) === null || _367 === void 0 ? void 0 : _367['a11y-tables-lists']['layout-table'].description,
                    score: (_368 = results.accessibilityAudits) === null || _368 === void 0 ? void 0 : _368['a11y-tables-lists']['layout-table'].score,
                    value: (_369 = results.accessibilityAudits) === null || _369 === void 0 ? void 0 : _369['a11y-tables-lists']['layout-table'].rawValue,
                    displayValue: (_370 = results.accessibilityAudits) === null || _370 === void 0 ? void 0 : _370['a11y-tables-lists']['layout-table'].displayValue,
                },
                list: {
                    title: (_371 = results.accessibilityAudits) === null || _371 === void 0 ? void 0 : _371['a11y-tables-lists']['list'].title,
                    description: (_372 = results.accessibilityAudits) === null || _372 === void 0 ? void 0 : _372['a11y-tables-lists']['list'].description,
                    score: (_373 = results.accessibilityAudits) === null || _373 === void 0 ? void 0 : _373['a11y-tables-lists']['list'].score,
                    value: (_374 = results.accessibilityAudits) === null || _374 === void 0 ? void 0 : _374['a11y-tables-lists']['list'].rawValue,
                    displayValue: (_375 = results.accessibilityAudits) === null || _375 === void 0 ? void 0 : _375['a11y-tables-lists']['list'].displayValue,
                },
                listitem: {
                    title: (_376 = results.accessibilityAudits) === null || _376 === void 0 ? void 0 : _376['a11y-tables-lists']['listitem'].title,
                    description: (_377 = results.accessibilityAudits) === null || _377 === void 0 ? void 0 : _377['a11y-tables-lists']['listitem'].description,
                    score: (_378 = results.accessibilityAudits) === null || _378 === void 0 ? void 0 : _378['a11y-tables-lists']['listitem'].score,
                    value: (_379 = results.accessibilityAudits) === null || _379 === void 0 ? void 0 : _379['a11y-tables-lists']['listitem'].rawValue,
                    displayValue: (_380 = results.accessibilityAudits) === null || _380 === void 0 ? void 0 : _380['a11y-tables-lists']['listitem'].displayValue,
                },
                tdHeadersAttr: {
                    title: (_381 = results.accessibilityAudits) === null || _381 === void 0 ? void 0 : _381['a11y-tables-lists']['td-headers-attr'].title,
                    description: (_382 = results.accessibilityAudits) === null || _382 === void 0 ? void 0 : _382['a11y-tables-lists']['td-headers-attr'].description,
                    score: (_383 = results.accessibilityAudits) === null || _383 === void 0 ? void 0 : _383['a11y-tables-lists']['td-headers-attr'].score,
                    value: (_384 = results.accessibilityAudits) === null || _384 === void 0 ? void 0 : _384['a11y-tables-lists']['td-headers-attr'].rawValue,
                    displayValue: (_385 = results.accessibilityAudits) === null || _385 === void 0 ? void 0 : _385['a11y-tables-lists']['td-headers-attr'].displayValue,
                },
                thHasDataCells: {
                    title: (_386 = results.accessibilityAudits) === null || _386 === void 0 ? void 0 : _386['a11y-tables-lists']['th-has-data-cells'].title,
                    description: (_387 = results.accessibilityAudits) === null || _387 === void 0 ? void 0 : _387['a11y-tables-lists']['th-has-data-cells'].description,
                    score: (_388 = results.accessibilityAudits) === null || _388 === void 0 ? void 0 : _388['a11y-tables-lists']['th-has-data-cells'].score,
                    value: (_389 = results.accessibilityAudits) === null || _389 === void 0 ? void 0 : _389['a11y-tables-lists']['th-has-data-cells'].rawValue,
                    displayValue: (_390 = results.accessibilityAudits) === null || _390 === void 0 ? void 0 : _390['a11y-tables-lists']['th-has-data-cells'].displayValue,
                },
            },
            allyBestPractices: {
                duplicateId: {
                    title: (_391 = results.accessibilityAudits) === null || _391 === void 0 ? void 0 : _391['a11y-best-practices']['duplicate-id'].title,
                    description: (_392 = results.accessibilityAudits) === null || _392 === void 0 ? void 0 : _392['a11y-best-practices']['duplicate-id'].description,
                    score: (_393 = results.accessibilityAudits) === null || _393 === void 0 ? void 0 : _393['a11y-best-practices']['duplicate-id'].score,
                    value: (_394 = results.accessibilityAudits) === null || _394 === void 0 ? void 0 : _394['a11y-best-practices']['duplicate-id'].rawValue,
                    displayValue: (_395 = results.accessibilityAudits) === null || _395 === void 0 ? void 0 : _395['a11y-best-practices']['duplicate-id'].displayValue,
                },
                metaRefresh: {
                    title: (_396 = results.accessibilityAudits) === null || _396 === void 0 ? void 0 : _396['a11y-best-practices']['meta-refresh'].title,
                    description: (_397 = results.accessibilityAudits) === null || _397 === void 0 ? void 0 : _397['a11y-best-practices']['meta-refresh'].description,
                    score: (_398 = results.accessibilityAudits) === null || _398 === void 0 ? void 0 : _398['a11y-best-practices']['meta-refresh'].score,
                    value: (_399 = results.accessibilityAudits) === null || _399 === void 0 ? void 0 : _399['a11y-best-practices']['meta-refresh'].rawValue,
                    displayValue: (_400 = results.accessibilityAudits) === null || _400 === void 0 ? void 0 : _400['a11y-best-practices']['meta-refresh'].displayValue,
                },
                metaViewport: {
                    title: (_401 = results.accessibilityAudits) === null || _401 === void 0 ? void 0 : _401['a11y-best-practices']['meta-viewport'].title,
                    description: (_402 = results.accessibilityAudits) === null || _402 === void 0 ? void 0 : _402['a11y-best-practices']['meta-viewport'].description,
                    score: (_403 = results.accessibilityAudits) === null || _403 === void 0 ? void 0 : _403['a11y-best-practices']['meta-viewport'].score,
                    value: (_404 = results.accessibilityAudits) === null || _404 === void 0 ? void 0 : _404['a11y-best-practices']['meta-viewport'].rawValue,
                    displayValue: (_405 = results.accessibilityAudits) === null || _405 === void 0 ? void 0 : _405['a11y-best-practices']['meta-viewport'].displayValue,
                },
            },
            allyLanguage: {
                htmlHasLang: {
                    title: (_406 = results.accessibilityAudits) === null || _406 === void 0 ? void 0 : _406['a11y-language']['html-has-lang'].title,
                    description: (_407 = results.accessibilityAudits) === null || _407 === void 0 ? void 0 : _407['a11y-language']['html-has-lang'].description,
                    score: (_408 = results.accessibilityAudits) === null || _408 === void 0 ? void 0 : _408['a11y-language']['html-has-lang'].score,
                    value: (_409 = results.accessibilityAudits) === null || _409 === void 0 ? void 0 : _409['a11y-language']['html-has-lang'].rawValue,
                    displayValue: (_410 = results.accessibilityAudits) === null || _410 === void 0 ? void 0 : _410['a11y-language']['html-has-lang'].displayValue,
                },
                htmlLangValid: {
                    title: (_411 = results.accessibilityAudits) === null || _411 === void 0 ? void 0 : _411['a11y-language']['html-lang-valid'].title,
                    description: (_412 = results.accessibilityAudits) === null || _412 === void 0 ? void 0 : _412['a11y-language']['html-lang-valid'].description,
                    score: (_413 = results.accessibilityAudits) === null || _413 === void 0 ? void 0 : _413['a11y-language']['html-lang-valid'].score,
                    value: (_414 = results.accessibilityAudits) === null || _414 === void 0 ? void 0 : _414['a11y-language']['html-lang-valid'].rawValue,
                    displayValue: (_415 = results.accessibilityAudits) === null || _415 === void 0 ? void 0 : _415['a11y-language']['html-lang-valid'].displayValue,
                },
                validLang: {
                    title: (_416 = results.accessibilityAudits) === null || _416 === void 0 ? void 0 : _416['a11y-language']['valid-lang'].title,
                    description: (_417 = results.accessibilityAudits) === null || _417 === void 0 ? void 0 : _417['a11y-language']['valid-lang'].description,
                    score: (_418 = results.accessibilityAudits) === null || _418 === void 0 ? void 0 : _418['a11y-language']['valid-lang'].score,
                    value: (_419 = results.accessibilityAudits) === null || _419 === void 0 ? void 0 : _419['a11y-language']['valid-lang'].rawValue,
                    displayValue: (_420 = results.accessibilityAudits) === null || _420 === void 0 ? void 0 : _420['a11y-language']['valid-lang'].displayValue,
                },
            },
            noGroup: {
                logicalTabOrder: {
                    title: (_421 = results.accessibilityAudits) === null || _421 === void 0 ? void 0 : _421.noGroup['logical-tab-order'].title,
                    description: (_422 = results.accessibilityAudits) === null || _422 === void 0 ? void 0 : _422.noGroup['logical-tab-order'].description,
                    score: (_423 = results.accessibilityAudits) === null || _423 === void 0 ? void 0 : _423.noGroup['logical-tab-order'].score,
                    value: (_424 = results.accessibilityAudits) === null || _424 === void 0 ? void 0 : _424.noGroup['logical-tab-order'].rawValue,
                    displayValue: (_425 = results.accessibilityAudits) === null || _425 === void 0 ? void 0 : _425.noGroup['logical-tab-order'].displayValue,
                },
                focusableControls: {
                    title: (_426 = results.accessibilityAudits) === null || _426 === void 0 ? void 0 : _426.noGroup['focusable-controls'].title,
                    description: (_427 = results.accessibilityAudits) === null || _427 === void 0 ? void 0 : _427.noGroup['focusable-controls'].description,
                    score: (_428 = results.accessibilityAudits) === null || _428 === void 0 ? void 0 : _428.noGroup['focusable-controls'].score,
                    value: (_429 = results.accessibilityAudits) === null || _429 === void 0 ? void 0 : _429.noGroup['focusable-controls'].rawValue,
                    displayValue: (_430 = results.accessibilityAudits) === null || _430 === void 0 ? void 0 : _430.noGroup['focusable-controls'].displayValue,
                },
                interactiveElementsAffordance: {
                    title: (_431 = results.accessibilityAudits) === null || _431 === void 0 ? void 0 : _431.noGroup['interactive-element-affordance'].title,
                    description: (_432 = results.accessibilityAudits) === null || _432 === void 0 ? void 0 : _432.noGroup['interactive-element-affordance'].description,
                    score: (_433 = results.accessibilityAudits) === null || _433 === void 0 ? void 0 : _433.noGroup['interactive-element-affordance'].score,
                    value: (_434 = results.accessibilityAudits) === null || _434 === void 0 ? void 0 : _434.noGroup['interactive-element-affordance'].rawValue,
                    displayValue: (_435 = results.accessibilityAudits) === null || _435 === void 0 ? void 0 : _435.noGroup['interactive-element-affordance'].displayValue,
                },
                managedFocus: {
                    title: (_436 = results.accessibilityAudits) === null || _436 === void 0 ? void 0 : _436.noGroup['managed-focus'].title,
                    description: (_437 = results.accessibilityAudits) === null || _437 === void 0 ? void 0 : _437.noGroup['managed-focus'].description,
                    score: (_438 = results.accessibilityAudits) === null || _438 === void 0 ? void 0 : _438.noGroup['managed-focus'].score,
                    value: (_439 = results.accessibilityAudits) === null || _439 === void 0 ? void 0 : _439.noGroup['managed-focus'].rawValue,
                    displayValue: (_440 = results.accessibilityAudits) === null || _440 === void 0 ? void 0 : _440.noGroup['managed-focus'].displayValue,
                },
                focusTraps: {
                    title: (_441 = results.accessibilityAudits) === null || _441 === void 0 ? void 0 : _441.noGroup['focus-traps'].title,
                    description: (_442 = results.accessibilityAudits) === null || _442 === void 0 ? void 0 : _442.noGroup['focus-traps'].description,
                    score: (_443 = results.accessibilityAudits) === null || _443 === void 0 ? void 0 : _443.noGroup['focus-traps'].score,
                    value: (_444 = results.accessibilityAudits) === null || _444 === void 0 ? void 0 : _444.noGroup['focus-traps'].rawValue,
                    displayValue: (_445 = results.accessibilityAudits) === null || _445 === void 0 ? void 0 : _445.noGroup['focus-traps'].displayValue,
                },
                customControlsLabels: {
                    title: (_446 = results.accessibilityAudits) === null || _446 === void 0 ? void 0 : _446.noGroup['custom-controls-labels'].title,
                    description: (_447 = results.accessibilityAudits) === null || _447 === void 0 ? void 0 : _447.noGroup['custom-controls-labels'].description,
                    score: (_448 = results.accessibilityAudits) === null || _448 === void 0 ? void 0 : _448.noGroup['custom-controls-labels'].score,
                    value: (_449 = results.accessibilityAudits) === null || _449 === void 0 ? void 0 : _449.noGroup['custom-controls-labels'].rawValue,
                    displayValue: (_450 = results.accessibilityAudits) === null || _450 === void 0 ? void 0 : _450.noGroup['custom-controls-labels'].displayValue,
                },
                customControlsRoles: {
                    title: (_451 = results.accessibilityAudits) === null || _451 === void 0 ? void 0 : _451.noGroup['custom-controls-roles'].title,
                    description: (_452 = results.accessibilityAudits) === null || _452 === void 0 ? void 0 : _452.noGroup['custom-controls-roles'].description,
                    score: (_453 = results.accessibilityAudits) === null || _453 === void 0 ? void 0 : _453.noGroup['custom-controls-roles'].score,
                    value: (_454 = results.accessibilityAudits) === null || _454 === void 0 ? void 0 : _454.noGroup['custom-controls-roles'].rawValue,
                    displayValue: (_455 = results.accessibilityAudits) === null || _455 === void 0 ? void 0 : _455.noGroup['custom-controls-roles'].displayValue,
                },
                visualOrderFollowsDom: {
                    title: (_456 = results.accessibilityAudits) === null || _456 === void 0 ? void 0 : _456.noGroup['visual-order-follows-dom'].title,
                    description: (_457 = results.accessibilityAudits) === null || _457 === void 0 ? void 0 : _457.noGroup['visual-order-follows-dom'].description,
                    score: (_458 = results.accessibilityAudits) === null || _458 === void 0 ? void 0 : _458.noGroup['visual-order-follows-dom'].score,
                    value: (_459 = results.accessibilityAudits) === null || _459 === void 0 ? void 0 : _459.noGroup['visual-order-follows-dom'].rawValue,
                    displayValue: (_460 = results.accessibilityAudits) === null || _460 === void 0 ? void 0 : _460.noGroup['visual-order-follows-dom'].displayValue,
                },
                offscreenContentHidden: {
                    title: (_461 = results.accessibilityAudits) === null || _461 === void 0 ? void 0 : _461.noGroup['offscreen-content-hidden'].title,
                    description: (_462 = results.accessibilityAudits) === null || _462 === void 0 ? void 0 : _462.noGroup['offscreen-content-hidden'].description,
                    score: (_463 = results.accessibilityAudits) === null || _463 === void 0 ? void 0 : _463.noGroup['offscreen-content-hidden'].score,
                    value: (_464 = results.accessibilityAudits) === null || _464 === void 0 ? void 0 : _464.noGroup['offscreen-content-hidden'].rawValue,
                    displayValue: (_465 = results.accessibilityAudits) === null || _465 === void 0 ? void 0 : _465.noGroup['offscreen-content-hidden'].displayValue,
                },
                headingLevels: {
                    title: (_466 = results.accessibilityAudits) === null || _466 === void 0 ? void 0 : _466.noGroup['heading-levels'].title,
                    description: (_467 = results.accessibilityAudits) === null || _467 === void 0 ? void 0 : _467.noGroup['heading-levels'].description,
                    score: (_468 = results.accessibilityAudits) === null || _468 === void 0 ? void 0 : _468.noGroup['heading-levels'].score,
                    value: (_469 = results.accessibilityAudits) === null || _469 === void 0 ? void 0 : _469.noGroup['heading-levels'].rawValue,
                    displayValue: (_470 = results.accessibilityAudits) === null || _470 === void 0 ? void 0 : _470.noGroup['heading-levels'].displayValue,
                },
                useLandmarks: {
                    title: (_471 = results.accessibilityAudits) === null || _471 === void 0 ? void 0 : _471.noGroup['use-landmarks'].title,
                    description: (_472 = results.accessibilityAudits) === null || _472 === void 0 ? void 0 : _472.noGroup['use-landmarks'].description,
                    score: (_473 = results.accessibilityAudits) === null || _473 === void 0 ? void 0 : _473.noGroup['use-landmarks'].score,
                    value: (_474 = results.accessibilityAudits) === null || _474 === void 0 ? void 0 : _474.noGroup['use-landmarks'].rawValue,
                    displayValue: (_475 = results.accessibilityAudits) === null || _475 === void 0 ? void 0 : _475.noGroup['use-landmarks'].displayValue,
                },
            },
        },
        bestPracticesAudits: {
            noGroup: {
                appcacheManifest: {
                    title: (_476 = results.bestPracticesAudits) === null || _476 === void 0 ? void 0 : _476.noGroup['appcache-manifest'].title,
                    description: (_477 = results.bestPracticesAudits) === null || _477 === void 0 ? void 0 : _477.noGroup['appcache-manifest'].description,
                    score: (_478 = results.bestPracticesAudits) === null || _478 === void 0 ? void 0 : _478.noGroup['appcache-manifest'].score,
                    value: (_479 = results.bestPracticesAudits) === null || _479 === void 0 ? void 0 : _479.noGroup['appcache-manifest'].rawValue,
                    displayValue: (_480 = results.bestPracticesAudits) === null || _480 === void 0 ? void 0 : _480.noGroup['appcache-manifest'].displayValue,
                },
                isOnHttps: {
                    title: (_481 = results.bestPracticesAudits) === null || _481 === void 0 ? void 0 : _481.noGroup['is-on-https'].title,
                    description: (_482 = results.bestPracticesAudits) === null || _482 === void 0 ? void 0 : _482.noGroup['is-on-https'].description,
                    score: (_483 = results.bestPracticesAudits) === null || _483 === void 0 ? void 0 : _483.noGroup['is-on-https'].score,
                    value: (_484 = results.bestPracticesAudits) === null || _484 === void 0 ? void 0 : _484.noGroup['is-on-https'].rawValue,
                    displayValue: (_485 = results.bestPracticesAudits) === null || _485 === void 0 ? void 0 : _485.noGroup['is-on-https'].displayValue,
                },
                usesHttp2: {
                    title: (_486 = results.bestPracticesAudits) === null || _486 === void 0 ? void 0 : _486.noGroup['uses-http2'].title,
                    description: (_487 = results.bestPracticesAudits) === null || _487 === void 0 ? void 0 : _487.noGroup['uses-http2'].description,
                    score: (_488 = results.bestPracticesAudits) === null || _488 === void 0 ? void 0 : _488.noGroup['uses-http2'].score,
                    value: (_489 = results.bestPracticesAudits) === null || _489 === void 0 ? void 0 : _489.noGroup['uses-http2'].rawValue,
                    displayValue: (_490 = results.bestPracticesAudits) === null || _490 === void 0 ? void 0 : _490.noGroup['uses-http2'].displayValue,
                },
                userPassiveEventListeners: {
                    title: (_491 = results.bestPracticesAudits) === null || _491 === void 0 ? void 0 : _491.noGroup['uses-passive-event-listeners'].title,
                    description: (_492 = results.bestPracticesAudits) === null || _492 === void 0 ? void 0 : _492.noGroup['uses-passive-event-listeners'].description,
                    score: (_493 = results.bestPracticesAudits) === null || _493 === void 0 ? void 0 : _493.noGroup['uses-passive-event-listeners'].score,
                    value: (_494 = results.bestPracticesAudits) === null || _494 === void 0 ? void 0 : _494.noGroup['uses-passive-event-listeners'].rawValue,
                    displayValue: (_495 = results.bestPracticesAudits) === null || _495 === void 0 ? void 0 : _495.noGroup['uses-passive-event-listeners'].displayValue,
                },
                noDocumentWrite: {
                    title: (_496 = results.bestPracticesAudits) === null || _496 === void 0 ? void 0 : _496.noGroup['no-document-write'].title,
                    description: (_497 = results.bestPracticesAudits) === null || _497 === void 0 ? void 0 : _497.noGroup['no-document-write'].description,
                    score: (_498 = results.bestPracticesAudits) === null || _498 === void 0 ? void 0 : _498.noGroup['no-document-write'].score,
                    value: (_499 = results.bestPracticesAudits) === null || _499 === void 0 ? void 0 : _499.noGroup['no-document-write'].rawValue,
                    displayValue: (_500 = results.bestPracticesAudits) === null || _500 === void 0 ? void 0 : _500.noGroup['no-document-write'].displayValue,
                },
                externalAnchorsUseRelNoopener: {
                    title: (_501 = results.bestPracticesAudits) === null || _501 === void 0 ? void 0 : _501.noGroup['external-anchors-use-rel-noopener'].title,
                    description: (_502 = results.bestPracticesAudits) === null || _502 === void 0 ? void 0 : _502.noGroup['external-anchors-use-rel-noopener'].description,
                    score: (_503 = results.bestPracticesAudits) === null || _503 === void 0 ? void 0 : _503.noGroup['external-anchors-use-rel-noopener'].score,
                    value: (_504 = results.bestPracticesAudits) === null || _504 === void 0 ? void 0 : _504.noGroup['external-anchors-use-rel-noopener'].rawValue,
                    displayValue: (_505 = results.bestPracticesAudits) === null || _505 === void 0 ? void 0 : _505.noGroup['external-anchors-use-rel-noopener'].displayValue,
                },
                geolocationOnStart: {
                    title: (_506 = results.bestPracticesAudits) === null || _506 === void 0 ? void 0 : _506.noGroup['geolocation-on-start'].title,
                    description: (_507 = results.bestPracticesAudits) === null || _507 === void 0 ? void 0 : _507.noGroup['geolocation-on-start'].description,
                    score: (_508 = results.bestPracticesAudits) === null || _508 === void 0 ? void 0 : _508.noGroup['geolocation-on-start'].score,
                    value: (_509 = results.bestPracticesAudits) === null || _509 === void 0 ? void 0 : _509.noGroup['geolocation-on-start'].rawValue,
                    displayValue: (_510 = results.bestPracticesAudits) === null || _510 === void 0 ? void 0 : _510.noGroup['geolocation-on-start'].displayValue,
                },
                doctype: {
                    title: (_511 = results.bestPracticesAudits) === null || _511 === void 0 ? void 0 : _511.noGroup['doctype'].title,
                    description: (_512 = results.bestPracticesAudits) === null || _512 === void 0 ? void 0 : _512.noGroup['doctype'].description,
                    score: (_513 = results.bestPracticesAudits) === null || _513 === void 0 ? void 0 : _513.noGroup['doctype'].score,
                    value: (_514 = results.bestPracticesAudits) === null || _514 === void 0 ? void 0 : _514.noGroup['doctype'].rawValue,
                    displayValue: (_515 = results.bestPracticesAudits) === null || _515 === void 0 ? void 0 : _515.noGroup['doctype'].displayValue,
                },
                noVulnerableLibraries: {
                    title: (_516 = results.bestPracticesAudits) === null || _516 === void 0 ? void 0 : _516.noGroup['no-vulnerable-libraries'].title,
                    description: (_517 = results.bestPracticesAudits) === null || _517 === void 0 ? void 0 : _517.noGroup['no-vulnerable-libraries'].description,
                    score: (_518 = results.bestPracticesAudits) === null || _518 === void 0 ? void 0 : _518.noGroup['no-vulnerable-libraries'].score,
                    value: (_519 = results.bestPracticesAudits) === null || _519 === void 0 ? void 0 : _519.noGroup['no-vulnerable-libraries'].rawValue,
                    displayValue: (_520 = results.bestPracticesAudits) === null || _520 === void 0 ? void 0 : _520.noGroup['no-vulnerable-libraries'].displayValue,
                },
                jsLibraries: {
                    title: (_521 = results.bestPracticesAudits) === null || _521 === void 0 ? void 0 : _521.noGroup['js-libraries'].title,
                    description: (_522 = results.bestPracticesAudits) === null || _522 === void 0 ? void 0 : _522.noGroup['js-libraries'].description,
                    score: (_523 = results.bestPracticesAudits) === null || _523 === void 0 ? void 0 : _523.noGroup['js-libraries'].score,
                    value: (_524 = results.bestPracticesAudits) === null || _524 === void 0 ? void 0 : _524.noGroup['js-libraries'].rawValue,
                    displayValue: (_525 = results.bestPracticesAudits) === null || _525 === void 0 ? void 0 : _525.noGroup['js-libraries'].displayValue,
                },
                notificationsOnSart: {
                    title: (_526 = results.bestPracticesAudits) === null || _526 === void 0 ? void 0 : _526.noGroup['notification-on-start'].title,
                    description: (_527 = results.bestPracticesAudits) === null || _527 === void 0 ? void 0 : _527.noGroup['notification-on-start'].description,
                    score: (_528 = results.bestPracticesAudits) === null || _528 === void 0 ? void 0 : _528.noGroup['notification-on-start'].score,
                    value: (_529 = results.bestPracticesAudits) === null || _529 === void 0 ? void 0 : _529.noGroup['notification-on-start'].rawValue,
                    displayValue: (_530 = results.bestPracticesAudits) === null || _530 === void 0 ? void 0 : _530.noGroup['notification-on-start'].displayValue,
                },
                deprecations: {
                    title: (_531 = results.bestPracticesAudits) === null || _531 === void 0 ? void 0 : _531.noGroup['deprecations'].title,
                    description: (_532 = results.bestPracticesAudits) === null || _532 === void 0 ? void 0 : _532.noGroup['deprecations'].description,
                    score: (_533 = results.bestPracticesAudits) === null || _533 === void 0 ? void 0 : _533.noGroup['deprecations'].score,
                    value: (_534 = results.bestPracticesAudits) === null || _534 === void 0 ? void 0 : _534.noGroup['deprecations'].rawValue,
                    displayValue: (_535 = results.bestPracticesAudits) === null || _535 === void 0 ? void 0 : _535.noGroup['deprecations'].displayValue,
                },
                passwordInputsCanBePastedInto: {
                    title: (_536 = results.bestPracticesAudits) === null || _536 === void 0 ? void 0 : _536.noGroup['password-inputs-can-be-pasted-into'].title,
                    description: (_537 = results.bestPracticesAudits) === null || _537 === void 0 ? void 0 : _537.noGroup['password-inputs-can-be-pasted-into'].description,
                    score: (_538 = results.bestPracticesAudits) === null || _538 === void 0 ? void 0 : _538.noGroup['password-inputs-can-be-pasted-into'].score,
                    value: (_539 = results.bestPracticesAudits) === null || _539 === void 0 ? void 0 : _539.noGroup['password-inputs-can-be-pasted-into'].rawValue,
                    displayValue: (_540 = results.bestPracticesAudits) === null || _540 === void 0 ? void 0 : _540.noGroup['password-inputs-can-be-pasted-into'].displayValue,
                },
                errorsInConsole: {
                    title: (_541 = results.bestPracticesAudits) === null || _541 === void 0 ? void 0 : _541.noGroup['errors-in-console'].title,
                    description: (_542 = results.bestPracticesAudits) === null || _542 === void 0 ? void 0 : _542.noGroup['errors-in-console'].description,
                    score: (_543 = results.bestPracticesAudits) === null || _543 === void 0 ? void 0 : _543.noGroup['errors-in-console'].score,
                    value: (_544 = results.bestPracticesAudits) === null || _544 === void 0 ? void 0 : _544.noGroup['errors-in-console'].rawValue,
                    displayValue: (_545 = results.bestPracticesAudits) === null || _545 === void 0 ? void 0 : _545.noGroup['errors-in-console'].displayValue,
                },
                imageAspectRatio: {
                    title: (_546 = results.bestPracticesAudits) === null || _546 === void 0 ? void 0 : _546.noGroup['image-aspect-ratio'].title,
                    description: (_547 = results.bestPracticesAudits) === null || _547 === void 0 ? void 0 : _547.noGroup['image-aspect-ratio'].description,
                    score: (_548 = results.bestPracticesAudits) === null || _548 === void 0 ? void 0 : _548.noGroup['image-aspect-ratio'].score,
                    value: (_549 = results.bestPracticesAudits) === null || _549 === void 0 ? void 0 : _549.noGroup['image-aspect-ratio'].rawValue,
                    displayValue: (_550 = results.bestPracticesAudits) === null || _550 === void 0 ? void 0 : _550.noGroup['image-aspect-ratio'].displayValue,
                },
            },
        },
    };
    return returnResults;
};
const getAuditResultsFromCategory = (category, fullResults, categoryName) => {
    let responseCategory = {};
    for (const auditGroup in category) {
        for (const auditItem of category[auditGroup]) {
            try {
                responseCategory = { [categoryName]: { [auditGroup]: { [auditItem]: {} } }, ...responseCategory };
                responseCategory[categoryName][auditGroup] = { ...responseCategory[categoryName][auditGroup] };
                responseCategory[categoryName][auditGroup][auditItem] = {};
                responseCategory[categoryName][auditGroup][auditItem].title = fullResults.audits[auditItem].title || '';
                responseCategory[categoryName][auditGroup][auditItem].description = fullResults.audits[auditItem].description || '';
                responseCategory[categoryName][auditGroup][auditItem].score = fullResults.audits[auditItem].score || '';
                responseCategory[categoryName][auditGroup][auditItem].rawValue = fullResults.audits[auditItem].rawValue || 0;
                responseCategory[categoryName][auditGroup][auditItem].displayValue = fullResults.audits[auditItem].displayValue || '';
            }
            catch (err) {
                console.log('Error ', err);
            }
        }
    }
    return responseCategory;
};
const saveLighthouseScores = async (results, siteData, timeCreated, siteName, pageType, URL) => {
    try {
        const lighthouseScores = new LighthouseScores_1.default({
            siteID: siteData._id,
            created: timeCreated,
            siteName: siteName,
            pageType: pageType,
            url: URL,
            scores: {
                performance: results.scores.performance,
                bestPractice: results.scores.bestPractice,
                accessibility: results.scores.accessibility,
                seo: results.scores.seo,
            },
            metrics: {
                firstContentfulPaint: {
                    score: results.performanceAudits.metrics.firstContentfulPaint.score,
                    value: results.performanceAudits.metrics.firstContentfulPaint.value,
                },
                firstMeaningfulPaint: {
                    score: results.performanceAudits.metrics.firstMeaningfulPaint.score,
                    value: results.performanceAudits.metrics.firstMeaningfulPaint.value,
                },
                speedIndex: {
                    score: results.performanceAudits.metrics.speedIndex.score,
                    value: results.performanceAudits.metrics.speedIndex.value,
                },
                interactive: {
                    score: results.performanceAudits.metrics.interactive.score,
                    value: results.performanceAudits.metrics.interactive.value,
                },
                firstCPUIdle: {
                    score: results.performanceAudits.metrics.firstCpuIdle.score,
                    value: results.performanceAudits.metrics.firstCpuIdle.value,
                },
                maxPotentialFid: {
                    score: results.performanceAudits.metrics.maxPotentialFid.score,
                    value: results.performanceAudits.metrics.maxPotentialFid.value,
                },
            },
        });
        await lighthouseScores.save();
        siteData[`${pageType}URLLighthouseScores`].push(lighthouseScores);
        await siteData.save();
        console.log(`Saved ${siteName}'s ${pageType} lighthouse scores to the database!`);
        return;
    }
    catch (err) {
        console.log('Error saving scores: ', err);
        return err;
    }
};
const saveLighthouseDetails = async (results, siteData, timeCreated, siteName, pageType, URL) => {
    try {
        let queryParam = { siteName: siteName, pageType: pageType };
        const lighthouseDetailsContent = {
            siteID: siteData._id,
            created: timeCreated,
            siteName: siteName,
            pageType: pageType,
            url: URL,
            performanceAudits: results.performanceAudits,
            seoAudits: results.seoAudits,
            accessibilityAudits: results.accessibilityAudits,
            bestPracticesAudits: results.bestPracticesAudits,
        };
        const existingDetails = await LighthouseAuditDetails_1.default.findOne(queryParam);
        if (existingDetails) {
            await existingDetails.update({ ...lighthouseDetailsContent });
            console.log(`Updated ${siteName}'s ${pageType} lighthouse details to the database!`);
        }
        else {
            const lighthouseDetails = new LighthouseAuditDetails_1.default(lighthouseDetailsContent);
            await lighthouseDetails.save();
            siteData[`${pageType}URLLighthouseAuditDetails`].push(lighthouseDetails);
            await siteData.save();
            console.log(`Saved ${siteName}'s ${pageType} lighthouse details to the database!`);
        }
        return;
    }
    catch (err) {
        return err;
    }
};
//# sourceMappingURL=lighthouseController.js.map