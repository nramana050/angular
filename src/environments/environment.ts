import { ApplicationConstant } from "src/app/framework/constants/app-constant";

export const environment = {
  production: false,
  apiURL: 'https://devservices.sequation.net',
  logo: `./assets/logo/Captr_Logo_kw.png`,
  appTitle: window.location.host.split('-')[0].toUpperCase(),
  appInsights: {
    instrumentationKey: '451221f0-7c79-4813-9ea3-a8b385b2fd5b'
  },
  azureBlobStorage: 'https://sequationdevsav2.blob.core.windows.net',
  fileSizeLimit: '1GB',
  reportsBiUrl:
'https://pefreports.azurewebsites.net/api/reportEmbedToken?code=0Ka4OeDVa4v/sUks1N0mEsJPTrneC9INGemW0muwfCc5kg4ZYyyYdQ==',
  cdnUrl:'https://sequation-dev-v2-cdn.sequation.net',
  microsoftClarityProjectId : 'k2nu2ehd6t',
  env:ApplicationConstant.DEV_ENV,
  buildId: "{jenkinsBuildId}",
  issuer: 'https://trial-6877763.okta.com',
  clientId: '0oac2i6d0q9NmC3bH697'
};
