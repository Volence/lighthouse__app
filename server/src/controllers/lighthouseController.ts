const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
import LighthouseScores from '../models/LighthouseScores';
import LighthouseAuditDetails from '../models/LighthouseAuditDetails';
import Site, { SiteListType } from '../models/Site';
import lighthouseDataNormalize from '../utils/lighthouseDataNormalizer';
const consoleErrorController = require('../controllers/consoleErrorController');
const moment = require('moment');

const runAudits = async (newSite: string | null = null): Promise<string> => {
    if (newSite !== null) {
        try {
            await consoleErrorController.runConsoleAuditsOnSingleSite(newSite);
            let queryParam = { siteName: newSite };
            const site = await Site.findOne(queryParam);
            if (site === null) return 'Site not Found';
            await runLighthouseAndSaveToDatabase(site, site.siteName);
            console.log(`Finished running lighthouse checks on new site!`);
            return 'Finished';
        } catch (err) {
            return err;
        }
    } else {
        try {
            await consoleErrorController.runAllAudits();
            const sites = await Site.find();
            let siteCount = 0;
            const siteTotal = sites.length;
            const runEachSite = async ([siteData, ...sites]: SiteListType[]) => {
                if (siteData === undefined) return;
                siteCount++;
                try {
                    await runLighthouseAndSaveToDatabase(siteData, siteData.siteName);
                } catch (err) {
                    console.log('Error: ', err);
                }
                console.log(`---LIGHTHOUSE: ${siteCount} out of ${siteTotal} sites complete`);
                return await runEachSite(sites);
            };
            await runEachSite(sites);
            return '--------------Finished with all audits!-----------------';
        } catch (err) {
            return err;
        }
    }
};

const runLighthouseRequest = async (siteName): Promise<string> => {
    try {
        let queryParam = { siteName: siteName };
        const siteData = await Site.findOne(queryParam);
        await runLighthouseAndSaveToDatabase(siteData, siteName);
        return '--------------Finished with Lighthouse request!-----------------';
    } catch (err) {
        return err;
    }
};

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

const getFormattedAudit = async url => {
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
    } catch (err) {
        return err;
    }
};

const formatResults = results => {
    const {
        categories: {
            performance: { score: performanceScore },
            seo: { score: seoScore },
            accessibility: { score: accessibilityScore },
            'best-practices': { score: bestPracticesScore },
        },
    } = results;
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
    const results: LighthouseAuditDetailsType = {
        ...getAuditResultsFromCategory(formattedResults.performanceAudits, fullResults, 'performanceAudits'),
        ...getAuditResultsFromCategory(formattedResults.seoAudits, fullResults, 'seoAudits'),
        ...getAuditResultsFromCategory(formattedResults.accessibilityAudits, fullResults, 'accessibilityAudits'),
        ...getAuditResultsFromCategory(formattedResults.bestPracticesAudits, fullResults, 'bestPracticesAudits'),
    };

    return lighthouseDataNormalize(results);
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
            } catch (err) {
                console.log('Error ', err);
            }
        }
    }
    return responseCategory;
};

const saveLighthouseScores = async (results, siteData, timeCreated, siteName, pageType, URL) => {
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
    } catch (err) {
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
        const existingDetails = await LighthouseAuditDetails.findOne(queryParam);
        if (existingDetails) {
            await existingDetails.update({ ...lighthouseDetailsContent });
            console.log(`Updated ${siteName}'s ${pageType} lighthouse details to the database!`);
        } else {
            const lighthouseDetails = new LighthouseAuditDetails(lighthouseDetailsContent);
            await lighthouseDetails.save();
            siteData[`${pageType}URLLighthouseAuditDetails`].push(lighthouseDetails);
            await siteData.save();
            console.log(`Saved ${siteName}'s ${pageType} lighthouse details to the database!`);
        }
        return;
    } catch (err) {
        return err;
    }
};

export { runAudits, runLighthouseRequest };
