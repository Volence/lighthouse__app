import React, { useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';

const Chart = ({title, firstContentfulPaint, firstMeaningfulPaint, speedIndex, interactive, firstCPUIdle, estimatedInputLatency}) => {
    const [viewerAmount, setViewerAmount] = useState(0);

    const updateMinViewerAmount = (e) => {
        setViewerAmount(e.target.value);
    }

    return(
        <ChartContainer>
            <ChartTitle><b>{title}</b></ChartTitle>
          <VictoryChart
            padding={{ left: 70, top: 70, right: 70, bottom: 70 }}        
            minDomain={{ y: viewerAmount }}
            maxDomain={{ y: 100 }}
            theme={VictoryTheme.material}
          >
          <VictoryAxis dependentAxis/>
          <VictoryAxis
              style={{ tickLabels: { angle: -90, fontSize: 4 } }}
          />
          <VictoryLine
            width={1600}
            style={{
                data: { stroke: "#33FFB8", strokeWidth: 2.5 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={firstContentfulPaint}
          />
          <VictoryLine
            width={1600}
            style={{
                data: { stroke: "#FF4200", strokeWidth: 2 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={firstMeaningfulPaint}
          />
          <VictoryLine
            width={1600}
            style={{
                data: { stroke: "#0049FF", strokeWidth: 1.5 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={speedIndex}
          />
          <VictoryLine
            width={1600}
            style={{
                data: { stroke: "#6833FF", strokeWidth: 1 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={interactive}
          />
          <VictoryLine
            width={1600}
            labels={(datum) => datum.y}
            style={{
                data: { stroke: "#CFC800", strokeWidth: .5 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={firstCPUIdle}
          />
          <VictoryLine
            width={1600}
            labels={(datum) => datum.y}
            style={{
                data: { stroke: "#6B00CF", strokeWidth: .25 },
                parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={estimatedInputLatency}
          />
          </VictoryChart>
          <Key>
              <FirstContentfulPaint>First Contentful Paint</FirstContentfulPaint>
              <FirstMeaningfulPaint>First Meaningful Paint</FirstMeaningfulPaint>
              <SpeedIndex>Speed Index</SpeedIndex>
              <Interactive>Interactive</Interactive>
              <FirstCPUIdle>First CPU Idle</FirstCPUIdle>
              <EstimatedInputLatency>Estimated Input Latency</EstimatedInputLatency>
          </Key>
          <SliderContainer><p>0</p><input type="range" name="spacing" onChange={e => updateMinViewerAmount(e)} min="0" max="100" value={viewerAmount} /><p>100</p></SliderContainer>
        </ChartContainer>
    );

    
}

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
`

const FirstContentfulPaint = styled.h5`
    background-color: #33FFB8;
    margin: 0;
    width: 100%;
`
const FirstMeaningfulPaint = styled.h5`
    background-color: #FF4200;
    margin: 0;
    width: 100%;
`
const SpeedIndex = styled.h5`
    background-color: #0049FF;
    margin: 0;
    width: 100%;
`
const Interactive = styled.h5`
    background-color: #6833FF;
    margin: 0;
    width: 100%;
`
const FirstCPUIdle = styled.h5`
    background-color: #CFC800;
    margin: 0;
    width: 100%;
`
const EstimatedInputLatency = styled.h5`
    background-color: #6B00CF;
    margin: 0;
    width: 100%;
`

const SliderContainer = styled.div`
    display: flex;
    margin: 0 auto;
    width: fit-content;
`

const ChartContainer = styled.div`
    padding-top: .8rem;
    max-width: 33%;
    min-width: 45rem;
    width: 33%;
    margin: 4rem 0 0;
    height: fit-content;
    position: relative;
    min-height: 55rem;
    box-shadow: 1px 0 10px rgba(0, 0, 0, .6);
    background: linear-gradient(rgba(36, 187, 233, .4), rgba(190, 187, 233, .4));
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2));
    }
`;

const ChartTitle = styled.code`
    margin-top: .8rem;
`;

export default Chart;