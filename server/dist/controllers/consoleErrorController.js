"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Site_1 = __importDefault(require("../models/Site"));
const ConsoleErrorDetails_1 = __importDefault(require("../models/ConsoleErrorDetails"));
const ConsoleErrorAudits_1 = __importDefault(require("../models/ConsoleErrorAudits"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const moment_1 = __importDefault(require("moment"));
const saveConsoleErrorResults = async (response, siteName, pageType, URL, timeCreated) => {
    try {
        const site = await Site_1.default.findOne({ siteName: siteName });
        if (site === null)
            return 'No site found!';
        const consoleErrorAudit = new ConsoleErrorAudits_1.default({
            siteID: site._id,
            created: timeCreated,
            siteName: siteName,
            pageType: pageType,
            url: URL,
            errorCount: response[URL].errorCount,
            warningCount: response[URL].warningCount,
            failedRequestCount: response[URL].failedRequestCount,
        });
        const consoleErrorDetailsContent = {
            siteID: site._id,
            created: timeCreated,
            siteName: siteName,
            pageType: pageType,
            url: URL,
            summary: response[URL].summary,
            errorsText: response[URL].errors,
            warningsText: response[URL].warnings,
            failedRequestsText: response[URL].failedRequests,
        };
        const queryParam = { siteName: siteName, pageType: pageType };
        const existingDetails = await ConsoleErrorDetails_1.default.findOne(queryParam);
        if (existingDetails) {
            await existingDetails.update({ ...consoleErrorDetailsContent });
            console.log(`Updated ${siteName}'s ${pageType} error details!`);
        }
        else {
            const consoleErrorDetails = new ConsoleErrorDetails_1.default(consoleErrorDetailsContent);
            await consoleErrorDetails.save();
            site[`${pageType}URLAuditDetails`].push(consoleErrorDetails);
        }
        await consoleErrorAudit.save();
        site[`${pageType}URLAudits`].push(consoleErrorAudit);
        await site.save();
        console.log(`Saved ${siteName}'s ${pageType} console error's summary!`);
        return 'Complete!';
    }
    catch (err) {
        return err;
    }
};
const getErrorAudits = async (site) => {
    try {
        let queryParam = {
            siteName: site.siteName,
            pageType: 'main',
        };
        let response = {
            main: await ConsoleErrorAudits_1.default.find(queryParam),
            category: [],
            products: [],
        };
        queryParam.pageType = 'category';
        response.category = await ConsoleErrorAudits_1.default.find(queryParam);
        queryParam.pageType = 'product';
        response.products = await ConsoleErrorAudits_1.default.find(queryParam);
        return response;
    }
    catch (err) {
        return err;
    }
};
const checkConsolesForErrors = async (urls, timeToWaitOnPage = 2000) => {
    try {
        let response = {};
        const runConsoleAudits = async ([url, ...urls]) => {
            if (url === undefined)
                return;
            console.log(`Checking for errors on ${url}...`);
            let errorCount = 0;
            let errors = [];
            let warningCount = 0;
            let warnings = [];
            let failedRequestCount = 0;
            let failedRequests = [];
            const browser = await puppeteer_1.default.launch();
            const page = await browser.newPage();
            page.on('console', msg => {
                if (msg._type && msg._type == 'error') {
                    errors.push(msg._text);
                    errorCount += 1;
                }
                if (msg._type && msg._type == 'warning') {
                    warnings.push(msg._text);
                    warningCount += 1;
                }
            });
            page.on('pageerror', error => {
                errors.push(error.message);
                errorCount += 1;
            });
            page.on('requestfailed', request => {
                failedRequests.push(`Text: ${request._failureText}; Location: ${request._url} `);
                failedRequestCount += 1;
            });
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 0,
            });
            await page.waitFor(timeToWaitOnPage);
            await page.close();
            await browser.close();
            response[url] = {
                summary: `You have ${errorCount} errors, ${warningCount} warnings, and ${failedRequestCount} failed requests!`,
                errorCount: errorCount,
                warningCount: warningCount,
                failedRequestCount: failedRequestCount,
                errors: errors,
                warnings: warnings,
                failedRequests: failedRequests,
            };
            return await runConsoleAudits(urls);
        };
        await runConsoleAudits(urls);
        return response;
    }
    catch (err) {
        return err;
    }
};
exports.getSiteErrorAudits = async (siteEntered) => {
    try {
        let queryParam = { siteName: siteEntered };
        const site = await Site_1.default.findOne(queryParam);
        if (site === null)
            return 'Site not Found';
        let response = {};
        let siteName = site.siteName;
        console.log(`Pulling console error data from ${siteName}`);
        response[siteName] = await getErrorAudits(site);
        return response;
    }
    catch (err) {
        throw err;
    }
};
exports.runConsoleAuditsOnAll = async () => {
    try {
        let sites = await Site_1.default.find();
        let response = {};
        const runSiteAudit = async ([site, ...sites]) => {
            if (site === undefined)
                return;
            let time = moment_1.default.utc();
            let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
            let productResponse = await checkConsolesForErrors([site.productURL], 2000);
            await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
            response[site.siteName] = [mainResponse, categoryResponse, productResponse];
            return await runSiteAudit(sites);
        };
        await runSiteAudit(sites);
        return response;
    }
    catch (err) {
        throw err;
    }
};
exports.runConsoleAuditsOnSingleSite = async (siteName) => {
    try {
        let foundSite = await Site_1.default.findOne({ siteName: siteName });
        if (foundSite) {
            let time = moment_1.default.utc();
            let mainResponse = await checkConsolesForErrors([foundSite.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, siteName, 'main', foundSite.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([foundSite.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, siteName, 'category', foundSite.categoryURL, time);
            let productResponse = await checkConsolesForErrors([foundSite.productURL], 2000);
            await saveConsoleErrorResults(productResponse, siteName, 'product', foundSite.productURL, time);
            let response = [mainResponse, categoryResponse, productResponse];
            console.log('Send complete');
            return response;
        }
        else {
            throw new Error(`Sorry that site doesn't exist!`);
        }
    }
    catch (err) {
        throw err;
    }
};
exports.runAllAudits = async () => {
    try {
        let sites = await Site_1.default.find();
        let response = {};
        let siteCount = 0;
        const siteTotal = sites.length;
        const runSiteAudit = async ([site, ...sites]) => {
            if (site === undefined)
                return;
            siteCount++;
            let time = moment_1.default.utc();
            let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
            let productResponse = await checkConsolesForErrors([site.productURL], 2000);
            await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
            response[site.siteName] = [mainResponse, categoryResponse, productResponse];
            console.log(`---ConsoleAuditErrors: ${siteCount} out of ${siteTotal} sites complete`);
            return await runSiteAudit(sites);
        };
        await runSiteAudit(sites);
        return response;
    }
    catch (err) {
        return err;
    }
};
//# sourceMappingURL=consoleErrorController.js.map