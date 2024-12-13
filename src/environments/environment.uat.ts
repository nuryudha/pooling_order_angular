export const environment = {
  production: false,
  // detailUser: 'http://mff-gateway-acq-uat.apps.ocp4dev.muf.co.id/uaa-iam/user/',
  // apiUrlPoolingOrder: 'http://todolist-pooling-order-uat.apps.ocp4dev.muf.co.id/',
  // apiUrlDetail: 'http://detail-pooling-order-uat.apps.ocp4dev.muf.co.id/',
  // apiUrlMappingJob: 'http://mapping-job-java-uat.apps.ocp4dev.muf.co.id/',
  // apiUrlInternalSalesForce: 'http://master-internal-sales-force-java-uat.apps.ocp4dev.muf.co.id/',
  // apiUrlClaim: 'http://claim-pooling-order-publisher-kafka-uat.apps.ocp4dev.muf.co.id/',

  // urlGateway: 'http://public-gateway-pooling-order-uat.apps.ocp4dev.muf.co.id/',
  // urlGatewaySecure: 'https://public-gateway-pooling-order-uat.muf.co.id/',

  urlGatewayAPI: 'https://api-massuat-pub.muf.co.id/mass-api/',

  urlTranslatorNodeJs:
    'http://dealer-translator-nodejs-uat.apps.ocp4dev.muf.co.id/',

  getUrlGateway() {
    // return window.location.protocol === 'https:' ? this.urlGatewaySecure : this.urlGateway;

    return this.urlGatewayAPI;
  },
};
