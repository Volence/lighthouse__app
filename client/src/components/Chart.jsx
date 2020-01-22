import React from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';
import { Typography } from '@material-ui/core';

const Chart = ({ title, summary, errorData, warningData, failedRequestData, errors, warnings, failedRequests }) => {
    return (
        <ChartContainer>
            <ChartTitle>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">{summary}</Typography>
            </ChartTitle>
            <VictoryChart
                padding={{ left: 70, top: 70, right: 70, bottom: 70 }}
                minDomain={{ y: 0 }}
                maxDomain={{ y: 10 }}
                theme={VictoryTheme.material}
                style={{
                    data: { fill: '#eeeeee' },
                    labels: { fill: '#eeeeee' },
                }}
            >
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ tickLabels: { angle: -90, fontSize: 4 } }} />
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
            <Key>
                <Errors>Errors</Errors>
                <Warnings>Warnings</Warnings>
                <FailedRequests>Failed Requests</FailedRequests>
            </Key>
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
        </ChartContainer>
    );
};

const ChartContainer = styled.div`
    position: relative;
    height: fit-content;
    width: 50%;
    border: 1px solid black;
    flex-wrap: wrap;
    margin: 4rem 0 0;
    padding-top: 0.8rem;
    color: #212121;
    box-shadow: 1px 0 10px rgba(0, 0, 0, 0.3);
`;

const Key = styled.div`
    background-color: white;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30%;
    margin: auto;
    box-shadow: 2px 0 8px black;
    color: #222831;
`;

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

const Summary = styled.pre`
    margin-bottom: -120px;
`;

const ChartTitle = styled.code`
    margin-top: 0.8rem;
    margin-bottom: -6rem;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
`;

const ListErrorSection = styled.div`
    text-align: left;
`;

export default Chart;
