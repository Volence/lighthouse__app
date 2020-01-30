import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    siteContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    chartContent: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    mobilePadding: {
        height: '40px',
        [theme.breakpoints.up('sm')]: {
            height: '0',
        },
    },
}));

const MainPanel = ({ currentSiteDisplayed, displayData, chartNumber }) => {
    const classes = useStyles();
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <div className={classes.mobilePadding} />
            {/* <Typography variant="h3">Current Sites in the Database:</Typography> */}
            <div className={classes.siteContainer}>
                {currentSiteDisplayed}
                <div className={classes.chartContent}>{displayData[chartNumber]}</div>
            </div>
        </main>
    );
};
export default MainPanel;
