import gql from 'graphql-tag';

const getSiteNames = gql`
    {
        sites {
            siteName
        }
    }
`;
const getSpecificSite = site => gql`
  {
    sites(siteName: "${site}") {
      mainURLAudits {
        summary
      }
    }
  }
`;

const createSite = gql`
    mutation createSite($siteInput: SiteInput!) {
        createSite(siteInput: $siteInput) {
            siteName
        }
    }
`;

const addAdmin = gql`
    mutation addAdmin($email: String!) {
        addAdmin(email: $email) {
            error
            success
        }
    }
`;
const removeAdmin = gql`
    mutation removeAdmin($email: String!) {
        removeAdmin(email: $email) {
            error
            success
        }
    }
`;

const getUsers = gql`
    {
        users {
            userName
            email
            userType
        }
    }
`;

const signIn = gql`
    mutation signIn($clientData: SignInData!) {
        signIn(clientData: $clientData) {
            userName
            created
            lastSignIn
            email
            userID
            error
            userType
        }
    }
`;

const runSiteAudits = gql`
    mutation signIn($siteName: [String]) {
        runSiteAudits(siteName: $siteName) {
            error
            success
        }
    }
`;

const getSiteErrorAuditData = site => gql`
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

const getSiteScores = site => gql`
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
const getMetricScores = site => gql`
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

export {
    getSiteNames,
    getSpecificSite,
    createSite,
    getUsers,
    signIn,
    getSiteErrorAuditData,
    getSiteScores,
    getMetricScores,
    addAdmin,
    removeAdmin,
    runSiteAudits,
};
