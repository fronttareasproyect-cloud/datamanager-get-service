// import { BbvaBtgeDataManagerBase } from '@btge/bbva-btge-data-manager-base';
// import { BGADPAnyServicePost } from '@cells-components/bgadp-any-service';

// import {
//   onRequestSuccess,
//   onErrorParsed,
//   getApiConfig,
//   getPropValue,
//   getConfig
// } from '@btge/bbva-btge-helpers';

// // DM
// export class BbvaBtgeContractingProcessesCreditHistoryLoansScorePostService extends BbvaBtgeDataManagerBase {

//   constructor(...args) {
//     super(...args);
//     const [config = {}] = args;
//     this.host = config.host || '';
//     this.params = config.params || {};
//     this.requiresTsec = config.requiresTsec !== undefined ? config.requiresTsec : true;
//     this.version = config.version !== undefined ? config.version : 0;
//     this.htmlContext = config.htmlContext;
//   }

//   getCreditHistoryLoansScore(params) {
//     const config = this._getApiConfig(params);
//     return this._request(config);
//   }

//   _getApiConfig(params = {}) {
//     const config = getApiConfig(
//       this.host,
//       this.params,
//       this.requiresTsec,
//       this.version,
//       this.htmlContext
//     );

//     config.params = { ...this.params, ...params };

//     return config;
//   }

//   _mapResponse(data) {
//     const { details, product } = data || {};
//     const productsRates = getConfig(product, 'rates', []);
//     const productsTerms = getConfig(product, 'terms', []);
//     const detailsDates = getConfig(details, 'dates', []);
//     const productRate = Array.isArray(productsRates) && productsRates.length > 0 ? productsRates[0] : undefined;
//     const productTerm = Array.isArray(productsTerms) && productsTerms.length > 0 ? productsTerms[0] : undefined;
//     const detailsDate = Array.isArray(detailsDates) && detailsDates.length > 0 ? detailsDates[0] : undefined;
//     const mappedData = {
//       catRatePercentage: getPropValue(productRate, 'rate'),
//       catDate: getPropValue(detailsDate, 'date'),
//       term: {
//         frequency: getPropValue(productTerm, 'termType'),
//         number: getPropValue(productTerm, 'term'),
//       },
//     };
//     return mappedData;
//   }


//   async _request(config) {
//     const dp = new BGADPAnyServicePost(
//       'contracting-processes/v1/credit-history/loans/score',
//       {
//         ...config,
//       },
//     );
//     const request = await dp
//       .generateRequest()
//       .then(onRequestSuccess)
//       .then(data => this._mapResponse(data))
//       .catch(error => {  
//         throw onErrorParsed(error);  
//       });
//     return request;
//   }
// }