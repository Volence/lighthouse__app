import React, { useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';

const Chart = ({title, performanceScore, bestPracticeScore, accessibilityScore, seoScore}) => {
    const [viewerAmount, setViewerAmount] = useState(4);

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
            data: { stroke: "#33FFB8", strokeWidth: 2 },
            parent: { border: "1px solid #ccc"},
          }}
          labelComponent={<VictoryTooltip/>}
          data={performanceScore}
          />
          <VictoryLine
          width={1600}
          style={{
            data: { stroke: "#0049FF", strokeWidth: 1 },
            parent: { border: "1px solid #ccc"},
          }}
          labelComponent={<VictoryTooltip/>}
          data={bestPracticeScore}
          />
          <VictoryLine
          width={1600}
          labels={(datum) => datum.y}
          style={{
            data: { stroke: "#FF4200", strokeWidth: .5 },
            parent: { border: "1px solid #ccc"},
          }}
          labelComponent={<VictoryTooltip/>}
          data={accessibilityScore}
          />
          <VictoryLine
          width={1600}
          labels={(datum) => datum.y}
          style={{
            data: { stroke: "#6833FF", strokeWidth: .25 },
            parent: { border: "1px solid #ccc"},
          }}
          labelComponent={<VictoryTooltip/>}
          data={seoScore}
          />
          </VictoryChart>
          <Key>
              <Performance>Performance</Performance>
              <Accessibility>Accessibility</Accessibility>
              <BestPractices>Best Practices</BestPractices>
              <SEO>SEO</SEO>
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
`

const Performance = styled.h5`
    background-color: #33FFB8;
    margin: 0;
    width: 100%;
`
const Accessibility = styled.h5`
    background-color: #FF4200;
    margin: 0;
    width: 100%;
`
const BestPractices = styled.h5`
    background-color: #0049FF;
    margin: 0;
    width: 100%;
`
const SEO = styled.h5`
    background-color: #6833FF;
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