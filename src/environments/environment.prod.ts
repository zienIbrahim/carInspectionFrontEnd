import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl:"https://app.redaimond.com:7008/api/"

};
