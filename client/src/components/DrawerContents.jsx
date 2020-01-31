import React from 'react';
import Modal from './Modal';
import { loadSiteErrors, loadSiteMetrics, loadSiteScores } from './ChartLoadingLogic';
import { Typography, Divider, List, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    google: {
        marginTop: 'auto',
    },
}));

const pageToolTips = ['The Main Page', 'The Category Page', 'The Product Page'];
const typeToolTips = [
    'Errors, Warnings, and Failed Requests from the console of a page.',
    'Performance, Accessibility, Best Practices, and Seo scores from the page.',
    'First Contentful Paint, First Meaningful Paint, Speed Index, Time to Interactive, First CPU Idle, and Estimated Input Latency from page',
];
const addSiteToolTips = 'Add a new site to the database';

const DrawerContents = ({ setChartNumber, currentSelectedSite, setDisplayType, setCurrentSiteDisplayed, setDisplayData }) => {
    const classes = useStyles();
    const responseGoogle = response => {
        console.log('response', response);
    };
    const logout = response => {
        console.log('response2', response);
    };
    return (
        <>
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
                            onClick={async e => {
                                if (currentSelectedSite === 'Select Site') return;
                                setDisplayType(text);
                                setCurrentSiteDisplayed(
                                    <Typography variant="h5" className={'test'}>
                                        {`${currentSelectedSite.siteName} (${text})`}:
                                    </Typography>
                                );
                                if (text.toLowerCase() === 'errors') {
                                    setDisplayData(await loadSiteErrors(currentSelectedSite.siteName));
                                } else if (text.toLowerCase() === 'metrics') {
                                    setDisplayData(await loadSiteScores(currentSelectedSite.siteName));
                                } else {
                                    setDisplayData(await loadSiteMetrics(currentSelectedSite.siteName));
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
            <GoogleLogin
                clientId="19242543304-9rrof3emeds7ii5e01epmirn8f483v0l.apps.googleusercontent.com"
                buttonText="Login"
                className={classes.google}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            {/* <GoogleLogout clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com" buttonText="Logout" onLogoutSuccess={logout}></GoogleLogout> */}
        </>
    );
};

export default DrawerContents;
