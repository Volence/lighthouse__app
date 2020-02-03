import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import MainPanel from './components/MainPanel';
import Cookies from 'js-cookie';
import { getSiteNames } from './gql/queries';
import { Box, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sendQuery, AppoloWrapper } from './utils';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('Basic');
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
            let { data } = await sendQuery(getSiteNames);
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

        const checkLoginStatus = async () => {
            const loggedIn = Cookies.get('loggedIn') == 'true' ? true : false;
            if (loggedIn !== true) {
                Cookies.set('loggedIn', false);
                setIsLoggedIn(false);
                return;
            }
            setUserType(Cookies.get('userType'));
            setIsLoggedIn(true);
        };

        checkLoginStatus();
        getAndSetSites();
    }, []);

    const handleDrawerToggle = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <AppoloWrapper>
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
                    sites={sites}
                    handleDrawerToggle={handleDrawerToggle}
                    mobileDrawerOpen={mobileDrawerOpen}
                    setChartNumber={setChartNumber}
                    currentSelectedSite={currentSelectedSite}
                    setDisplayType={setDisplayType}
                    setCurrentSiteDisplayed={setCurrentSiteDisplayed}
                    setDisplayData={setDisplayData}
                    userType={userType}
                    setUserType={setUserType}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />
                <MainPanel currentSiteDisplayed={currentSiteDisplayed} chartNumber={chartNumber} displayData={displayData} />
            </div>
        </AppoloWrapper>
    );
};

export default App;
