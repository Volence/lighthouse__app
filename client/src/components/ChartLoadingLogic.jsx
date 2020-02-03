import AuditChart from './ErrorsCharts';
import ScoresChart from './MetricsCharts';
import MetricsChart from './ScoresCarts';
import { sendQuery } from '../utils';
import { getSiteErrorAuditData, getSiteScores, getMetricScores } from '../gql/queries';
import React from 'react';
import moment from 'moment';

const sortByCreated = arr => {
    return arr.sort((a, b) => a.created.localeCompare(b.created));
};

const setDataForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
        data.push({ x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element[type] });
    });
    return data;
};

const setScoresForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
        data.push({ x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element.scores[type] * 100 });
    });
    return data;
};

const setMetricsForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
        data.push({ x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element.metrics[type].score * 100 });
    });
    return data;
};

const loadSiteErrors = async site => {
    let {
        data: {
            sites: [data],
        },
    } = await sendQuery(getSiteErrorAuditData(site));

    const sortedMain = sortByCreated(data.mainURLAudits);
    const sortedCategory = sortByCreated(data.categoryURLAudits);
    const sortedProducts = sortByCreated(data.productURLAudits);

    const mainErrors = data.mainURLAuditDetails[0].errorsText;
    const mainWarnings = data.mainURLAuditDetails[0].warningsText;
    const mainFailedRequests = data.mainURLAuditDetails[0].failedRequestsText;

    const categoryErrors = data.categoryURLAuditDetails[0].errorsText;
    const categoryWarnings = data.categoryURLAuditDetails[0].warningsText;
    const categoryFailedRequests = data.categoryURLAuditDetails[0].failedRequestsText;

    const productErrors = data.productURLAuditDetails[0].errorsText;
    const productWarnings = data.productURLAuditDetails[0].warningsText;
    const productFailedRequests = data.productURLAuditDetails[0].failedRequestsText;

    const mainErrorDataForChart = setDataForChart(sortedMain, 'errorCount');
    const mainWarningDataForChart = setDataForChart(sortedMain, 'warningCount');
    const mainFailedRequestDataForChart = setDataForChart(sortedMain, 'failedRequestCount');

    const categoryErrorDataForChart = setDataForChart(sortedCategory, 'errorCount');
    const categoryWarningDataForChart = setDataForChart(sortedCategory, 'warningCount');
    const categoryFailedRequestDataForChart = setDataForChart(sortedCategory, 'failedRequestCount');

    const productErrorDataForChart = setDataForChart(sortedProducts, 'errorCount');
    const productWarningDataForChart = setDataForChart(sortedProducts, 'warningCount');
    const productFailedRequestDataForChart = setDataForChart(sortedProducts, 'failedRequestCount');

    const mainAuditChart = (
        <AuditChart
            title="Main:"
            summary={data.mainURLAuditDetails[0].summary}
            errorData={mainErrorDataForChart}
            warningData={mainWarningDataForChart}
            failedRequestData={mainFailedRequestDataForChart}
            errors={mainErrors}
            warnings={mainWarnings}
            failedRequests={mainFailedRequests}
        />
    );

    const categoryAuditChart = (
        <AuditChart
            title="Category:"
            summary={data.categoryURLAuditDetails[0].summary}
            errorData={categoryErrorDataForChart}
            warningData={categoryWarningDataForChart}
            failedRequestData={categoryFailedRequestDataForChart}
            errors={categoryErrors}
            warnings={categoryWarnings}
            failedRequests={categoryFailedRequests}
        />
    );

    const productAuditChart = (
        <AuditChart
            title="Product:"
            summary={data.productURLAuditDetails[0].summary}
            errorData={productErrorDataForChart}
            warningData={productWarningDataForChart}
            failedRequestData={productFailedRequestDataForChart}
            errors={productErrors}
            warnings={productWarnings}
            failedRequests={productFailedRequests}
        />
    );

    return [mainAuditChart, categoryAuditChart, productAuditChart];
};
// -------

