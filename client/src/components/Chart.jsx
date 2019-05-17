import React from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip } from 'victory';


const Chart = ({title, summary, errorData, warningData, failedRequestData, errors, warnings, failedRequests}) => {
    return(
      <ChartContainer>
        <ChartTitle><b>{title}</b><Summary>{summary}</Summary></ChartTitle>
          <VictoryChart
            padding={{ left: 70, top: 70, right: 70, bottom: 70 }}        
            minDomain={{ y: 0 }}
            maxDomain={{ y: 10 }}
              theme={VictoryTheme.material}
          >
          <VictoryAxis dependentAxis/>
          <VictoryAxis
            style={{ tickLabels: { angle: -90, fontSize: 4 } }}
          />
          <VictoryLine
            width={1600}
            style={{
              data: { stroke: "#FF8C00", strokeWidth: 2 },
              parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={failedRequestData}
          />
          <VictoryLine
            width={1600}
            style={{
              data: { stroke: "#FFCC00", strokeWidth: 1 },
              parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={warningData}
          />
          <VictoryLine
            width={1600}
            labels={(datum) => datum.y}
            style={{
              data: { stroke: "#c43a31", strokeWidth: .5 },
              parent: { border: "1px solid #ccc"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={errorData}
          />
          </VictoryChart>
          <ListErrorSection>
            {(errors !== undefined && errors.length > 0) && <ul><b>Errors:</b> {errors.map(e => <li>{e}</li>)}</ul>}
            {(warnings !== undefined && warnings.length > 0) && <ul><b>Warnings:</b> {warnings.map(e => <li>{e}</li>)}</ul>}
            {(failedRequests !== undefined && failedRequests.length > 0) && <ul><b>Failed Requests:</b> {failedRequests.map(e => <li>{e}</li>)}</ul>}
          </ListErrorSection>
        </ChartContainer>
    );

    
}

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

const Summary = styled.pre`
   margin-bottom: -120px;
`;

const ChartTitle = styled.code`
   margin-top: .8rem;
`;

const ListErrorSection = styled.div`
    text-align: left;
`;

export default Chart;