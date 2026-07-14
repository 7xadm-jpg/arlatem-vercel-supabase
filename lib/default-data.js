const content = require('../data/default-content.json');
const products = require('../data/default-products.json');

function getDefaultPayload() {
  return {
    ...JSON.parse(JSON.stringify(content)),
    products: JSON.parse(JSON.stringify(products))
  };
}

module.exports = {
  getDefaultPayload
};
