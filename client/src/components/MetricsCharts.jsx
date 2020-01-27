import React, { useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    chart: {
        height: 'fit-content',
        width: '95%',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        flexWrap: 'wrap',
        display: 'flex',
        margin: '1rem 0 0',
        paddingTop: '0.8rem',
        color: '#212121',
        boxShadow: '1px 0 10px rgba(0, 0, 0, 0.3)',
        [theme.breakpoints.up('sm')]: {
            width: '85%',
        },
        [theme.breakpoints.up('md')]: {
            width: '70%',
        },
    },
    key: {
        backgroundColor: 'white',
        border: '1px solid black',
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
}));

const Chart = ({ title, performanceScore, bestPracticeScore, accessibilityScore, seoScore }) => {
    const classes = useStyles();
    const [viewerAmount, setViewerAmount] = useState(0);

    const updateMinViewerAmount = e => {
        setViewerAmount(e.target.value);
    };

    return (
        <Box className={classes.chart}>
            <ChartTitle>
                <Typography variant="h5">{title}</Typography>
            </ChartTitle>
            <VictoryChart
                minDomain={{ y: viewerAmount }}
                maxDomain={{ y: 100 }}
                theme={VictoryTheme.material}
                style={{
                    data: { fill: '#eeeeee' },
                    labels: { fill: '#eeeeee' },
                }}
                animate={{
                    duration: 1000,
                    onLoad: { duration: 500 },
                }}
                height={500}
                width={1000}
            >
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ tickLabels: { angle: -90, fontSize: 8 } }} />
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
                <VictoryLine
                    width={1600}
                    style={{
                        data: { stroke: '#0049FF', strokeWidth: 1 },
                        parent: { border: '1px solid #ccc' },
                    }}
                    labelComponent={<VictoryTooltip />}
                    data={bestPracticeScore}
                />
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
            </VictoryChart>
            <Box className={classes.key}>
                <Performance>Performance</Performance>
                <Accessibility>Accessibility</Accessibility>
                <BestPractices>Best Practices</BestPractices>
                <SEO>SEO</SEO>
            </Box>
            {/* <SliderContainer>
                <p>0</p>
                <input type="range" name="spacing" onChange={e => updateMinViewerAmount(e)} min="0" max="100" value={viewerAmount} />
                <p>100</p>
            </SliderContainer> */}
        </Box>
    );
};

const Performance = styled.h5`
    background-color: #33ffb8;
    margin: 0;
    width: 100%;
`;
const Accessibility = styled.h5`
    background-color: #ff4200;
    margin: 0;
    width: 100%;
`;
const BestPractices = styled.h5`
    background-color: #0049ff;
    margin: 0;
    width: 100%;
`;
const SEO = styled.h5`
    background-color: #6833ff;
    margin: 0;
    width: 100%;
`;

const SliderContainer = styled.div`
    display: flex;
    margin: 0 auto;
    width: fit-content;
`;

const ChartTitle = styled.code`
    margin-top: 0.8rem;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
`;

export default Chart;
