import React from 'react';
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
        overflowWrap: 'break-word',
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

const Chart = ({ title, summary, errorData, warningData, failedRequestData, errors, warnings, failedRequests }) => {
    const classes = useStyles();
    return (
        <Box className={classes.chart}>
            <ChartTitle>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">{summary}</Typography>
            </ChartTitle>
            <VictoryChart
                minDomain={{ y: 0 }}
                maxDomain={{ y: 10 }}
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
                        data: { stroke: '#FF8C00', strokeWidth: 2 },
                        parent: { border: '1px solid #eeeeee' },
                    }}
                    labelComponent={<VictoryTooltip />}
                    data={failedRequestData}
                />
                <VictoryLine
                    width={1600}
                    style={{
                        data: { stroke: '#FFCC00', strokeWidth: 1 },
                        parent: { border: '1px solid #eeeeee' },
                    }}
                    labelComponent={<VictoryTooltip />}
                    data={warningData}
                />
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
            </VictoryChart>
            <Box className={classes.key}>
                <Errors>Errors</Errors>
                <Warnings>Warnings</Warnings>
                <FailedRequests>Failed Requests</FailedRequests>
            </Box>
            <ListErrorSection>
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
            </ListErrorSection>
        </Box>
    );
};

const Errors = styled.h5`
    background-color: #ff8c00;
    margin: 0;
    width: 100%;
`;
const Warnings = styled.h5`
    background-color: #ffcc00;
    margin: 0;
    width: 100%;
`;
const FailedRequests = styled.h5`
    background-color: #c43a31;
    margin: 0;
    width: 100%;
`;

const ChartTitle = styled.code`
    margin-top: 0.8rem;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
`;

const ListErrorSection = styled.div`
    text-align: left;
    overflow-wrap: break-word;
    width: 100%;
`;

export default Chart;
