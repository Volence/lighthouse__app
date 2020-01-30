"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const LighthouseScores = mongoose.model('LighthouseScores');
const LighthouseAuditDetails = mongoose.model('LighthouseAuditDetails');
const consoleErrorController = require('../controllers/consoleErrorController');
const utils = require('../utils/utils');
const Site = mongoose.model('Site');
const moment = require('moment');
const runAudits = async () => {
    try {
        await consoleErrorController.runAllAudits();
        const sites = await Site.find();
        const runEachSite = async ([siteData, ...sites]) => {
            if (siteData === undefined)
                return;
            try {
                await runLighthouseAndSaveToDatabase(siteData, siteData.siteName);
            }
            catch (err) {
                console.log(err);
            }
            console.log(`---LIGHTHOUSE: ${sites.indexOf(siteData) + 1} out of ${sites.length} sites complete`);
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
        const siteData = await Site.findOne(queryParam);
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
const launchChromeAndRunLighthouse = async (url, flags = { chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'], port: 3000 }, config = null) => {
    try {
        const chrome = await chromeLauncher.launch(flags);
        flags.port = chrome.port;
        let results = await lighthouse(url, flags, config);
        await chrome.kill();
        return results;
    }
    catch (err) {
        return err;
    }
};
const formatResults = (results) => {
    const { categories: { performance: { score: performanceScore }, seo: { score: seoScore }, accessibility: { score: accessibilityScore }, 'best-practices': { score: bestPracticesScore } } } = results;
    const resultsFormatted = formatAuditResults(formatListOfAudits(results), results);
    return { ...resultsFormatted, scores: { performance: performanceScore, bestPractice: bestPracticesScore, accessibility: accessibilityScore, seo: seoScore } };
};
const formatListOfAudits = (results) => {
    resultsFormatted.performanceAudits = { ...getAuditList(results.categories.performance.auditRefs) };
    resultsFormatted.seoAudits = { ...getAuditList(results.categories.seo.auditRefs) };
    resultsFormatted.accessibilityAudits = { ...getAuditList(results.categories.accessibility.auditRefs) };
    resultsFormatted.bestPracticesAudits = { ...getAuditList(results.categories["best-practices"].auditRefs) };
    return resultsFormatted;
};
const getAuditList = (arrayOfAuditDescriptions) => {
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
    let results = {};
    results = {
        ...getAuditResultsFromCategory(formattedResults.performanceAudits, fullResults, 'performanceAudits'),
        ...getAuditResultsFromCategory(formattedResults.seoAudits, fullResults, 'seoAudits'),
        ...getAuditResultsFromCategory(formattedResults.accessibilityAudits, fullResults, 'accessibilityAudits'),
        ...getAuditResultsFromCategory(formattedResults.bestPracticesAudits, fullResults, 'bestPracticesAudits')
    };
    results = {
        performanceAudits: {
            metrics: {
                firstContentfulPaint: {
                    title: results.performanceAudits.metrics['first-contentful-paint'].title,
                    description: results.performanceAudits.metrics['first-contentful-paint'].description,
                    score: results.performanceAudits.metrics['first-contentful-paint'].score,
                    value: results.performanceAudits.metrics['first-contentful-paint'].rawValue,
                    displayValue: results.performanceAudits.metrics['first-contentful-paint'].displayValue
                },
                firstMeaningfulPaint: {
                    title: results.performanceAudits.metrics['first-meaningful-paint'].title,
                    description: results.performanceAudits.metrics['first-meaningful-paint'].description,
                    score: results.performanceAudits.metrics['first-meaningful-paint'].score,
                    value: results.performanceAudits.metrics['first-meaningful-paint'].rawValue,
                    displayValue: results.performanceAudits.metrics['first-meaningful-paint'].displayValue
                },
                speedIndex: {
                    title: results.performanceAudits.metrics['speed-index'].title,
                    description: results.performanceAudits.metrics['speed-index'].description,
                    score: results.performanceAudits.metrics['speed-index'].score,
                    value: results.performanceAudits.metrics['speed-index'].rawValue,
                    displayValue: results.performanceAudits.metrics['speed-index'].displayValue
                },
                interactive: {
                    title: results.performanceAudits.metrics.interactive.title,
                    description: results.performanceAudits.metrics.interactive.description,
                    score: results.performanceAudits.metrics.interactive.score,
                    value: results.performanceAudits.metrics.interactive.rawValue,
                    displayValue: results.performanceAudits.metrics.interactive.displayValue
                },
                firstCpuIdle: {
                    title: results.performanceAudits.metrics['first-cpu-idle'].title,
                    description: results.performanceAudits.metrics['first-cpu-idle'].description,
                    score: results.performanceAudits.metrics['first-cpu-idle'].score,
                    value: results.performanceAudits.metrics['first-cpu-idle'].rawValue,
                    displayValue: results.performanceAudits.metrics['first-cpu-idle'].displayValue
                },
                estimatedInputLatency: {
                    title: results.performanceAudits.metrics['estimated-input-latency'].title,
                    description: results.performanceAudits.metrics['estimated-input-latency'].description,
                    score: results.performanceAudits.metrics['estimated-input-latency'].score,
                    value: results.performanceAudits.metrics['estimated-input-latency'].rawValue,
                    displayValue: results.performanceAudits.metrics['estimated-input-latency'].displayValue
                },
            },
            noGroup: {
                maxPotentialFid: {
                    title: results.performanceAudits.noGroup['max-potential-fid'].title,
                    description: results.performanceAudits.noGroup['max-potential-fid'].description,
                    score: results.performanceAudits.noGroup['max-potential-fid'].score,
                    value: results.performanceAudits.noGroup['max-potential-fid'].rawValue,
                    displayValue: results.performanceAudits.noGroup['max-potential-fid'].displayValue
                },
                networkRequests: {
                    title: results.performanceAudits.noGroup['network-requests'].title,
                    description: results.performanceAudits.noGroup['network-requests'].description,
                    score: results.performanceAudits.noGroup['network-requests'].score,
                    value: results.performanceAudits.noGroup['network-requests'].rawValue,
                    displayValue: results.performanceAudits.noGroup['network-requests'].displayValue
                },
                networkRtt: {
                    title: results.performanceAudits.noGroup['network-rtt'].title,
                    description: results.performanceAudits.noGroup['network-rtt'].description,
                    score: results.performanceAudits.noGroup['network-rtt'].score,
                    value: results.performanceAudits.noGroup['network-rtt'].rawValue,
                    displayValue: results.performanceAudits.noGroup['network-rtt'].displayValue
                },
                networkServerLatency: {
                    title: results.performanceAudits.noGroup['network-server-latency'].title,
                    description: results.performanceAudits.noGroup['network-server-latency'].description,
                    score: results.performanceAudits.noGroup['network-server-latency'].score,
                    value: results.performanceAudits.noGroup['network-server-latency'].rawValue,
                    displayValue: results.performanceAudits.noGroup['network-server-latency'].displayValue
                },
                mainThreadTasks: {
                    title: results.performanceAudits.noGroup['main-thread-tasks'].title,
                    description: results.performanceAudits.noGroup['main-thread-tasks'].description,
                    score: results.performanceAudits.noGroup['main-thread-tasks'].score,
                    value: results.performanceAudits.noGroup['main-thread-tasks'].rawValue,
                    displayValue: results.performanceAudits.noGroup['main-thread-tasks'].displayValue
                },
                diagnostics: {
                    title: results.performanceAudits.noGroup.diagnostics.title,
                    description: results.performanceAudits.noGroup.diagnostics.description,
                    score: results.performanceAudits.noGroup.diagnostics.score,
                    value: results.performanceAudits.noGroup.diagnostics.rawValue,
                    displayValue: results.performanceAudits.noGroup.diagnostics.displayValue
                },
                metrics: {
                    title: results.performanceAudits.noGroup.metrics.title,
                    description: results.performanceAudits.noGroup.metrics.description,
                    score: results.performanceAudits.noGroup.metrics.score,
                    value: results.performanceAudits.noGroup.metrics.rawValue,
                    displayValue: results.performanceAudits.noGroup.metrics.displayValue
                },
                screenshotThumbnails: {
                    title: results.performanceAudits.noGroup['screenshot-thumbnails'].title,
                    description: results.performanceAudits.noGroup['screenshot-thumbnails'].description,
                    score: results.performanceAudits.noGroup['screenshot-thumbnails'].score,
                    value: results.performanceAudits.noGroup['screenshot-thumbnails'].rawValue,
                    displayValue: results.performanceAudits.noGroup['screenshot-thumbnails'].displayValue
                },
                finalScreenshot: {
                    title: results.performanceAudits.noGroup['final-screenshot'].title,
                    description: results.performanceAudits.noGroup['final-screenshot'].description,
                    score: results.performanceAudits.noGroup['final-screenshot'].score,
                    value: results.performanceAudits.noGroup['final-screenshot'].rawValue,
                    displayValue: results.performanceAudits.noGroup['final-screenshot'].displayValue
                },
            },
            loadOpportunities: {
                renderBlockingResources: {
                    title: results.performanceAudits['load-opportunities']['render-blocking-resources'].title,
                    description: results.performanceAudits['load-opportunities']['render-blocking-resources'].description,
                    score: results.performanceAudits['load-opportunities']['render-blocking-resources'].score,
                    value: results.performanceAudits['load-opportunities']['render-blocking-resources'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['render-blocking-resources'].displayValue
                },
                usesResponsiveImages: {
                    title: results.performanceAudits['load-opportunities']['uses-responsive-images'].title,
                    description: results.performanceAudits['load-opportunities']['uses-responsive-images'].description,
                    score: results.performanceAudits['load-opportunities']['uses-responsive-images'].score,
                    value: results.performanceAudits['load-opportunities']['uses-responsive-images'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-responsive-images'].displayValue
                },
                offscreenImages: {
                    title: results.performanceAudits['load-opportunities']['offscreen-images'].title,
                    description: results.performanceAudits['load-opportunities']['offscreen-images'].description,
                    score: results.performanceAudits['load-opportunities']['offscreen-images'].score,
                    value: results.performanceAudits['load-opportunities']['offscreen-images'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['offscreen-images'].displayValue
                },
                unminifiedCss: {
                    title: results.performanceAudits['load-opportunities']['unminified-css'].title,
                    description: results.performanceAudits['load-opportunities']['unminified-css'].description,
                    score: results.performanceAudits['load-opportunities']['unminified-css'].score,
                    value: results.performanceAudits['load-opportunities']['unminified-css'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['unminified-css'].displayValue
                },
                unminifiedJavascript: {
                    title: results.performanceAudits['load-opportunities']['unminified-javascript'].title,
                    description: results.performanceAudits['load-opportunities']['unminified-javascript'].description,
                    score: results.performanceAudits['load-opportunities']['unminified-javascript'].score,
                    value: results.performanceAudits['load-opportunities']['unminified-javascript'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['unminified-javascript'].displayValue
                },
                unusedCssRules: {
                    title: results.performanceAudits['load-opportunities']['unused-css-rules'].title,
                    description: results.performanceAudits['load-opportunities']['unused-css-rules'].description,
                    score: results.performanceAudits['load-opportunities']['unused-css-rules'].score,
                    value: results.performanceAudits['load-opportunities']['unused-css-rules'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['unused-css-rules'].displayValue
                },
                usesOptimizedImages: {
                    title: results.performanceAudits['load-opportunities']['uses-optimized-images'].title,
                    description: results.performanceAudits['load-opportunities']['uses-optimized-images'].description,
                    score: results.performanceAudits['load-opportunities']['uses-optimized-images'].score,
                    value: results.performanceAudits['load-opportunities']['uses-optimized-images'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-optimized-images'].displayValue
                },
                usesWebpImages: {
                    title: results.performanceAudits['load-opportunities']['uses-webp-images'].title,
                    description: results.performanceAudits['load-opportunities']['uses-webp-images'].description,
                    score: results.performanceAudits['load-opportunities']['uses-webp-images'].score,
                    value: results.performanceAudits['load-opportunities']['uses-webp-images'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-webp-images'].displayValue
                },
                usesTextCompression: {
                    title: results.performanceAudits['load-opportunities']['uses-text-compression'].title,
                    description: results.performanceAudits['load-opportunities']['uses-text-compression'].description,
                    score: results.performanceAudits['load-opportunities']['uses-text-compression'].score,
                    value: results.performanceAudits['load-opportunities']['uses-text-compression'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-text-compression'].displayValue
                },
                usesRelPreconnect: {
                    title: results.performanceAudits['load-opportunities']['uses-rel-preconnect'].title,
                    description: results.performanceAudits['load-opportunities']['uses-rel-preconnect'].description,
                    score: results.performanceAudits['load-opportunities']['uses-rel-preconnect'].score,
                    value: results.performanceAudits['load-opportunities']['uses-rel-preconnect'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-rel-preconnect'].displayValue
                },
                timeToFirstByte: {
                    title: results.performanceAudits['load-opportunities']['time-to-first-byte'].title,
                    description: results.performanceAudits['load-opportunities']['time-to-first-byte'].description,
                    score: results.performanceAudits['load-opportunities']['time-to-first-byte'].score,
                    value: results.performanceAudits['load-opportunities']['time-to-first-byte'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['time-to-first-byte'].displayValue
                },
                redirects: {
                    title: results.performanceAudits['load-opportunities'].redirects.title,
                    description: results.performanceAudits['load-opportunities'].redirects.description,
                    score: results.performanceAudits['load-opportunities'].redirects.score,
                    value: results.performanceAudits['load-opportunities'].redirects.rawValue,
                    displayValue: results.performanceAudits['load-opportunities'].redirects.displayValue
                },
                usesRelPreload: {
                    title: results.performanceAudits['load-opportunities']['uses-rel-preload'].title,
                    description: results.performanceAudits['load-opportunities']['uses-rel-preload'].description,
                    score: results.performanceAudits['load-opportunities']['uses-rel-preload'].score,
                    value: results.performanceAudits['load-opportunities']['uses-rel-preload'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['uses-rel-preload'].displayValue
                },
                efficientAnimatedContent: {
                    title: results.performanceAudits['load-opportunities']['efficient-animated-content'].title,
                    description: results.performanceAudits['load-opportunities']['efficient-animated-content'].description,
                    score: results.performanceAudits['load-opportunities']['efficient-animated-content'].score,
                    value: results.performanceAudits['load-opportunities']['efficient-animated-content'].rawValue,
                    displayValue: results.performanceAudits['load-opportunities']['efficient-animated-content'].displayValue
                },
            },
            diagnostics: {
                totalByteWeight: {
                    title: results.performanceAudits.diagnostics['total-byte-weight'].title,
                    description: results.performanceAudits.diagnostics['total-byte-weight'].description,
                    score: results.performanceAudits.diagnostics['total-byte-weight'].score,
                    value: results.performanceAudits.diagnostics['total-byte-weight'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['total-byte-weight'].displayValue
                },
                usesLongCacheTtl: {
                    title: results.performanceAudits.diagnostics['uses-long-cache-ttl'].title,
                    description: results.performanceAudits.diagnostics['uses-long-cache-ttl'].description,
                    score: results.performanceAudits.diagnostics['uses-long-cache-ttl'].score,
                    value: results.performanceAudits.diagnostics['uses-long-cache-ttl'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['uses-long-cache-ttl'].displayValue
                },
                domSize: {
                    title: results.performanceAudits.diagnostics['dom-size'].title,
                    description: results.performanceAudits.diagnostics['dom-size'].description,
                    score: results.performanceAudits.diagnostics['dom-size'].score,
                    value: results.performanceAudits.diagnostics['dom-size'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['dom-size'].displayValue
                },
                criticalRequestChains: {
                    title: results.performanceAudits.diagnostics['critical-request-chains'].title,
                    description: results.performanceAudits.diagnostics['critical-request-chains'].description,
                    score: results.performanceAudits.diagnostics['critical-request-chains'].score,
                    value: results.performanceAudits.diagnostics['critical-request-chains'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['critical-request-chains'].displayValue
                },
                userTimings: {
                    title: results.performanceAudits.diagnostics['user-timings'].title,
                    description: results.performanceAudits.diagnostics['user-timings'].description,
                    score: results.performanceAudits.diagnostics['user-timings'].score,
                    value: results.performanceAudits.diagnostics['user-timings'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['user-timings'].displayValue
                },
                bootupTime: {
                    title: results.performanceAudits.diagnostics['bootup-time'].title,
                    description: results.performanceAudits.diagnostics['bootup-time'].description,
                    score: results.performanceAudits.diagnostics['bootup-time'].score,
                    value: results.performanceAudits.diagnostics['bootup-time'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['bootup-time'].displayValue
                },
                mainthreadWorkBreakdown: {
                    title: results.performanceAudits.diagnostics['mainthread-work-breakdown'].title,
                    description: results.performanceAudits.diagnostics['mainthread-work-breakdown'].description,
                    score: results.performanceAudits.diagnostics['mainthread-work-breakdown'].score,
                    value: results.performanceAudits.diagnostics['mainthread-work-breakdown'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['mainthread-work-breakdown'].displayValue
                },
                fontDisplay: {
                    title: results.performanceAudits.diagnostics['font-display'].title,
                    description: results.performanceAudits.diagnostics['font-display'].description,
                    score: results.performanceAudits.diagnostics['font-display'].score,
                    value: results.performanceAudits.diagnostics['font-display'].rawValue,
                    displayValue: results.performanceAudits.diagnostics['font-display'].displayValue
                },
            }
        },
        seoAudits: {
            seoMobile: {
                viewport: {
                    title: results.seoAudits['seo-mobile'].viewport.title,
                    description: results.seoAudits['seo-mobile'].viewport.description,
                    score: results.seoAudits['seo-mobile'].viewport.score,
                    value: results.seoAudits['seo-mobile'].viewport.rawValue,
                    displayValue: results.seoAudits['seo-mobile'].viewport.displayValue
                },
                fontSize: {
                    title: results.seoAudits['seo-mobile']['font-size'].title,
                    description: results.seoAudits['seo-mobile']['font-size'].description,
                    score: results.seoAudits['seo-mobile']['font-size'].score,
                    value: results.seoAudits['seo-mobile']['font-size'].rawValue,
                    displayValue: results.seoAudits['seo-mobile']['font-size'].displayValue
                },
                tapTargets: {
                    title: results.seoAudits['seo-mobile']['tap-targets'].title,
                    description: results.seoAudits['seo-mobile']['tap-targets'].description,
                    score: results.seoAudits['seo-mobile']['tap-targets'].score,
                    value: results.seoAudits['seo-mobile']['tap-targets'].rawValue,
                    displayValue: results.seoAudits['seo-mobile']['tap-targets'].displayValue
                },
            },
            seoContent: {
                documentTitle: {
                    title: results.seoAudits['seo-content']['document-title'].title,
                    description: results.seoAudits['seo-content']['document-title'].description,
                    score: results.seoAudits['seo-content']['document-title'].score,
                    value: results.seoAudits['seo-content']['document-title'].rawValue,
                    displayValue: results.seoAudits['seo-content']['document-title'].displayValue
                },
                metaDescription: {
                    title: results.seoAudits['seo-content']['meta-description'].title,
                    description: results.seoAudits['seo-content']['meta-description'].description,
                    score: results.seoAudits['seo-content']['meta-description'].score,
                    value: results.seoAudits['seo-content']['meta-description'].rawValue,
                    displayValue: results.seoAudits['seo-content']['meta-description'].displayValue
                },
                linkText: {
                    title: results.seoAudits['seo-content']['link-text'].title,
                    description: results.seoAudits['seo-content']['link-text'].description,
                    score: results.seoAudits['seo-content']['link-text'].score,
                    value: results.seoAudits['seo-content']['link-text'].rawValue,
                    displayValue: results.seoAudits['seo-content']['link-text'].displayValue
                },
                hreflang: {
                    title: results.seoAudits['seo-content'].hreflang.title,
                    description: results.seoAudits['seo-content'].hreflang.description,
                    score: results.seoAudits['seo-content'].hreflang.score,
                    value: results.seoAudits['seo-content'].hreflang.rawValue,
                    displayValue: results.seoAudits['seo-content'].hreflang.displayValue
                },
                canonical: {
                    title: results.seoAudits['seo-content'].canonical.title,
                    description: results.seoAudits['seo-content'].canonical.description,
                    score: results.seoAudits['seo-content'].canonical.score,
                    value: results.seoAudits['seo-content'].canonical.rawValue,
                    displayValue: results.seoAudits['seo-content'].canonical.displayValue
                },
                plugins: {
                    title: results.seoAudits['seo-content'].plugins.title,
                    description: results.seoAudits['seo-content'].plugins.description,
                    score: results.seoAudits['seo-content'].plugins.score,
                    value: results.seoAudits['seo-content'].plugins.rawValue,
                    displayValue: results.seoAudits['seo-content'].plugins.displayValue
                },
            },
            seoCrawl: {
                httpStatusCode: {
                    title: results.seoAudits['seo-crawl']['http-status-code'].title,
                    description: results.seoAudits['seo-crawl']['http-status-code'].description,
                    score: results.seoAudits['seo-crawl']['http-status-code'].score,
                    value: results.seoAudits['seo-crawl']['http-status-code'].rawValue,
                    displayValue: results.seoAudits['seo-crawl']['http-status-code'].displayValue
                },
                isCrawlable: {
                    title: results.seoAudits['seo-crawl']['is-crawlable'].title,
                    description: results.seoAudits['seo-crawl']['is-crawlable'].description,
                    score: results.seoAudits['seo-crawl']['is-crawlable'].score,
                    value: results.seoAudits['seo-crawl']['is-crawlable'].rawValue,
                    displayValue: results.seoAudits['seo-crawl']['is-crawlable'].displayValue
                },
                robotsTxt: {
                    title: results.seoAudits['seo-crawl']['robots-txt'].title,
                    description: results.seoAudits['seo-crawl']['robots-txt'].description,
                    score: results.seoAudits['seo-crawl']['robots-txt'].score,
                    value: results.seoAudits['seo-crawl']['robots-txt'].rawValue,
                    displayValue: results.seoAudits['seo-crawl']['robots-txt'].displayValue
                },
            },
            noGroup: {
                structuredData: {
                    title: results.seoAudits.noGroup['structured-data'].title,
                    description: results.seoAudits.noGroup['structured-data'].description,
                    score: results.seoAudits.noGroup['structured-data'].score,
                    value: results.seoAudits.noGroup['structured-data'].rawValue,
                    displayValue: results.seoAudits.noGroup['structured-data'].displayValue
                },
            },
        },
        accessibilityAudits: {
            allyNavigation: {
                accesskeys: {
                    title: results.accessibilityAudits['a11y-navigation'].accesskeys.title,
                    description: results.accessibilityAudits['a11y-navigation'].accesskeys.description,
                    score: results.accessibilityAudits['a11y-navigation'].accesskeys.score,
                    value: results.accessibilityAudits['a11y-navigation'].accesskeys.rawValue,
                    displayValue: results.accessibilityAudits['a11y-navigation'].accesskeys.displayValue
                },
                bypass: {
                    title: results.accessibilityAudits['a11y-navigation'].bypass.title,
                    description: results.accessibilityAudits['a11y-navigation'].bypass.description,
                    score: results.accessibilityAudits['a11y-navigation'].bypass.score,
                    value: results.accessibilityAudits['a11y-navigation'].bypass.rawValue,
                    displayValue: results.accessibilityAudits['a11y-navigation'].bypass.displayValue
                },
                tabindex: {
                    title: results.accessibilityAudits['a11y-navigation'].tabindex.title,
                    description: results.accessibilityAudits['a11y-navigation'].tabindex.description,
                    score: results.accessibilityAudits['a11y-navigation'].tabindex.score,
                    value: results.accessibilityAudits['a11y-navigation'].tabindex.rawValue,
                    displayValue: results.accessibilityAudits['a11y-navigation'].tabindex.displayValue
                },
            },
            allyAria: {
                ariaAllowedAttr: {
                    title: results.accessibilityAudits['a11y-aria']['aria-allowed-attr'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-allowed-attr'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-allowed-attr'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-allowed-attr'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-allowed-attr'].displayValue
                },
                ariaRequiredAttr: {
                    title: results.accessibilityAudits['a11y-aria']['aria-required-attr'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-required-attr'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-required-attr'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-required-attr'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-required-attr'].displayValue
                },
                ariaRequiredChildren: {
                    title: results.accessibilityAudits['a11y-aria']['aria-required-children'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-required-children'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-required-children'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-required-children'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-required-children'].displayValue
                },
                ariaRequiredParent: {
                    title: results.accessibilityAudits['a11y-aria']['aria-required-parent'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-required-parent'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-required-parent'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-required-parent'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-required-parent'].displayValue
                },
                ariaRoles: {
                    title: results.accessibilityAudits['a11y-aria']['aria-roles'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-roles'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-roles'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-roles'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-roles'].displayValue
                },
                ariaValidAttrValue: {
                    title: results.accessibilityAudits['a11y-aria']['aria-valid-attr-value'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-valid-attr-value'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-valid-attr-value'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-valid-attr-value'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-valid-attr-value'].displayValue
                },
                ariaValidAttr: {
                    title: results.accessibilityAudits['a11y-aria']['aria-valid-attr'].title,
                    description: results.accessibilityAudits['a11y-aria']['aria-valid-attr'].description,
                    score: results.accessibilityAudits['a11y-aria']['aria-valid-attr'].score,
                    value: results.accessibilityAudits['a11y-aria']['aria-valid-attr'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-aria']['aria-valid-attr'].displayValue
                },
            },
            allyAudioVideo: {
                audioCaption: {
                    title: results.accessibilityAudits['a11y-audio-video']['audio-caption'].title,
                    description: results.accessibilityAudits['a11y-audio-video']['audio-caption'].description,
                    score: results.accessibilityAudits['a11y-audio-video']['audio-caption'].score,
                    value: results.accessibilityAudits['a11y-audio-video']['audio-caption'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-audio-video']['audio-caption'].displayValue
                },
                videoCaption: {
                    title: results.accessibilityAudits['a11y-audio-video']['video-caption'].title,
                    description: results.accessibilityAudits['a11y-audio-video']['video-caption'].description,
                    score: results.accessibilityAudits['a11y-audio-video']['video-caption'].score,
                    value: results.accessibilityAudits['a11y-audio-video']['video-caption'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-audio-video']['video-caption'].displayValue
                },
                videoDescription: {
                    title: results.accessibilityAudits['a11y-audio-video']['video-description'].title,
                    description: results.accessibilityAudits['a11y-audio-video']['video-description'].description,
                    score: results.accessibilityAudits['a11y-audio-video']['video-description'].score,
                    value: results.accessibilityAudits['a11y-audio-video']['video-description'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-audio-video']['video-description'].displayValue
                },
            },
            allyNamesLabels: {
                buttonName: {
                    title: results.accessibilityAudits['a11y-names-labels']['button-name'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['button-name'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['button-name'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['button-name'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['button-name'].displayValue
                },
                documentTitle: {
                    title: results.accessibilityAudits['a11y-names-labels']['document-title'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['document-title'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['document-title'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['document-title'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['document-title'].displayValue
                },
                frameTitle: {
                    title: results.accessibilityAudits['a11y-names-labels']['frame-title'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['frame-title'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['frame-title'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['frame-title'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['frame-title'].displayValue
                },
                imageAlt: {
                    title: results.accessibilityAudits['a11y-names-labels']['image-alt'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['image-alt'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['image-alt'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['image-alt'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['image-alt'].displayValue
                },
                inputImageAlt: {
                    title: results.accessibilityAudits['a11y-names-labels']['input-image-alt'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['input-image-alt'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['input-image-alt'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['input-image-alt'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['input-image-alt'].displayValue
                },
                label: {
                    title: results.accessibilityAudits['a11y-names-labels'].label.title,
                    description: results.accessibilityAudits['a11y-names-labels'].label.description,
                    score: results.accessibilityAudits['a11y-names-labels'].label.score,
                    value: results.accessibilityAudits['a11y-names-labels'].label.rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels'].label.displayValue
                },
                linkName: {
                    title: results.accessibilityAudits['a11y-names-labels']['link-name'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['link-name'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['link-name'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['link-name'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['link-name'].displayValue
                },
                objectAlt: {
                    title: results.accessibilityAudits['a11y-names-labels']['object-alt'].title,
                    description: results.accessibilityAudits['a11y-names-labels']['object-alt'].description,
                    score: results.accessibilityAudits['a11y-names-labels']['object-alt'].score,
                    value: results.accessibilityAudits['a11y-names-labels']['object-alt'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-names-labels']['object-alt'].displayValue
                },
            },
            allyColorContrast: {
                colorContrast: {
                    title: results.accessibilityAudits['a11y-color-contrast']['color-contrast'].title,
                    description: results.accessibilityAudits['a11y-color-contrast']['color-contrast'].description,
                    score: results.accessibilityAudits['a11y-color-contrast']['color-contrast'].score,
                    value: results.accessibilityAudits['a11y-color-contrast']['color-contrast'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-color-contrast']['color-contrast'].displayValue
                },
            },
            allyTablesLists: {
                definitionList: {
                    title: results.accessibilityAudits['a11y-tables-lists']['definition-list'].title,
                    description: results.accessibilityAudits['a11y-tables-lists']['definition-list'].description,
                    score: results.accessibilityAudits['a11y-tables-lists']['definition-list'].score,
                    value: results.accessibilityAudits['a11y-tables-lists']['definition-list'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists']['definition-list'].displayValue
                },
                dlitem: {
                    title: results.accessibilityAudits['a11y-tables-lists'].dlitem.title,
                    description: results.accessibilityAudits['a11y-tables-lists'].dlitem.description,
                    score: results.accessibilityAudits['a11y-tables-lists'].dlitem.score,
                    value: results.accessibilityAudits['a11y-tables-lists'].dlitem.rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists'].dlitem.displayValue
                },
                layoutTable: {
                    title: results.accessibilityAudits['a11y-tables-lists']['layout-table'].title,
                    description: results.accessibilityAudits['a11y-tables-lists']['layout-table'].description,
                    score: results.accessibilityAudits['a11y-tables-lists']['layout-table'].score,
                    value: results.accessibilityAudits['a11y-tables-lists']['layout-table'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists']['layout-table'].displayValue
                },
                list: {
                    title: results.accessibilityAudits['a11y-tables-lists'].list.title,
                    description: results.accessibilityAudits['a11y-tables-lists'].list.description,
                    score: results.accessibilityAudits['a11y-tables-lists'].list.score,
                    value: results.accessibilityAudits['a11y-tables-lists'].list.rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists'].list.displayValue
                },
                listitem: {
                    title: results.accessibilityAudits['a11y-tables-lists'].listitem.title,
                    description: results.accessibilityAudits['a11y-tables-lists'].listitem.description,
                    score: results.accessibilityAudits['a11y-tables-lists'].listitem.score,
                    value: results.accessibilityAudits['a11y-tables-lists'].listitem.rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists'].listitem.displayValue
                },
                tdHeadersAttr: {
                    title: results.accessibilityAudits['a11y-tables-lists']['td-headers-attr'].title,
                    description: results.accessibilityAudits['a11y-tables-lists']['td-headers-attr'].description,
                    score: results.accessibilityAudits['a11y-tables-lists']['td-headers-attr'].score,
                    value: results.accessibilityAudits['a11y-tables-lists']['td-headers-attr'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists']['td-headers-attr'].displayValue
                },
                thHasDataCells: {
                    title: results.accessibilityAudits['a11y-tables-lists']['th-has-data-cells'].title,
                    description: results.accessibilityAudits['a11y-tables-lists']['th-has-data-cells'].description,
                    score: results.accessibilityAudits['a11y-tables-lists']['th-has-data-cells'].score,
                    value: results.accessibilityAudits['a11y-tables-lists']['th-has-data-cells'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-tables-lists']['th-has-data-cells'].displayValue
                },
            },
            allyBestPractices: {
                duplicateId: {
                    title: results.accessibilityAudits['a11y-best-practices']['duplicate-id'].title,
                    description: results.accessibilityAudits['a11y-best-practices']['duplicate-id'].description,
                    score: results.accessibilityAudits['a11y-best-practices']['duplicate-id'].score,
                    value: results.accessibilityAudits['a11y-best-practices']['duplicate-id'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-best-practices']['duplicate-id'].displayValue
                },
                metaRefresh: {
                    title: results.accessibilityAudits['a11y-best-practices']['meta-refresh'].title,
                    description: results.accessibilityAudits['a11y-best-practices']['meta-refresh'].description,
                    score: results.accessibilityAudits['a11y-best-practices']['meta-refresh'].score,
                    value: results.accessibilityAudits['a11y-best-practices']['meta-refresh'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-best-practices']['meta-refresh'].displayValue
                },
                metaViewport: {
                    title: results.accessibilityAudits['a11y-best-practices']['meta-viewport'].title,
                    description: results.accessibilityAudits['a11y-best-practices']['meta-viewport'].description,
                    score: results.accessibilityAudits['a11y-best-practices']['meta-viewport'].score,
                    value: results.accessibilityAudits['a11y-best-practices']['meta-viewport'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-best-practices']['meta-viewport'].displayValue
                },
            },
            allyLanguage: {
                htmlHasLang: {
                    title: results.accessibilityAudits['a11y-language']['html-has-lang'].title,
                    description: results.accessibilityAudits['a11y-language']['html-has-lang'].description,
                    score: results.accessibilityAudits['a11y-language']['html-has-lang'].score,
                    value: results.accessibilityAudits['a11y-language']['html-has-lang'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-language']['html-has-lang'].displayValue
                },
                htmlLangValid: {
                    title: results.accessibilityAudits['a11y-language']['html-lang-valid'].title,
                    description: results.accessibilityAudits['a11y-language']['html-lang-valid'].description,
                    score: results.accessibilityAudits['a11y-language']['html-lang-valid'].score,
                    value: results.accessibilityAudits['a11y-language']['html-lang-valid'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-language']['html-lang-valid'].displayValue
                },
                validLang: {
                    title: results.accessibilityAudits['a11y-language']['valid-lang'].title,
                    description: results.accessibilityAudits['a11y-language']['valid-lang'].description,
                    score: results.accessibilityAudits['a11y-language']['valid-lang'].score,
                    value: results.accessibilityAudits['a11y-language']['valid-lang'].rawValue,
                    displayValue: results.accessibilityAudits['a11y-language']['valid-lang'].displayValue
                },
            },
            noGroup: {
                logicalTabOrder: {
                    title: results.accessibilityAudits.noGroup['logical-tab-order'].title,
                    description: results.accessibilityAudits.noGroup['logical-tab-order'].description,
                    score: results.accessibilityAudits.noGroup['logical-tab-order'].score,
                    value: results.accessibilityAudits.noGroup['logical-tab-order'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['logical-tab-order'].displayValue
                },
                focusableVontrols: {
                    title: results.accessibilityAudits.noGroup['focusable-controls'].title,
                    description: results.accessibilityAudits.noGroup['focusable-controls'].description,
                    score: results.accessibilityAudits.noGroup['focusable-controls'].score,
                    value: results.accessibilityAudits.noGroup['focusable-controls'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['focusable-controls'].displayValue
                },
                interactiveElementsAffordance: {
                    title: results.accessibilityAudits.noGroup['interactive-element-affordance'].title,
                    description: results.accessibilityAudits.noGroup['interactive-element-affordance'].description,
                    score: results.accessibilityAudits.noGroup['interactive-element-affordance'].score,
                    value: results.accessibilityAudits.noGroup['interactive-element-affordance'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['interactive-element-affordance'].displayValue
                },
                managedFocus: {
                    title: results.accessibilityAudits.noGroup['managed-focus'].title,
                    description: results.accessibilityAudits.noGroup['managed-focus'].description,
                    score: results.accessibilityAudits.noGroup['managed-focus'].score,
                    value: results.accessibilityAudits.noGroup['managed-focus'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['managed-focus'].displayValue
                },
                focusTraps: {
                    title: results.accessibilityAudits.noGroup['focus-traps'].title,
                    description: results.accessibilityAudits.noGroup['focus-traps'].description,
                    score: results.accessibilityAudits.noGroup['focus-traps'].score,
                    value: results.accessibilityAudits.noGroup['focus-traps'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['focus-traps'].displayValue
                },
                customCntrolsLabels: {
                    title: results.accessibilityAudits.noGroup['custom-controls-labels'].title,
                    description: results.accessibilityAudits.noGroup['custom-controls-labels'].description,
                    score: results.accessibilityAudits.noGroup['custom-controls-labels'].score,
                    value: results.accessibilityAudits.noGroup['custom-controls-labels'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['custom-controls-labels'].displayValue
                },
                customControlsRoles: {
                    title: results.accessibilityAudits.noGroup['custom-controls-roles'].title,
                    description: results.accessibilityAudits.noGroup['custom-controls-roles'].description,
                    score: results.accessibilityAudits.noGroup['custom-controls-roles'].score,
                    value: results.accessibilityAudits.noGroup['custom-controls-roles'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['custom-controls-roles'].displayValue
                },
                visualOrderFollowsDom: {
                    title: results.accessibilityAudits.noGroup['visual-order-follows-dom'].title,
                    description: results.accessibilityAudits.noGroup['visual-order-follows-dom'].description,
                    score: results.accessibilityAudits.noGroup['visual-order-follows-dom'].score,
                    value: results.accessibilityAudits.noGroup['visual-order-follows-dom'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['visual-order-follows-dom'].displayValue
                },
                offscreenContentHidden: {
                    title: results.accessibilityAudits.noGroup['offscreen-content-hidden'].title,
                    description: results.accessibilityAudits.noGroup['offscreen-content-hidden'].description,
                    score: results.accessibilityAudits.noGroup['offscreen-content-hidden'].score,
                    value: results.accessibilityAudits.noGroup['offscreen-content-hidden'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['offscreen-content-hidden'].displayValue
                },
                headingLevels: {
                    title: results.accessibilityAudits.noGroup['heading-levels'].title,
                    description: results.accessibilityAudits.noGroup['heading-levels'].description,
                    score: results.accessibilityAudits.noGroup['heading-levels'].score,
                    value: results.accessibilityAudits.noGroup['heading-levels'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['heading-levels'].displayValue
                },
                useLandmarks: {
                    title: results.accessibilityAudits.noGroup['use-landmarks'].title,
                    description: results.accessibilityAudits.noGroup['use-landmarks'].description,
                    score: results.accessibilityAudits.noGroup['use-landmarks'].score,
                    value: results.accessibilityAudits.noGroup['use-landmarks'].rawValue,
                    displayValue: results.accessibilityAudits.noGroup['use-landmarks'].displayValue
                },
            },
        },
        bestPracticesAudits: {
            noGroup: {
                appcacheManifest: {
                    title: results.bestPracticesAudits.noGroup['appcache-manifest'].title,
                    description: results.bestPracticesAudits.noGroup['appcache-manifest'].description,
                    score: results.bestPracticesAudits.noGroup['appcache-manifest'].score,
                    value: results.bestPracticesAudits.noGroup['appcache-manifest'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['appcache-manifest'].displayValue
                },
                isOnHttps: {
                    title: results.bestPracticesAudits.noGroup['is-on-https'].title,
                    description: results.bestPracticesAudits.noGroup['is-on-https'].description,
                    score: results.bestPracticesAudits.noGroup['is-on-https'].score,
                    value: results.bestPracticesAudits.noGroup['is-on-https'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['is-on-https'].displayValue
                },
                usesHttp: {
                    title: results.bestPracticesAudits.noGroup['uses-http2'].title,
                    description: results.bestPracticesAudits.noGroup['uses-http2'].description,
                    score: results.bestPracticesAudits.noGroup['uses-http2'].score,
                    value: results.bestPracticesAudits.noGroup['uses-http2'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['uses-http2'].displayValue
                },
                userPassiveEventListeners: {
                    title: results.bestPracticesAudits.noGroup['uses-passive-event-listeners'].title,
                    description: results.bestPracticesAudits.noGroup['uses-passive-event-listeners'].description,
                    score: results.bestPracticesAudits.noGroup['uses-passive-event-listeners'].score,
                    value: results.bestPracticesAudits.noGroup['uses-passive-event-listeners'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['uses-passive-event-listeners'].displayValue
                },
                noDocumentWrite: {
                    title: results.bestPracticesAudits.noGroup['no-document-write'].title,
                    description: results.bestPracticesAudits.noGroup['no-document-write'].description,
                    score: results.bestPracticesAudits.noGroup['no-document-write'].score,
                    value: results.bestPracticesAudits.noGroup['no-document-write'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['no-document-write'].displayValue
                },
                externalAnchorsUseRelNoopener: {
                    title: results.bestPracticesAudits.noGroup['external-anchors-use-rel-noopener'].title,
                    description: results.bestPracticesAudits.noGroup['external-anchors-use-rel-noopener'].description,
                    score: results.bestPracticesAudits.noGroup['external-anchors-use-rel-noopener'].score,
                    value: results.bestPracticesAudits.noGroup['external-anchors-use-rel-noopener'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['external-anchors-use-rel-noopener'].displayValue
                },
                geolocationOnStart: {
                    title: results.bestPracticesAudits.noGroup['geolocation-on-start'].title,
                    description: results.bestPracticesAudits.noGroup['geolocation-on-start'].description,
                    score: results.bestPracticesAudits.noGroup['geolocation-on-start'].score,
                    value: results.bestPracticesAudits.noGroup['geolocation-on-start'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['geolocation-on-start'].displayValue
                },
                doctype: {
                    title: results.bestPracticesAudits.noGroup.doctype.title,
                    description: results.bestPracticesAudits.noGroup.doctype.description,
                    score: results.bestPracticesAudits.noGroup.doctype.score,
                    value: results.bestPracticesAudits.noGroup.doctype.rawValue,
                    displayValue: results.bestPracticesAudits.noGroup.doctype.displayValue
                },
                noVulnerableLibraries: {
                    title: results.bestPracticesAudits.noGroup['no-vulnerable-libraries'].title,
                    description: results.bestPracticesAudits.noGroup['no-vulnerable-libraries'].description,
                    score: results.bestPracticesAudits.noGroup['no-vulnerable-libraries'].score,
                    value: results.bestPracticesAudits.noGroup['no-vulnerable-libraries'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['no-vulnerable-libraries'].displayValue
                },
                jsLibraries: {
                    title: results.bestPracticesAudits.noGroup['js-libraries'].title,
                    description: results.bestPracticesAudits.noGroup['js-libraries'].description,
                    score: results.bestPracticesAudits.noGroup['js-libraries'].score,
                    value: results.bestPracticesAudits.noGroup['js-libraries'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['js-libraries'].displayValue
                },
                notificationsOnSart: {
                    title: results.bestPracticesAudits.noGroup['notification-on-start'].title,
                    description: results.bestPracticesAudits.noGroup['notification-on-start'].description,
                    score: results.bestPracticesAudits.noGroup['notification-on-start'].score,
                    value: results.bestPracticesAudits.noGroup['notification-on-start'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['notification-on-start'].displayValue
                },
                deprecations: {
                    title: results.bestPracticesAudits.noGroup.deprecations.title,
                    description: results.bestPracticesAudits.noGroup.deprecations.description,
                    score: results.bestPracticesAudits.noGroup.deprecations.score,
                    value: results.bestPracticesAudits.noGroup.deprecations.rawValue,
                    displayValue: results.bestPracticesAudits.noGroup.deprecations.displayValue
                },
                passwordInputsCanBePastedInto: {
                    title: results.bestPracticesAudits.noGroup['password-inputs-can-be-pasted-into'].title,
                    description: results.bestPracticesAudits.noGroup['password-inputs-can-be-pasted-into'].description,
                    score: results.bestPracticesAudits.noGroup['password-inputs-can-be-pasted-into'].score,
                    value: results.bestPracticesAudits.noGroup['password-inputs-can-be-pasted-into'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['password-inputs-can-be-pasted-into'].displayValue
                },
                errorsInConsole: {
                    title: results.bestPracticesAudits.noGroup['errors-in-console'].title,
                    description: results.bestPracticesAudits.noGroup['errors-in-console'].description,
                    score: results.bestPracticesAudits.noGroup['errors-in-console'].score,
                    value: results.bestPracticesAudits.noGroup['errors-in-console'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['errors-in-console'].displayValue
                },
                imageAspectRatio: {
                    title: results.bestPracticesAudits.noGroup['image-aspect-ratio'].title,
                    description: results.bestPracticesAudits.noGroup['image-aspect-ratio'].description,
                    score: results.bestPracticesAudits.noGroup['image-aspect-ratio'].score,
                    value: results.bestPracticesAudits.noGroup['image-aspect-ratio'].rawValue,
                    displayValue: results.bestPracticesAudits.noGroup['image-aspect-ratio'].displayValue
                },
            }
        }
    };
    return results;
};
const getAuditResultsFromCategory = (category, fullResults, categoryName) => {
    let responseCategory = {};
    for (auditGroup in category) {
        for (auditItem of category[auditGroup]) {
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
                console.log(err);
            }
        }
    }
    return responseCategory;
};
const saveLighthouseScores = (results, siteData, timeCreated, siteName, pageType, URL) => {
    return new Promise(async (res, rej) => {
        try {
            const lighthouseScores = new LighthouseScores({
                siteID: siteData._id,
                created: timeCreated,
                siteName: siteName,
                pageType: pageType,
                url: URL,
                scores: {
                    performance: results.scores.performance,
                    bestPractice: results.scores.bestPractice,
                    accessibility: results.scores.accessibility,
                    seo: results.scores.seo
                },
                metrics: {
                    firstContentfulPaint: {
                        score: results.performanceAudits.metrics.firstContentfulPaint.score,
                        value: results.performanceAudits.metrics.firstContentfulPaint.value
                    },
                    firstMeaningfulPaint: {
                        score: results.performanceAudits.metrics.firstMeaningfulPaint.score,
                        value: results.performanceAudits.metrics.firstMeaningfulPaint.value
                    },
                    speedIndex: {
                        score: results.performanceAudits.metrics.speedIndex.score,
                        value: results.performanceAudits.metrics.speedIndex.value
                    },
                    interactive: {
                        score: results.performanceAudits.metrics.interactive.score,
                        value: results.performanceAudits.metrics.interactive.value
                    },
                    firstCPUIdle: {
                        score: results.performanceAudits.metrics.firstCpuIdle.score,
                        value: results.performanceAudits.metrics.firstCpuIdle.value
                    },
                    estimatedInputLatency: {
                        score: results.performanceAudits.metrics.estimatedInputLatency.score,
                        value: results.performanceAudits.metrics.estimatedInputLatency.value
                    },
                }
            });
            await lighthouseScores.save();
            siteData[`${pageType}URLLighthouseScores`].push(lighthouseScores);
            await siteData.save();
            console.log(`Saved ${siteName}'s ${pageType} lighthouse scores to the database!`);
            res();
        }
        catch (err) {
            rej(err);
        }
    });
};
const saveLighthouseDetails = (results, siteData, timeCreated, siteName, pageType, URL) => {
    return new Promise(async (res, rej) => {
        try {
            let queryParam = {};
            queryParam.siteName = siteName;
            queryParam.pageType = pageType;
            const lighthouseDetailsContent = {
                siteID: siteData._id,
                created: timeCreated,
                siteName: siteName,
                pageType: pageType,
                url: URL,
                performanceAudits: results.performanceAudits,
                seoAudits: results.seoAudits,
                accessibilityAudits: results.accessibilityAudits,
                bestPracticesAudits: results.bestPracticesAudits
            };
            const existingDetails = await LighthouseAuditDetails.findOne(queryParam);
            if (existingDetails) {
                await existingDetails.update({ ...lighthouseDetailsContent });
                console.log(`Updated ${siteName}'s ${pageType} lighthouse details to the database!`);
            }
            else {
                const lighthouseDetails = new LighthouseAuditDetails(lighthouseDetailsContent);
                await lighthouseDetails.save();
                siteData[`${pageType}URLLighthouseAuditDetails`].push(lighthouseDetails);
                await siteData.save();
                console.log(`Saved ${siteName}'s ${pageType} lighthouse details to the database!`);
            }
            res();
        }
        catch (err) {
            rej(err);
        }
    });
};
//# sourceMappingURL=lighthouseController.js.map