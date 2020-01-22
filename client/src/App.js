import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import './App.css';
import styled, { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import AuditChart from './components/Chart';
import ScoresChart from './components/ScoresChart';
import MetricsChart from './components/MetricsChart';
import * as customQueries from './gql/queries';
import { AppBar, Button, CssBaseline, Toolbar, IconButton, Drawer, Typography, Divider, List, ListItem, ListItemText, TextField, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { sendQuery } from './utils';

const App = () => {
    const drawerWidth = 240;

    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        label: {
            backgroundColor: '#fff',
        },
        toolbar: theme.mixins.toolbar,
        siteSelectionContainer: {
            marginLeft: 'auto',
        },
        inputRoot: {
            backgroundColor: '#fff',
        },
        inputBackground: {
            backgroundColor: '#fff',
        },
    }));

    const SitesContainer = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;

    const Charts = styled.div`
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    `;

    const EmptyChart = styled.div`
        height: 35rem;
        width: 50%;
        min-width: 45rem;
        border: 1px solid black;
        display: flex;
        justify-content: center;
        margin: 4rem 0 0;
        padding-top: 0.8rem;
        color: #212121;
        box-shadow: 1px 0 10px rgba(0, 0, 0, 0.3);
    `;

    const SiteAreaTitles = styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 0;
    `;

    const [sites, setSites] = useState();
    const [currentSiteDisplayed, setCurrentSiteDisplayed] = useState(<Typography variant="h5">Site:</Typography>);
    const [chartNumber, setChartNumber] = useState(0);
    const [displayType, setDisplayType] = useState('Errors');
    const [displayData, setDisplayData] = useState([
        <EmptyChart>
            <Typography variant="h4">Select a Site</Typography>
        </EmptyChart>,
        <EmptyChart>
            <Typography variant="h4">Select a Site</Typography>
        </EmptyChart>,
        <EmptyChart>
            <Typography variant="h4">Select a Site</Typography>
        </EmptyChart>,
    ]);
    const [currentSelectedSite, setCurrentSelectedSite] = useState('Select Site');

    const getSites = async () => {
        let { data } = await sendQuery(customQueries.getSiteNames);
        displaySiteList(data.sites);
    };

    const displaySiteList = siteList => {
        siteList = siteList.map(
            site =>
                // <SiteListItem key={String(Symbol)}>
                //     {site.siteName}:
                //     <Button variant="contained" color="primary" href="##" onClick={e => loadSiteErrors(e, site.siteName)}>
                //         {' '}
                //         Console Audit Info
                //     </Button>
                //     <Button variant="contained" color="primary" href="##" onClick={e => loadSiteScores(e, site.siteName)}>
                //         Site Scores
                //     </Button>
                //     <Button variant="contained" color="primary" href="##" onClick={e => loadSiteMetrics(e, site.siteName)}>
                //         Site Metrics
                //     </Button>
                // </SiteListItem>
                site
        );
        setSites(siteList);
    };

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

    // ==========================================================================================
    // Event Handlers
    // ==========================================================================================
    const loadSiteErrors = async site => {
        let {
            data: {
                sites: [data],
            },
        } = await sendQuery(customQueries.getSiteErrorAuditData(site));

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

        setDisplayData([mainAuditChart, categoryAuditChart, productAuditChart]);
    };
    // -------

    const loadSiteScores = async site => {
        let {
            data: {
                sites: [data],
            },
        } = await sendQuery(customQueries.getSiteScores(site));

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

        setDisplayData([mainScoresChart, categoryScoresChart, productScoresChart]);
    };

    const loadSiteMetrics = async site => {
        let {
            data: {
                sites: [data],
            },
        } = await sendQuery(customQueries.getMetricScores(site));

        const sortedMain = sortByCreated(data.mainURLLighthouseScores);
        const sortedCategory = sortByCreated(data.categoryURLLighthouseScores);
        const sortedProducts = sortByCreated(data.productURLLighthouseScores);

        const mainFirstMeaningfulPaintForChart = setMetricsForChart(sortedMain, 'firstContentfulPaint');
        const mainFirstContentfulPaintForChart = setMetricsForChart(sortedMain, 'firstMeaningfulPaint');
        const mainSpeedIndexForChart = setMetricsForChart(sortedMain, 'speedIndex');
        const mainInteractiveForChart = setMetricsForChart(sortedMain, 'interactive');
        const mainFirstCPUIdleForChart = setMetricsForChart(sortedMain, 'firstCPUIdle');
        const mainLatencyForChart = setMetricsForChart(sortedMain, 'estimatedInputLatency');

        const categoryFirstMeaningfulPaintForChart = setMetricsForChart(sortedCategory, 'firstContentfulPaint');
        const categoryFirstContentfulPaintForChart = setMetricsForChart(sortedCategory, 'firstMeaningfulPaint');
        const categorySpeedIndexForChart = setMetricsForChart(sortedCategory, 'speedIndex');
        const categoryInteractiveForChart = setMetricsForChart(sortedCategory, 'interactive');
        const categoryFirstCPUIdleForChart = setMetricsForChart(sortedCategory, 'firstCPUIdle');
        const categoryLatencyForChart = setMetricsForChart(sortedCategory, 'estimatedInputLatency');

        const productFirstMeaningfulPaintForChart = setMetricsForChart(sortedProducts, 'firstContentfulPaint');
        const productFirstContentfulPaintForChart = setMetricsForChart(sortedProducts, 'firstMeaningfulPaint');
        const productSpeedIndexForChart = setMetricsForChart(sortedProducts, 'speedIndex');
        const productInteractiveForChart = setMetricsForChart(sortedProducts, 'interactive');
        const productFirstCPUIdleForChart = setMetricsForChart(sortedProducts, 'firstCPUIdle');
        const productLatencyForChart = setMetricsForChart(sortedProducts, 'estimatedInputLatency');

        const mainScoresChart = (
            <MetricsChart
                title="Main:"
                firstContentfulPaint={mainFirstMeaningfulPaintForChart}
                firstMeaningfulPaint={mainFirstContentfulPaintForChart}
                speedIndex={mainSpeedIndexForChart}
                interactive={mainInteractiveForChart}
                firstCPUIdle={mainFirstCPUIdleForChart}
                estimatedInputLatency={mainLatencyForChart}
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
                estimatedInputLatency={categoryLatencyForChart}
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
                estimatedInputLatency={productLatencyForChart}
            />
        );

        setDisplayData([mainScoresChart, categoryScoresChart, productScoresChart]);
    };

    const pageToolTips = ['The Main Page', 'The Category Page', 'The Product Page'];
    const typeToolTips = [
        'Errors, Warnings, and Failed Requests from the console of a page.',
        'Performance, Accessibility, Best Practices, and Seo scores from the page.',
        'First Contentful Paint, First Meaningful Paint, Speed Index, Time to Interactive, First CPU Idle, and Estimated Input Latency from page',
    ];
    const addSiteToolTips = 'Add a new site to the database';

    useEffect(() => {
        getSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={'test'} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={'test'}>
                        Lighthouse App
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                    <Autocomplete
                        id="combo-box-demo"
                        className={classes.siteSelectionContainer}
                        classes={{
                            inputRoot: classes.inputRoot,
                            tag: classes.label,
                        }}
                        options={sites ? sites.sort((a, b) => -b.siteName.localeCompare(a.siteName)) : sites}
                        groupBy={option => option.siteName[0].toUpperCase()}
                        onChange={(e, value) => {
                            console.log('value', value);
                            if (value === 'Select Site' || value === null) return;
                            setCurrentSelectedSite(value);
                            setCurrentSiteDisplayed(
                                <Typography variant="h5" className={'test'}>
                                    {`${value.siteName} (${displayType})`}:
                                </Typography>
                            );
                            if (displayType.toLowerCase() === 'errors') {
                                loadSiteErrors(value.siteName);
                            } else if (displayType.toLowerCase() === 'metrics') {
                                loadSiteScores(value.siteName);
                            } else {
                                loadSiteMetrics(value.siteName);
                            }
                        }}
                        getOptionLabel={option => option.siteName}
                        style={{ width: 300 }}
                        size="small"
                        renderInput={params => <TextField className={classes.siteSelection} {...params} label="Select Site" variant="outlined" fullWidth />}
                    />
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {['Main Page', 'Category Page', 'Product Page'].map((text, index) => (
                        <Tooltip title={pageToolTips[index]}>
                            <ListItem button key={text} onClick={e => setChartNumber(index)}>
                                <ListItemText primary={text} />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Errors', 'Metrics', 'Scores'].map((text, index) => (
                        <Tooltip title={typeToolTips[index]}>
                            <ListItem
                                button
                                key={text}
                                onClick={e => {
                                    if (currentSelectedSite === 'Select Site') return;
                                    setDisplayType(text);
                                    setCurrentSiteDisplayed(
                                        <Typography variant="h5" className={'test'}>
                                            {`${currentSelectedSite.siteName} (${text})`}:
                                        </Typography>
                                    );
                                    if (text.toLowerCase() === 'errors') {
                                        loadSiteErrors(currentSelectedSite.siteName);
                                    } else if (text.toLowerCase() === 'metrics') {
                                        loadSiteScores(currentSelectedSite.siteName);
                                    } else {
                                        loadSiteMetrics(currentSelectedSite.siteName);
                                    }
                                }}
                            >
                                <ListItemText primary={text} />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Add Site'].map((text, index) => (
                        <Tooltip title={addSiteToolTips}>
                            <Modal key={text}></Modal>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {/* <Typography variant="h3">Current Sites in the Database:</Typography> */}
                <SitesContainer>
                    <SiteAreaTitles>{currentSiteDisplayed}</SiteAreaTitles>
                    <Charts>{displayData[chartNumber]}</Charts>
                </SitesContainer>
            </main>
        </div>
    );
};

export default App;
