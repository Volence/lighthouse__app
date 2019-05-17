import React, { useState, useEffect } from 'react';
import './App.css';
import styled, { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import AuditChart from './components/Chart';
import ScoresChart from './components/ScoresChart';
import MetricsChart from './components/MetricsChart';
import ApolloClient from 'apollo-boost';
import * as customQueries from './gql/queries'

const client = new ApolloClient({
  uri: 'https://volence.dev/node_apps/lighthouse_app/graphql'
});

const sendQuery = (query) => {
  return new Promise(async (res, rej) => {
    try {
      let response = await client.query({
        query: query
      });
      res(response);
    } catch(err) {
      rej(err)
    }
  })
}
const sendMutation = (mutationQuery, mutationVariable) => {
  console.log("mutationVariable ", mutationVariable);
  return new Promise(async (res, rej) => {
    try {
      let response = await client.mutate({
        mutation: mutationQuery,
        variables: {
            siteInput: mutationVariable
        }
      });
      res(response);
    } catch(err) {
      rej(err)
    }
  })
}

const App = () => {

  const [sites, setSites] = useState();
  const [currentSiteDisplayed, setCurrentSiteDisplayed] = useState(<h2>Site:</h2>);
  const [displayData, setDisplayData] = useState([<EmptyChart>Main</EmptyChart>, <EmptyChart>Category</EmptyChart>, <EmptyChart>Product</EmptyChart>]);
  const [siteCreationFormValues, setSiteCreationFormValues] = useState({siteName: '', mainURL: '', categoryURL: '', productURL: ''});

  const getSites = async () => {
    let { data } = await sendQuery(customQueries.getSiteNames);
    displaySiteList(data.sites);
  }

  const displaySiteList = (siteList) => {
    siteList = siteList.map(site => <SiteListItem key={site.siteName}>{site.siteName}:<SiteLink href="##" onClick={(e) => loadSiteErrors(e, site.siteName)}> Console Audit Info</SiteLink><SiteLink href="##" onClick={(e) => loadSiteScores(e, site.siteName)}>Site Scores</SiteLink><SiteLink href="##" onClick={(e) => loadSiteMetrics(e, site.siteName)}>Site Metrics</SiteLink></SiteListItem>);
    setSites(siteList);
  }

  const sortByCreated = (arr) => {
    return arr.sort((a,b)=> a.created.localeCompare(b.created));
  }

  const setDataForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
      data.push({x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element[type]})
    });
    return data;
  }
  const setScoresForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
      data.push({x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element.scores[type] * 100})
    });
    return data;
  }
  const setMetricsForChart = (arr, type) => {
    let data = [];
    arr.forEach(element => {
      data.push({x: moment(element.created).format('MM-DD-YYYY--HH:mm:ss'), y: element.metrics[type].score * 100})
    });
    return data;
  }

  // ==========================================================================================
  // Event Handlers
  // ==========================================================================================
  const loadSiteErrors = async (e, site) => {
    e.preventDefault();
    let { data: {sites: [data]} } = await sendQuery(customQueries.getSiteErrorAuditData(site));
    setCurrentSiteDisplayed(<h2>{site}:</h2>);

    const sortedMain = sortByCreated(data.mainURLAudits);
    const sortedCategory = sortByCreated(data.categoryURLAudits);
    const sortedProducts = sortByCreated(data.productURLAudits);

    const mainErrors = data.mainURLAuditDetails[0].errorsText;
    const mainWarnings = data.mainURLAuditDetails[0].warningsText;
    const mainFailedRequests = data.mainURLAuditDetails[0].failedRequestsText;

    const categoryErrors = data.categoryURLAuditDetails[0].errorsText;
    const categoryWarnings = data.categoryURLAuditDetails[0].warningsText;
    const categoryFailedRequests = data.categoryURLAuditDetails[0].failedRequestsText;

    const productErrors = data.productURLAuditDetails[0].errorsText;
    const productWarnings = data.productURLAuditDetails[0].warningsText;
    const productFailedRequests = data.productURLAuditDetails[0].failedRequestsText;

    const mainErrorDataForChart = setDataForChart(sortedMain, 'errorCount');
    const mainWarningDataForChart = setDataForChart(sortedMain, 'warningCount');
    const mainFailedRequestDataForChart = setDataForChart(sortedMain, 'failedRequestCount');

    const categoryErrorDataForChart = setDataForChart(sortedCategory, 'errorCount');
    const categoryWarningDataForChart = setDataForChart(sortedCategory, 'warningCount');
    const categoryFailedRequestDataForChart = setDataForChart(sortedCategory, 'failedRequestCount');

    const productErrorDataForChart = setDataForChart(sortedProducts, 'errorCount');
    const productWarningDataForChart = setDataForChart(sortedProducts, 'warningCount');
    const productFailedRequestDataForChart = setDataForChart(sortedProducts, 'failedRequestCount');

    const mainAuditChart = 
    <AuditChart 
    title="Main:" 
    summary={data.mainURLAuditDetails[0].summary} 
    errorData={mainErrorDataForChart} 
    warningData={mainWarningDataForChart} 
    failedRequestData={mainFailedRequestDataForChart}
    errors={mainErrors}
    warnings={mainWarnings}
    failedRequests={mainFailedRequests}
    />;

    const categoryAuditChart = 
    <AuditChart 
        title="Category:" 
        summary={data.categoryURLAuditDetails[0].summary} 
        errorData={categoryErrorDataForChart} 
        warningData={categoryWarningDataForChart} 
        failedRequestData={categoryFailedRequestDataForChart}
        errors={categoryErrors}
        warnings={categoryWarnings}
        failedRequests={categoryFailedRequests}
    />
    const productAuditChart = 
    <AuditChart 
        title="Product:" 
        summary={data.productURLAuditDetails[0].summary} 
        errorData={productErrorDataForChart} 
        warningData={productWarningDataForChart} 
        failedRequestData={productFailedRequestDataForChart}
        errors={productErrors}
        warnings={productWarnings}
        failedRequests={productFailedRequests}
    />

    setDisplayData([mainAuditChart, categoryAuditChart, productAuditChart]);
  }
