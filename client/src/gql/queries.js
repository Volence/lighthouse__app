import gql from 'graphql-tag';

export const getSiteNames = gql`
{
  sites {
    siteName
  }
}
`;
export const getSpecificSite = site => gql`
  {
    sites(siteName: "${site}") {
      mainURLAudits {
        summary
      }
    }
  }
`;

export const createSite = gql`
    mutation createSite($siteInput: SiteInput!) {
        createSite(siteInput: $siteInput) {
            siteName
        } 
    }
`;

export const getSiteErrorAuditData = site => gql`
  {
  sites(siteName: "${site}") {
    mainURLAudits {
      created
      errorCount
      warningCount
      failedRequestCount
    }
    categoryURLAudits {
      created
      errorCount
      warningCount
      failedRequestCount
    }
    productURLAudits {
      created
      errorCount
      warningCount
      failedRequestCount
    }
    mainURLAuditDetails {
      summary
      errorsText
      warningsText
      failedRequestsText
    }
    categoryURLAuditDetails {
      summary
      errorsText
      warningsText
      failedRequestsText
    }
    productURLAuditDetails {
      summary
      errorsText
      warningsText
      failedRequestsText
    }
  }
}
`;

export const getSiteScores = site => gql`
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
`;
export const getMetricScores = site => gql`
{
  sites(siteName: "${site}") {
    mainURLLighthouseScores {
      created
      metrics {
        firstContentfulPaint {
          score
        }
        firstMeaningfulPaint {
          score
        }
        speedIndex {
          score
        }
        interactive {
          score
        }
        firstCPUIdle {
          score
        }
        maxPotentialFid {
          score
        }
      }
    }
    categoryURLLighthouseScores {
      created
      metrics {
        firstContentfulPaint {
          score
        }
        firstMeaningfulPaint {
          score
        }
        speedIndex {
          score
        }
        interactive {
          score
        }
        firstCPUIdle {
          score
        }
        maxPotentialFid {
          score
        }
      }
    }
    productURLLighthouseScores {
      created
      metrics {
        firstContentfulPaint {
          score
        }
        firstMeaningfulPaint {
          score
        }
        speedIndex {
          score
        }
        interactive {
          score
        }
        firstCPUIdle {
          score
        }
        maxPotentialFid {
          score
        }
      }
    }
  }
}
`;
