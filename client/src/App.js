import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import MainPanel from './components/MainPanel';
import * as customQueries from './gql/queries';
import { Box, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sendQuery } from './utils';

// Styles
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        color: '#000000de',
        backgoundColor: '#f5f5f5',
    },
    emptyChart: {
        height: '35rem',
        width: '95%',
        display: 'flex',
        justifyContent: 'center',
        margin: '1rem 0 0',
        paddingTop: '0.8rem',
        color: 'gray',
        [theme.breakpoints.up('sm')]: {
            width: '85%',
        },
        [theme.breakpoints.up('md')]: {
            width: '70%',
        },
        backgroundColor: 'white',
    },
}));

const App = () => {
    const classes = useStyles();

    const [sites, setSites] = useState();
    const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
    const [currentSiteDisplayed, setCurrentSiteDisplayed] = useState(<Typography variant="h5">Site:</Typography>);
    const [chartNumber, setChartNumber] = useState(0);
    const [displayType, setDisplayType] = useState('Errors');
    const [displayData, setDisplayData] = useState(
        [...Array(3)].map(x => (
            <Box boxShadow={2} className={classes.emptyChart}>
                <Typography variant="h4">Select a Site</Typography>
            </Box>
        ))
    );
    const [currentSelectedSite, setCurrentSelectedSite] = useState('Select Site');

    useEffect(() => {
        // Queries
        const getSites = async () => {
            let { data } = await sendQuery(customQueries.getSiteNames);
            return data.sites;
        };

        const displaySiteList = siteList => {
            siteList = siteList.map(site => site);
            setSites(siteList);
        };

        const getAndSetSites = async () => {
            const siteList = await getSites();
            displaySiteList(siteList);
        };

        getAndSetSites();
    }, []);

    const handleDrawerToggle = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TopBar
                setDisplayData={setDisplayData}
                handleDrawerToggle={handleDrawerToggle}
                sites={sites}
                setCurrentSelectedSite={setCurrentSelectedSite}
                setCurrentSiteDisplayed={setCurrentSiteDisplayed}
                displayType={displayType}
            />
            <SideBar
                handleDrawerToggle={handleDrawerToggle}
                mobileDrawerOpen={mobileDrawerOpen}
                setChartNumber={setChartNumber}
                currentSelectedSite={currentSelectedSite}
                setDisplayType={setDisplayType}
                setCurrentSiteDisplayed={setCurrentSiteDisplayed}
                setDisplayData={setDisplayData}
            />
            <MainPanel currentSiteDisplayed={currentSiteDisplayed} chartNumber={chartNumber} displayData={displayData} />
        </div>
    );
};

export default App;
