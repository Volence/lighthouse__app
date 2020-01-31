import Site from '../models/Site';
import ConsoleErrorDetails from '../models/ConsoleErrorDetails';
import ConsoleErrorAudit, { ConsoleErrorType } from '../models/ConsoleErrorAudits';
import puppeteer from 'puppeteer';
import moment, { Moment } from 'moment';

const saveConsoleErrorResults = async (response: ConsoleErrorDetailsBySiteName, siteName: string, pageType: string, URL: string, timeCreated: Moment): Promise<string> => {
    try {
        const site = await Site.findOne({ siteName: siteName });
        if (site === null) return 'No site found!';
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
        } else {
            const consoleErrorDetails = new ConsoleErrorDetails(consoleErrorDetailsContent);
            await consoleErrorDetails.save();
            site[`${pageType}URLAuditDetails`].push(consoleErrorDetails);
        }
        await consoleErrorAudit.save();
        site[`${pageType}URLAudits`].push(consoleErrorAudit);
        await site.save();
        console.log(`Saved ${siteName}'s ${pageType} console error's summary!`);
        return 'Complete!';
    } catch (err) {
        return err;
    }
};

const getErrorAudits = async site => {
    try {
        let queryParam = {
            siteName: site.siteName,
            pageType: 'main',
        };
        let response = {
            main: await ConsoleErrorAudit.find(queryParam),
            category: [] as ConsoleErrorType[],
            products: [] as ConsoleErrorType[],
        };
        queryParam.pageType = 'category';
        response.category = await ConsoleErrorAudit.find(queryParam);
        queryParam.pageType = 'product';
        response.products = await ConsoleErrorAudit.find(queryParam);
        return response;
    } catch (err) {
        return err;
    }
};

const checkConsolesForErrors = async (urls, timeToWaitOnPage = 2000) => {
    try {
        let response: ConsoleErrorDetailsBySiteName = {};
        // Puppeteer types was giving back errors even though the correct data is coming through
        const runConsoleAudits = async ([url, ...urls]: any[]) => {
            if (url === undefined) return;
            console.log(`Checking for errors on ${url}...`);
            let errorCount = 0;
            let errors: string[] = [];
            let warningCount = 0;
            let warnings: string[] = [];
            let failedRequestCount = 0;
            let failedRequests: string[] = [];
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            page.on('console', msg => {
                // @ts-ignore
                if (msg._type && msg._type == 'error') {
                    // @ts-ignore
                    errors.push(msg._text);
                    errorCount += 1;
                }
                // @ts-ignore
                if (msg._type && msg._type == 'warning') {
                    // Having just msg here gave [ConsoleMessage] as a return which gave a cyclical error for JSON.stringify because it was a node element with child references
                    // @ts-ignore
                    warnings.push(msg._text);
                    warningCount += 1;
                }
            });
            page.on('pageerror', error => {
                errors.push(error.message);
                errorCount += 1;
            });
            page.on('requestfailed', request => {
                // @ts-ignore
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
    } catch (err) {
        return err;
    }
};

// const getAllSitesErrorAudits = async () => {
//     try {
//         const sites = await Site.find();
//         let response = {};
//         const runSiteAudit = async ([site, ...sites]: any[]) => {
//             if (site === undefined) return;
//             console.log(`Pulling console error data from ${site.siteName}`);
//             let siteName = site.siteName;
//             response[siteName] = await getErrorAudits(site);
//             return runSiteAudit(sites);
//         };
//         await runSiteAudit(sites);
//         return;
//     } catch (err) {
//         throw err;
//     }
// };

exports.getSiteErrorAudits = async siteEntered => {
    try {
        let queryParam = { siteName: siteEntered };
        const site = await Site.findOne(queryParam);
        if (site === null) return 'Site not Found';
        let response = {};
        let siteName = site.siteName;
        console.log(`Pulling console error data from ${siteName}`);
        response[siteName] = await getErrorAudits(site);
        return response;
    } catch (err) {
        throw err;
    }
};

exports.runConsoleAuditsOnAll = async () => {
    try {
        let sites = await Site.find();
        let response = {};
        const runSiteAudit = async ([site, ...sites]: any[]) => {
            if (site === undefined) return;
            let time = moment.utc();
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
    } catch (err) {
        throw err;
    }
};

exports.runConsoleAuditsOnSingleSite = async siteName => {
    try {
        let foundSite = await Site.findOne({ siteName: siteName });
        if (foundSite) {
            let time = moment.utc();
            let mainResponse = await checkConsolesForErrors([foundSite.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, siteName, 'main', foundSite.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([foundSite.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, siteName, 'category', foundSite.categoryURL, time);
            let productResponse = await checkConsolesForErrors([foundSite.productURL], 2000);
            await saveConsoleErrorResults(productResponse, siteName, 'product', foundSite.productURL, time);
            let response = [mainResponse, categoryResponse, productResponse];
            console.log('Finished Saving All Errors!');
            return response;
        } else {
            throw new Error(`Sorry that site doesn't exist!`);
        }
    } catch (err) {
        throw err;
    }
};

// Used for the Kron Job
exports.runAllAudits = async () => {
    try {
        let sites = await Site.find();
        let response = {};
        let siteCount = 0;
        const siteTotal = sites.length;
        const runSiteAudit = async ([site, ...sites]: any[]) => {
            if (site === undefined) return;
            siteCount++;
            let time = moment.utc();
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
    } catch (err) {
        return err;
    }
};
