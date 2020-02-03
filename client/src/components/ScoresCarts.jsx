import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryZoomContainer } from 'victory';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Switch, Typography } from '@material-ui/core';

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
    chartTitle: {
        marginTop: '0.8rem',
        paddingLeft: '2rem',
        display: 'flex',
        flexDirection: 'column',
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
        backgroundColor: '#33ffb8',
    },
    colorSwatch2: {
        backgroundColor: '#ff4200',
    },
    colorSwatch3: {
        backgroundColor: '#0049ff',
    },
    colorSwatch4: {
        backgroundColor: '#6833ff',
    },
    colorSwatch5: {
        backgroundColor: '#cfc800',
    },
    colorSwatch6: {
        backgroundColor: '#6b00cf',
    },
}));

const Chart = ({ title, firstContentfulPaint, firstMeaningfulPaint, speedIndex, interactive, firstCPUIdle, maxPotentialFid }) => {
    const classes = useStyles();
    const [showFirstContentfulPaint, setShowFirstContentfulPaint] = useState(true);
    const [showFirstMeaningfulPaint, setShowFirstMeaningfulPaint] = useState(true);
    const [showSpeedIndex, setShowSpeedIndex] = useState(true);
    const [showInteractive, setShowInteractive] = useState(true);
    const [showFirstCPUIdle, setShowFirstCPUIdle] = useState(true);
    const [showMaxPotentialFid, setShowMaxPotentialFid] = useState(true);

    return (
        <Box boxShadow={2} className={classes.chart}>
            <Box className={classes.chartTitle}>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">Various Scores from the Performance Category</Typography>
            </Box>
            <VictoryChart
                containerComponent={<VictoryZoomContainer />}
                minDomain={{ y: 0 }}
                maxDomain={{ y: 100 }}
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
                {showFirstContentfulPaint && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#33FFB8', strokeWidth: 2.5 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={firstContentfulPaint}
                    />
                )}
                {showFirstMeaningfulPaint && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#FF4200', strokeWidth: 2 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={firstMeaningfulPaint}
                    />
                )}
                {showSpeedIndex && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#0049FF', strokeWidth: 1.5 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={speedIndex}
                    />
                )}
                {showInteractive && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#6833FF', strokeWidth: 1 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={interactive}
                    />
                )}
                {showFirstCPUIdle && (
                    <VictoryLine
                        width={1600}
                        labels={datum => datum.y}
                        style={{
                            data: { stroke: '#CFC800', strokeWidth: 0.5 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={firstCPUIdle}
                    />
                )}
                {showMaxPotentialFid && (
                    <VictoryLine
                        width={1600}
                        labels={datum => datum.y}
                        style={{
                            data: { stroke: '#6B00CF', strokeWidth: 0.25 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={maxPotentialFid}
                    />
                )}
            </VictoryChart>
            <Box className={classes.key}>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch1}`}></Box>
                    <Switch color="primary" checked={showFirstContentfulPaint} onChange={e => setShowFirstContentfulPaint(e.target.checked)}></Switch>
                    <Typography variant="h6">First Contentful Paint</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch2}`}></Box>
                    <Switch color="primary" checked={showFirstMeaningfulPaint} onChange={e => setShowFirstMeaningfulPaint(e.target.checked)}></Switch>
                    <Typography variant="h6">First Meaningful Paint</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch3}`}></Box>
                    <Switch color="primary" checked={showSpeedIndex} onChange={e => setShowSpeedIndex(e.target.checked)}></Switch>
                    <Typography variant="h6">Speed Index</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch4}`}></Box>
                    <Switch color="primary" checked={showInteractive} onChange={e => setShowInteractive(e.target.checked)}></Switch>
                    <Typography variant="h6">Interactive</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch5}`}></Box>
                    <Switch color="primary" checked={showFirstCPUIdle} onChange={e => setShowFirstCPUIdle(e.target.checked)}></Switch>
                    <Typography variant="h6">First CPU Idle</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch6}`}></Box>
                    <Switch color="primary" checked={showMaxPotentialFid} onChange={e => setShowMaxPotentialFid(e.target.checked)}></Switch>
                    <Typography variant="h6">Max Potential Fid</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Chart;
