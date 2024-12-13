// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // detailUser: 'http://mff-gateway-acq-dev.apps.ocp4dev.muf.co.id/uaa-iam/user/',
  // apiUrlPoolingOrder: 'http://todolist-pooling-order-dev.apps.ocp4dev.muf.co.id/',
  // apiUrlDetail: 'http://detail-pooling-order-dev.apps.ocp4dev.muf.co.id/',
  // apiUrlMappingJob: 'http://mapping-job-java-dev.apps.ocp4dev.muf.co.id/',
  // apiUrlInternalSalesForce: 'http://master-internal-sales-force-java-dev.apps.ocp4dev.muf.co.id/',
  // apiUrlClaim: 'http://claim-pooling-order-publisher-kafka-dev.apps.ocp4dev.muf.co.id/',

  // urlGateway: 'http://public-gateway-pooling-order-dev.apps.ocp4dev.muf.co.id/',
  // urlGatewaySecure: 'https://public-gateway-pooling-order-dev.muf.co.id/',

  urlGatewayAPI: 'https://api-massdev-pub.muf.co.id/mass-api/',

  urlTranslatorNodeJs:
    'http://dealer-translator-nodejs-dev.apps.ocp4dev.muf.co.id/',

  getUrlGateway() {
    // return window.location.protocol === 'https:' ? this.urlGatewaySecure : this.urlGateway;

    return this.urlGatewayAPI;
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
