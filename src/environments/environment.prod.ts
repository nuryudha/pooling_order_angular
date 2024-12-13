export const environment = {
  production: true,
  // detailUser: 'http://mff-gateway-acq.apps.ocpdc.muf.co.id/uaa-iam/user/',
  // apiUrlPoolingOrder: 'http://todolist-pooling-order.apps.ocpdc.muf.co.id/',
  // apiUrlDetail: 'http://detail-pooling-order.apps.ocpdc.muf.co.id/',
  // apiUrlMappingJob: 'http://mapping-job-java.apps.ocpdc.muf.co.id/',
  // apiUrlInternalSalesForce: 'http://master-internal-sales-force-java.apps.ocpdc.muf.co.id/',
  // apiUrlClaim: 'http://claim-pooling-order-publisher-kafka.apps.ocpdc.muf.co.id/',

  // urlGateway: 'http://public-gateway-pooling-order.apps.ocpdrc.muf.co.id/',
  // urlGatewaySecure: 'https://public-gateway-pooling-order-drc.muf.co.id/',

  urlGatewayAPI: 'https://api-mass-pub.muf.co.id/mass-api/',

  urlTranslatorNodeJs: 'http://dealer-translator-nodejs.apps.ocpdc.muf.co.id/',

  getUrlGateway() {
    // return window.location.protocol === 'https:' ? this.urlGatewaySecure : this.urlGateway;

    return this.urlGatewayAPI;
  },
};
