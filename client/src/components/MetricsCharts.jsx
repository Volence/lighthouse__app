import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';
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
        overflowWrap: 'break-word',
        color: '#212121',
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
}));

const Chart = ({ title, performanceScore, bestPracticeScore, accessibilityScore, seoScore }) => {
    const classes = useStyles();
    const [showPerformance, setShowPerformance] = useState(true);
    const [showAccessibility, setShowAccessibility] = useState(true);
    const [showBestPractices, setShowBestPractices] = useState(true);
    const [showSEO, setShowSEO] = useState(true);

    return (
        <Box boxShadow={2} className={classes.chart}>
            <Box className={classes.chartTitle}>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">Main Categories from The Lighthouse App</Typography>
            </Box>
            <VictoryChart
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
                {showPerformance && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#33FFB8', strokeWidth: 2 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labels={() => 'Performance'}
                        labelComponent={<VictoryTooltip activeData={true} />}
                        data={performanceScore}
                    />
                )}
                {showAccessibility && (
                    <VictoryLine
                        width={1600}
                        style={{
                            data: { stroke: '#0049FF', strokeWidth: 1 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={bestPracticeScore}
                    />
                )}
                {showBestPractices && (
                    <VictoryLine
                        width={1600}
                        labels={datum => datum.y}
                        style={{
                            data: { stroke: '#FF4200', strokeWidth: 0.5 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={accessibilityScore}
                    />
                )}
                {showSEO && (
                    <VictoryLine
                        width={1600}
                        labels={datum => datum.y}
                        style={{
                            data: { stroke: '#6833FF', strokeWidth: 0.25 },
                            parent: { border: '1px solid #ccc' },
                        }}
                        labelComponent={<VictoryTooltip />}
                        data={seoScore}
                    />
                )}
            </VictoryChart>
            <Box className={classes.key}>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch1}`}></Box>
                    <Switch color="primary" checked={showPerformance} onChange={e => setShowPerformance(e.target.checked)}></Switch>
                    <Typography variant="h6">Performance</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch2}`}></Box>
                    <Switch color="primary" checked={showAccessibility} onChange={e => setShowAccessibility(e.target.checked)}></Switch>
                    <Typography variant="h6">Accessibility</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch3}`}></Box>
                    <Switch color="primary" checked={showBestPractices} onChange={e => setShowBestPractices(e.target.checked)}></Switch>
                    <Typography variant="h6">Best Practices</Typography>
                </Box>
                <Box className={classes.keyContainer}>
                    <Box className={`${classes.colorSwatch} ${classes.colorSwatch4}`}></Box>
                    <Switch color="primary" checked={showSEO} onChange={e => setShowSEO(e.target.checked)}></Switch>
                    <Typography variant="h6">SEO</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Chart;
