import React from 'react';
import { loadSiteErrors, loadSiteMetrics, loadSiteScores } from './ChartLoadingLogic';
import { Typography, List, ListItem, ListItemText, Tooltip } from '@material-ui/core';

const typeToolTips = [
    'Errors, Warnings, and Failed Requests from the console of a page.',
    'Performance, Accessibility, Best Practices, and Seo scores from the page.',
    'First Contentful Paint, First Meaningful Paint, Speed Index, Time to Interactive, First CPU Idle, and Estimated Input Latency from page',
];

const MapTypeList = ({ currentSelectedSite, setDisplayType, setCurrentSiteDisplayed, setDisplayData }) => {
    return (
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
    );
};

export default MapTypeList;
