const mongoose = require('mongoose');
const Site = mongoose.model('Site');
const ConsoleErrorAudit = mongoose.model('ConsoleErrorAudit');
const ConsoleErrorDetails = mongoose.model('ConsoleErrorDetails');
const puppeteer = require('puppeteer');
const utils = require ('../utils/utils');
const moment = require ('moment');

const saveConsoleErrorResults = async (response, siteName, pageType, URL, timeCreated) => {
    return new Promise( async (res, rej) => {
        try {
            let site = await Site.findOne({'siteName': siteName});
            const consoleErrorAudit = new ConsoleErrorAudit({
                siteID: site._id,
                created: timeCreated,
                siteName: siteName,
                pageType: pageType,
                url: URL,
                errorCount: response[URL].ErrorCount,
                warningCount: response[URL].WarningCount,
                failedRequestCount: response[URL].FailedRequestCount
            });
            const consoleErrorDetailsContent = {
                siteID: site._id,
                created: timeCreated,
                siteName: siteName,
                pageType: pageType,
                url: URL,
                summary: response[URL].Summary,
                errorsText: response[URL].Errors,
                warningsText: response[URL].Warnings,
                failedRequestsText: response[URL].FailedRequests
            };
            let queryParam = {};
            queryParam.siteName = siteName;
            queryParam.pageType = pageType;
            const existingDetails = await ConsoleErrorDetails.findOne(queryParam);
            if(existingDetails) {
                await existingDetails.update({...consoleErrorDetailsContent});
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
            res();
        } catch(err) {
            rej(err);
        }
    });
}

const getErrorAudits = (site) => {
    return new Promise( async (res, rej) => {
        try {
            let response = {};
            let queryParam = {};
            queryParam.siteName = site.siteName;
            queryParam.pageType = 'main';
            response.main = await ConsoleErrorAudit.find(queryParam)
            queryParam.pageType = 'category';
            response.category = await ConsoleErrorAudit.find(queryParam)
            queryParam.pageType = 'product';
            response.products = await ConsoleErrorAudit.find(queryParam)
            res(response);
        } catch(err) {
            rej(err);
        }
    });
}

const checkConsolesForErrors = async (urls, timeToWaitOnPage = 2000) => {
    return new Promise( async (res, rej) => {
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
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            page.on('console', msg => {
                if (msg._type && msg._type == 'error') {
                    errors.push(msg._text);
                    errorCount += 1;
                };
                if (msg._type && msg._type == 'warning') {
                    // Having just msg here gave [ConsoleMessage] as a return which gave a cyclical error for JSON.stringify because it was a node element with child references
                    warnings.push(msg._text);
                    warningCount += 1;
                };
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
                timeout: 0
            });
            await page.waitFor(timeToWaitOnPage);
            await page.close();
            await browser.close();
            response[url] = {
                Summary: `You have ${errorCount} errors, ${warningCount} warnings, and ${failedRequestCount} failed requests!`,
                ErrorCount: errorCount,
                WarningCount: warningCount,
                FailedRequestCount: failedRequestCount,
                Errors: errors,
                Warnings: warnings,
                FailedRequests: failedRequests
            };
        });
        res(response);
    } catch(err) {
        rej(err)
    }
})
};

exports.getAllSitesErrorAudits = async (req, res) => {
    try {
    const sites = await Site.find()
    let response = {};
    await utils.asyncForEach(sites, async (site) => {
        console.log(`Pulling console error data from ${site.siteName}`)
        let siteName = site.siteName
        response[siteName] = await getErrorAudits(site);
    });
    res.send(response);
    } catch(err) {
        throw err
    }
}

exports.getSiteErrorAudits = async (req, res) => {
    try {
        let queryParam = {};
        queryParam.siteName = req.params.site;
        const site = await Site.findOne(queryParam);
        let response = {};
        let siteName = site.siteName;
        console.log(`Pulling console error data from ${siteName}`);
        response[siteName] = await getErrorAudits(site);
        res.send(response);
    } catch(err) {
        throw err
    }
}

exports.runConsoleAuditsOnAll = async (req, res) => {
    try {
    let sites = await Site.find()
    let response = {};
    await utils.asyncForEach(sites, async (site) => {
        let time = moment.utc();
        let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
        await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
        let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
        await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
        let productResponse = await checkConsolesForErrors([site.productURL], 2000);
        await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
        response[site.siteName] = [mainResponse, categoryResponse, productResponse];
    });
        res.send(response);
    } catch(err) {
        throw err
    }
};

exports.runConsoleAuditsOnSingleSite = async (req, res) => {
    try {
        let siteName = req.body.siteName.toLowerCase();
        let foundSite = await  Site.findOne({'siteName':siteName});
        if (foundSite) {
            let time = moment.utc();
            let mainResponse = await checkConsolesForErrors([foundSite.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, siteName, 'main', foundSite.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([foundSite.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, siteName, 'category', foundSite.categoryURL, time);
            let productResponse = await checkConsolesForErrors([foundSite.productURL], 2000);
            await saveConsoleErrorResults(productResponse, siteName, 'product', foundSite.productURL, time);
            let response = [mainResponse, categoryResponse, productResponse];
            console.log('Send complete');
            res.send(response);
        } else {
            throw new Error(`Sorry that site doesn't exist!`);
        };
    } catch(err) {
        throw err
    }
}

// Used for the Kron Job
exports.runAllAudits = async () => {
    return new Promise( async (res, rej) => {
    try {
        let sites = await Site.find()
        let response = {};
        await utils.asyncForEach(sites, async (site) => {
            let time = moment.utc();
            let mainResponse = await checkConsolesForErrors([site.mainURL], 2000);
            await saveConsoleErrorResults(mainResponse, site.siteName, 'main', site.mainURL, time);
            let categoryResponse = await checkConsolesForErrors([site.categoryURL], 2000);
            await saveConsoleErrorResults(categoryResponse, site.siteName, 'category', site.categoryURL, time);
            let productResponse = await checkConsolesForErrors([site.productURL], 2000);
            await saveConsoleErrorResults(productResponse, site.siteName, 'product', site.productURL, time);
            response[site.siteName] = [mainResponse, categoryResponse, productResponse];
            console.log(`---ConsoleAuditErrors: ${sites.indexOf(site) + 1} out of ${sites.length} sites complete`)
        });
            res(response);
        } catch(err) {
            rej(err)
        }
    });
}