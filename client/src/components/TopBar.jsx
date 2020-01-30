import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, TextField } from '@material-ui/core';
import { loadSiteErrors, loadSiteMetrics, loadSiteScores } from './ChartLoadingLogic';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    topBar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0',
        paddingLeft: '.8rem',
        paddingBottom: '1rem',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '0',
        },
    },
    topBarLeft: {
        display: 'flex',
        alignItems: 'center',
    },
    siteSelectionContainer: {
        marginLeft: '0',
        [theme.breakpoints.up('sm')]: {
            marginLeft: 'auto',
        },
    },
    siteSelectionLabel: {
        backgroundColor: '#fff',
        color: '#000',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

const TopBar = ({ handleDrawerToggle, sites, setCurrentSelectedSite, setCurrentSiteDisplayed, displayType, setDisplayData }) => {
    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.topBar}>
                <Box className={classes.topBarLeft}>
                    <IconButton onClick={handleDrawerToggle} edge="start" aria-label="open drawer" className={classes.menuButton} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={'test'}>
                        Lighthouse App
                    </Typography>
                </Box>
                {/* <Button color="inherit">Login</Button> */}
                <Autocomplete
                    id="combo-box-demo"
                    className={classes.siteSelectionContainer}
                    classes={{
                        inputRoot: classes.inputRoot,
                        tag: classes.label,
                        tagSizeSmall: classes.label,
                    }}
                    options={sites ? sites.sort((a, b) => -b.siteName.localeCompare(a.siteName)) : sites}
                    groupBy={option => option.siteName[0].toUpperCase()}
                    onChange={async (e, value) => {
                        if (value === 'Select Site' || value === null) return;
                        setCurrentSelectedSite(value);
                        setCurrentSiteDisplayed(
                            <Typography variant="h5" className={classes.chartTitle}>
                                {`${value.siteName} (${displayType})`}:
                            </Typography>
                        );
                        if (displayType.toLowerCase() === 'errors') {
                            setDisplayData(await loadSiteErrors(value.siteName));
                        } else if (displayType.toLowerCase() === 'metrics') {
                            setDisplayData(await loadSiteScores(value.siteName));
                        } else {
                            setDisplayData(await loadSiteMetrics(value.siteName));
                        }
                    }}
                    getOptionLabel={option => option.siteName}
                    style={{ width: 300 }}
                    size="small"
                    renderInput={params => <TextField className={classes.siteSelectionLabel} {...params} label="Select Site" variant="filled" fullWidth />}
                />
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