const loadSiteScores = async site => {
    let {
        data: {
            sites: [data],
        },
    } = await sendQuery(getSiteScores(site));

    const sortedMain = sortByCreated(data.mainURLLighthouseScores);
    const sortedCategory = sortByCreated(data.categoryURLLighthouseScores);
    const sortedProducts = sortByCreated(data.productURLLighthouseScores);

    const mainPerformanceScoreForChart = setScoresForChart(sortedMain, 'performance');
    const mainBestPracticesScoreForChart = setScoresForChart(sortedMain, 'bestPractice');
    const mainAccessibilityScoreForChart = setScoresForChart(sortedMain, 'accessibility');
    const mainSEOScoreForChart = setScoresForChart(sortedMain, 'seo');

    const categoryPerformanceScoreForChart = setScoresForChart(sortedCategory, 'performance');
    const categoryBestPracticesScoreForChart = setScoresForChart(sortedCategory, 'bestPractice');
    const categoryAccessibilityScoreForChart = setScoresForChart(sortedCategory, 'accessibility');
    const categorySEOScoreForChart = setScoresForChart(sortedCategory, 'seo');

    const productPerformanceScoreForChart = setScoresForChart(sortedProducts, 'performance');
    const productBestPracticesScoreForChart = setScoresForChart(sortedProducts, 'bestPractice');
    const productAccessibilityScoreForChart = setScoresForChart(sortedProducts, 'accessibility');
    const productSEOScoreForChart = setScoresForChart(sortedProducts, 'seo');

    const mainScoresChart = (
        <ScoresChart
            title="Main:"
            performanceScore={mainPerformanceScoreForChart}
            bestPracticeScore={mainBestPracticesScoreForChart}
            accessibilityScore={mainAccessibilityScoreForChart}
            seoScore={mainSEOScoreForChart}
        />
    );

    const categoryScoresChart = (
        <ScoresChart
            title="Category:"
            performanceScore={categoryPerformanceScoreForChart}
            bestPracticeScore={categoryBestPracticesScoreForChart}
            accessibilityScore={categoryAccessibilityScoreForChart}
            seoScore={categorySEOScoreForChart}
        />
    );

    const productScoresChart = (
        <ScoresChart
            title="Product:"
            performanceScore={productPerformanceScoreForChart}
            bestPracticeScore={productBestPracticesScoreForChart}
            accessibilityScore={productAccessibilityScoreForChart}
            seoScore={productSEOScoreForChart}
        />
    );

    return [mainScoresChart, categoryScoresChart, productScoresChart];
};

const loadSiteMetrics = async site => {
    let {
        data: {
            sites: [data],
        },
    } = await sendQuery(getMetricScores(site));

    const sortedMain = sortByCreated(data.mainURLLighthouseScores);
    const sortedCategory = sortByCreated(data.categoryURLLighthouseScores);
    const sortedProducts = sortByCreated(data.productURLLighthouseScores);

    const mainFirstMeaningfulPaintForChart = setMetricsForChart(sortedMain, 'firstContentfulPaint');
    const mainFirstContentfulPaintForChart = setMetricsForChart(sortedMain, 'firstMeaningfulPaint');
    const mainSpeedIndexForChart = setMetricsForChart(sortedMain, 'speedIndex');
    const mainInteractiveForChart = setMetricsForChart(sortedMain, 'interactive');
    const mainFirstCPUIdleForChart = setMetricsForChart(sortedMain, 'firstCPUIdle');
    const mainLatencyForChart = setMetricsForChart(sortedMain, 'maxPotentialFid');

    const categoryFirstMeaningfulPaintForChart = setMetricsForChart(sortedCategory, 'firstContentfulPaint');
    const categoryFirstContentfulPaintForChart = setMetricsForChart(sortedCategory, 'firstMeaningfulPaint');
    const categorySpeedIndexForChart = setMetricsForChart(sortedCategory, 'speedIndex');
    const categoryInteractiveForChart = setMetricsForChart(sortedCategory, 'interactive');
    const categoryFirstCPUIdleForChart = setMetricsForChart(sortedCategory, 'firstCPUIdle');
    const categoryLatencyForChart = setMetricsForChart(sortedCategory, 'maxPotentialFid');

    const productFirstMeaningfulPaintForChart = setMetricsForChart(sortedProducts, 'firstContentfulPaint');
    const productFirstContentfulPaintForChart = setMetricsForChart(sortedProducts, 'firstMeaningfulPaint');
    const productSpeedIndexForChart = setMetricsForChart(sortedProducts, 'speedIndex');
    const productInteractiveForChart = setMetricsForChart(sortedProducts, 'interactive');
    const productFirstCPUIdleForChart = setMetricsForChart(sortedProducts, 'firstCPUIdle');
    const productLatencyForChart = setMetricsForChart(sortedProducts, 'maxPotentialFid');

    const mainScoresChart = (
        <MetricsChart
            title="Main:"
            firstContentfulPaint={mainFirstMeaningfulPaintForChart}
            firstMeaningfulPaint={mainFirstContentfulPaintForChart}
            speedIndex={mainSpeedIndexForChart}
            interactive={mainInteractiveForChart}
            firstCPUIdle={mainFirstCPUIdleForChart}
            maxPotentialFid={mainLatencyForChart}
        />
    );

    const categoryScoresChart = (
        <MetricsChart
            title="Category:"
            firstContentfulPaint={categoryFirstMeaningfulPaintForChart}
            firstMeaningfulPaint={categoryFirstContentfulPaintForChart}
            speedIndex={categorySpeedIndexForChart}
            interactive={categoryInteractiveForChart}
            firstCPUIdle={categoryFirstCPUIdleForChart}
            maxPotentialFid={categoryLatencyForChart}
        />
    );

    const productScoresChart = (
        <MetricsChart
            title="Product:"
            firstContentfulPaint={productFirstMeaningfulPaintForChart}
            firstMeaningfulPaint={productFirstContentfulPaintForChart}
            speedIndex={productSpeedIndexForChart}
            interactive={productInteractiveForChart}
            firstCPUIdle={productFirstCPUIdleForChart}
            maxPotentialFid={productLatencyForChart}
        />
    );

    return [mainScoresChart, categoryScoresChart, productScoresChart];
};

export { loadSiteErrors, loadSiteMetrics, loadSiteScores };
