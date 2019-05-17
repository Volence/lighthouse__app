import gql from 'graphql-tag';

export const getSiteNames =gql`
{
  sites {
    siteName
  }
}
`
export const getSpecificSite = (site) => gql`
  {
    sites(siteName: "${site}") {
      mainURLAudits {
        summary
      }
    }
  }
`

export const createSite = gql`
    mutation createSite($siteInput: SiteInput!) {
        createSite(siteInput: $siteInput) {
            siteName
        } 
    }
`

export const getSiteErrorAuditData = (site) => gql`
  {
  sites(siteName: "${site}") {
    mainURLAudits {
      created
      summary
      errorCount
      warningCount
      failedRequestCount
      errorsText
      warningsText
      failedRequestsText
    }
    categoryURLAudits {
      created
      summary
      errorCount
      warningCount
      failedRequestCount
      errorsText
      warningsText
      failedRequestsText
    }
    productURLAudits {
      created
      summary
      errorCount
      warningCount
      failedRequestCount
      errorsText
      warningsText
      failedRequestsText
      }
    }
  }
`

export const getSiteScores = (site) => gql`
{
  sites(siteName: "${site}") {
		mainURLLighthouseScores {
      created
      scores {
        performance
        bestPractice
        accessibility
        seo
      }
    }
    categoryURLLighthouseScores {
      created
      scores {
        performance
        bestPractice
        accessibility
        seo
      }      
    }
    productURLLighthouseScores {
      created
      scores {
        performance
        bestPractice
        accessibility
        seo
      }
    }
  }
}
`