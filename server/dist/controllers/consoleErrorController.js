"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Site = mongoose_1.default.model('Site');
const ConsoleErrorAudit = mongoose_1.default.model('ConsoleErrorAudit');
const ConsoleErrorDetails = mongoose_1.default.model('ConsoleErrorDetails');
const puppeteer_1 = __importDefault(require("puppeteer"));
const moment_1 = __importDefault(require("moment"));
const saveConsoleErrorResults = async (response, siteName, pageType, URL, timeCreated) => {
    try {
        const site = await Site.findOne({ siteName: siteName });
        const consoleErrorAudit = new ConsoleErrorAudit({
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
        const existingDetails = await ConsoleErrorDetails.findOne(queryParam);
        if (existingDetails) {
            await existingDetails.update({ ...consoleErrorDetailsContent });
            console.log(`Updated ${siteName}'s ${pageType} error details!`);
        }
        else {
            const consoleErrorDetails = new ConsoleErrorDetails(consoleErrorDetailsContent);
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
        let response = {};
        let queryParam = {};
        queryParam.siteName = site.siteName;
        queryParam.pageType = 'main';
        response.main = await ConsoleErrorAudit.find(queryParam);
        queryParam.pageType = 'category';
        response.category = await ConsoleErrorAudit.find(queryParam);
        queryParam.pageType = 'product';
        response.products = await ConsoleErrorAudit.find(queryParam);
        return response;
    }
    catch (err) {
        return err;
    }
};
const checkConsolesForErrors = async (urls, timeToWaitOnPage = 2000) => {
    try {
        let response = {};
        await utils.asyncForEach(urls, async (url) => {
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
        });
        return response;
    }
    catch (err) {
        return err;
    }
};
const getAllSitesErrorAudits = async () => {
    try {
        const sites = await Site.find();
        let response = {};
        await utils.asyncForEach(sites, async (site) => {
            console.log(`Pulling console error data from ${site.siteName}`);
            let siteName = site.siteName;
            response[siteName] = await getErrorAudits(site);
        });
        return;
    }
    catch (err) {
        throw err;
    }
};
exports.getSiteErrorAudits = async () => {
    try {
        let queryParam = {};
        queryParam.siteName = req.params.site;
        const site = await Site.findOne(queryParam);
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
        let sites = await Site.find();
        let response = {};
        await utils.asyncForEach(sites, async (site) => {
            let time = moment_1.default.utc();
            let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
            let productResponse = await checkConsolesForErrors([site.productURL], 2000);
            await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
            response[site.siteName] = [mainResponse, categoryResponse, productResponse];
        });
        return response;
    }
    catch (err) {
        throw err;
    }
};
exports.runConsoleAuditsOnSingleSite = async () => {
    try {
        let siteName = req.body.siteName.toLowerCase();
        let foundSite = await Site.findOne({ siteName: siteName });
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
        let sites = await Site.find();
        let response = {};
        await utils.asyncForEach(sites, async (site) => {
            let time = moment_1.default.utc();
            let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
            let productResponse = await checkConsolesForErrors([site.productURL], 2000);
            await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
            response[site.siteName] = [mainResponse, categoryResponse, productResponse];
            console.log(`---ConsoleAuditErrors: ${sites.indexOf(site) + 1} out of ${sites.length} sites complete`);
        });
        return response;
    }
    catch (err) {
        return err;
    }
};
//# sourceMappingURL=consoleErrorController.js.map