// --------
  const submitNewSite = async (event) => {
    try {
      event.preventDefault();
      let response = sendMutation(customQueries.createSite, siteCreationFormValues);
      console.log("response ", response);
    } catch(err) {
      console.log(err)
    }
  }

// -------

  const loadSiteScores = async (e, site) => {
    e.preventDefault();
    let { data: {sites: [data]} } = await sendQuery(customQueries.getSiteScores(site));
    setCurrentSiteDisplayed(<h2>{site}:</h2>);

    const sortedMain = sortByCreated(data.mainURLLighthouseScores);
    const sortedCategory = sortByCreated(data.categoryURLLighthouseScores);
    const sortedProducts = sortByCreated(data.productURLLighthouseScores);

    const mainPerformanceScoreForChart = setScoresForChart(sortedMain, 'performance');
    const mainBestPracticesScoreForChart = setScoresForChart(sortedMain, 'bestPractice');
    const mainAccessibilityScoreForChart = setScoresForChart(sortedMain, 'accessibility');
    const mainSEOScoreForChart = setScoresForChart(sortedMain, 'seo');

    const categoryPerformanceScoreForChart = setScoresForChart(sortedCategory, 'performance');
    const categoryBestPracticesScoreForChart = setScoresForChart(sortedCategory, 'bestPractice');
    const categoryAccessibilityScoreForChart = setScoresForChart(sortedCategory, 'accessibility');
    const categorySEOScoreForChart = setScoresForChart(sortedCategory, 'seo');

    const productPerformanceScoreForChart = setScoresForChart(sortedProducts, 'performance');
    const productBestPracticesScoreForChart = setScoresForChart(sortedProducts, 'bestPractice');
    const productAccessibilityScoreForChart = setScoresForChart(sortedProducts, 'accessibility');
    const productSEOScoreForChart = setScoresForChart(sortedProducts, 'seo');

    const mainScoresChart = 
    <ScoresChart 
      title="Main:"
      performanceScore={mainPerformanceScoreForChart}
      bestPracticeScore={mainBestPracticesScoreForChart}
      accessibilityScore={mainAccessibilityScoreForChart}
      seoScore={mainSEOScoreForChart}
    />;

    const categoryScoresChart = 
    <ScoresChart 
        title="Category:" 
        performanceScore={categoryPerformanceScoreForChart}
        bestPracticeScore={categoryBestPracticesScoreForChart}
        accessibilityScore={categoryAccessibilityScoreForChart}
        seoScore={categorySEOScoreForChart}
    />
    const productScoresChart = 
    <ScoresChart 
        title="Product:" 
        performanceScore={productPerformanceScoreForChart}
        bestPracticeScore={productBestPracticesScoreForChart}
        accessibilityScore={productAccessibilityScoreForChart}
        seoScore={productSEOScoreForChart}
    />
    
    setDisplayData([mainScoresChart, categoryScoresChart, productScoresChart]);
  }

  const loadSiteMetrics = async (e, site) => {
    e.preventDefault();
    let { data: {sites: [data]} } = await sendQuery(customQueries.getMetricScores(site));
    setCurrentSiteDisplayed(<h2>{site}:</h2>);

    const sortedMain = sortByCreated(data.mainURLLighthouseScores);
    const sortedCategory = sortByCreated(data.categoryURLLighthouseScores);
    const sortedProducts = sortByCreated(data.productURLLighthouseScores);

    const mainFirstMeaningfulPaintForChart = setMetricsForChart(sortedMain, 'firstContentfulPaint');
    const mainFirstContentfulPaintForChart = setMetricsForChart(sortedMain, 'firstMeaningfulPaint');
    const mainSpeedIndexForChart = setMetricsForChart(sortedMain, 'speedIndex');
    const mainInteractiveForChart = setMetricsForChart(sortedMain, 'interactive');
    const mainFirstCPUIdleForChart = setMetricsForChart(sortedMain, 'firstCPUIdle');
    const mainLatencyForChart = setMetricsForChart(sortedMain, 'estimatedInputLatency');

    const categoryFirstMeaningfulPaintForChart = setMetricsForChart(sortedCategory, 'firstContentfulPaint');
    const categoryFirstContentfulPaintForChart = setMetricsForChart(sortedCategory, 'firstMeaningfulPaint');
    const categorySpeedIndexForChart = setMetricsForChart(sortedCategory, 'speedIndex');
    const categoryInteractiveForChart = setMetricsForChart(sortedCategory, 'interactive');
    const categoryFirstCPUIdleForChart = setMetricsForChart(sortedCategory, 'firstCPUIdle');
    const categoryLatencyForChart = setMetricsForChart(sortedCategory, 'estimatedInputLatency');

    const productFirstMeaningfulPaintForChart = setMetricsForChart(sortedProducts, 'firstContentfulPaint');
    const productFirstContentfulPaintForChart = setMetricsForChart(sortedProducts, 'firstMeaningfulPaint');
    const productSpeedIndexForChart = setMetricsForChart(sortedProducts, 'speedIndex');
    const productInteractiveForChart = setMetricsForChart(sortedProducts, 'interactive');
    const productFirstCPUIdleForChart = setMetricsForChart(sortedProducts, 'firstCPUIdle');
    const productLatencyForChart = setMetricsForChart(sortedProducts, 'estimatedInputLatency');

    const mainScoresChart = 
    <MetricsChart 
      title="Main:"
      firstContentfulPaint={mainFirstMeaningfulPaintForChart}
      firstMeaningfulPaint={mainFirstContentfulPaintForChart}
      speedIndex={mainSpeedIndexForChart}
      interactive={mainInteractiveForChart}
      firstCPUIdle={mainFirstCPUIdleForChart}
      estimatedInputLatency={mainLatencyForChart}
    />;

    const categoryScoresChart = 
    <MetricsChart 
        title="Category:" 
        firstContentfulPaint={categoryFirstMeaningfulPaintForChart}
        firstMeaningfulPaint={categoryFirstContentfulPaintForChart}
        speedIndex={categorySpeedIndexForChart}
        interactive={categoryInteractiveForChart}
        firstCPUIdle={categoryFirstCPUIdleForChart}
        estimatedInputLatency={categoryLatencyForChart}
    />
    const productScoresChart = 
    <MetricsChart 
        title="Product:" 
        firstContentfulPaint={productFirstMeaningfulPaintForChart}
        firstMeaningfulPaint={productFirstContentfulPaintForChart}
        speedIndex={productSpeedIndexForChart}
        interactive={productInteractiveForChart}
        firstCPUIdle={productFirstCPUIdleForChart}
        estimatedInputLatency={productLatencyForChart}
    />
    
    setDisplayData([mainScoresChart, categoryScoresChart, productScoresChart]);
  }

  const updateSiteCreationFormValues = (event, propertyName) => {
    event.preventDefault();
    setSiteCreationFormValues({...siteCreationFormValues, [propertyName]: event.target.value});
  }

  useEffect(() => {
    getSites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
    <GlobalStyle/>
      <h1>Current Sites in the Database:</h1>
      <SitesContainer>
        {sites}
        <SiteAreaTitles>{currentSiteDisplayed}</SiteAreaTitles>
        <Charts>
          {displayData}
        </Charts>
      </SitesContainer>
      <div>
        <h2>Add a site:</h2>
        <AddSiteForm onSubmit={e => submitNewSite(e)}>
          <label>Site Name:</label>
          <input 
            type='text' 
            placeholder='esslinger'
            value={siteCreationFormValues.siteName} 
            onChange={e => updateSiteCreationFormValues(e, 'siteName')} 
          >
          </input>
          <label>Main URL:</label>
          <input 
            type='text' 
            placeholder='https://www.esslinger.com/'
            value={siteCreationFormValues.mainURL} 
            onChange={e => updateSiteCreationFormValues(e, 'mainURL')} 
          >
          </input>
          <label>Category URL:</label>
          <input 
            type='text' 
            placeholder='https://www.esslinger.com/watch-parts/'
            value={siteCreationFormValues.categoryURL} 
            onChange={e => updateSiteCreationFormValues(e, 'categoryURL')} 
          >
          </input>
          <label>Product URL:</label>
          <input 
            type='text' 
            placeholder='https://www.esslinger.com/watch-battery-energizer-377-and-376-replacement-cell/'
            value={siteCreationFormValues.productURL} 
            onChange={e => updateSiteCreationFormValues(e, 'productURL')} 
          >
          </input>
          <AddSiteButton type='submit'>Add Site</AddSiteButton>
        </AddSiteForm>
      </div>
    </div>
  );
}

