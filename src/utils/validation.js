const validator = require('validator');

function isValidUrl(candidateUrl) {
  return validator.isURL(candidateUrl, {
    require_protocol: true,
    protocols: ['http', 'https'],
    allow_query_components: true,
  });
}

module.exports = { isValidUrl };

