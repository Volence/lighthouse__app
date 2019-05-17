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
            style={{
              data: {fill: '#eeeeee'},
              labels: {fill: '#eeeeee'}
            }}
          >
          <VictoryAxis dependentAxis/>
          <VictoryAxis
            style={{ tickLabels: { angle: -90, fontSize: 4 } }}
          />
          <VictoryLine
            width={1600}
            style={{
              data: { stroke: "#FF8C00", strokeWidth: 2 },
              parent: { border: "1px solid #eeeeee"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={failedRequestData}
          />
          <VictoryLine
            width={1600}
            style={{
              data: { stroke: "#FFCC00", strokeWidth: 1 },
              parent: { border: "1px solid #eeeeee"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={warningData}
          />
          <VictoryLine
            width={1600}
            labels={(datum) => datum.y}
            style={{
              data: { stroke: "#c43a31", strokeWidth: .5 },
              parent: { border: "1px solid #eeeeee"},
            }}
            labelComponent={<VictoryTooltip/>}
            data={errorData}
          />
          </VictoryChart>
          <Key>
              <Errors>Errors</Errors>
              <Warnings>Warnings</Warnings>
              <FailedRequests>Failed Requests</FailedRequests>
          </Key>
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
    background: #BEBEBE;
    color: #212121;
    border: 1px solid #222831;
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
`

const Errors = styled.h5`
    background-color: #FF8C00;
    margin: 0;
    width: 100%;
`
const Warnings = styled.h5`
    background-color: #FFCC00;
    margin: 0;
    width: 100%;
`
const FailedRequests = styled.h5`
    background-color: #c43a31;
    margin: 0;
    width: 100%;
`

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