const GlobalStyle = createGlobalStyle`
    body {
      background-color: #EEEEEE;
    }
    tspan {
      fill: #eeeeee;
    }
    input[type=range] {
      height: 29px;
      -webkit-appearance: none;
      margin: 10px 20px;
      width: 100%;
      background-color: transparent;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 1px 1px 1px #000000;
      background: #3883C4;
      border-radius: 0px;
      border: 1px solid #000000;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 1px 1px 2px #000000;
      border: 1px solid #000000;
      height: 14px;
      width: 14px;
      border-radius: 10px;
      background: #eeeeee;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -8.5px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #3883C4;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 1px 1px 1px #000000;
      background: #3883C4;
      border-radius: 0px;
      border: 1px solid #000000;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 1px 1px 2px #000000;
      border: 1px solid #000000;
      height: 21px;
      width: 21px;
      border-radius: 10px;
      background: #F6A1FF;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
      animate: 0.2s;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #3883C4;
      border: 1px solid #000000;
      border-radius: 0px;
      box-shadow: 1px 1px 1px #000000;
    }
    input[type=range]::-ms-fill-upper {
      background: #3883C4;
      border: 1px solid #000000;
      border-radius: 0px;
      box-shadow: 1px 1px 1px #000000;
    }
    input[type=range]::-ms-thumb {
      margin-top: 1px;
      box-shadow: 1px 1px 2px #000000;
      border: 1px solid #000000;
      height: 21px;
      width: 21px;
      border-radius: 10px;
      background: #F6A1FF;
      cursor: pointer;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #3883C4;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #3883C4;
    }
`;

const SiteListItem = styled.div`
    margin: .4rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 65%;
    text-align: left;
`

const SiteLink = styled.a`
    font-weight: bold;
    text-decoration: none;
    border: 1px solid black;
    background-color: #B2EBF2;
    box-shadow: 1px 0 4px black;
    margin: 0 .4rem;
    color: #212121;
    padding: .4rem .8rem;
    transition: .4s all;
    text-align: center;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 5px 0 8px black;
      background-color: #00BCD4;
    }
`;

const SitesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Charts = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
`;

const AddSiteForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rem;
`;

const AddSiteButton = styled.button`
    margin-top: .6rem;
`;

const EmptyChart = styled.div`
    height: 55rem;
    width: 33%;
    min-width: 45rem;
    border: 1px solid black;
    flex-wrap: wrap;
    margin: 4rem 0 0;
    padding-top: .8rem;
    background-color: #BEBEBE;
    color: #212121;
    box-shadow: 1px 0 10px rgba(0, 0, 0, .6);
`

const SiteAreaTitles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 0;
`

export default App;
