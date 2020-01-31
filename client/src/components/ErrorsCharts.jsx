import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Switch } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    chart: {
        height: 'fit-content',
        width: '95%',
        flexWrap: 'wrap',
        display: 'flex',
        margin: '1rem 0 0',
        paddingTop: '0.8rem',
        color: '#212121',
        overflowWrap: 'break-word',
        backgroundColor: 'white',
        [theme.breakpoints.up('sm')]: {
            width: '85%',
        },
        [theme.breakpoints.up('md')]: {
            width: '70%',
        },
    },
    key: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        margin: '2rem auto',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.up('md')]: {
            width: '30%',
        },
    },
    listErrorsSection: {
        textAlign: 'left',
        overflowWrap: 'breakWord',
        width: '100%',
    },
    keyContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    colorSwatch: {
        width: '1rem',
        height: '1rem',
    },
    colorSwatch1: {
        backgroundColor: '#ff8c00',
    },
    colorSwatch2: {
        backgroundColor: '#ffcc00',
    },
    colorSwatch3: {
        backgroundColor: '#c43a31',
    },
}));

const Chart = ({ title, summary, errorData, warningData, failedRequestData, errors, warnings, failedRequests }) => {
    const classes = useStyles();
    const [showErrors, setShowErrors] = useState(true);
    const [showWarnings, setShowWarnings] = useState(true);
    const [showFailedRequests, setShowFailedRequests] = useState(true);
    return (
        <Box boxShadow={2} className={classes.chart}>
            <Box className={classes.chartTitle}>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">{summary}</Typography>
            </Box>
            <VictoryChart
                minDomain={{ y: 0 }}
                maxDomain={{ y: 10 }}
                theme={VictoryTheme.material}
                style={{
                    data: { fill: '#eeeeee' },
                    labels: { fill: '#eeeeee' },
                }}
                animate={{
                    duration: 700,
                    onLoad: { duration: 500 },
                }}
                height={500}
                width={1000}
            >
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ tickLabels: { angle: -90, fontSize: 8 } }} />
                {showErrors && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#FF8C00', strokeWidth: 2 },
                            parent: { border: '1px solid #eeeeee' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={failedRequestData}
                    />
                )}
                {showWarnings && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#FFCC00', strokeWidth: 1 },
                            parent: { border: '1px solid #eeeeee' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={warningData}
                    />
                )}
                {showFailedRequests && (
                    <VictoryLine
                        width={1600}
                        labels={datum => datum.y}
                        style={{
                            data: { stroke: '#c43a31', strokeWidth: 0.5 },
                            parent: { border: '1px solid #eeeeee' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={errorData}
                    />
                )}
            </VictoryChart>
            <Box className={classes.key}>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch1}`}></Box>
                    <Switch color="primary" checked={showErrors} onChange={e => setShowErrors(e.target.checked)}></Switch>
                    <Typography variant="h6">Errors</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch2}`}></Box>
                    <Switch color="primary" checked={showWarnings} onChange={e => setShowWarnings(e.target.checked)}></Switch>
                    <Typography variant="h6">Warnings</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch3}`}></Box>
                    <Switch color="primary" checked={showFailedRequests} onChange={e => setShowFailedRequests(e.target.checked)}></Switch>
                    <Typography variant="h6">Failed Requests</Typography>
                </Box>
            </Box>
            <Box className={classes.listErrorSection}>
                {errors !== undefined && errors.length > 0 && (
                    <ul>
                        <Typography variant="h6">Errors:</Typography>{' '}
                        {errors.map(e => (
                            <li>
                                <Typography variant="body2">{e}</Typography>
                            </li>
                        ))}
                    </ul>
                )}
                {warnings !== undefined && warnings.length > 0 && (
                    <ul>
                        <Typography variant="h6">Warnings:</Typography>{' '}
                        {warnings.map(e => (
                            <li>
                                <Typography variant="body2">{e}</Typography>
                            </li>
                        ))}
                    </ul>
                )}
                {failedRequests !== undefined && failedRequests.length > 0 && (
                    <ul>
                        <Typography variant="h6">Failed Requests:</Typography>{' '}
                        {failedRequests.map(e => (
                            <li>
                                <Typography variant="body2">{e}</Typography>
                            </li>
                        ))}
                    </ul>
                )}
            </Box>
        </Box>
    );
};

export default Chart;
