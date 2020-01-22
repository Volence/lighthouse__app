import React, { useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';
import { Typography } from '@material-ui/core';

const Chart = ({ title, performanceScore, bestPracticeScore, accessibilityScore, seoScore }) => {
    const [viewerAmount, setViewerAmount] = useState(0);

    const updateMinViewerAmount = e => {
        setViewerAmount(e.target.value);
    };

    return (
        <ChartContainer>
            <ChartTitle>
                <Typography variant="h5">{title}</Typography>
            </ChartTitle>
            <VictoryChart padding={{ left: 70, top: 70, right: 70, bottom: 70 }} minDomain={{ y: viewerAmount }} maxDomain={{ y: 100 }} theme={VictoryTheme.material}>
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ tickLabels: { angle: -90, fontSize: 4 } }} />
                <VictoryLine
                    width={1600}
                    style={{
                        data: { stroke: '#33FFB8', strokeWidth: 2 },
                        parent: { border: '1px solid #ccc' },
                    }}
                    labelComponent={<VictoryTooltip />}
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
            <Key>
                <Performance>Performance</Performance>
                <Accessibility>Accessibility</Accessibility>
                <BestPractices>Best Practices</BestPractices>
                <SEO>SEO</SEO>
            </Key>
            <SliderContainer>
                <p>0</p>
                <input type="range" name="spacing" onChange={e => updateMinViewerAmount(e)} min="0" max="100" value={viewerAmount} />
                <p>100</p>
            </SliderContainer>
        </ChartContainer>
    );
};

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
`;

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

const ChartTitle = styled.code`
    margin-top: 0.8rem;
    margin-bottom: -6rem;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
`;

export default Chart;
